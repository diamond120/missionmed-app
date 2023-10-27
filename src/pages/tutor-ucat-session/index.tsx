import "./index.less";
import React, { useEffect, useState } from "react";
import Section from "../../components/shared-ui/Section";
import { HomeOutlined, FileSearchOutlined, CalendarOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, message } from "antd";
import SessionDetails from "../../components/session-details";
import UCATSessionService from "../../api/services/UCATSession";


const TutorUCATSession = () => {


  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [agenda, setAgenda] = useState(null);

  const getMockInterviewDetails = async () => {
    try {
      const response = await UCATSessionService.getTutorUcatSession({});
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

  const handleEditAgenda = async(agendaDetails) => {
    try{
      const response = await UCATSessionService.updateUCATSessionData({
        "ucatBookingId":upcomingInterview?.id,
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

  const updatePastSession = (id, data={}) => {
    const updatedSessions = pastSessions.map(session => {
      if(session.id == id){
        return {...session, ...data};
      }else{
        return session;
      }})
    setPastSessions(updatedSessions);
  }

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
          <Breadcrumb.Item>UCAT Sessions</Breadcrumb.Item>
        </Breadcrumb>

        <div className={"con-section-wrap tutor-mock-section-wrap"}>
          <div className={"grid-col-2"}>
            <h2 className={"tab-title"}>UCAT Sessions</h2>
            <Button className={"primary-button"}>
              <FileSearchOutlined /> Useful Resources
            </Button>
          </div>
          { (upcomingSessions.length > 0 || pastSessions.length > 0)  ? (
          <SessionDetails
            moduleType="ucat"
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
                    You Don’t Have Any Booked UCAT Session
                  </h2>
                </div>
              </div>
            </div>
          </div>  
          ) }
        </div>
        
      </Section>
    </>
  );
};

export default TutorUCATSession;
