
import "./index.less"
import { Breadcrumb, Spin } from "antd";
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
import { useStudent } from "../../api/providers/StudentProvider";
import CardDatails from "./card-details";

const StudentProfile = () => {
  const student = useStudent();
  const { TabPane } = Tabs;

  return (
    <Section >
      <Breadcrumb>
        <Breadcrumb.Item href={"/"}>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>My Profile</Breadcrumb.Item>
      </Breadcrumb>
      <h2 className={"student-profile-section-title"}>My Profile</h2>
      {student?.loading ?
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15%' }} >
          <Spin size='large' />
        </div>
        :
        <div className={"student-profile-section-wrap"}>
          <Tabs style={{ marginTop: 32 }} defaultActiveKey={"1"}>
            <TabPane className={"custom-tab"} tab={"Profile"} key={"1"}>
              <div className={"top-form-group"}>
                <div>
                  {student && <BasicInfoForm />}

                  {student && <Biography student={student?.attributes as Student} id={student?.id ?? ''} />}
                  <Personality />
                  <Applications />

                </div>
                <div className={"top-form-group-right"}>
                  {student && <ProfilePicture />}
                  <MyTeam />
                </div>
              </div>


            </TabPane>
            <TabPane className={"custom-tab"} tab={"Application Information"} key={"2"}>
              {student && <ApplicationInfo />}
              {student && <ExtraInfo student={student?.attributes as Student} id={student?.id ?? ''} />}
            </TabPane>
            {/* <TabPane className={"custom-tab"} tab={"Card Details"} key={"3"}>
              {student && <CardDatails />}
            </TabPane> */}
          </Tabs>
        </div>
      }
    </Section>
  )
}

export default StudentProfile



