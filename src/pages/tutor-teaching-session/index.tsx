import "./index.less";
import { useEffect, useState } from "react";
import Section from "../../components/shared-ui/Section";
import { HomeOutlined, FileSearchOutlined, CalendarOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, message } from "antd";
import BookSession from "../book-session";
import SessionDetails from "../../components/session-details";
import CommonService from "../../api/services/Common";

const TutorTeachingSession = () => {
  const [timezone, setTimeZone] = useState("");
  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [agenda, setAgenda] = useState(null);
  const [freezeSessions, setFreezeSessions] = useState([]);

  const getMockInterviewDetails = async () => {
    try {
      const data = {
        bookingFor : 'Interview 1-to-1 Tutoring'
      }
      const response = await CommonService.postAPI('/tutor/session-details',data);
        if (response.data.success) {
        setTimeZone(response.data?.data?.tutorTimezone ?? null);
        await setUpcomingInterview(response.data?.data?.upcomingInterview ?? {});
        await setUpcomingSessions(
          response.data?.data?.upcomingsessions
            ? response.data?.data?.upcomingsessions
            : []
        );
        await setPastSessions(
          response.data?.data?.pastsessions
            ? response.data?.data?.pastsessions
            : []
        );
        await setAgenda(response.data?.data?.agenda ?? null);
        await setFreezeSessions(
          response.data?.data?.freezesessions
            ? response.data?.data?.freezesessions
            : []
        );
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleEditAgenda = async(agendaDetails) => {
    try{
      const data = {
        "sessionId":upcomingInterview?.id,
        "agenda":agendaDetails,
        'bookingFor' : 'Interview 1-to-1 Tutoring'
      }
      const response = await CommonService.postAPI('/session-data',data)
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

  const addUpcomingSession = (sessionId, data) => {
  
    // const updatedSessions = upcomingSessions.map(session => {
    //   if(session.id == sessionId ){
    //     return {...session, ...data}
    //   }else{
    //     return session;
    //   }addUpcomingSession
    // })
    // setUpcomingSessions(updatedSessions);
    // if(sessionId == upcomingInterview.id){
    //   setUpcomingInterview(prev => ({...prev, ...{
    //     date:data.date,
    //     session_start_time:data.session_start_time,
    //     session_end_time:data.session_end_time,
    //   }}))
    // }
    getMockInterviewDetails();
  }

  const handleEditLink = async(detail) => {
    try{
      const data = {
        "sessionId":detail?.sessionId,
        "sessionLink":detail.link,
        'bookingFor' : 'Interview 1-to-1 Tutoring'
      }
      const response = await CommonService.postAPI('/session-data',data)
      if(response.data.success){
        message.success(response.data.message);
          getMockInterviewDetails();
      }else{
        throw new Error(response.data.message)
      }
    }catch(e){
      message.error(e.message);
    }
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
          <Breadcrumb.Item>Interview Teaching Session</Breadcrumb.Item>
        </Breadcrumb>
        <div className={"con-section-wrap tutor-mock-section-wrap"}>
          <div className={"d_flex_beetwen"}>
            <h2 className={"tab-title"}>Interview Teaching Sessions</h2>
            <div className="btn-group">
              <BookSession title="Book Extra Session" /*addUpcomingSession={addUpcomingSession}*/ moduleType="teaching" timezone={timezone} />
              <Button className={"primary-button"}>
                <FileSearchOutlined /> Useful Resources
              </Button>

            </div>
          </div>
          { (upcomingSessions.length > 0 || pastSessions.length > 0)  ? (
          <SessionDetails
            moduleType="teaching"
            upcomingInterview={upcomingInterview}
            upcomingSessions={upcomingSessions}
            pastSessions={pastSessions}
            agenda={agenda}
            handleEditAgenda={handleEditAgenda}
            handleEditLink= {handleEditLink}
            freezeSessions={freezeSessions}
          /> ) : (
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
                      You Don’t Have Any Booked Teaching Session
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
};

export default TutorTeachingSession;
