import { Result } from "antd";

export default function UnderConstructionPage() {
    return (
        <Result
            status="warning"
            title="This page is under construction"
            subTitle="We are sorry for the inconvenience, but this page is currently under construction. Please check back later."
            //   extra={<Button onClick={() => {navigate('/sign_in')}}>Back Home</Button>}
        />
    );
}
