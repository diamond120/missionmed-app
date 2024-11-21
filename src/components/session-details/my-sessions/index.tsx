import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Modal, Tabs } from "antd";
import RateSession from "../../../components/rate-session";
import { formatDateV1 } from "../../../common/common";
import { useUser } from "../../../api/providers/UserProvider";
import { groupSessionsByDate, formatTime, checkSessionOnToday } from "../../../common/common";
import "./index.less";
import CancleSession from "../../../pages/cancle-session";
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import { PageInfoType } from "./types";

const SessionList = ({
  date,
  sessions,
  type,
  handleRateSession = () => { },
  handleReschedule,
  pagesession,
  cancleUpSession,
  handleEditLink,
  handleEditAgenda
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
          handleEditAgenda={handleEditAgenda}
        />
      ))}
    </ul>
  </div>
);

const SessionItem = ({ session, type, handleRateSession = () => { }, handleReschedule, pagesession, cancleUpSession, handleEditLink, handleEditAgenda }) => {
  const user = useUser();
  const userRole = user.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [form] = Form.useForm();
  const [formAgenda] = Form.useForm();
  const { TextArea } = Input;

  const [details, setDetails] = useState(false)

  const handleClick = (type) => {
    setModalType(type);
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    if (modalType === "agenda") {
      const values = await formAgenda.validateFields();
      handleEditAgenda(values.agenda,values.sessionId);
    } else if (modalType === "sessionLink") {
      const values = await form.validateFields();
      const data = {
        link: values.sessionLink,
        sessionId: values.sessionId
      }
      handleEditLink(data);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalType('');
  };

  const validateURL = (rule, value, callback) => {
    if (value && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)) {
      callback('Please enter a valid URL');
    } else {
      callback();
    }
  };

  useEffect(() => {
    formAgenda.setFieldValue('agenda', session.agenda)
  }, [session.agenda])

  form.setFieldsValue({ sessionLink: session.sessionLink });
  const navigate = useNavigate();
  return (
    <li className="item" style={{ position: "relative" }}>
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

      {type == "freeze" && (
        <>
          {
            session.is_freeze == 1 && (
              <div className={"freeze-div"} ><span className="freeze-span" >Freezed</span>
              </div>)
          }
        </>
      )}

      {(userRole == 'student' && type == "upcoming") && (
        <div style={{ gap: 15, display: 'flex', flexWrap: 'wrap' }}>

          <Button disabled={(session.isWithin24Hours) || session.is_freeze == 1} className={"secondary-button"} onClick={() => handleReschedule(session.id)}>Reschedule</Button>
          <CancleSession title={'Cancel Session'} moduleType={pagesession} addUpcomingSession={session} cancleUpcomingSession={cancleUpSession} />
          <Button className={"secondary-button"} onClick={() => handleClick('agenda')}>Edit Agenda</Button>
          {details ? <DownOutlined onClick={() => setDetails(false)} /> : <RightOutlined onClick={() => setDetails(true)} />}
          <Modal
            title="Edit Agenda"
            open={isModalOpen && modalType === "agenda"}
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
            <Form form={formAgenda} layout="vertical">
              <Form.Item 
              label="Here you can put down your thoughts and questions to your tutor on the upcoming session" 
              name="agenda" 
              rules={[{required:true}]}
              initialValue={session.agenda}
              >
              <TextArea
                style={{ height: 200 }}
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
        </div>
      )}
      {userRole == "tutor" && type == "upcoming" && (
        <>
          <div className="btn-group" style={{ marginTop: "10px" }}>
          {user.role == "tutor" && (
            <>
            <Button className={"secondary-button"} onClick={() => handleReschedule(session.id)}>Reschedule</Button>
              <CancleSession title={'Cancel Session'} moduleType={pagesession} addUpcomingSession={session} cancleUpcomingSession={cancleUpSession} />
              </>
            )}
            <Button className={"secondary-button"} onClick={() => handleClick('sessionLink')}>Edit Session Link</Button>
            <Button className={"secondary-button"} onClick={() => handleClick('agenda')}>Edit Agenda</Button>
            {details ? <DownOutlined onClick={() => setDetails(false)} /> : <RightOutlined onClick={() => setDetails(true)} />}
          </div>
          <Modal
            title="Edit Session Link"
            open={isModalOpen && modalType === "sessionLink"}
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
                key={'test' + session.id}
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
          <Modal
            title="Edit Agenda"
            open={isModalOpen && modalType === "agenda"}
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
            <Form form={formAgenda} layout="vertical">
              <Form.Item 
              label="Here you can put down your thoughts and questions to your tutor on the upcoming session" 
              name="agenda" 
              rules={[{required:true}]}
              initialValue={session.agenda}
              >
              <TextArea
                style={{ height: 200 }}
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
                {/* <Link to={`/student/interview-summary/${session.id}/${pagesession}`}> */}
                <Button className={"secondary-button"} onClick={() => { navigate(`/student/interview-summary/${session.id}/${pagesession}`) }} >View Summary</Button>
                {(session.sessionLink || session.defaultSessionLink) && (
                <Button className={"secondary-button"}  onClick={(event) => {
                const linkToOpen = session.sessionLink  ? session.sessionLink  : session.defaultSessionLink;
                if(linkToOpen) {
                  window.open(linkToOpen , '_blank')
                } else {
                  event.preventDefault();
                }
              }} >Session Link </Button>
                )}
                {/* </Link> */}
                {details ? <DownOutlined onClick={() => setDetails(false)} /> : <RightOutlined onClick={() => setDetails(true)} />}
              </>
            )}
            {userRole == "tutor" && (
              <>
                {/* <Link to={`/tutor/interview-summary/${session.id}/${pagesession}`}> */}
                <Button className={"secondary-button"} onClick={() => { navigate(`/tutor/interview-summary/${session.id}/${pagesession}`) }}>Session Summary</Button>
                {(session.sessionLink || session.defaultSessionLink) && (
                <Button className={"secondary-button"}  onClick={(event) => {
                const linkToOpen = session.sessionLink  ? session.sessionLink  : session.defaultSessionLink;
                if(linkToOpen) {
                  window.open(linkToOpen , '_blank')
                } else {
                  event.preventDefault();
                }
              }} >Session Link </Button>
                )}
                {/* </Link> */}
                {details ? <DownOutlined onClick={() => setDetails(false)} /> : <RightOutlined onClick={() => setDetails(true)} />}
              </>
            )}
          </div>
        </>
      )}

      {details &&
        <div style={{ display: "flex" }} className="w_full roll-out">
          <div className="time pe-full">
            <div style={{ paddingBottom: "5px" }}>
              <strong>{userRole == "tutor" ? "Student Details" : " Tutor Details"}</strong>
            </div>
            <div className={"end-time"}>Location : {session.location ?? 'N/A'}</div>
            <div className={"end-time"}>Currinculum : {(!session.state || session.state == '') ? 'N/A' : session.state}</div>
            <div className={"end-time"}>Phone Number : {session.phone_number ?? 'N/A'}</div>
            <div className={"end-time"}>Email : {session.email ?? 'N/A'}</div>
          </div>
          <div>
            <div style={{ paddingBottom: "5px" }}>
              <strong>Session Details</strong>
            </div>
            <div className={"mock_interview"}>Applicant Cycle : {session.applicant_cycle ?? 'N/A'}</div>
            <div className={"mock_interview"}>Applicant Type : {session.applicant_type ?? 'N/A'}</div>
          </div>
        </div>
      }
    </li>

  );
};

const Mysessions = ({ moduleType, upcomingSessions, pastSessions, updatePastSession, handleReschedule, cancleUpSession, handleEditLink, freezeSessions, handleEditAgenda }) => {
  const { TabPane } = Tabs;
  const [pageInfo, setPageInfo] = useState<PageInfoType>({
    upcoming: {
      page: upcomingSessions.current_page ?? 1,
      loading: false,
      hasMore: upcomingSessions.next_page_url ?? false
    },
    past: {
      page: pastSessions.current_page ?? 1,
      loading: false,
      hasMore: pastSessions.next_page_url ?? false
    },
    freeze: {
      page: freezeSessions.current_page ?? 1,
      loading: false,
      hasMore: freezeSessions.next_page_url ?? false
    },
  });
  const [rateSession, setRateSession] = useState(null);
  const formatedUpcomingSessios = groupSessionsByDate(upcomingSessions.data, "asc");
  const formatedpastSessions = groupSessionsByDate(pastSessions.data, "desc");
  let formatedFreezeSessions = {};
  if (freezeSessions) {
    formatedFreezeSessions = groupSessionsByDate(freezeSessions.data, "asc");
  }

  const updatePageInfo = () => {
    setPageInfo({
      upcoming: {
        page: upcomingSessions.current_page ?? pageInfo.upcoming.page,
        loading: false,
        hasMore: upcomingSessions.next_page_url ?? false
      },
      past: {
        page: pastSessions.current_page ?? pageInfo.past.page,
        loading: false,
        hasMore: pastSessions.next_page_url ?? false
      },
      freeze: {
        page: freezeSessions.current_page ?? pageInfo.freeze.page,
        loading: false,
        hasMore: freezeSessions.next_page_url ?? false
      },
    });
  }

  const handleRateSession = (event, session) => {
    setRateSession({ id: session.id, tutorId: session.tutor_id });
  };

  const handleRateCancel = () => {
    setRateSession(null);
  };

  const loadMore = (type: keyof PageInfoType) => {
    if (!pageInfo[type].hasMore) {
      message.error('No more session available')
      return;
    }
    setPageInfo((prevValue) => {
      return {
        ...prevValue,
        [type]: {
          ...prevValue[type],
          loading: true
        }
      }
    })

    const pageNumber = pageInfo[type].page + 1
    const event = new CustomEvent('LoadMoreSessions', { detail: { type, page: pageNumber } })
    document.dispatchEvent(event)
  }
  useEffect(() => {
    updatePageInfo()
  }, [upcomingSessions, pastSessions, freezeSessions])

  return (
    <>
      <div className={"upc-agenda con-box"} style={{ marginTop: "55px" }}>
        <h2 className={"secondary-title"}>My Sessions </h2>
        <Tabs defaultActiveKey={"Upcoming"}>
          <TabPane tab={"Upcoming"} key={"Upcoming"}>
            <div className={"upcoming-sessions"}>
              {Object.keys(formatedUpcomingSessios).length > 0 && 
                Object.keys(formatedUpcomingSessios).map((date, index) => (
                  <SessionList
                    date={date}
                    sessions={formatedUpcomingSessios[date]}
                    type={"upcoming"}
                    handleReschedule={handleReschedule}
                    key={`upcomingSessions${index}`}
                    pagesession={moduleType}
                    cancleUpSession={cancleUpSession}
                    handleEditLink={handleEditLink}
                    handleEditAgenda={handleEditAgenda}
                  />
              ))}
              {Object.keys(formatedUpcomingSessios).length > 0 && pageInfo.upcoming.hasMore && (
                <Button
                  type='primary'
                  className='primary-button'
                  loading={pageInfo.upcoming.loading}
                  iconPosition='end'
                  onClick={() => loadMore('upcoming')}
                >Load More</Button>
              )}
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
              {Object.keys(formatedpastSessions).length > 0 &&
                Object.keys(formatedpastSessions).map((date, index) => (
                  <SessionList
                    date={date}
                    sessions={formatedpastSessions[date]}
                    type={"past"}
                    handleRateSession={handleRateSession}
                    key={`pastSessions${index}`}
                    pagesession={moduleType}
                  />
              ))}
              {Object.keys(formatedpastSessions).length > 0 && pageInfo.past.hasMore && (
                <Button
                  type='primary'
                  className='primary-button'
                  loading={pageInfo.past.loading}
                  iconPosition='end'
                  onClick={() => loadMore('past')}
                >Load More</Button>
              )}
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
                  cancleUpSession={cancleUpSession}
                  handleEditLink={handleEditLink}

                />
              ))}
              {Object.keys(formatedFreezeSessions).length > 0 && pageInfo.freeze.hasMore && (
                <Button
                  type='primary'
                  className='primary-button'
                  loading={pageInfo.freeze.loading}
                  iconPosition='end'
                  onClick={() => loadMore('freeze')}
                >Load More</Button>
              )}
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