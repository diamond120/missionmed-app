


import "./index.less"

import { Form, Input, Button, Checkbox } from 'antd';
import { ReactComponent as SignInLogo } from "../../components/icon/assets/sign-in-logo.svg"
import Authentication from "../../api/services/Authentication";
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";


const ForgotPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('');
    const onFinish = async (values: any) => {
        const { email } = values;
        setErrorMessage("API is not integrated");
        // try {
        //     const result = await Authentication.login({email});
        //     if(result.data.success) {
        //         if (result.data.data && result.data.data.token) {
                
        //         navigate("/")
        //         }
        //     } else {
            // setErrorMessage("We cannot find your email");
        //         throw new Error(result.data.message);
        //     }
        // } catch (e) {
        //     console.log(e);
        //     alert('Error Your email or password is wrong!')
        // }
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
                <h2 className={"sign-in-left-subtitle"}>Forgot Password</h2>
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
                rules={[{ required: true, message: 'Please enter your Email!' }]}
                style={{ marginTop: 55 }}
                >
                
                <Input style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }} placeholder={"Email"} />
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                </Form.Item>
                <Button type={"default"} htmlType={"submit"} disabled={false} className={"btn-text"}
                        style={{width: "100%", borderRadius: "8px", }}>
                Submit
                </Button>
                <Link to={`/sign_in`} className={"sign-in-left-remember-forgot"}><Button className={"btn-text"}  style={{ marginTop: "5px", width: "100%", borderRadius: "8px", }}> Back To Login</Button></Link>
            
            </Form>
            
            </div>

        </div>
        <div className={"sign-in-right"}></div>

        </div>
    )
}

export default ForgotPassword;


