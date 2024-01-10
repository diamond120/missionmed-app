import "./index.less";
import React, { useEffect, useState } from "react";
import Section from "../../components/shared-ui/Section";
import { HomeOutlined, CalendarOutlined, EllipsisOutlined, CreditCardOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Breadcrumb, message, Space, Dropdown, Spin, Button, Tag, Alert, Tooltip } from "antd";
import SessionDetails from "../../components/session-details";
import RescheduleInterview from "../../components/session-details/reschedule-interview";
import BookSession from "../book-session";
import FreezeSession from "../freeze-session";
import CancleSession from "../cancle-session";
import CommonService from "../../api/services/Common";
import { Link } from "react-router-dom";

const StudentTeachingSession = () => {

  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [agenda, setAgenda] = useState(null);
  const [isOpenReschedule, setIsOpenReschedule] = useState(false);
  const [rescheduleSessionId, setRescheduleSessionId] = useState(null);
  const [moduleType, setModuleType] = useState("teaching");
  const [freezeSessions, setFreezeSessions] = useState([]);
  const [timezone, setTimeZone] = useState("");
  const [credit, setCredit] = useState("");

  const getMockInterviewDetails = async () => {
    try {
      const data = {
        bookingFor: 'Interview 1-to-1 Tutoring'
      }
      const response = await CommonService.postAPI("/student/session-details", data);
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
        setFreezeSessions(
          response.data?.data?.freezesessions
            ? response.data?.data?.freezesessions
            : []
        );
        setTimeZone(response.data?.data?.studentTimezone ?? null);
        setCredit(response.data?.data?.teachingSessionCredit ?? '')
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleEditAgenda = async (agendaDetails) => {
    try {

      const data = {
        "sessionId": upcomingInterview?.id,
        "agenda": agendaDetails,
        'bookingFor': 'Interview 1-to-1 Tutoring'
      }

      const response = await CommonService.postAPI('/session-data', data)
      if (response.data.success) {
        setAgenda(agendaDetails);
      } else {
        throw new Error(response.data.message)
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const updatePastSession = (id, data = {}) => {
    const updatedSessions = pastSessions.map(session => {
      if (session.id == id) {
        return { ...session, ...data };
      } else {
        return session;
      }
    })
    setPastSessions(updatedSessions);
  }

  const addUpcomingSession = (session) => {
    // console.log(session)
    // setUpcomingSessions([...upcomingSessions, session]);

    // if(Object.keys(upcomingInterview).length == 0 || (moment(upcomingInterview.date)>moment(session.date))){
    //   setUpcomingInterview({
    //     id:session.id,
    //     date:session.date,
    //     session_start_time:session.session_start_time,
    //     session_end_time:session.session_end_time,
    //     agenda:null
    //   })
    //   setAgenda(null);
    // }

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

  useEffect(() => {
    getMockInterviewDetails();
  }, []);


  const updateUpcomingSession = (sessionId, data) => {
    // const updatedSessions = upcomingSessions.map(session => {
    //   if(session.id == sessionId ){
    //     return {...session, ...data}
    //   }else{
    //     return session;
    //   }
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

  const cancleUpSession = () => {
    getMockInterviewDetails();
  }

  const addFreezeSession = (data: any) => {
    console.log(data);
    getMockInterviewDetails();
  }

  const items = [
    {
      key: '1',
      label: (
        <FreezeSession title='Freeze Session' moduleType="teaching" addFreezeSession={addFreezeSession} />
      ),
    },
    {
      key: '2',
      label: (
        <CancleSession title='Cancel Session' moduleType={moduleType} cancleUpcomingSession={cancleUpSession} addUpcomingSession={upcomingInterview} />
      ),
    },
  ];

  return (
    <React.Fragment>
      <Section className={"application-review-section"}>
        <Breadcrumb>
          <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Interview Teaching Session</Breadcrumb.Item>
        </Breadcrumb>
        <div className={"con-section-wrap tutor-mock-section-wrap"}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 className={"tab-title"}>Interview Teaching Sessions</h2>
            <div className={"d_flex_center"} style={{ gap: 15, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* <div> <b>Credit: {credit === '' ? <Spin style={{ marginLeft: 10 }} /> : credit}</b></div> */}
              {(credit == '0' || credit == '') ?
                <div className={"tagLayout errorTagStyle"}>
                  <Tag icon={<CreditCardOutlined />} className={"tagStyle"} color="error">
                    {upcomingSessions.length > 0 ? 'Purchase More Hours ' : 'No Hours Remaining'}
                  </Tag>
                </div>
                :
                <div className={"tagLayout"} >
                  <Tag icon={<CheckCircleOutlined />} className={"tagStyle"} color="success">
                    {credit} Hours Remaining
                  </Tag>
                </div>
              }
              {(upcomingSessions.length > 0) &&
                <Space direction="vertical" className="dropdownIcon">
                  <Space wrap  >
                    <Dropdown placement="bottomLeft" menu={{ items }} overlayClassName="session-dropdown">
                      <EllipsisOutlined style={{ padding: 11, borderRadius: 8, border: '1px solid #00000026', backgroundColor: '#fff', cursor: 'pointer' }} />
                    </Dropdown>
                  </Space>
                </Space>
              }
              {(upcomingSessions.length > 0 || pastSessions.length > 0) &&
                <BookSession title="Book Extra Session" addUpcomingSession={addUpcomingSession} moduleType="teaching" credit={credit} timezone={timezone} />}
            </div>
          </div>
          {((upcomingSessions.length > 0 || pastSessions.length > 0) && credit == '0' || credit == '') &&
            <Alert
              closable
              showIcon
              message={
                <>
                  You will not be able to sit a session until you purchase more teaching session hours.{' '}
                  <Link to="#" style={{ cursor: "not-allowed" }} title="Coming Soon">Purchase Here.</Link>
                </>
              }
              type="error"
              className="errorBanner"
            />
          }
          {(upcomingSessions.length > 0 || pastSessions.length > 0) ? (
            <SessionDetails
              key="Student Teaching Session"
              moduleType="teaching"
              upcomingInterview={upcomingInterview}
              upcomingSessions={upcomingSessions}
              pastSessions={pastSessions}
              agenda={agenda}
              handleEditAgenda={handleEditAgenda}
              updatePastSession={updatePastSession}
              handleReschedule={handleReschedule}
              cancleUpSession={cancleUpSession}
              freezeSessions={freezeSessions}
              credit={credit} />
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
                      {credit != '0' ?
                        <>
                          You Don’t Have Any Booked Session
                        </>
                        :
                        <>
                          Parchase Hours to Book Tutors!
                        </>
                      }
                    </h2>
                    <div style={{ marginBottom: "16px" }}>
                      {credit != '0' ? (
                        <>
                          You can choose long-term tutor and book your first < br />
                          Teaching session by pressing "Book Session" button below.
                        </>
                      ) : (
                        <>
                          You are only a click away from the best Teaching tutors in  < br />
                          Australia! Purchase teaching hour to book!
                        </>
                      )}
                    </div>
                    {credit != '0' ?
                      <BookSession moduleType="teaching" title="Book Session" addUpcomingSession={addUpcomingSession} timezone={timezone} credit={credit} />
                      :
                      <Button className={"primary-button disable-button"} href="#" disabled target="_blank" title="Coming Soon"> Purchase Hours</Button>

                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
      <RescheduleInterview isOpen={isOpenReschedule} moduleType={moduleType} handleOpen={handleOpen} sessionId={rescheduleSessionId} updateUpcomingSession={updateUpcomingSession} timezone={timezone} />
    </React.Fragment>
  );
};

export default StudentTeachingSession;