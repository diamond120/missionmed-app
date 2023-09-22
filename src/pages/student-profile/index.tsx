
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
    </Section>
  )
}

export default StudentProfile



