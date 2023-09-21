import "./index.less";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Breadcrumb, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import BookInterview from "./book-interview";
import MockInterviewDetails from "./mock-interview-details";
import MockInterviewsService from "../../api/services/MockInterviews";

const StudentMockInterview = () => {
  const data = [];
  const navigate = useNavigate();

  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState({});
  const [pastSessions, setPastSessions] = useState({});
  const [agenda, setAgenda] = useState(null);

  const formatSessionList = (sessions) => {
    const formatedSessions = sessions.reduce((obj, session) => {
      obj[session.date] = obj[session.date] ||[];
      obj[session.date].push(session);
      return obj;
    }, {})
    return formatedSessions;
  }

  const getMockInterviewDetails = async () => {
    try {
      const response = await MockInterviewsService.getStudentMockInterviews({});
      if (response.data.success) {
        setUpcomingInterview(response.data?.data?.uplcomingInterview ?? {});
        setUpcomingSessions(response.data?.data?.upcomingsessions ? formatSessionList(response.data?.data?.upcomingsessions) : {})
        setPastSessions(response.data?.data?.pastsessions ? formatSessionList(response.data?.data?.pastsessions) : {})
        setAgenda(response.data?.data?.agenda ?? null)
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleEditAgenda = (agendaDetails) => {
    setAgenda(agendaDetails)
  }

  useEffect(() => {
    getMockInterviewDetails();
  }, []);

  return (
    <React.Fragment>
      <Section className={"application-review-section"}>
        <Breadcrumb>
          <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Mock Interview</Breadcrumb.Item>
        </Breadcrumb>
        <div className={"con-section-wrap tutor-mock-section-wrap"}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 className={"tab-title"}>UCAT Sessions</h2>
            {Object.values(upcomingInterview).length > 0 && <BookInterview />}
          </div>
          {Object.values(upcomingInterview).length > 0 ? (
            <MockInterviewDetails
              key="mockInterviewDetails"
              upcomingInterview={upcomingInterview}
              upcomingSessions={upcomingSessions}
              pastSessions={pastSessions}
              agenda={agenda}
              handleEditAgenda={handleEditAgenda}
            />
          ) : (
            <BookInterview key="bookInterview" />
          )}
        </div>
      </Section>
    </React.Fragment>
  );
};

export default StudentMockInterview;
