
import "./index.less"
import { Breadcrumb, } from "antd";
import { Tabs } from 'antd';
import { HomeOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import BasicInfo from "./basic-info"
import ProfilePicture from "./profile-picture"
import BiographyTutor from "./biography-tutor"
import PersonalityTutor from "./personality-tutor"
import Education from "./education"
import WorkingDaysHours from "./working-days-hours"
import Specializations from "./specializations"
import BufferTime from "./buffer-time"
import AverageRating from "./average-rating"
import Rating from "./clarity-rating"
import StudentsReview from "./students-review"
import Billing from "./billing"
// import { useMeQuery, useTutorsQuery } from "../../graphql"

const TutorProfile = () => {

  // const tutorId = useMeQuery()?.data?.me?.tutor?.data?.id
  // const tutor = useTutorsQuery({ variables: { filter: { id: { eq: tutorId}}}})?.data?.tutors?.data[0]
  
  const { TabPane } = Tabs;

  return(
    <Section >
      <Breadcrumb>
        <Breadcrumb.Item href={"/"}>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>My Profile</Breadcrumb.Item>
      </Breadcrumb>

      <div className={"tutor-profile-section-wrap"}>
        <h2 className={"tutor-profile-section-title"}>My Profile</h2>
        <Tabs defaultActiveKey={"profile"}>
          
          <TabPane tab={"Profile"} key={"profile"}>
            <div className={"top-form-group"}>
              <BasicInfo />
              <ProfilePicture/>
            </div>
            <Education/>
            <BiographyTutor/>
            <PersonalityTutor/>      
          </TabPane>

          <TabPane tab={"Teaching"} key={"teaching"}>
            <div className={"working-time-wrap"}>
              <WorkingDaysHours />
              <div>
                <Specializations/>
                <BufferTime/>
              </div>
            </div>
          </TabPane>

          <TabPane tab={"Rating"} key={"rating"}>
            <AverageRating />
            <div className={"ratings-wrap"}>
              <Rating rating={4.5} one={0} two={0} three={10} four={75} five={90} title={"Knowledge & Expertise"}/>
              <Rating rating={5} one={0} two={0} three={0} four={0} five={100} title={"Engagement & Enthusiasm"}/>
              <Rating rating={4.5} one={0} two={0} three={5} four={75} five={90} title={"Clarity & Understandability"}/>
              <Rating rating={4.5} one={0} two={0} three={10} four={80} five={75} title={"Punctuality & Preparedness"}/>
            </div>
            <StudentsReview />
          </TabPane>

          <TabPane tab={"Billing"} key={"billing"}>
            <Billing />
          </TabPane>
          
        </Tabs>
      </div>
    </Section>
  )
}

export default TutorProfile











