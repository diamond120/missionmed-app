import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Form, Input, Modal, Rate, Tabs, message } from "antd";
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
  cancleUpSession,
  handleEditLink
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
          handleEditLink={handleEditLink}
        />
      ))}
    </ul>
  </div>
);


const SessionItem = ({ session, type, handleRateSession = () => {} , handleReschedule,pagesession,cancleUpSession,handleEditLink}) => {
  const user = useUser();
  const userRole = user.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const handleClick = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
      const values = await form.validateFields();
      handleEditLink(values.sessionLink);
      setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const validateURL = (rule, value, callback) => {
    if (value && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)) {
      callback('Please enter a valid URL');
    } else {
      callback();
    }
  };
  form.setFieldsValue({sessionLink :  session.sessionLink});
  return (
    <li className="item" style={{position :"relative"}}>
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
      
      { type == "freeze" && (
        <>
        {
        session.is_freeze == 1 && (
          <div className= {"freeze-div"} ><span   className = "freeze-span" >Freezed</span>
          </div>) 
        }
        </>
      )}
      { (userRole == 'student' && type == "upcoming") && (
        <div style={{gap:15,display:'flex',flexWrap:'wrap'}}>
          <Button disabled={checkSessionOnToday(session.date) || session.is_freeze == 1 } className={"secondary-button"} onClick={() => handleReschedule(session.id)}>Reschedule</Button>
          <CancleSession title='Cancel Session' moduleType={pagesession} addUpcomingSession={session} cancleUpcomingSession={cancleUpSession}/>
        </div>
      )}
      { userRole == "tutor" && type == "upcoming" && (
        <>
        <div className="btn-group" style={{ marginTop: "10px" }}>
         <Button className={"secondary-button"} onClick={handleClick}>Edit Session Link</Button>
        </div>
        <Modal
          title="Edit Session Link"
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
          className={"mock-interview-modal"}
          width={"600px"}
          footer={[
            <div key="buttonGroup" className='button-group'>
              <Button key="discard" type="dashed" className={"secondary-button"} onClick={handleCancel}>
                Discard 
              </Button>
              <Button key="submit" className={"primary-button"} onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>
          ]}
        >
        <Form form={form} layout="vertical">
            <Form.Item 
            key={'test'+session.id}
            label="Edit Session Link" 
            name="sessionLink" 
            rules={[{required:true},
              { validator: validateURL }]}
            initialValue={session?.sessionLink}
            
            >
            <TextArea
              style={{ height: 50 }}
              placeholder=""
            />
        </Form.Item>
        </Form>
      </Modal>
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

const Mysessions = ({moduleType, upcomingSessions, pastSessions, updatePastSession, handleReschedule,cancleUpSession,handleEditLink,freezeSessions}) => {
  const { TabPane } = Tabs;
  const navigation = useNavigate();
  const [rateSession, setRateSession] = useState(null);
  const formatedUpcomingSessios = groupSessionsByDate(upcomingSessions, "asc");
  const formatedpastSessions= groupSessionsByDate(pastSessions, "desc");
  let formatedFreezeSessions = {};
  if(freezeSessions) {
    formatedFreezeSessions= groupSessionsByDate(freezeSessions, "asc");
  }

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
                  handleEditLink= {handleEditLink}
                  
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
               {
                (Object.keys(formatedpastSessions).length <= 0) &&
                (
                  <li className="item">
                    <div style={{ display: "flex" }}>
                      <div className="time">
                        <div style={{ paddingBottom: "5px" }}>
                          <h1><strong>No past sessions found.</strong></h1>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              }
            </div>
          </TabPane>
          <TabPane tab={"Freeze"} key={"Freeze"}>
            <div className={"upcoming-sessions"}>
              {Object.keys(formatedFreezeSessions).map((date, index) => (
                  <SessionList
                  date={date}
                  sessions={formatedFreezeSessions[date]}
                  type={"freeze"}
                  handleReschedule={handleReschedule}
                  key={`upcomingSessions${index}`}
                  pagesession={moduleType}
                  cancleUpSession ={cancleUpSession}
                  handleEditLink= {handleEditLink}
                  
                />
              ))}
              {
                (Object.keys(formatedFreezeSessions).length <= 0) &&
                (
                  <li className="item">
                    <div style={{ display: "flex" }}>
                      <div className="time">
                        <div style={{ paddingBottom: "5px" }}>
                          <h1><strong>No Freeze sessions found.</strong></h1>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              }
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
