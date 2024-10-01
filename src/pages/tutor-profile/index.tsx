
import "./index.less"
import { Breadcrumb, Tabs, message, Spin } from 'antd';
import { HomeOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import BasicInfo from "./basic-info"
import ProfilePicture from "./profile-picture"
import BiographyTutor from "./biography-tutor"
import AchievementTutor from "./achievement-tutor"
import PersonalityTutor from "./personality-tutor"
import Education from "./education"
import WorkingDaysHours from "./working-days-hours"
import Specializations from "./specializations"
import CalendarAuth from "../../components/CalenderAuth"
import BufferTime from "./buffer-time"
import AverageRating from "./average-rating"
import Rating from "./clarity-rating"
import StudentsReview from "./students-review"
import Billing from "./billing";
import { useEffect, useState } from "react";
import CommonService from "../../api/services/Common";
import { useTutor } from "../../api/providers/TutorProvider"
import MeetingLink from "./meeting-link";
import SpecialDays from "./special-days";
import UcatPerformance from "./ucat-performance";

const TutorProfile = () => {
  
  const [rating, setRating] = useState(null);
  const [isGoogleVerification, setGoogleVerification] = useState(false);
  const tutor = useTutor();
  // const tutorId = useMeQuery()?.data?.me?.tutor?.data?.id
  // const tutor = useTutorsQuery({ variables: { filter: { id: { eq: tutorId}}}})?.data?.tutors?.data[0]

  const getRatingDetails = async () => {
    try {
     
      const response = await CommonService.getAPI("/tutor/rating");
      if (response.data.success) {
        setRating(response.data.data );
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    getRatingDetails()
    .then(() => {
      console.log(rating); // This should log the updated value of rating
    })
    .catch((error) => {
      console.error(error);
    });
  }, []);


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
        {tutor?.loading ?
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15%' }} >
            <Spin size='large' />
          </div>
          :
          <Tabs defaultActiveKey={"profile"}>

            <TabPane tab={"Profile"} key={"profile"}>
              <div className={"top-form-group"}>
                <BasicInfo />
                <ProfilePicture />
              </div>
              <Education />
              <BiographyTutor />
              {/* <AchievementTutor /> */}
              <UcatPerformance />
              <PersonalityTutor />
            </TabPane>

            <TabPane tab={"Teaching"} key={"teaching"}>
                  
              <div className={"working-time-wrap"}>
                <div className="flex-col">
                  <WorkingDaysHours />
                  <SpecialDays isGoogleVerification={isGoogleVerification}/>
                </div> 
                <div>
                <div className={"specializations-section"}>
                <h2 className={"specializations-section-title"}>Google Calendar</h2>
                 <CalendarAuth setGoogleVerification={setGoogleVerification} />
                </div>
                  <Specializations />
                  <BufferTime />
                  <MeetingLink />
                </div>
              </div>
            </TabPane>

            <TabPane tab={"Rating"} key={"rating"}>
              {/* <h1>{JSON.stringify(rating?.KnowledgeExpertise)}</h1> */}
              <AverageRating student={rating?.students} average={rating?.alloverAverage} />
              <div className={"ratings-wrap"}>

                <Rating rating={rating?.KnowledgeExpertise?.average} one={rating?.KnowledgeExpertise?.one} two={rating?.KnowledgeExpertise?.two} three={rating?.KnowledgeExpertise?.three} four={rating?.KnowledgeExpertise?.four} five={rating?.KnowledgeExpertise?.five} title={"Knowledge & Expertise"} />
                <Rating rating={rating?.EngagementEnthusiasm?.average} one={rating?.EngagementEnthusiasm?.one} two={rating?.EngagementEnthusiasm?.two} three={rating?.EngagementEnthusiasm?.three} four={rating?.EngagementEnthusiasm?.four} five={rating?.EngagementEnthusiasm?.five} title={"Engagement & Enthusiasm"} />
                <Rating rating={rating?.ClarityUnderstandability?.average} one={rating?.ClarityUnderstandability?.one} two={rating?.ClarityUnderstandability?.two} three={rating?.ClarityUnderstandability?.three} four={rating?.ClarityUnderstandability?.four} five={rating?.ClarityUnderstandability?.five} title={"Clarity & Understandability"} />
                <Rating rating={rating?.PunctualityPreparedness?.average} one={rating?.PunctualityPreparedness?.one} two={rating?.PunctualityPreparedness?.two} three={rating?.PunctualityPreparedness?.three} four={rating?.PunctualityPreparedness?.four} five={rating?.PunctualityPreparedness?.five} title={"Punctuality & Preparedness"} />
              </div>
              <StudentsReview reviews={rating?.student_reviews} />
            </TabPane>

            <TabPane tab={"Billing"} key={"billing"}>
              <Billing />
            </TabPane>

          </Tabs>
        }
      </div>

    </Section>
  )
}

export default TutorProfile











