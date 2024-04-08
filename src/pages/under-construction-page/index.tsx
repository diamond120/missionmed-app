import { Result, Button } from 'antd';
import { useNavigate } from "react-router-dom"


const UnderConstructionPage = () => {

const navigate = useNavigate()
  return (
    <Result
      status="warning"
      title="This page is under construction"
      subTitle="We are sorry for the inconvenience, but this page is currently under construction. Please check back later."
    //   extra={<Button onClick={() => {navigate('/sign_in')}}>Back Home</Button>}
    />
  );
};

export default UnderConstructionPage;