import "./index.less";
import React, { useEffect } from "react";
import { useState } from "react";
import { Breadcrumb, Button, message } from "antd";
import { HomeOutlined, CalendarOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import BookInterview from "./book-interview";
import MockInterviewDetails from "../../components/mock-interview-details";
import moment from "moment";
import RescheduleInterview from "../../components/mock-interview-details/reschedule-interview";
import CommonService from "../../api/services/Common";

const StudentMockInterview = () => {
  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [agenda, setAgenda] = useState(null);
  const [isOpenReschedule, setIsOpenReschedule] = useState(false);
  const [rescheduleSessionId, setRescheduleSessionId] = useState(null);
  const [student, setStudentData] = useState("0");
  const [timezone, setTimeZone] = useState("");

  const handleReschedule = (sessionId) => {
    setIsOpenReschedule(true);
    setRescheduleSessionId(sessionId);
  }

  const handleOpen = (state) => {
    setIsOpenReschedule(state);
  }

  const addUpcomingSession = (session) => {
    
    setUpcomingSessions([...upcomingSessions, session]);
    
    if(Object.keys(upcomingInterview).length == 0 || (moment(upcomingInterview.date)>moment(session.date))){
      setUpcomingInterview({
        id:session.id,
        date:session.date,
        session_start_time:session.session_start_time,
        session_end_time:session.session_end_time,
        agenda:null
      })
      setAgenda(null);
    }
    getMockInterviewDetails();
  }

  const updateUpcomingSession = (sessionId, data) => {
    const updatedSessions = upcomingSessions.map(session => {
      if(session.id == sessionId ){
        return {...session, ...data}
      }else{
        return session;
      }
    })
    setUpcomingSessions(updatedSessions);
    if(sessionId == upcomingInterview.id){
      setUpcomingInterview(prev => ({...prev, ...{
        date:data.date,
        session_start_time:data.session_start_time,
        session_end_time:data.session_end_time,
      }}))
    }
  }

  const updatePastSession = (id, data={}) => {
    const updatedSessions = pastSessions.map(session => {
      if(session.id == id){
        return {...session, ...data};
      }else{
        return session;
      }})
    setPastSessions(updatedSessions);
  }

  const getMockInterviewDetails = async () => {
    try {
      const data = {
        bookingFor : 'Mock interviews'
      }
      const response = await CommonService.postAPI("/student/session-details",data);
      if (response.data.success) {
        setUpcomingInterview(response.data?.data?.upcomingInterview ?? {});
        setUpcomingSessions(
          response.data?.data?.upcomingsessions
            ?  response.data?.data?.upcomingsessions
            : []
        );
        setPastSessions(
          response.data?.data?.pastsessions
            ? response.data?.data?.pastsessions
            : []
        );
        setAgenda(response.data?.data?.upcomingInterview?.agenda ?? null);
        setStudentData(response.data?.data?.studentCredit ?? 0);
        setTimeZone(response.data?.data?.studentTimezone ?? null);
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
        'bookingFor' : 'Mock interviews'
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

  const cancleUpSession =() => {
    getMockInterviewDetails();
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
            <h2 className={"tab-title"}>Mock Interview</h2>
            <div>Student credit: {student}</div>
            {(student == 0 ) && <a href="https://missionmed.com.au/#PricingPanel" target="_blank"><Button className={"primary-button"} >Buy Mock Interview</Button></a> }
            { ( student > 0) && <BookInterview  addUpcomingSession={addUpcomingSession} timezone={timezone}/>}
          </div>
          { (upcomingSessions.length > 0 || pastSessions.length > 0)  ? (
            <MockInterviewDetails
              key="mockInterviewDetails"
              upcomingInterview={upcomingInterview}
              upcomingSessions={upcomingSessions}
              pastSessions={pastSessions}
              agenda={agenda}
              handleEditAgenda={handleEditAgenda}
              updatePastSession={updatePastSession}
              handleReschedule={handleReschedule}
              cancleUpSession={cancleUpSession}
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
                    { ( student > 0) ?
                      <div style={{ marginBottom: "16px" }}>
                        You can choose tutor and book your first mock <br />{" "}
                        interview by pressing “Book Interview” button below.
                      </div> :
                      <div style={{ marginBottom: "16px" }}>
                        Please add credit after that you can book interview.
                      </div>
                    }
                    { ( student > 0) ?
                      <BookInterview key="bookInterview" addUpcomingSession={addUpcomingSession} timezone={timezone}/> : <></>
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <RescheduleInterview isOpen={isOpenReschedule} handleOpen={handleOpen} sessionId={rescheduleSessionId} updateUpcomingSession={updateUpcomingSession} timezone={timezone}/>
      </Section>
    </React.Fragment>
  );
};

export default StudentMockInterview;
