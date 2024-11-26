import "./index.less";
import  { useEffect, useState } from "react";
import Section from "../../components/shared-ui/Section";
import { HomeOutlined, FileSearchOutlined, CalendarOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, message } from "antd";
import SessionDetails from "../../components/session-details";
import CommonService from "../../api/services/Common";
import BookSession from "../book-session";
import RescheduleInterview from "../../components/session-details/reschedule-interview";
import { PageInfoType } from "../../components/session-details/my-sessions/types";
const TutorUCATSession = () => {

  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [agenda, setAgenda] = useState(null);
  const [freezeSessions, setFreezeSessions] = useState([]);
  const [timezone, setTimeZone] = useState("");
  const [isOpenReschedule, setIsOpenReschedule] = useState(false);
  const [rescheduleSessionId, setRescheduleSessionId] = useState(null);
  const BookingFor = 'UCAT 1-to-1 Tutoring'

  const getUCATSessionDetails = async () => {
    try {
      const response = await CommonService.postAPI("/tutor/session-details", { bookingFor: BookingFor});
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
        setFreezeSessions(
          response.data?.data?.freezesessions
            ? response.data?.data?.freezesessions
            : []
        );
        setTimeZone(response.data?.data?.tutorTimezone ?? null);
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleReschedule = (sessionId) => {
    setIsOpenReschedule(true);
    setRescheduleSessionId(sessionId);
    getUCATSessionDetails();
  }

  const handleOpen = (state) => {
    setIsOpenReschedule(state);
  }

  const handleEditAgenda = async (agendaDetails, sessionId = null) => {
    const updateSessionId = sessionId ?? upcomingInterview?.id 
    try {
      const data = {
        "sessionId": updateSessionId,
        "agenda": agendaDetails,
        'bookingFor': BookingFor
      }
      const response = await CommonService.postAPI('/session-data', data)
      if (response.data.success) {
        if(updateSessionId === upcomingInterview?.id) {
          setAgenda(agendaDetails);
          setUpcomingSessions((prevValue) => {
            prevValue.data = prevValue.data.map((prevSession) => { 
              if (prevSession.id === upcomingInterview?.id) {
                prevSession.agenda = agendaDetails
              }
              return prevSession
            })
            return prevValue
          })
        } 
      } else {
        throw new Error(response.data.message)
      }
    } catch (e) {
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

  const addUpcomingSessionTutor = () => {
    getUCATSessionDetails();
  }

  const customEventHandler = async ({ detail }: CustomEvent) => {
    const pageName    = (detail?.type ?? '') as keyof PageInfoType
    const pageNumber  = (detail?.page ?? null)
    if (!pageName || !pageNumber) {
      return
    }

    const payload = {
      bookingFor: BookingFor,
      page: pageNumber,
      pageName: pageName
    }
    const response = await CommonService.postAPI('/tutor/session-details', payload);
    const pageNameResponseKey: { [K in keyof PageInfoType]: string } = {
      upcoming: 'upcomingsessions',
      past: 'pastsessions',
      freeze: 'freezesessions'
    }
    if (response.data.success) {
      const content = response.data.data[pageNameResponseKey[pageName]]
      const sessionUpdateHandler = (prevValue) => {
        return {
          ...content,
          data: [
            ...prevValue.data,
            ...content.data
          ]
        }
      }
      switch (pageName) {
        case 'upcoming':
          setUpcomingSessions(sessionUpdateHandler)
          break;
        case 'past':
          setPastSessions(sessionUpdateHandler)
          break;
        case 'freeze':
          setFreezeSessions(sessionUpdateHandler)
          break;
      }
    }
  }

  useEffect(() => {
    getUCATSessionDetails();

    // @ts-expect-error - this is custom event triggered by app
    document.addEventListener('LoadMoreSessions', customEventHandler)
  
    return () => {
      // @ts-expect-error - this is custom event triggered by app
      document.removeEventListener('LoadMoreSessions', customEventHandler)
    }
  }, []);

  const updateUpcomingSession = (sessionId, data) => {
    getUCATSessionDetails();
  }
  const cancleUpSession = (data) => {
    getUCATSessionDetails();
  };

  const handleEditLink = async(detail) => {
    try{
      const data = {
        "sessionId":detail?.sessionId,
        "sessionLink":detail.link,
        'bookingFor' : 'UCAT 1-to-1 Tutoring'
      }
      const response = await CommonService.postAPI('/session-data',data)
      if(response.data.success){
        message.success(response.data.message);
        getUCATSessionDetails();
      }else{
        throw new Error(response.data.message)
      }
    }catch(e){
      message.error(e.message);
    }
  }
  const handleEditInterviewDate = async (detail) => {
    try {
      const data = {
        sessionId: detail?.sessionId,
        interviewDate: detail.interviewDate,
        bookingFor: 'UCAT 1-to-1 Tutoring'
      }
      const response = await CommonService.postAPI('/session-data', data)
      if (response.data.success) {
        message.success(response.data.message)
        getUCATSessionDetails()
      } else {
        throw new Error(response.data.message)
      }
    } catch (e) {
      message.error(e.message)
    }
  }

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
            <div className="btn-group">
            {/* {(upcomingSessions.length > 0 || pastSessions.length > 0 || freezeSessions.length > 0) &&  */}
            <BookSession title="Book Session" moduleType="ucatStudent" addUpcomingSession={addUpcomingSessionTutor} timezone={timezone}/>
            <Button className={"primary-button"}>
              <FileSearchOutlined /> Useful Resources
            </Button>
            {/* } */}
            </div>
          </div>
          { (upcomingSessions?.data?.length > 0 || pastSessions?.data?.length > 0)  ? (
          <SessionDetails
            moduleType="ucat"
            upcomingInterview={upcomingInterview}
            upcomingSessions={upcomingSessions}
            pastSessions={pastSessions}
            agenda={agenda}
            handleEditAgenda={handleEditAgenda}
            handleReschedule={handleReschedule}
            handleEditLink= {handleEditLink}
            handleEditInterviewDate= {handleEditInterviewDate}
            freezeSessions={freezeSessions}
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
                    You Don’t Have Any Booked UCAT Session
                  </h2>
                </div>
              </div>
            </div>
          </div>  
          ) }
        </div>
      </Section>
      <RescheduleInterview isOpen={isOpenReschedule} handleOpen={handleOpen} sessionId={rescheduleSessionId} updateUpcomingSession={updateUpcomingSession} timezone={timezone} />
    </>
  );
};

export default TutorUCATSession;