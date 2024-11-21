import { useEffect, useState } from "react";
import { Breadcrumb, Button, message } from "antd";
import { HomeOutlined, FileSearchOutlined,CalendarOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import MockInterviewDetails from "../../components/mock-interview-details";
import "./index.less";
import CommonService from "../../api/services/Common";
import BookInterview from "../student-mock-interview/book-interview";
import RescheduleInterview from "../../components/mock-interview-details/reschedule-interview";
import React from "react";
import { PageInfoType } from "../../components/session-details/my-sessions/types";

const TutorMockInterview = () => {
  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [agenda, setAgenda] = useState(null);
  const [timezone, setTimeZone] = useState("");
  const [isOpenReschedule, setIsOpenReschedule] = useState(false);
  const [rescheduleSessionId, setRescheduleSessionId] = useState(null);
  const BookingFor = 'Mock interviews'

  const getMockInterviewDetails = async () => {
    try {
      const response = await CommonService.postAPI("/tutor/session-details", { bookingFor: BookingFor });
      if (response.data.success) {
        setTimeZone(response.data?.data?.tutorTimezone ?? null);
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

  const handleReschedule = (sessionId) => {
    setIsOpenReschedule(true);
    setRescheduleSessionId(sessionId);
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
        } 
      } else {
        throw new Error(response.data.message)
      }
    } catch (e) {
      message.error(e.message);
    }
  };

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


  const updateUpcomingSession = (sessionId, data) => {
    getMockInterviewDetails();
  }

  const cancleUpSession = () => {
    getMockInterviewDetails();
  }
  
  const handleEditLink = async(detail) => {
    try{
      const data = {
        "sessionId":detail?.sessionId,
        "sessionLink":detail.link,
        'bookingFor' : BookingFor
      }
      const response = await CommonService.postAPI('/session-data',data);
      
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
            <div className="btn-group">
            <BookInterview timezone={timezone}  addUpcomingSession={getMockInterviewDetails}/>
            <Button className={"primary-button"}>
              <FileSearchOutlined /> Useful Resources
            </Button>
            </div>
          </div>
          { (upcomingSessions?.data?.length > 0 || pastSessions?.data?.length > 0)  ? (
          <MockInterviewDetails
            upcomingInterview={upcomingInterview}
            upcomingSessions={upcomingSessions}
            pastSessions={pastSessions}
            agenda={agenda}
            handleReschedule={handleReschedule}
            handleEditAgenda={handleEditAgenda}
            handleEditLink= {handleEditLink}
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
                </div>
              </div>
            </div>
          </div>
          )
          }
        </div>
      </Section>
      <RescheduleInterview isOpen={isOpenReschedule} handleOpen={handleOpen} sessionId={rescheduleSessionId} updateUpcomingSession={updateUpcomingSession} timezone={timezone} />
    </>
  );
};

export default TutorMockInterview;