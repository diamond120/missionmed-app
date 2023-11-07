import { useEffect, useState } from "react";
import { Breadcrumb, Button, message } from "antd";
import { HomeOutlined, FileSearchOutlined,CalendarOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import MockInterviewDetails from "../../components/mock-interview-details";
import MockInterviewsService from "../../api/services/MockInterviews";
import "./index.less";
import CommonService from "../../api/services/Common";

const TutorMockInterview = () => {
  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [agenda, setAgenda] = useState(null);

  const getMockInterviewDetails = async () => {
    try {
      // const response = await MockInterviewsService.getTutorMockInterviews({});
      const data = {
        bookingFor : 'Mock interviews'
      }
      const response = await CommonService.postAPI("/tutor/session-details",data);
      if (response.data.success) {
        setUpcomingInterview(response.data?.data?.upcomingInterview ?? {});
        setUpcomingSessions(
          response.data?.data?.upcomingsessions
            ? response.data?.data?.upcomingsessions
            : []
        );
        setPastSessions(
          response.data?.data?.pastsessions
            ? response.data?.data?.pastsessions
            : []
        );
        setAgenda(response.data?.data?.agenda ?? null);
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleEditAgenda = async (agendaDetails) => {
    try {
      const data = {
        "sessionId":upcomingInterview?.id,
        "agenda":agendaDetails,
        'bookingFor' : 'Mock interviews'
      }
      const response = await CommonService.postAPI('/session-data',data)
      // const response = await MockInterviewsService.updateMockInterviewData({
      //   mockInterviewId: upcomingInterview?.id,
      //   agenda: agendaDetails,
      // });
      if (response.data.success) {
        setAgenda(agendaDetails);
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    getMockInterviewDetails();
  }, []);

  const handleEditLink = async(link) => {
    try{

      const data = {
        "sessionId":upcomingInterview?.id,
        "sessionLink":link,
        'bookingFor' : 'Mock interviews'
      }
      const response = await CommonService.postAPI('/session-data',data)

     
      if(response.data.success){
        getMockInterviewDetails();
        message.success(response.data.message);
      }else{
        throw new Error(response.data.message)
      }
    }catch(e){
      message.error(e.message);
    }
  }

  return (
    <>
      <Section>
        <Breadcrumb>
          <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Mock Interview</Breadcrumb.Item>
        </Breadcrumb>

        <div className={"con-section-wrap tutor-mock-section-wrap"}>
          <div className={"grid-col-2"}>
            <h2 className={"tab-title"}>Mock Interview</h2>
            <Button className={"primary-button"}>
              <FileSearchOutlined /> Useful Resources
            </Button>
          </div>
          { (upcomingSessions.length > 0 || pastSessions.length > 0)  ? (
          <MockInterviewDetails
            upcomingInterview={upcomingInterview}
            upcomingSessions={upcomingSessions}
            pastSessions={pastSessions}
            agenda={agenda}
            handleEditAgenda={handleEditAgenda}
            handleEditLink= {handleEditLink}
          />
          ) : (
          <div className="mock-interview">
            <div className={"con-section-wrap"}>
              <div className={"con-box"}>
                <div
                  className={"con-box-wrap"}
                  style={{ textAlign: "center" }}
                >
                  <CalendarOutlined
                    style={{
                      fontSize: "50px",
                      color: "#A9A2F8",
                      marginBottom: "17px",
                    }}
                  />
                  <h2 className={"con-box-title"}>
                    You Don’t Have Any Booked Interviews
                  </h2>
                </div>
              </div>
            </div>
          </div>
          )
          }
        </div>
      </Section>
    </>
  );
};
export default TutorMockInterview;
