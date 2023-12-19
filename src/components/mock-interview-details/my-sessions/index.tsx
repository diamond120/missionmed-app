import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Modal, Tabs } from "antd";
import RateSession from "../../../components/rate-session";
import { formatDateV1 } from "../../../common/common";
import { useUser } from "../../../api/providers/UserProvider";
import { groupSessionsByDate, formatTime, checkSessionOnToday } from "../../../common/common";
import "./index.less";
import CancleSession from "../../../pages/cancle-session";
import { RightOutlined, DownOutlined } from '@ant-design/icons';

const SessionList = ({
  date,
  sessions,
  type,
  handleRateSession = () => { },
  handleReschedule,
  handleEditLink,
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
          handleEditLink={handleEditLink}
          cancleUpSession={cancleUpSession}
        />
      ))}
    </ul>
  </div>
);

const SessionItem = ({ session, type, handleRateSession = () => { }, handleReschedule, handleEditLink, cancleUpSession }) => {
  const user = useUser();
  const userRole = user.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [details, setDetails] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {

    const values = await form.validateFields();
    const data = {
      link: values.sessionLink,
      sessionId: values.sessionId
    }
    handleEditLink(data);
    setIsModalOpen(false);

  };

  const validateURL = (rule, value, callback) => {
    if (value && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)) {
      callback('Please enter a valid URL');
    } else {
      callback();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  form.setFieldsValue({ sessionLink: session.sessionLink });

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
            <strong>{session.mock_interview}</strong>
          </div>
          <div className={"mock_interview"}>
            {userRole == "tutor" ? session.student_name : session.tutor_name}
          </div>
        </div>
      </div>
      {userRole == "student" && type == "upcoming" && (
        <div style={{ gap: 15, display: 'flex', flexWrap: 'wrap' }}>
          <Button disabled={checkSessionOnToday(session.date)} className={"secondary-button"} onClick={() => handleReschedule(session.id)}>Reschedule</Button>
          <CancleSession title='Cancel Session' moduleType={"mock"} addUpcomingSession={session} cancleUpcomingSession={cancleUpSession} />
          {details ? <DownOutlined onClick={() => setDetails(false)} /> : <RightOutlined onClick={() => setDetails(true)} />}
        </div>
      )}
      {userRole == "tutor" && type == "upcoming" && (
        <>
          <div className="btn-group" style={{ marginTop: "10px" }}>
            <Button className={"secondary-button"} onClick={handleClick}>Edit Session Link</Button>
            {details ? <DownOutlined onClick={() => setDetails(false)} /> : <RightOutlined onClick={() => setDetails(true)} />}
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
                label="Edit Session Link"
                name="sessionLink"
                rules={[{ required: true },
                { validator: validateURL }]}
                initialValue={session?.sessionLink}
              >
                <TextArea
                  style={{ height: 50 }}
                  placeholder=""
                />
              </Form.Item>

              <Form.Item
                name="sessionId"
                initialValue={session?.id}
              >
                <Input type="hidden" />
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
                {!session?.hasSessionRate && <Button
                  className={"secondary-button"}
                  onClick={(event) => handleRateSession(event, session)}
                >
                  Rate Session
                </Button>}
                <Link to={`/student/interview-summary/${session.id}`}>
                  <Button className={"secondary-button"}>View Summary</Button>
                </Link>
                {details ? <DownOutlined onClick={() => setDetails(false)} /> : <RightOutlined onClick={() => setDetails(true)} />}
              </>
            )}
            {userRole == "tutor" && (
              <>
                <Link to={`/tutor/interview-summary/${session.id}`}>
                  <Button className={"secondary-button"}>Session Summary</Button>
                </Link>
                {details ? <DownOutlined onClick={() => setDetails(false)} /> : <RightOutlined onClick={() => setDetails(true)} />}
              </>
            )}
          </div>
        </>
      )}

      {details &&
        <div style={{ display: "flex" }} className="w_full">
          <div className="time" style={{ paddingRight: 100 }}>
            <div style={{ paddingBottom: "5px" }}>
              <strong>Session Details</strong>
            </div>

            <div className={"end-time"}>Location : {session.location ?? 'N/A'}</div>
            <div className={"end-time"}>Currinculum : {session.state ?? 'N/A'}</div>
            <div className={"end-time"}>Phone Number : {session.phone_number ?? 'N/A'}</div>
            <div className={"end-time"}>Email : {session.email ?? 'N/A'}</div>

          </div>
          <div>
            <div style={{ paddingBottom: "5px" }}>
              <strong>Session Details</strong>
            </div>
            <div className={"mock_interview"}> University : {session.university ?? 'N/A'} </div>
            <div className={"mock_interview"}>Session /Interview : {session.mock_interview ?? 'N/A'}</div>
            <div className={"mock_interview"}>Applicant Cycle : {session.applicant_cycle ?? 'N/A'}</div>
            <div className={"mock_interview"}>Applicant Type : {session.applicant_type ?? 'N/A'}</div>
          </div>
        </div>
      }
    </li>
  );
};

const Mysessions = ({ upcomingSessions, pastSessions, updatePastSession, handleReschedule, handleEditLink, cancleUpSession }) => {
  const { TabPane } = Tabs;
  const navigation = useNavigate();
  const [rateSession, setRateSession] = useState(null);
  const formatedUpcomingSessios = groupSessionsByDate(upcomingSessions, "asc");
  const formatedpastSessions = groupSessionsByDate(pastSessions, "desc");
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
                  handleEditLink={handleEditLink}
                  cancleUpSession={cancleUpSession}
                />
              ))}
              {
                (Object.keys(formatedUpcomingSessios).length <= 0) &&
                (
                  <li className="item">
                    <div style={{ display: "flex" }}>
                      <div className="time">
                        <div style={{ paddingBottom: "5px" }}>
                          <h1><strong>No Upcoming sessions found.</strong></h1>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              }
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
        </Tabs>
      </div>
      <RateSession
        session={rateSession}
        isOpen={Object.keys(rateSession ?? {}).length > 0}
        handleRateCancel={handleRateCancel}
        updatePastSession={updatePastSession}
      />
    </>
  );
};

export default Mysessions;