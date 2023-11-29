import { useEffect, useState } from "react";
import { Button,Form, Modal, message, Select, Radio, Row, Col, Input, Tooltip } from "antd";
import CommonService from "../../../api/services/Common";
import Calender from "../calender";
import { formatDateV1, formatTime, getDay } from "../../../common/common";
import moment from "moment";
import "./index.less";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { QuestionCircleFilled } from "@ant-design/icons";

const { TextArea } = Input;
const RescheduleInterview = ({
  updateUpcomingSession,
  isOpen,
  handleOpen,
  sessionId,
  moduleType,
  timezone
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeStep, setActiveStep] = useState(1);
  const [modalTitle, setModalTitle] = useState("");
  const [universityList, setUniversityList] = useState([]);
  const [recurringAvailable, setRecurringAvailable] = useState(false);

  const totalSteps = 3;

  const [interviewSummary, setInterviewSummary] = useState(null);
  const [showDropdown, setShowDropdown] = useState(true);
  const [dayOfWeek, setDayOfWeek] = useState('Monday');

  const getSessionummary = async (sessionId) => {
    try {
      const data = {
        sessionId : sessionId,
        bookingFor : (moduleType == 'teaching') ? 'Interview 1-to-1 Tutoring' : 'UCAT 1-to-1 Tutoring'
      };
      const response = await CommonService.postAPI('/session-summary',data);
      
      if (response.data.success) {
        setInterviewSummary(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const getUniversityList = async () => {
    try {
      const response = await CommonService.getAPI("/university-list");
      if (response.data.success) {
        setUniversityList(
          response.data.data.map((university) => ({
            key: university.id,
            label: university.title,
            value: university.title,
          }))
        );
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    if (sessionId) {
      getSessionummary(sessionId);
    }
    
    setModalTitle("Reschedule Session");
    setActiveStep(1);
  }, [sessionId,isOpen]);

  useEffect(() => {
    getUniversityList();
  },[])

  const stepsTitles = [
    "Reschedule Session",
    "Book New Time for Session",
    "Check Last Details",
  ];

  const next = async () => {
    try {
      const values = await form.validateFields();
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
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
  };

  const handleSubmit = async () => {
    const formData = form.getFieldsValue(true);
    try {
      formData.bookingFor = (moduleType == 'teaching') ? 'Interview 1-to-1 Tutoring' : 'UCAT 1-to-1 Tutoring';
      formData.day = getDay(moment(formData.date));
      formData.startTime =  formatTime(formData.sessionStartTime);
      formData.endTime =  formatTime(formData.sessionEndTime);
      formData.frequency =  interviewSummary?.frequency;
      formData.tutorId =  interviewSummary?.tutor_id;
      formData.bookingFor =  interviewSummary?.booking_for;
      const response = await CommonService.postAPI('/student/reschedule-session',{...formData, sessionId:interviewSummary?.id});
      if (response.data.success) {
        const result = response.data.data;
        updateUpcomingSession(result.id, {
          date: result.date,
          mock_interview: result.mock_interview,
          session_end_time: result.session_end_time,
          session_start_time: result.session_start_time,
        });
        if(moduleType == 'teaching') {
          navigate("/student/teaching-session");
        
        } else {
          navigate("/student/ucat-session");
        }
        message.success("You've successfully rescheduled teaching session");
      } else {
        throw new Error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
    handleCancel();
  };

  const handleCancel = () => {
    handleOpen(false);
    form.resetFields();
  };

  const handleOk = () => {
    handleOpen(false);
  };

  const mockInterviewList = [
    { id: 1, value: "Mock Interview#1" },
    { id: 2, value: "Mock Interview#2" },
    { id: 3, value: "Mock Interview#3" },
  ];

  const getMockInterviewList = () => {
    return mockInterviewList;
  };
  
  const selectUniversity = Form.useWatch("university", form);

  const Step1Form = ({ universityList, getMockInterviewList }) => {
    if(interviewSummary?.session_type =='Individual Session') {
      setShowDropdown(false);
    }
    console.log(interviewSummary);
    return (
      <>
          <div className={"session-details"} style={{ padding: "10px" }}>
          <h3 style={{ fontSize: 16, color: "#312D42", fontWeight: "600" }}>
            Session Details
          </h3>
          <div style={{ marginBottom: 21 }}>
            <h4 style={{ marginBottom: 0, fontSize: 14, fontWeight: 600 }}>
              Tutor
            </h4>
            <div style={{ fontSize: 16 }}>{interviewSummary?.tutorName}</div>
          </div>

          <Row>
            <Col span={10} sm={8}>
              <h4 style={{ marginBottom: 0, fontSize: 14, fontWeight: 600 }}>
                Date
              </h4>
              <div style={{ fontSize: 16 }}>{formatDateV1(interviewSummary?.date)}</div>
            </Col>
            <Col span={7} sm={5}>
              <h4 style={{ marginBottom: 0, fontSize: 14, fontWeight: 600 }}>
                Start Time
              </h4>
              <div style={{ fontSize: 16 }}>{formatTime(interviewSummary?.session_start_time)}</div>
            </Col>
            <Col span={7} sm={11}>
              <h4 style={{ marginBottom: 0, fontSize: 14, fontWeight: 600 }}>
                End Time
              </h4>
              <div style={{ fontSize: 16 }}>{formatTime(interviewSummary?.session_end_time)}</div>
            </Col>
          </Row>
        </div>
        
        <Form.Item
          style={{ marginTop: "17px", marginBottom: "0px"}}
          label="Reschedule UCAT Teaching Session?"
          name="sessionType"
          initialValue={interviewSummary?.session_type}
        >   
         <Radio.Group onChange={handleRadioChange}>
            <Radio value="Individual Session">This One Session</Radio>
            <Tooltip title={(interviewSummary?.session_type =='Individual Session') ? 'This Session is individual session.' : ''}>
              <Radio value="Recurring Session" disabled={interviewSummary?.session_type =='Individual Session'}>All Recurring Sessions<QuestionCircleFilled  style={{marginLeft:"8px"}}/></Radio>
            </Tooltip>
         </Radio.Group>
        </Form.Item>
        {selectUniversity && (
          <Form.Item
            name="mockInterview"
            label="Which mock interview are you sitting?"
            rules={[{ required: true }]}
            initialValue={interviewSummary?.mock_interview}
          >
            <Radio.Group>
              {getMockInterviewList(selectUniversity).map((interview) => (
                <Radio key={interview.id} value={interview.value}>
                  {interview.value}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        )}
      </>
    );
  };

  const Step2From = () => {
    return <>
      <div className={"book-time-cal"}>
      <Calender tutorId={interviewSummary?.tutor_id} rescheduleDate={interviewSummary?.session_start_time} form={form} moduleType = {moduleType} next={next} timezone={timezone}/>
      </div>
    </>;
  };

  const handleRadioChange = (e) => {
    setShowDropdown(e.target.value === 'Recurring Session');
  }

  const checkingDate = async (date,startTime,endTime) => {
    // const data = {
    //   date : date,
    //   startTime : startTime,
    //   endTime : endTime
    // };
    // const response = await CommonService.checkSession(data);
    // try {
    //   if (response.data.success) {
    //     setRecurringAvailable(response.data.data.recurring);
    //       if(response.data.data.recurring == true) {
    //         setShowDropdown(false);
    //       } else {
    //         form.setFieldsValue({ sessionType: 'Recurring Session' });
    //         setShowDropdown(true);
    //       }
    //   } else {
    //       throw new Error(response.data.message); 
    //   }
    // } catch (e) {
    //   message.error(e.message);
    // }
  }

  const Step3From = ({form}) => {
    console.log(interviewSummary);
    const formData = form.getFieldsValue(true);
    const tutorName = interviewSummary?.tutorName
    const sessionDate =  formatDateV1(moment(formData.date, 'YYYY-MM-DD'))
    setDayOfWeek(getDay(moment(formData.date)));
    const sessionStartTime =  formatTime(formData.sessionStartTime)
    const sessionEndTime =  formatTime(formData.sessionEndTime)
    return (
      <>
        <div className={"session-details"} style={{ padding: "0 10px" }}>
          <h3 style={{ fontSize: 16, color: "#312D42", fontWeight: "600" }}>
            Session Details
          </h3>
          <div style={{ marginBottom: 21 }}>
            <h4 style={{ marginBottom: 0, fontSize: 14, fontWeight: 600 }}>
            Tutor
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
          style={{ marginTop: "17px", marginBottom: "0px"}}
          label="Type"
          name="sessionType"
        >   
         <Radio.Group onChange={handleRadioChange}  disabled={true}>
            <Radio value="Individual Session">Individual Session</Radio>
            <Radio value="Recurring Session">Recurring Session</Radio>
         </Radio.Group>
        </Form.Item>
        {showDropdown && (
        <Form.Item
          style={{ marginTop: "17px", marginBottom: "0px"}}
          label="Frequency"
          name="frequency"
        >
            <Select value={dayOfWeek} placeholder="Select an option" disabled={true} defaultValue={dayOfWeek}>
                <Select.Option value="Monday" >Weekly on Monday</Select.Option>
                <Select.Option value="Tuesday">Weekly on Tuesday</Select.Option>
                <Select.Option value="Wednesday">Weekly on Wednesday</Select.Option>
                <Select.Option value="Thursday">Weekly on Thursday</Select.Option>
                <Select.Option value="Friday">Weekly on Friday</Select.Option>
                <Select.Option value="Saturday">Weekly on Saturday</Select.Option>
            </Select>
        </Form.Item>
        )}

        <Form.Item
          style={{ marginTop: "17px", marginBottom: "0px"}}
          label="Leave a quick note"
          name="note"
        >
          <TextArea rows={3} placeholder="Textarea" style={{ fontSize: 16 }} />
        </Form.Item>
      </>
    );
  };

  return (
    <>
      <Modal
        title={modalTitle}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className={"mock-interview-modal "}
        width={"max-content"}
        footer={[
          activeStep > 1 && (
            <Button className={"secondary-button previous-button"} onClick={() => prev()}>
              Previous Step
            </Button>
          ),
          <span className={"steps"}>Step {activeStep} of {stepsTitles.length}</span>,
          activeStep < totalSteps && (
            <Button className={"secondary-button"} onClick={next}>
              Next Step
            </Button>
          ),
          activeStep === totalSteps && (
            <Button
              className={"primary-button"}
              htmlType="submit"
              onClick={handleSubmit}
            >
              Confirm
            </Button>
          ),
        ]}
      >
        <Form form={form} layout="vertical">
          {activeStep == 1 && (
            <div style={{ width: "555px" }}>
              <Step1Form
                universityList={universityList}
                getMockInterviewList={getMockInterviewList}
                interviewSummary={interviewSummary}
              />
            </div>
          )}
          {activeStep == 2 && (
            <div style={{ width: "1155px" }}>
              <Step2From />
            </div>
          )}
          {activeStep == 3 && (
            <div style={{ width: "600px" }}>
              <Step3From form={form} />
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default RescheduleInterview;