import "./index.less";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Breadcrumb, message } from "antd";
import { HomeOutlined, CalendarOutlined } from "@ant-design/icons";
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
      obj[session.date] = obj[session.date] || [];
      obj[session.date].push(session);
      return obj;
    }, {});
    return formatedSessions;
  };


  const getMockInterviewDetails = async () => {
    try {
      const response = await MockInterviewsService.getStudentMockInterviews({});
      if (response.data.success) {
        setUpcomingInterview(response.data?.data?.upcomingInterview ?? {});
        //setUpcomingInterview({});
        setUpcomingSessions(
          response.data?.data?.upcomingsessions
            ? formatSessionList(response.data?.data?.upcomingsessions)
            : {}
        );
        setPastSessions(
          response.data?.data?.pastsessions
            ? formatSessionList(response.data?.data?.pastsessions)
            : {}
        );
        setAgenda(response.data?.data?.upcomingInterview?.agenda ?? null);
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleEditAgenda = async(agendaDetails) => {
    try{
      const response = await MockInterviewsService.updateMockInterviewAgenda({
        "mockInterviewId":upcomingInterview?.id,
        "agenda":agendaDetails,
      });
      if(response.data.success){
        setAgenda(agendaDetails);
      }else{
        throw new Error(response.data.message)
      }
    }catch(e){
      message.error(e.message);
    }
  };

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
            <h2 className={"tab-title"}>Mock Interview</h2>
            {(Object.values(upcomingSessions).length > 0 || Object.values(pastSessions).length > 0) && <BookInterview />}
          </div>
          { (Object.values(upcomingSessions).length > 0 || Object.values(pastSessions).length > 0)  ? (
            <MockInterviewDetails
              key="mockInterviewDetails"
              upcomingInterview={upcomingInterview}
              upcomingSessions={upcomingSessions}
              pastSessions={pastSessions}
              agenda={agenda}
              handleEditAgenda={handleEditAgenda}
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
                    <div style={{ marginBottom: "16px" }}>
                      You can choose tutor and book your first mock <br />{" "}
                      interview by pressing “Book Interview” button below.
                    </div>
                    <BookInterview key="bookInterview" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </React.Fragment>
  );
};

export default StudentMockInterview;
