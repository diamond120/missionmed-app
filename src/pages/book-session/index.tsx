import { memo, useState, useEffect } from "react";
import { Button, Form, Modal, message, Select, Collapse, Avatar, Radio, Row, Col, Input, Spin, Tooltip, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";
import CommonService from "../../api/services/Common";
import { formatDateV1, formatTime, getDay, formatCreditCardNumber, formatCVC, formatExpirationDate } from "../../common/common";
import moment from "moment";
import "./index.less";
import { useNavigate } from "react-router-dom";
import Calender from "../../components/session-details/calender";
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css'
import { useStudent } from "../../api/providers/StudentProvider";
import { useTutor } from "../../api/providers/TutorProvider";
import { useUser } from "../../api/providers/UserProvider";
const { Panel } = Collapse;
const { TextArea } = Input;
import { QuestionCircleFilled } from "@ant-design/icons";
// import Search from "antd/lib/transfer/search";
import type { SearchProps } from 'antd/es/input/Search';


const BookSession = ({ addUpcomingSession, title, moduleType, timezone, credit }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(1);
  const [modalTitle, setModalTitle] = useState("");
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const totalSteps = 3;
  const [showDropdown, setShowDropdown] = useState(true);
  const [dayOfWeek, setDayOfWeek] = useState('Weekly on Monday');
  const [form] = Form.useForm();
  const [recurringAvailable, setRecurringAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState("");
  const student = useStudent();
  const [sessionType, setSessionType] = useState('');
  const user = useUser();
  const tutor = useTutor();
  const userRole = user.role;
  const { Search } = Input;

  const getUniversityTutorList = async () => {
    try {
      let type = 'Mock interviews';
      if (moduleType == 'ucatStudent') {
        type = 'UCAT 1-to-1 Tutoring';
      } else if (moduleType == 'teaching') {
        type = 'Interview 1-to-1 Tutoring';
      }
      const data = {
        lessionType: type
      };
      // const response = await CommonService.getTutorList(data);
      const response = await CommonService.postAPI('ucat-tutors-list', data);
      if (response.data.success) {
        const tutorList = response.data.data ?? [];
        setTutors(tutorList);
      } else {
        message.error(response.data.message);
      }

    } catch (e) {
      message.error(e.message);
    }
  };

  const getStudentList = async (keyword = '') => {
    try {
      //student List API
      const data = { search: keyword }
      const response = await CommonService.postAPI('students-data', data);
      if (response.data.success) {
        const studentList = response.data.data.students ?? [];
        setStudents(studentList);
      } else {
        message.error(response.data.message);
      }

    } catch (e) {
      message.error(e.message);
    }
  };

  // const stepsTitles = ['Specify Your Priorites','Choose Tutor','Book Time for Sessions','Check Last Details'];
  const stepsTitles = ['Choose Tutor', 'Book Time for Sessions', 'Check Last Details'];

  const next = async () => {
    try {
      const values = await form.validateFields();

      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      if (nextStep == 3) {
        const formData = form.getFieldsValue(true);
        const sessionStartTime = formatTime(formData.sessionStartTime)
        const sessionEndTime = formatTime(formData.sessionEndTime)
        const getday = getDay(moment(formData.date));
        checkingDate(formData.date, sessionStartTime, sessionEndTime, getday);
      }
      setModalTitle(stepsTitles[nextStep - 1]);
    } catch (e) {
      if (activeStep == 2) {
        message.error("Please select slot.");
      }
    }
  };

  const prev = () => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
    setModalTitle(stepsTitles[prevStep - 1]);
  }

  const handleSubmit = async () => {

    await form.validateFields();

    let formData = form.getFieldsValue(true);
    if (formData.issuer == "unknown") {
      message.error('Your Card is invalid');
      return false;
    }

    setLoading(true);
    if (!formData.frequency) {
      formData.frequency = dayOfWeek;
    }
    formData.startTime = formatTime(formData.sessionStartTime);
    formData.endTime = formatTime(formData.sessionEndTime);
    formData.day = getDay(moment(formData.date));

    let type = 'Mock interviews';
    if (moduleType == 'ucatStudent') {
      type = 'UCAT 1-to-1 Tutoring';
    } else if (moduleType == 'teaching') {
      type = 'Interview 1-to-1 Tutoring';
    }
    formData.bookingFor = type;
    try {
      const response = await CommonService.postAPI('/student/book-teaching-session', formData);
      if (response.data.success) {
        const result = response.data.data;
        // if(userRole == 'student') {
        addUpcomingSession({
          date: result.date,
          hasSessionRate: false,
          id: result.id,
          mock_interview: result.mock_interview,
          session_end_time: result.session_end_time,
          session_start_time: result.session_start_time,
          student_id: result.student_id,
          tutor_id: result.tutor_id,
          tutor_name: tutors.find(tutor => tutor.id == result.tutor_id)?.full_name
        });
        // }
        setLoading(false);
        if (moduleType == 'ucatStudent') {
          navigate(`/${userRole}/ucat-session`)
        } else {
          navigate(`/${userRole}/teaching-session`)
        }
        cardDetails();
        message.success('You’ve successfully booked session');
      } else {
        setLoading(false);
        throw new Error(response.data.message)
      }
    } catch (e) {
      setLoading(false);
      message.error(e.message);
    }
    handleCancel()
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const showModal = () => {
    setTutors([]);
    getUniversityTutorList();
    setActiveStep(1);
    setModalTitle("Choose Tutor");
    setIsModalOpen(true);
  };

  const showModalTutor = () => {
    getStudentList();
    setIsModalOpen(true);
    setActiveStep(1);
    setModalTitle("Choose Student");
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };


  const handleRadioChange = (e) => {
    setSessionType(e.target.value);
    setShowDropdown(e.target.value === 'Recurring Session');
  }

  const checkCredit = (student) => {
    if (userRole == 'tutor') {
      if (moduleType == 'ucatStudent' && (student?.ucat_teaching_session_credit == 0 || student?.ucat_teaching_session_credit == null)) {
        return 'disabled'
      } else if (moduleType == 'teaching' && student?.teaching_session_credit == 0 || student?.ucat_teaching_session_credit == null) {
        return 'disabled'
      }
    }
  }

  const TutorPanelHeader = memo(function TutorPanelHeader({ tutor, student }) {
    return (
      <>
        {userRole === 'tutor' ? (
          <Radio key={student.id} value={student.id} disabled={checkCredit(student)}  >
            <div className={"avatar"}>
              <Avatar
                src={student.profile_picture}
                icon={<UserOutlined />}
              />
              <div className={"name-degree"}>
                <h4 className={"tutor-name"}>{student.full_name}</h4>
                {student.phone_number && (
                  <span>
                    Ph No: {student.phone_number + ', '}
                  </span>
                )}
                {student.country && (
                  <span>
                    Country: {student.country + ', '}
                  </span>
                )}
                <span>
                  Credit:
                  {moduleType == 'ucatStudent' && student.ucat_teaching_session_credit ? (
                    ` ${student.ucat_teaching_session_credit}`
                  ) : moduleType == 'teaching' && student.teaching_session_credit ? (
                    ` ${student.teaching_session_credit}`
                  ) : (
                    ` 0`
                  )}
                </span>

                <div
                  style={{
                    display: "flex",
                    columnGap: 10,
                    rowGap: 5,
                    flexWrap: "wrap",
                    color: "#6B7393",
                    fontSize: 12,
                  }}
                >
                </div>
              </div>
            </div>
          </Radio>
        ) : (
          <Radio key={tutor.id} value={tutor.id}>
            <div className={"avatar"}>
              <Avatar
                src={tutor.profile_picture}
                size={40}
                icon={<UserOutlined />}
              />
              <div className={"name-degree"}>
                <h4 className={"tutor-name"}>{tutor.full_name}</h4>
                <div
                  style={{
                    display: "flex",
                    columnGap: 10,
                    rowGap: 5,
                    flexWrap: "wrap",
                    color: "#6B7393",
                    fontSize: 12,
                  }}
                >
                   
                  <div className="school-degree">
                    {tutor.university && tutor.university.map((item, index) => (
                      <span key={index}>{item.degree}<span className="dot"></span>{item.school}
                        {tutor.university.length - 1 != index && ','}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Radio>
        )}
      </>
    );
  });


  const TutorCollapse = memo(function TutorCollapse({
    value = null,
    onChange,
    tutors,
    students
  }) {
    const [activeKey, setActiveKey] = useState([]);

    useEffect(() => {
      // Set initial tutor selection based on activeKey (expanded collapse)
      if (!value && tutors && tutors?.length > 0 && (userRole !== 'tutor')) {
        const firstTutorId = tutors[0]?.id?.toString();
        setActiveKey([firstTutorId]);
        onChange?.({ target: { value: Number(firstTutorId) } })
      }
    }, [tutors]);
  
    // Sync activeKey with the selected radio value (if provided)
    useEffect(() => {
      if (value && value.toString() !== activeKey[0] && (userRole !== 'tutor')) {
        const firstTutorId = tutors[0]?.id?.toString();
        setActiveKey([firstTutorId]);
        onChange?.({ target: { value: Number(firstTutorId) } }); 
      }
    }, [tutors]);
  
    // Handle Collapse change and sync with radio selection
    const handleCollapseChange = (key) => {
      setActiveKey(key);
      if (key) {
        const selectedTutor = tutors.find((tutor) => tutor.id.toString() === key);
        if (selectedTutor && onChange) {
          // Pass the selected tutor ID via onChange when the panel is expanded
          onChange({ target: { value: selectedTutor.id } });
        }
      }
    };
  
    // Handle Radio Change
    const handleRadioChange = (e) => {
      const selectedValue = e.target.value;
      setActiveKey([selectedValue.toString()]);
      onChange?.(e); // Trigger onChange to update the form field
    };

    return (
      <>
        {userRole !== 'tutor' ?
          (
            <Radio.Group onChange={handleRadioChange} value={value}>
              <Collapse
                bordered={false}
                activeKey={activeKey}
                onChange={handleCollapseChange}
                expandIconPosition={`end`}
                className="site-collapse-custom-collapse"
                accordion
              >

                {tutors && tutors.map((tutor) => (
                  <Panel
                    header={<TutorPanelHeader tutor={tutor} />}
                    key={tutor.id}
                    className="site-collapse-custom-panel"
                  >
                      {tutor.biography && (
                        <>
                          <strong className="biography">Biography</strong>
                          <div dangerouslySetInnerHTML={{ __html: tutor.biography }} />
                        </>
                      )}

                  </Panel>
                ))}
              </Collapse>
            </Radio.Group>
          ) : (
            <Radio.Group onChange={onChange} value={value}>
              {/* <Collapse
            bordered={false}
            defaultActiveKey={["1"]}
            expandIconPosition={`end`}
            className="site-collapse-custom-collapse"
            > */}
              {students && students.map((student) => (
                <Panel
                  header={<TutorPanelHeader student={student} />}
                  key={student.id}
                  className="site-collapse-custom-panel tutor_collapse"
                  title={checkCredit(student) == 'disabled' && 'Please select other student because student credit is 0'}
                >
                </Panel>
              ))}
              {/* </Collapse> */}
            </Radio.Group>
          )}
      </>
    );
  });

  // const handleSearchChange = (e) => {
  //   const value = e.target.value;
  //   getStudentList(value)
  // };

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    getStudentList(value)
  }

  const Step2Form = memo(function Step2Form({ students, tutors }) {
    return (
      <>
        <div className={"choose-tutor"}>
          <div className="btn-group" >
            <h3 className={"title"}>Recommended for you</h3>
            {userRole === 'tutor' && (
              <div className="tutor_Search">
                <Search placeholder="input search text" onSearch={onSearch} allowClear />
              </div>)}
          </div>
          <h4 className={"sub-title"} style={{ padding: '0 10px' }}>We recommend you pick someone you haven’t sat a mock with before.</h4>
          {userRole === 'tutor' ? (
            <Form.Item name="studentId" label="" rules={[{ required: true, message: "Please select student" }]}>
              <TutorCollapse students={students} />
            </Form.Item>
          ) : (
            <Form.Item name="tutorId" label="" rules={[{ required: true, message: "Please select tutor" }]}>
              <TutorCollapse tutors={tutors} />
            </Form.Item>
          )}
        </div>
      </>
    );
  });

  const Step3From = () => {
    return <>
      <div className={"book-time-cal"}>
        <Calender tutorId={form.getFieldValue('tutorId')} studentId={form.getFieldValue('studentId')} form={form} moduleType={moduleType} timezone={timezone} next={next} prev={prev} />
        {(userRole == 'tutor' && (timezone != students.find(student => student.id == form.getFieldValue('tutorId'))?.timezone)) && <Alert style={{ top: 23 }} message="Note: Timings in Calendar are displaying based on Student Timezone." showIcon />}
      </div>
    </>;
  };

  const checkingDate = async (date, startTime, endTime, getday, studentId, tutorId) => {
    if (user.role === 'tutor') {
      studentId = form.getFieldValue('studentId');
      tutorId = tutor.id;
    } else {
      tutorId = form.getFieldValue('newTutorId');
    }
    const data = {
      date: date,
      startTime: startTime,
      endTime: endTime,
      day: getday,
      studentId: studentId,
      tutorId: tutorId,
      isFreeze: form.getFieldValue('isFreeze'),
      role: user.role
    };
    const response = await CommonService.checkSession(data);

    try {
      if (response.data.success) {
        setRecurringAvailable(response.data.data.recurring);
        if (response.data.data.recurring == true) {
          form.setFieldsValue({ sessionType: 'Individual Session' });
          setSessionType('Individual Session');
          setShowDropdown(false);
        }
        else {
          form.setFieldsValue({ sessionType: 'Recurring Session' });
          setSessionType('Recurring Session');
          setShowDropdown(true);
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  }


  const Step4From = ({ form }) => {
    const formData = form.getFieldsValue(true);
    const tutorName = (user.role == 'student') ? tutors.find(tutor => tutor.id == formData.tutorId)?.full_name : students.find(student => student.id == formData.studentId)?.full_name
    setDayOfWeek(`Weekly on ${getDay(moment(formData.date))}`)
    const sessionDate = formatDateV1(moment(formData.date, 'YYYY-MM-DD'))
    const sessionStartTime = formatTime(formData.sessionStartTime)
    const sessionEndTime = formatTime(formData.sessionEndTime)

    return (
      <>
        <div className={"session-details"} style={{ padding: "0 10px" }}>
          <h3 style={{ fontSize: 16, color: "#312D42", fontWeight: "600" }}>
            Session Details
          </h3>
          <div style={{ marginBottom: 21 }}>
            <h4 style={{ marginBottom: 0, fontSize: 14, fontWeight: 600 }}>
              {user.role == 'tutor' ? 'Student' : 'Tutor'}
            </h4>
            <div style={{ fontSize: 16 }}>{tutorName}</div>
          </div>

          <Row>
            <Col span={10} sm={8}>
              <h4 style={{ marginBottom: 0, fontSize: 14, fontWeight: 600 }}>
                Date
              </h4>
              <div style={{ fontSize: 16 }}>{sessionDate}</div>
            </Col>
            <Col span={7} sm={5}>
              <h4 style={{ marginBottom: 0, fontSize: 14, fontWeight: 600 }}>
                Start Time
              </h4>
              <div style={{ fontSize: 16 }}>{sessionStartTime}</div>
            </Col>
            <Col span={7} sm={11}>
              <h4 style={{ marginBottom: 0, fontSize: 14, fontWeight: 600 }}>
                End Time
              </h4>
              <div style={{ fontSize: 16 }}>{sessionEndTime}</div>
            </Col>
          </Row>
        </div>

        <Form.Item
          style={{ marginTop: "17px", marginBottom: "0px" }}
          label="Type"
          name="sessionType"
          rules={[{ required: true, message: "Please select session type" }]}
        >
          <Radio.Group onChange={handleRadioChange} >
            <Radio value="Individual Session">Individual Session</Radio>
            <Tooltip title={recurringAvailable ? 'Already recurring session is booked by another sutdernt.' : ''}>

              <Radio value="Recurring Session" disabled={recurringAvailable}>Recurring Session {recurringAvailable && (<><QuestionCircleFilled style={{ marginLeft: "8px" }} /></>)}</Radio>

            </Tooltip>
          </Radio.Group>
        </Form.Item>


        {showDropdown && (
          <>
            <Form.Item
              style={{ marginTop: "17px", marginBottom: "0px" }}
              label="Frequency"
              name="frequency"
            >
              <Select placeholder="Select an option" value={dayOfWeek}
                onChange={(value) => {
                  setDayOfWeek(value);
                  form.setFieldsValue({ frequency: value });
                }} defaultValue={dayOfWeek} disabled={true} >
                <Select.Option value="Weekly on Monday">Weekly on Monday</Select.Option>
                <Select.Option value="Weekly on Tuesday">Weekly on Tuesday</Select.Option>
                <Select.Option value="Weekly on Wednesday">Weekly on Wednesday</Select.Option>
                <Select.Option value="Weekly on Thursday">Weekly on Thursday</Select.Option>
                <Select.Option value="Weekly on Friday">Weekly on Friday</Select.Option>
                <Select.Option value="Weekly on Saturday">Weekly on Saturday</Select.Option>
              </Select>
            </Form.Item>
          </>
        )}
        <Form.Item
          style={{ marginTop: "17px", marginBottom: "0px" }}
          label={user.role == 'student' ? "Notes for Tutor" : "Notes for Student"}
          name="note"
        >
          <TextArea rows={3} placeholder="Note down questions, content, topics etc. that you’d like to focus on so your tutor know ahead of time..." style={{ fontSize: 16 }} />
        </Form.Item>
        {/* {(card != null && card != '' && (sessionType == 'Recurring Session' || (sessionType == 'Individual Session' && credit <= 0))) && (
          <>
            <div className="credit-card">
              <div className="credit-card-header">
                <div className="card-brand">Card Number</div>
                <div className="chip"><button onClick={next} >Edit</button></div>
              </div>
              <div className="credit-card-number">{'**** **** **** ' + card}</div>
            </div>
            <Alert
              message="Warning"
              description={"For Session payment, if you have Credit in your account then it will deducted from that else your Credit Card will be charged."}
              type="warning"
              showIcon
              style={{ marginBottom: 20, marginTop: 20 }}
            />
          </>
        )} */}
      </>
    );
  };

  const Step5From = ({ form }) => {

    const [userName, setUserName] = useState("");
    const [cvc, setCVC] = useState("");
    const [expiry, setExpiry] = useState("");
    const [number, setNumber] = useState("");
    const [focused, setFocused] = useState("");
    const [issuer, setIssuer] = useState();

    const handleInputChange = async (event: any) => {
      if (event.target.name === 'number') {
        event.target.value = formatCreditCardNumber(event.target.value)
        form.setFieldsValue({ number: event.target.value });
        setNumber(event.target.value);
      } else if (event.target.name === 'expiry') {
        event.target.value = formatExpirationDate(event.target.value)
        form.setFieldsValue({ expiry: event.target.value });
        setExpiry(event.target.value);
      } else if (event.target.name === 'cvc') {
        event.target.value = formatCVC(event.target.value)
        form.setFieldsValue({ cvc: event.target.value });
        setCVC(event.target.value);
      } else
        if (event.target.name === 'userName') {
          setUserName(event.target.value);
          form.setFieldsValue({ userName: event.target.value });
        }
      await form.validateFields();
    }

    const handleInputFocus = async (event: any) => {
      setFocused(event.target.name);
    }

    const handleCallback = ({ issuer }, isValid) => {
      form.setFieldsValue({ issuer: issuer });
      if (isValid == true) {
        setIssuer(issuer);

      } else {
        setIssuer(issuer);
      }
    };

    return (
      <>
        <div className={"session-details"} style={{ padding: "0 10px" }}>
          <h3 style={{ fontSize: 16, color: "#312D42", fontWeight: "600" }}>
            Credit Card Details
          </h3>
          <Cards
            cvc={cvc}
            expiry={expiry}
            name={userName}
            number={number}
            focused={focused}
            callback={handleCallback}
          />
          <Form.Item
            style={{ marginTop: "17px", marginBottom: "0px" }}
            label="Name"
            name={"userName"}
            rules={[{ required: true, message: "Please enter name" },
            ]}
          >
            <Input className="form-control" style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }} id="messagsse" name={"userName"} onChange={handleInputChange} onFocus={handleInputFocus} placeholder={"Name"} />
          </Form.Item>

          <Form.Item
            key="number"
            style={{ marginTop: "17px", marginBottom: "0px" }}
            label="Card Number"
            name={"number"}
            rules={[{ required: true, message: "Please enter card number" },
            {
              pattern: /^[\d| ]{19,22}$/,
              message: "Card number must be 16 to 22 digits long and may contain only numbers and spaces",
            },
            ]}
          >
            <Input style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }} name={"number"} onChange={handleInputChange} onFocus={handleInputFocus} placeholder={"Card Number"} />
          </Form.Item>

          <Form.Item
            key="expiry"
            style={{ marginTop: "17px", marginBottom: "0px" }}
            label="Expiration Date:"
            name={"expiry"}
            rules={[{ required: true, message: "Please enter expiry date" },
            {
              pattern: /\d\d\/\d\d/, // Regular expression pattern for MM/YY format
              message: "Please enter a valid expiration date in MM/YY format",
            },
            ]}

          >
            <Input style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }} name={"expiry"} onChange={handleInputChange} onFocus={handleInputFocus} placeholder={"Valid Thru"} />
          </Form.Item>

          <Form.Item
            key="cvc"
            style={{ marginTop: "17px", marginBottom: "0px" }}
            label="CVC:"
            name={"cvc"}
            rules={[{ required: true, message: "Please enter cvc" },
            {
              pattern: /\d{3}/,
            },
            ]}

          >
            <Input style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: " 8px 12px 8px 12px", }} name={"cvc"} onChange={handleInputChange} onFocus={handleInputFocus} placeholder={"CVC"} />
          </Form.Item>

          <Form.Item
            name={"issuer"}
            initialValue={issuer}
          >
            <Input type="hidden" name={'issuer'} value={issuer} />
          </Form.Item>

        </div>
      </>
    );
  };

  const cardDetails = async () => {
    try {
      const response = await CommonService.getAPI("/student/card-data");
      if (response.data.success) {
        setCard(response.data.data.cardDigit);
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  }

  useEffect(() => {
    cardDetails();
  }, [dayOfWeek, recurringAvailable, card]);


  return (
    <>
      {(!timezone) ?
        <Tooltip
          title={
            "Please select your timezone first."
          }
          color={"#465078"}
        >
          <Button className={"primary-button"} >
            {title}
          </Button>
        </Tooltip> :
        userRole === 'tutor' ? (
          <Button className={"secondary-button disable-button"} onClick={showModalTutor}>
            {title}
          </Button>
        ) : (
          <Button className={"primary-button disable-button"} disabled={credit == 0 || credit == '' || credit == undefined} onClick={showModal}>
            {title}
          </Button>)
      }
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className={"mock-interview-modal teachingSessions-modal "}
        width={"max-content"}
        footer={[
          activeStep > 1 && (
            <Button className={"secondary-button previous-button"} onClick={() => prev()}>
              Previous Step
            </Button>
          ),
          <span className={"steps"}>Step {activeStep} of {totalSteps}</span>,


          // ((activeStep < totalSteps  && activeStep != 3 ) || ((!card) &&  activeStep != 4 ) )  && (
          //     <Button
          //       className={"secondary-button"}
          //       onClick={next}
          //     >
          //       Next Step  {sessionType}
          //     </Button>

          // ),
          // loading == true ? (
          //   <Spin />
          // ) : (
          //   ( (activeStep === totalSteps ||  activeStep == 3 && card ) ||  (card == '' &&  activeStep == 4) ) && (
          //     <Button className={"primary-button"} htmlType="submit" onClick={handleSubmit}>
          //       Book Session  {sessionType}
          //     </Button>
          //   ) 

          // ) 

          ((activeStep < totalSteps)) && (
            // ((activeStep < totalSteps && activeStep !== 3) || (!card && activeStep !== 4)) && (
            <>

              {/* {sessionType === 'Individual Session' && credit > 0 && (
                <Button className={"primary-button"} htmlType="submit" onClick={handleSubmit}>
                  Book Session
                </Button>
              )}
              {sessionType === 'Individual Session' && credit <= 0 && (

                <Button className={"secondary-button"} onClick={next}>
                  Next Step
                </Button>
              )}
              {(!sessionType || sessionType == 'Recurring Session') && ( */}
              <Button className={"secondary-button"} onClick={next}>
                Next Step
              </Button>
              {/* )} */}
            </>
          ),
          loading === true ? (
            <Spin />
          ) : (
            ((activeStep === totalSteps || (activeStep === 3 && card)) || (card === '' && activeStep === 4)) && (
              <Button className={"primary-button"} htmlType="submit" onClick={handleSubmit}>
                Book Session
              </Button>
            )
          )



        ]}
      >
        <Form form={form} layout="vertical"
        >
          {activeStep == 1 && (
            userRole === 'tutor' ? (
              <div style={{ width: "555px" }} className="md-w-full">
                <Step2Form students={students} />
              </div>) : (
              <div style={{ width: "555px" }} className="md-w-full">
                <Step2Form tutors={tutors} />
              </div>
            )
          )}
          {activeStep == 2 && (
            <div style={{ width: "1155px" }}>
              <Step3From />
            </div>
          )}
          {activeStep == 3 && (
            <div style={{ width: "600px" }} className="md-w-full">
              <Step4From form={form} />
            </div>
          )}
          {/* {activeStep == 4 && (
            <div style={{ width: "600px" }}>
              <Step5From form={form} />
            </div>
          )} */}
        </Form>


      </Modal>
    </>
  );
};

export default BookSession;