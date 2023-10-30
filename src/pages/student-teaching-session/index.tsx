import "./index.less";
import React, { useEffect, useState } from "react";
import Section from "../../components/shared-ui/Section";
import { HomeOutlined, CalendarOutlined,EllipsisOutlined,SearchOutlined } from "@ant-design/icons";
import { Breadcrumb, message,Space,Dropdown,Menu,Button } from "antd";
import SessionDetails from "../../components/session-details";
import MockInterviewsService from "../../api/services/MockInterviews";
import TeachingSessionService from "../../api/services/TeachingSession";
import RescheduleInterview from "../../components/session-details/reschedule-interview";
import BookSession from "../book-session";
import FreezeSession from "../freeze-session";
import CancleSession from "../cancle-session";
import moment from "moment";


const StudentTeachingSession = () => {

    const [upcomingInterview, setUpcomingInterview] = useState({});
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [pastSessions, setPastSessions] = useState([]);
    const [agenda, setAgenda] = useState(null);
    const [isOpenReschedule, setIsOpenReschedule] = useState(false);
    const [rescheduleSessionId, setRescheduleSessionId] = useState(null);
    const [moduleType, setModuleType] = useState("teaching");
  
    const getMockInterviewDetails = async () => {
      try {
        const response = await TeachingSessionService.getStudentTeachingSession({});
        if (response.data.success) {
          setUpcomingInterview(response.data?.data?.upcomingInterview ?? {});
          //setUpcomingInterview({});
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
        } else {
          throw new Error(response.data.message);
        }
      } catch (e) {
        message.error(e.message);
      }
    };
  
    const handleEditAgenda = async(agendaDetails) => {
      try{
        const response = await TeachingSessionService.updateTeachingSessionData({
          "teachingSessionId":upcomingInterview?.id,
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
  
    const addUpcomingSession = (session) => {
      console.log(session)
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
    }
    
    const handleReschedule = (sessionId) => {
      
      setIsOpenReschedule(true);
      setRescheduleSessionId(sessionId);
    }
  
    const handleOpen = (state) => {
      setIsOpenReschedule(state);
    }
  
    useEffect(() => {
      getMockInterviewDetails();
    }, []);
  
  
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

    const cancleUpSession =() => {
      debugger;
      console.log("adas");
    }


    const items = [
      {
        key: '1',
        label: (
          <FreezeSession title='Freeze Session' moduleType="teaching" addUpcomingSession={addUpcomingSession} />
        ),
      },
      {
        key: '2',
        label: (
          <CancleSession title='Cancle Session'  moduleType={moduleType} cancleUpcomingSession={cancleUpSession} addUpcomingSession={upcomingInterview} />
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
            <div style={{gap:15,display:'flex',flexWrap:'wrap',alignItems:'center'}}>
              { (upcomingSessions.length > 0)  &&
              <Space direction="vertical" >
                <Space wrap >
                  <Dropdown placement="bottomLeft" menu={{items}} overlayClassName="session-dropdown">
                    <EllipsisOutlined style={{padding:11,borderRadius:8,border: '1px solid #00000026',backgroundColor:'#fff',cursor:'pointer'}}/>
                  </Dropdown>
                </Space>
              </Space>
              }
              {(upcomingSessions.length > 0 || pastSessions.length > 0) && 
              <BookSession title="Book Extra Session"  addUpcomingSession={addUpcomingSession} moduleType="teaching" />}
            </div>
          </div>

          { (upcomingSessions.length > 0 || pastSessions.length > 0)  ? (
            <SessionDetails
              key="Student Teaching Session"
              moduleType="teaching"
              upcomingInterview={upcomingInterview}
              upcomingSessions={upcomingSessions}
              pastSessions={pastSessions}
              agenda={agenda}
              handleEditAgenda={handleEditAgenda}
              updatePastSession={updatePastSession}
              handleReschedule={handleReschedule}/>
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
                      You Don’t Have Any Booked Session
                    </h2>
                    <div style={{ marginBottom: "16px" }}>
                    You can choose long-term tutor and book your first  <br />{" "}
                    Teaching session by pressing "Book Session" button below.
                    </div>
                    <BookSession moduleType="teaching" title="Book Session" addUpcomingSession={addUpcomingSession}/>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
      <RescheduleInterview isOpen={isOpenReschedule} moduleType={moduleType} handleOpen={handleOpen} sessionId={rescheduleSessionId} updateUpcomingSession={updateUpcomingSession}/>
    </React.Fragment>
  );
};

export default StudentTeachingSession;
