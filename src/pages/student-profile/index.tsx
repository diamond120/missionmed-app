
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
import {useStudent} from "../../api/providers/StudentProvider";
import {useEffect, useState } from "react";
import CommonService from "../../api/services/Common";
import StudentProfileStaticDataContext from "../../api/context/StudentProfileStaticDataContext";

const StudentProfile = () => {
  // const studentId = useMeQuery()?.data?.me?.student?.data?.id
  const student = useStudent();
  const { TabPane } = Tabs;
 
  const [studentProfileStaticData, setStudentProfileStaticData] =useState({});
      useEffect(() => {
       (async () => {
          const res = await CommonService.getProfileStaticData();
          setStudentProfileStaticData({
          location : res.data.data.location,
          state:res.data.data.state,
          timezone:res.data.data.timezone,
          applicantType:res.data.data.applicantType
          })
        })(); 
      },[])
    return(
    <StudentProfileStaticDataContext.Provider value={studentProfileStaticData}>
    <Section >
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
    </StudentProfileStaticDataContext.Provider>
  )
}

export default StudentProfile



