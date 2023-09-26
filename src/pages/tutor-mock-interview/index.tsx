import { useEffect, useState } from "react";
import { Breadcrumb, Button, message } from "antd";
import { HomeOutlined, FileSearchOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import MockInterviewDetails from "../../components/mock-interview-details";
import MockInterviewsService from "../../api/services/MockInterviews";
import "./index.less";

const TutorMockInterview = () => {
  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [agenda, setAgenda] = useState(null);

  const getMockInterviewDetails = async () => {
    try {
      const response = await MockInterviewsService.getTutorMockInterviews({});
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
      const response = await MockInterviewsService.updateMockInterviewAgenda({
        mockInterviewId: upcomingInterview?.id,
        agenda: agendaDetails,
      });
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
          <MockInterviewDetails
            upcomingInterview={upcomingInterview}
            upcomingSessions={upcomingSessions}
            pastSessions={pastSessions}
            agenda={agenda}
            handleEditAgenda={handleEditAgenda}
          />
        </div>
      </Section>
    </>
  );
};
export default TutorMockInterview;
