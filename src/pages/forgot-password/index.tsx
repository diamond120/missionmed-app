import "./index.less"
import { Form, Input, Button, message } from 'antd';
import { ReactComponent as SignInLogo } from "../../components/icon/assets/sign-in-logo.svg"
import CommonService from "../../api/services/Common"
import { useNavigate } from "react-router-dom"

const ForgotPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            const formData = form.getFieldsValue(true);
            let response = await CommonService.postAPI('/forgot-password', formData);
            if (response.data.success == true) {
                message.success(response.data.message);
            } else {
                throw new Error(response.data.message)
            }
        } catch (e) {
            message.error(e.message);
        }
    }


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
                            {/* {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>} */}
                        </Form.Item>
                        <Button type={"default"} htmlType={"submit"} disabled={false} onClick={handleSubmit} className={"btn-text"}
                            style={{ width: "100%", borderRadius: "8px", }}>
                            Submit
                        </Button>
                        {/* <Link to={`/sign_in`} className={"sign-in-left-remember-forgot"}> */}
                        <Button className={"sign-in-left-remember-forgot btn-text"} href={`/sign_in`} style={{ marginTop: "5px", width: "100%", borderRadius: "8px", }}> Back To Login</Button>
                        {/* </Link> */}
                    </Form>
                </div>
            </div>
            <div className={"sign-in-right"}></div>
        </div>
    )
}

export default ForgotPassword;