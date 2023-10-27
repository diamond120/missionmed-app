import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Rate, Tabs, message } from "antd";
import RateSession from "../../../components/rate-session";
import { formatDateV1 } from "../../../common/common";
import { useUser } from "../../../api/providers/UserProvider";
import {groupSessionsByDate, formatTime, checkSessionOnToday} from "../../../common/common";
import "./index.less";
import RescheduleInterview from "../reschedule-interview";
import CancleSession from "../../../pages/cancle-session";
import UCATSessionService from "../../../api/services/UCATSession";

const SessionList = ({
  date,
  sessions,
  type,
  handleRateSession = () => {},
  handleReschedule,
  pagesession,
  cancleUpSession
}) => (
  <div className="sessions">
    <h4 className="sessions-date">{formatDateV1(date)}</h4>
    <ul className="sessions-list">
      {sessions.map((session) => (
        <SessionItem
          session={session}
          type={type}
          handleRateSession={handleRateSession}
          handleReschedule={handleReschedule}
          key={session.id}
          pagesession={pagesession}
          cancleUpSession={cancleUpSession}
        />
      ))}
    </ul>
  </div>
);


const SessionItem = ({ session, type, handleRateSession = () => {} , handleReschedule,pagesession,cancleUpSession}) => {
  const user = useUser();
  const userRole = user.role;
  return (
    <li className="item">
      <div style={{ display: "flex" }}>
        <div className="time">
          <div style={{ paddingBottom: "5px" }}>
            <strong>{formatTime(session.session_start_time)}</strong>
          </div>
          <div className={"end-time"}>{formatTime(session.session_end_time)}</div>
        </div>
        <div>
          <div style={{ paddingBottom: "5px" }}>
            {pagesession == "ucat" && (
              <>
              <strong>UCAT Teaching Session</strong>
              </>
            )}
            {pagesession == "teaching" && (
              <>
              <strong>Interview Teaching Session</strong>
              </>
            )}
            <strong>{session.mock_interview}</strong>
          </div>
          <div className={"mock_interview"}>
            {userRole == "tutor" ? session.student_name : session.tutor_name}
          </div>
        </div>
      </div>
    
      {userRole == "student" && type == "upcoming" && (
        <>
          <Button disabled={checkSessionOnToday(session.date)} className={"secondary-button"} onClick={() => handleReschedule(session.id)}>Reschedule</Button>
          <CancleSession title='Cancle Session' moduleType={pagesession} addUpcomingSession={session}  cancleUpcomingSession={cancleUpSession}/>
        
           
        </>
      )}
      {type == "past" && (
        <>
          <div
            className={"button-group"}
            style={{ display: "flex", columnGap: "16px" }}
          >
            
            {userRole == "student" && (
              <>
                {!session?.hasSessionRate  && <Button
                  className={"secondary-button"}
                  onClick={(event) => handleRateSession(event, session)}
                >
                  Rate Session
                </Button>}
                <Link to={`/student/interview-summary/${session.id}/${pagesession}`}>
                  <Button className={"secondary-button"}>View Summary</Button>
                </Link>
              </>
            )}
            {userRole == "tutor" && (
              <>
                <Link to={`/tutor/interview-summary/${session.id}/${pagesession}`}>
                  <Button className={"secondary-button"}>Session Summary</Button>
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </li>
  );
};

const Mysessions = ({moduleType, upcomingSessions, pastSessions, updatePastSession, handleReschedule,cancleUpSession}) => {
  const { TabPane } = Tabs;
  const navigation = useNavigate();
  const [rateSession, setRateSession] = useState(null);
  const formatedUpcomingSessios = groupSessionsByDate(upcomingSessions, "asc");
  const formatedpastSessions= groupSessionsByDate(pastSessions, "desc");
  

  const handleRateSession = (event, session) => {
    setRateSession({ id: session.id, tutorId: session.tutor_id });
  };

  const handleRateCancel = () => {
    setRateSession(null);
  };

  return (
    <>
      <div className={"upc-agenda con-box"} style={{ marginTop: "55px" }}>
        <h2 className={"secondary-title"}>My Sessions </h2>
        <Tabs defaultActiveKey={"Upcoming"}>
          <TabPane tab={"Upcoming"} key={"Upcoming"}>
            <div className={"upcoming-sessions"}>
              {Object.keys(formatedUpcomingSessios).map((date, index) => (
                <SessionList
                  date={date}
                  sessions={formatedUpcomingSessios[date]}
                  type={"upcoming"}
                  handleReschedule={handleReschedule}
                  key={`upcomingSessions${index}`}
                  pagesession={moduleType}
                  cancleUpSession ={cancleUpSession}
                  
                />
              ))}
            </div>
          </TabPane>

          <TabPane tab={"Past"} key={"Past"}>
            <div className={"upcoming-past"}>
              {Object.keys(formatedpastSessions).map((date, index) => (
                <SessionList
                  date={date}
                  sessions={formatedpastSessions[date]}
                  type={"past"}
                  handleRateSession={handleRateSession}
                  key={`pastSessions${index}`}
                  pagesession={moduleType}
                />
              ))}
            </div>
          </TabPane>
        </Tabs>
      </div>
      <RateSession
        pagesession={moduleType}
        session={rateSession}
        isOpen={Object.keys(rateSession ?? {}).length > 0}
        handleRateCancel={handleRateCancel}
        updatePastSession={updatePastSession}
      />
    </>
  );
};

export default Mysessions;
