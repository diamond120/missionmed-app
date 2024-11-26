import "./index.less";
import { useEffect, useState } from "react";
import Section from "../../components/shared-ui/Section";
import { HomeOutlined, FileSearchOutlined, CalendarOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, message } from "antd";
import BookSession from "../book-session";
import SessionDetails from "../../components/session-details";
import RescheduleInterview from "../../components/session-details/reschedule-interview";
import CommonService from "../../api/services/Common";
import { PageInfoType } from "../../components/session-details/my-sessions/types";

const TutorTeachingSession = () => {
  const [timezone, setTimeZone] = useState("");
  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [agenda, setAgenda] = useState(null);
  const [freezeSessions, setFreezeSessions] = useState([]);
  const [isOpenReschedule, setIsOpenReschedule] = useState(false);
  const [moduleType, setModuleType] = useState("teaching");
  const [rescheduleSessionId, setRescheduleSessionId] = useState(null);
  const BookingFor = 'Interview 1-to-1 Tutoring'

  const getMockInterviewDetails = async () => {
    try {
      const response = await CommonService.postAPI('/tutor/session-details', { bookingFor: BookingFor });
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

  const handleEditInterviewDate = async (detail) => {
    try {
      const data = {
        sessionId: detail?.sessionId,
        interviewDate: detail.interviewDate,
        bookingFor: 'Interview 1-to-1 Tutoring'
      }
      const response = await CommonService.postAPI('/session-data', data)
      if (response.data.success) {
        message.success(response.data.message)
        getMockInterviewDetails()
      } else {
        throw new Error(response.data.message)
      }
    } catch (e) {
      message.error(e.message)
    }
  }

  const updateUpcomingSession = (sessionId, data) => {
    getMockInterviewDetails();
  }

  const handleReschedule = (sessionId) => {
    setIsOpenReschedule(true);
    setRescheduleSessionId(sessionId);
    getMockInterviewDetails();
  }


  const handleOpen = (state) => {
    setIsOpenReschedule(state);
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
    getMockInterviewDetails();
    // @ts-expect-error - this is custom event triggered by app
    document.addEventListener('LoadMoreSessions', customEventHandler)

    return () => {
      // @ts-expect-error - this is custom event triggered by app
      document.removeEventListener('LoadMoreSessions', customEventHandler)
    }
  }, []);

  const cancleUpSession = (data) => {
    getMockInterviewDetails();
  };

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
              <BookSession title="Book Session" addUpcomingSession={addUpcomingSession} moduleType="teaching" timezone={timezone} />
              <Button className={"primary-button"}>
                <FileSearchOutlined /> Useful Resources
              </Button>

            </div>
          </div>
          { (upcomingSessions?.data?.length > 0 || pastSessions?.data?.length > 0)  ? (
          <SessionDetails
            moduleType="teaching"
            upcomingInterview={upcomingInterview}
            upcomingSessions={upcomingSessions}
            pastSessions={pastSessions}
            agenda={agenda}
            handleReschedule={handleReschedule}
            handleEditAgenda={handleEditAgenda}
            handleEditLink= {handleEditLink}
            handleEditInterviewDate= {handleEditInterviewDate}
            cancleUpSession={cancleUpSession}
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
        <RescheduleInterview isOpen={isOpenReschedule} moduleType={moduleType} handleOpen={handleOpen} sessionId={rescheduleSessionId} updateUpcomingSession={updateUpcomingSession} timezone={timezone} />
      </Section>
    </>
  );
};

export default TutorTeachingSession;
