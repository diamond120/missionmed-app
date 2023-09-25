import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Rate, Tabs, message } from "antd";
import RateSession from "../../../components/rate-session";
import { formatDateV1 } from "../../../common/common";
import { useUser } from "../../../api/providers/UserProvider";
import "./index.less";

const SessionList = ({
  date,
  sessions,
  type,
  handleRateSession = () => {},
}) => (
  <div className="sessions">
    <h4 className="sessions-date">{formatDateV1(date)}</h4>
    <ul className="sessions-list">
      {sessions.map((session) => (
        <SessionItem
          session={session}
          type={type}
          handleRateSession={handleRateSession}
          key={session.id}
        />
      ))}
    </ul>
  </div>
);

const SessionItem = ({ session, type, handleRateSession = () => {} }) => {
  const user = useUser();
  const userRole = user.role;
  return (
    <li className="item">
      <div style={{ display: "flex" }}>
        <div className="time">
          <div style={{ paddingBottom: "5px" }}>
            <strong>{session.session_start_time}</strong>
          </div>
          <div className={"end-time"}>{session.session_end_time}</div>
        </div>
        <div>
          <div style={{ paddingBottom: "5px" }}>
            <strong>{session.mock_interview}</strong>
          </div>
          <div className={"mock_interview"}>
            {userRole == "tutor" ? session.student_name : session.tutor_name}
          </div>
        </div>
      </div>
      {userRole == "student" && type == "upcoming" && (
        <Button className={"secondary-button"}>Reschedule</Button>
      )}
      {type == "past" && (
        <>
          <div
            className={"button-group"}
            style={{ display: "flex", columnGap: "16px" }}
          >
            {userRole == "student" && (
              <>
                <Button
                  className={"secondary-button"}
                  onClick={(event) => handleRateSession(event, session)}
                >
                  Rate Session
                </Button>
                <Link to={`/student/interview-summary/${session.id}`}>
                  <Button className={"secondary-button"}>View Summary</Button>
                </Link>
              </>
            )}
            {userRole == "tutor" && (
              <>
                <Link to={`/tutor/interview-summary/${session.id}`}>
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

const Mysessions = ({ upcomingSessions, pastSessions }) => {
  const { TabPane } = Tabs;
  const navigation = useNavigate();
  const [rateSession, setRateSession] = useState(null);

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
        <Tabs defaultActiveKey={"profile"}>
          <TabPane tab={"Upcoming"} key={"Upcoming"}>
            <div className={"upcoming-sessions"}>
              {Object.keys(upcomingSessions).map((date, index) => (
                <SessionList
                  date={date}
                  sessions={upcomingSessions[date]}
                  type={"upcoming"}
                  key={`upcomingSessions${index}`}
                />
              ))}
            </div>
          </TabPane>

          <TabPane tab={"Past"} key={"Past"}>
            <div className={"upcoming-past"}>
              {Object.keys(pastSessions).map((date, index) => (
                <SessionList
                  date={date}
                  sessions={pastSessions[date]}
                  type={"past"}
                  handleRateSession={handleRateSession}
                  key={`pastSessions${index}`}
                />
              ))}
            </div>
          </TabPane>
        </Tabs>
      </div>
      <RateSession
        session={rateSession}
        isOpen={Object.keys(rateSession ?? {}).length > 0}
        handleRateCancel={handleRateCancel}
      />
    </>
  );
};

export default Mysessions;
