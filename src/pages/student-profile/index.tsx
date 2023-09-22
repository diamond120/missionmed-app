
import "./index.less"
import { Breadcrumb, } from "antd";
import { Tabs } from 'antd';
import { HomeOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import BasicInfoForm from "./basic-info-form"
import ProfilePicture from "./profile-picture"
import MyTeam from "./my-team"
import Biography from "./biography"
import Personality from "./personality"
import Applications from "./applications"
import ApplicationInfo from "./application-info"
import ExtraInfo from "./extra-info"
import Calender from "./calender"
import {useStudent} from "../../api/providers/StudentProvider";

const StudentProfile = () => {
  const student = useStudent();
  const { TabPane } = Tabs;
 
    return(
    <Section >
      <Calender />
      <Breadcrumb>
        <Breadcrumb.Item href={"/"}>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>My Profile</Breadcrumb.Item>
      </Breadcrumb>
      <h2 className={"student-profile-section-title"}>My Profile</h2>
      <div className={"student-profile-section-wrap"}>
        <Tabs style={{marginTop: 32}} defaultActiveKey={"1"}>
          <TabPane className={"custom-tab"} tab={"Profile"} key={"1"}>
            <div className={"top-form-group"}>
              {student && <BasicInfoForm/>}
              <div className={"top-form-group-right"}>
                {student && <ProfilePicture />}
                <MyTeam/>
              </div>
            </div>

            {student && <Biography student={student?.attributes as Student} id={student?.id ?? ''}/>}
              <Personality/>
              <Applications/>

          </TabPane>
          <TabPane className={"custom-tab"} tab={"Application Information"} key={"2"}>
              {student && <ApplicationInfo/>}
              {student && <ExtraInfo student={student?.attributes as Student} id={student?.id ?? ''}/>}
          </TabPane>
        </Tabs>
      </div>
    </Section>
  )
}

export default StudentProfile



