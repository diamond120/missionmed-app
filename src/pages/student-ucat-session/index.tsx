import "./index.less";
import React, { useEffect, useState } from "react";
import Section from "../../components/shared-ui/Section";
import { HomeOutlined, CalendarOutlined, EllipsisOutlined, CreditCardOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Breadcrumb, message, Space, Dropdown, Spin, Tag, Alert, Button, Anchor } from "antd";
import SessionDetails from "../../components/session-details";
import RescheduleInterview from "../../components/session-details/reschedule-interview";
import BookSession from "../book-session";
import FreezeSession from "../freeze-session";
import CancleSession from "../cancle-session";
import CommonService from "../../api/services/Common";

const StudentUCATSession = () => {

  const [upcomingInterview, setUpcomingInterview] = useState({});
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [freezeSessions, setFreezeSessions] = useState([]);
  const [agenda, setAgenda] = useState(null);
  const [isOpenReschedule, setIsOpenReschedule] = useState(false);
  const [rescheduleSessionId, setRescheduleSessionId] = useState(null);
  const [timezone, setTimeZone] = useState("");
  const [credit, setCredit] = useState("");
  const { Link } = Anchor;

  const getUCATSessionDetails = async () => {
    try {
      const data = {
        bookingFor: 'UCAT 1-to-1 Tutoring'
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
        // setCredit(response.data?.data?.ucatTeachingSessionCredit ?? '')
        setCredit((response.data?.data?.ucatTeachingSessionCredit != '' && response.data?.data?.ucatTeachingSessionCredit != null) ? response.data?.data?.ucatTeachingSessionCredit : 0)

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
        'bookingFor': 'UCAT 1-to-1 Tutoring'
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
    getUCATSessionDetails();
  }

  const handleReschedule = (sessionId) => {
    setIsOpenReschedule(true);
    setRescheduleSessionId(sessionId);
    getUCATSessionDetails();
  }

  const handleOpen = (state) => {
    setIsOpenReschedule(state);
  }

  useEffect(() => {
    getUCATSessionDetails();
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
    getUCATSessionDetails();
  }

  const cancleUpSession = (data) => {
    getUCATSessionDetails();
  };

  const addFreezeSession = (data: any) => {
    getUCATSessionDetails();
  }

  const items = [
    {
      key: '1',
      label: (
        <FreezeSession title='Freeze Session' addUpcomingSession={addUpcomingSession} addFreezeSession={addFreezeSession} />
      ),
    },
    {
      key: '2',
      label: (
        <CancleSession title='Cancel Session' addUpcomingSession={upcomingInterview} moduleType={"ucat"} cancleUpcomingSession={cancleUpSession} />
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
          <Breadcrumb.Item>UCAT Teaching Sessions</Breadcrumb.Item>
        </Breadcrumb>
        <div className={"con-section-wrap tutor-mock-section-wrap"}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 className={"tab-title"}>UCAT Teaching Sessions</h2>
            <div className="d_flex_center">
              {/* <div ><b>Credit: {credit === '' ? <Spin style={{ marginLeft: 10 }} /> : credit}</b></div> */}
              {/* {(credit == '0' || credit == '') ?
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
              } */}

              {
                (credit === '') ?
                  <div className={"tagLayout errorTagStyle"}>
                    <Spin style={{ marginLeft: 10 }} />
                  </div>
                  :
                  credit == '0' ?
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
                  <Space wrap>
                    <Dropdown placement="bottomLeft" menu={{ items }} >
                      <EllipsisOutlined />
                    </Dropdown>
                  </Space>
                </Space>
              }
              {(upcomingSessions.length > 0 || pastSessions.length > 0) && <BookSession title="Book Extra Session" moduleType="ucatStudent" addUpcomingSession={addUpcomingSession} timezone={timezone} credit={credit} />}

            </div>
          </div>
          {((upcomingSessions.length > 0 || pastSessions.length > 0) && (credit == '0' || credit == null || credit == '')) &&
            <Alert
              closable
              showIcon
              message={
                <>
                  You will not be able to sit a session until you purchase more teaching session hours.{' '}
                  <Link href="https://missionmed.com.au/checkout_step/ucat-private-checkout/" target="_blank" title="Purchase Here." ></Link>
                </>
              }
              type="error"
              className="errorBanner"
            />
          }
          {(upcomingSessions.length > 0 || pastSessions.length > 0) ? (
            <SessionDetails
              key="mockInterviewDetails"
              moduleType="ucat"
              upcomingInterview={upcomingInterview}
              upcomingSessions={upcomingSessions}
              pastSessions={pastSessions}
              agenda={agenda}
              handleEditAgenda={handleEditAgenda}
              updatePastSession={updatePastSession}
              handleReschedule={handleReschedule}
              cancleUpSession={cancleUpSession}
              credit={credit}
              freezeSessions={freezeSessions} />
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
                      {credit != '0' && credit != null && credit != '' ?
                        <>
                          You Don’t Have Any Booked Session
                        </>
                        :
                        <>
                          Purchase Hours to Book Tutors!
                        </>
                      }
                    </h2>
                    <div style={{ marginBottom: "16px" }}>
                      {credit != '0' && credit != null && credit != '' ? (
                        <>
                          You can choose long-term tutor and book your first < br />
                          Teaching session by pressing "Book Session" button below.
                        </>
                      ) : (
                        <>
                          You are only a click away from the best UCAT tutors in < br /> Australia! Purchase teaching hour to book!
                        </>
                      )}
                    </div>
                    {credit != '0' && credit != null && credit != '' ?
                      <BookSession title="Book Session" moduleType="ucatStudent" addUpcomingSession={addUpcomingSession} timezone={timezone} credit={credit} />
                      :
                      <Button className={"primary-button"} href="https://missionmed.com.au/checkout_step/ucat-private-checkout/" title="Purchase Hours" target="_blank"> Purchase Hours</Button>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <RescheduleInterview isOpen={isOpenReschedule} handleOpen={handleOpen} sessionId={rescheduleSessionId} updateUpcomingSession={updateUpcomingSession} timezone={timezone} />
      </Section>
    </React.Fragment>
  );
};

export default StudentUCATSession;