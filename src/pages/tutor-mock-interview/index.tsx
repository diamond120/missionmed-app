import "./index.less";
import { Breadcrumb,  Button} from "antd"
import { HomeOutlined, FileSearchOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import Upcsession from "./upc-session";
import Ucatagenda from "./ucat-agenda";
import Mysessions from "./my-sessions";

const TutorMockInterview = () => {
    
    return (
    <> 
    <Section>

        <Breadcrumb>
            <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>UCAT Sessions</Breadcrumb.Item>
        </Breadcrumb>

        <div className={"con-section-wrap tutor-mock-section-wrap"}>
            <div className={"grid-col-2"}>
                <h2 className={"tab-title"}>UCAT Sessions</h2>
                <Button className={"primary-button"}><FileSearchOutlined /> Useful Resources</Button>
            </div>
            <div className={"display-f-24"}>
                <Upcsession/>
                <Ucatagenda />
            </div>
            <Mysessions />
        </div>
    </Section>
    </>
    )
}
export default TutorMockInterview;