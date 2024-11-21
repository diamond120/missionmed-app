import "./index.less";
import React, { useEffect } from "react";
import { useState } from "react";
import { Breadcrumb, Button, Spin, message, Tag} from "antd";
import { HomeOutlined, CalendarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import BookInterview from "./book-interview";
import MockInterviewDetails from "../../components/mock-interview-details";
import RescheduleInterview from "../../components/mock-interview-details/reschedule-interview";
import CommonService from "../../api/services/Common";
import RateSession from "../../components/rate-session";
import { PageInfoType } from "../../components/session-details/my-sessions/types";
const StudentMockInterview = () => {
  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [agenda, setAgenda] = useState(null);
  const [isOpenReschedule, setIsOpenReschedule] = useState(false);
  const [rescheduleSessionId, setRescheduleSessionId] = useState(null);
  const [student, setStudentData] = useState('');
  const [timezone, setTimeZone] = useState("");
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  const BookingFor = 'Mock interviews';

  const handleReschedule = (sessionId) => {
    setIsOpenReschedule(true);
    setRescheduleSessionId(sessionId);
  }

  const handleOpen = (state) => {
    setIsOpenReschedule(state);
  }

  const addUpcomingSession = () => {
    getMockInterviewDetails();
  }

  const updateUpcomingSession = (sessionId, data) => {
    const updatedSessions = upcomingSessions?.data?.map(session => {
      if (session.id == sessionId) {
        return { ...session, ...data }
      } else {
        return session;
      }
    })
    setUpcomingSessions((prevValue) => {
      return {
        ...prevValue,
        data: updatedSessions
      }
    });
    if (sessionId == upcomingInterview.id) {
      setUpcomingInterview(prev => ({
        ...prev, ...{
          date: data.date,
          session_start_time: data.session_start_time,
          session_end_time: data.session_end_time,
        }
      }))
    }
  }

  const updatePastSession = (id, data = {}) => {
    const updatedSessions = pastSessions?.data?.map(session => {
      if (session.id == id) {
        return { ...session, ...data };
      } else {
        return session;
      }
    })
    setPastSessions((prevValue) => {
      return {
        ...prevValue,
        data: updatedSessions
      }
    });
  }

  const CheckLastMock = async() => {
    console.log("function")
    const response = await CommonService.postAPI("/student/check-last-mock");
    if (response.data.success) {
      if(response.data.data.hasRating == false)
      {
        // message.error('Please book a mock interview first.');
        setIsRateModalOpen(true); // Open the RateSession modal
          setSessionData({
            tutor: response.data.data.tutorName,
            id: response.data.data.mockId, // Example session data, replace with actual data if available
            tutorId: response.data.data.tutorId,
            tutorProfilePicture: response.data.data.tutorProfilePicture,
          });
      }
    }
   
  };

  const handleRateCancel = () => {
    setIsRateModalOpen(false); // Close the modal
    setSessionData(null); // Clear session data
  };

  const getMockInterviewDetails = async () => {
    try {
      const response = await CommonService.postAPI("/student/session-details", { bookingFor: BookingFor });
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
        setAgenda(response.data?.data?.upcomingInterview?.agenda ?? null);

        setStudentData((response.data?.data?.studentCredit != '' && response.data?.data?.studentCredit != null) ? response.data?.data?.studentCredit : 0);
        setTimeZone(response.data?.data?.studentTimezone ?? null);
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
        } 
      } else {
        throw new Error(response.data.message)
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const cancleUpSession = () => {
    getMockInterviewDetails();
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
    const response = await CommonService.postAPI('/student/session-details', payload);
    const pageNameResponseKey: { [K in keyof PageInfoType]: string } = {
      upcoming: 'upcomingsessions',
      past: 'pastsessions',
      freeze: 'freezesessions' // This is to avoid ts error and for consistency across same functionality components
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
    CheckLastMock();

    // @ts-expect-error - this is custom event triggered by app
    document.addEventListener('LoadMoreSessions', customEventHandler)
  
    return () => {
      // @ts-expect-error - this is custom event triggered by app
      document.removeEventListener('LoadMoreSessions', customEventHandler)
    }
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
          <div className="flex">
            <h2 className={"tab-title"}>Mock Interview</h2>

            <div className="d_flex_center">

            <div className={"tagLayout"}>
                {student === '' ? (
                  <div className="errorTagStyle">
                    <Spin style={{ marginLeft: 10 }} />
                  </div>
                ) : (
                  <Tag 
                    icon={<CheckCircleOutlined />} 
                    className={"tagStyle"} 
                    color="success"
                  >
                    Mock Interviews Remaining: {student === '0' ? '0' : student}
                  </Tag>
                )}
              </div>

              {student === '0' ? (
                <a href="https://missionmed.com.au/checkout_step/mock-interview-checkout/" target="_blank">
                  <Button className={"primary-button"}>Buy Mock Interview</Button>
                </a>
              ) : student > 0 && (
                <BookInterview addUpcomingSession={addUpcomingSession} timezone={timezone} />
              )}
            </div>
          </div>
          {(upcomingSessions?.data?.length > 0 || pastSessions?.data?.length > 0) ? (
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
                    {(student > 0) ?
                      <div style={{ marginBottom: "16px" }}>
                        You can choose tutor and book your first mock <br />{" "}
                        interview by pressing “Book Interview” button below.
                      </div> :
                      <div style={{ marginBottom: "16px" }}>
                        Please add credit after that you can book interview.
                      </div>
                    }
                    {(student > 0) ?
                      <BookInterview key="bookInterview" addUpcomingSession={addUpcomingSession} timezone={timezone} /> : <></>
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <RescheduleInterview isOpen={isOpenReschedule} handleOpen={handleOpen} sessionId={rescheduleSessionId} updateUpcomingSession={updateUpcomingSession} timezone={timezone} />
        <RateSession
        session={sessionData}
        isOpen={isRateModalOpen}
        handleRateCancel={handleRateCancel}
      />
      </Section>
    </React.Fragment>
  );
};

export default StudentMockInterview;
