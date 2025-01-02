import './index.less'
import { Form, Input, Button, Checkbox, message, Alert } from 'antd'
import Authentication from '../../api/services/Authentication'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../api/providers/UserProvider.jsx'
import { useAuthContext } from '../../api/context/AuthContext.js'
import posthog from 'posthog-js'
import { useContext, useState } from 'react'
import CommonService from "../../api/services/Common";

const SignIn = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { dispatch } = useContext(UserContext)
  const { setAuthenticated } = useAuthContext()
  const [timezone, setTimezone] = useState<string>('')
  const [withEmail, setWithEmail] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  const onFinish = async (values: any) => {
    let userTimezone = timezone
    if (!timezone) {
      try {
        const response = await fetch('https://ipapi.co/timezone/')
        userTimezone = await response.text()
        setTimezone(userTimezone)
      } catch (e) {
        console.error('Unable to get timezone. request blocked by tracking blocker.')
        console.info(e)
      }
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

  const handleSendTempLoginLink = async () => {
    const email = form.getFieldValue('email')

    setLoading(true)
    const response = await CommonService.postAPI('/student/send-temp-login-link', { email })
    .catch((error) => {
      if (error.response) {
        message.error(error.response.data.message);
      }
      setLoading(false)
    })
    if (response.data.success) {
      message.success('Magic login link sent successfully.');
    } else if (response.data.error) {
      message.error(response.data.error);
    }
    setLoading(false)
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
              style={{ marginTop: 30 }}
            >
              <Input style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: ' 8px 12px 8px 12px' }} placeholder={'Email'} />
            </Form.Item>

            {!withEmail && 
              <>
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
                </>
            }

            {withEmail ? 
            <>
                <Button
                  type={'primary'}
                  htmlType={'submit'}
                  disabled={loading}
                  loading={loading}
                  className={'primary-button'}
                  style={{ marginTop: '10px', width: '100%', borderRadius: '8px' }}
                  onClick={async () => {
                    const rsp = await form.validateFields(['email'])
                    if (rsp.email) {
                      handleSendTempLoginLink()
                    }
                  }}
                  
                >
                  Sign In With Email
                </Button>

                <Alert
                  message=""
                  description={<>
                    We’ll email you a magic code for a password-free sign-in.
                    Or you can <a onClick={() => setWithEmail(false)}>sign in with password</a>.
                  </>}
                  type="info"
                  showIcon
                  style={{
                    marginTop: '20px',
                  }}
                />
              </>
              : 
              <>
              <Button
                type={'default'}
                htmlType={'submit'}
                disabled={loading}
                loading={loading}
                className={'btn-text'}
                style={{ marginTop: '25px', width: '100%', borderRadius: '8px' }}
              >
                Login
              </Button>
              <Alert
                  message=""
                  description={<>
                    For password-free sign-in. you can <a onClick={() => setWithEmail(true)}>sign in with email</a>.
                  </>}
                  type="info"
                  showIcon
                  style={{
                    marginTop: '20px',
                  }}
                />
              </>
              }
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignIn
