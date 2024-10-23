import './index.less'
import { Form, Input, Button, Checkbox, message } from 'antd'
import Authentication from '../../api/services/Authentication'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../api/providers/UserProvider.jsx'
import { useAuthContext } from '../../api/context/AuthContext.js'
import posthog from 'posthog-js'
import { useContext, useState } from 'react'

const SignIn = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { dispatch } = useContext(UserContext)
  const { setAuthenticated } = useAuthContext()
  const [timezone, setTimezone] = useState<string>('')

  const onFinish = async (values: any) => {
    let userTimezone = timezone
    if (!timezone) {
      const response = await fetch('https://ipapi.co/timezone/')
      userTimezone = await response.text()
      setTimezone(userTimezone)
    }

    const { email, password } = values
    try {
      const result = await Authentication.login({ email, password, timezone: userTimezone })
      if (result.data.success) {
        if (result.data.data && result.data.data.token) {
          posthog.capture('Login', { user: result.data.data })
          setAuthenticated(true)
          localStorage.setItem('jwt', result.data.data.token)
          dispatch({
            type: 'set',
            payload: {
              id: result.data.data.id,
              name: result.data.data.name,
              email: result.data.data.email,
              role: result.data.data.role
            }
          })
          navigate('/')
        }
      } else {
        posthog.capture('Login error', { error: result.data.message })
        throw new Error(result.data.message)
      }
    } catch (e) {
      posthog.capture('Login error', { error: e.message })
      message.error(e.message)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className={'sign-in'}>
      <div className={'sign-in-left'}>
        <div className={'sign-in-left-wrap'}>
          <div className={'sign-in-left-title-wrap'}>
            {/* <a href={`/`}><SignInLogo /></a> */}
            <h2 className={'sign-in-left-title'}>Welcome Back!</h2>
            <h2 className={'sign-in-left-subtitle'}>Log In to your account</h2>
          </div>
          <Form
            form={form}
            name={'basic'}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 392 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete={'off'}
            className='sign-in-form'
          >
            <Form.Item
              label={''}
              name={'email'}
              rules={[{ required: true, message: 'Please enter your email!' }]}
              style={{ marginTop: 55 }}
            >
              <Input style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: ' 8px 12px 8px 12px' }} placeholder={'Email'} />
            </Form.Item>

            <Form.Item label={''} name={'password'} rules={[{ required: true, message: 'Please enter your password!' }]}>
              <Input.Password
                style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: ' 8px 12px 8px 12px' }}
                placeholder={'Password'}
              />
            </Form.Item>

            <div className={'sign-in-left-remember'}>
              <Checkbox>
                <span>Remember me</span>
              </Checkbox>
              <Button size='large' type='link' href={`/forgot-password`} className='link_btn'>
                Forgot Password?
              </Button>
              {/* <Link to={`/forgot-password`} className={"sign-in-left-remember-forgot"}>Forgot Password?</Link> */}
            </div>

            <Button
              type={'default'}
              htmlType={'submit'}
              disabled={false}
              className={'btn-text'}
              style={{ marginTop: '40px', width: '100%', borderRadius: '8px' }}
            >
              Login
            </Button>
          </Form>
        </div>
      </div>
      {/* <div className={"sign-in-right"}></div> */}
    </div>
  )
}

export default SignIn
