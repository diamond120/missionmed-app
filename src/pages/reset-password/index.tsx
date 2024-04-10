import "./index.less"
import { Form, Input, Button, message } from 'antd';
import { ReactComponent as SignInLogo } from "../../components/icon/assets/sign-in-logo.svg"
import CommonService from "../../api/services/Common";
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react";


const ResetPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('');

    const { token } = useParams();

    const handleSubmit = async () => {
        try {

            await form.validateFields();
            const formData = form.getFieldsValue(true);
            formData.token = token;
            let response = await CommonService.postAPI('/reset-password', formData);
            if (response.data.success == true) {
                // throw new Error(response.data.message) 
                message.success(response.data.message);
                navigate("/")
            } else {
                throw new Error(response.data.message)
            }
        } catch (e) {
            message.error(e);
        }
    }


    return (
        <div className={"sign-in"}>
            <div className={"sign-in-left"}>
                <div className={"sign-in-left-wrap"}>
                    <div className={"sign-in-left-title-wrap"}>
                        <SignInLogo />
                        <h2 className={"sign-in-left-subtitle"}>Reset Password</h2>
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
                            name={"password"}
                            label={""}
                            rules={[{ required: true, message: 'Please enter new password' }]}
                        >
                            <Input.Password style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }} placeholder={"New Password"} />
                        </Form.Item>

                        <Form.Item
                            name={"confirmNewPassword"}
                            label={""}
                            rules={[{ required: true, message: 'Please enter confirm new password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('New Password and Confirm Password should be same');
                                },
                            })]}
                            dependencies={['password']}
                        >

                            <Input.Password style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }} placeholder={"Confirm New Password"} />
                        </Form.Item>
                        <Button type={"default"} htmlType={"submit"} disabled={false} onClick={handleSubmit} className={"btn-text"}
                            style={{ width: "100%", borderRadius: "8px", }}>
                            Submit
                        </Button>
                        {/* <Link to={`/sign_in`} className={"sign-in-left-remember-forgot"}><Button className={"btn-text"} style={{ marginTop: "5px", width: "100%", borderRadius: "8px", }}> Back To Login</Button></Link> */}
                        <Button className={"sign-in-left-remember-forgot btn-text"} href={`/sign_in`} style={{ marginTop: "5px", width: "100%", borderRadius: "8px", }}> Back To Login</Button>
                    </Form>

                </div>

            </div>
            {/* <div className={"sign-in-right"}></div> */}

        </div>
    )
}

export default ResetPassword;