


import "./index.less"

import { Form, Input, Button, Checkbox } from 'antd';
import { ReactComponent as SignInLogo } from "../../components/icon/assets/sign-in-logo.svg"
import Authentication from "../../api/services/Authentication";
import { useNavigate } from "react-router-dom"
import {useUserDispatch } from "../../api/providers/UserProvider.jsx";
import {useAuthContext} from "../../api/context/AuthContext.js";


const SignIn = () => {
   const [form] = Form.useForm();
  // //const [loginMutation, { loading, error, data }] = useLoginMutation();
   const navigate = useNavigate()
  // // const isTutor = useMeQuery().data?.me?.tutor?.data?.id
  // // const isStudent = useMeQuery().data?.me?.student?.data?.id
  const dispatch = useUserDispatch();
  const {setAuthenticated} = useAuthContext();

  const onFinish = async (values: any) => {
    const { email, password } = values;
    try {
      const result = await Authentication.login({email, password});
      if(result.data.success) {
        if (result.data.data && result.data.data.token) {
          setAuthenticated(true);
          localStorage.setItem("jwt", result.data.data.token)
          dispatch({
            type:"set",
            id:result.data.data.id,
            name:result.data.data.name,
            email:result.data.data.email,
            role:result.data.data.role
          })
          navigate("/")
        }
      }
      else {
        throw new Error(result.data.message);
      }
    } catch (e) {
      console.log(e);
      alert('Error Your email or password is wrong!')
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={"sign-in"}>
      <div className={"sign-in-left"}>
        <div className={"sign-in-left-wrap"}>
          <div className={"sign-in-left-title-wrap"}>
            <SignInLogo />
            <h2 className={"sign-in-left-title"}>Welcome Back!</h2>
            <h2 className={"sign-in-left-subtitle"}>Log In to your account</h2>
          </div>
          <Form
            form={form}
            name={"basic"}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 392 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete={"off"}
            className="sign-in-form"
          >
            <Form.Item
              label={""}
              name={"email"}
              rules={[{ required: true, message: 'Please input your username!' }]}
              style={{ marginTop: 55 }}
            >
              <Input style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }} placeholder={"Email"} />
            </Form.Item>

            <Form.Item
              label={""}
              name={"password"}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }} placeholder={"Password"} />
            </Form.Item>

            <div className={"sign-in-left-remember"}>
              <Checkbox><span>Remember me</span></Checkbox>
              <a className={"sign-in-left-remember-forgot"} href={"#"}>Forgot Password?</a>
            </div>

            <Button type={"default"} htmlType={"submit"} disabled={false} className={"btn-text"}
                    style={{ marginTop: "40px", width: "100%", borderRadius: "8px", }}>
              Continue
            </Button>

          </Form>
        </div>

      </div>
      <div className={"sign-in-right"}></div>

    </div>
  )
}

export default SignIn;


