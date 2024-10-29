import { useEffect, useState } from "react";
import { Button, Form, Modal, message, Select,  Radio, Row, Col, Input, Alert, Spin } from "antd";
import CommonService from "../../../api/services/Common";
import Calender from "../calender";
import { formatDateV1, formatTime, getDay } from "../../../common/common";
import moment from "moment";
import "./index.less";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { useUser } from "../../../api/providers/UserProvider";
const { TextArea } = Input;

const RescheduleInterview = ({
  updateUpcomingSession,
  isOpen,
  handleOpen,
  sessionId,
  timezone
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeStep, setActiveStep] = useState(1);
  const [modalTitle, setModalTitle] = useState("");
  const [universityList, setUniversityList] = useState([]);
  const totalSteps = 3;
  const [interviewSummary, setInterviewSummary] = useState(null);
  const [mockInterviewList, setMockInterviewList] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const userRole = user.role;
  const getInterviewSummary = async (sessionId) => {
    try {
      const data = {
        sessionId : sessionId,
        bookingFor : 'Mock interviews'
      };
      const response = await CommonService.postAPI('/session-summary',data);
      if (response.data.success) {
        setInterviewSummary(response.data.data);
        // Set mockInterviewList based on universitywisemock value
        const interviewCount = await response.data.data.universityWiseMock;
        const MockInterviewList =await Array.from({ length: interviewCount }, (_, i) => ({
          id: i + 1,
          value: `Mock Interview #${i + 1}`,
        }));
        setMockInterviewList(MockInterviewList);
        form.setFieldsValue({ university: response.data.data?.university });
        form.setFieldsValue({ mockInterview: response.data.data?.mock_interview });
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
    if (sessionId && isOpen) {
      console.log("id : ", sessionId, isOpen)
      getInterviewSummary(sessionId);
    }
    setModalTitle("Reschedule Interview");
    setActiveStep(1);
    if(!isOpen)
    setInterviewSummary(null)
  }, [sessionId,isOpen]);

  useEffect(() => {
    getUniversityList();
  },[])

  const stepsTitles = [
    "Reschedule Interview",
    "Book New Time for Interview",
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
    setLoading(true);
    const formData = form.getFieldsValue(true);
    formData.bookingFor = 'Mock interviews';
    try {
      formData.day = getDay(moment(formData.date));
      formData.startTime =  formatTime(formData.sessionStartTime);
      formData.endTime =  formatTime(formData.sessionEndTime);
      const response = await CommonService.postAPI('/student/reschedule-interview',{...formData, mockinterviewId:interviewSummary?.id});
      if (response.data.success) {
        const result = response.data.data;
        updateUpcomingSession(result.id, {
          date: result.date,
          mock_interview: result.mock_interview,
          session_end_time: result.session_end_time,
          session_start_time: result.session_start_time,
        });
        setLoading(false);
        const path = userRole === 'student' ? '/student/mock-interview' : '/tutor/mock-interview';
        navigate(path);
        message.success("You've successfully rescheduled mock interview");
      } else {
        setLoading(false);
        throw new Error(response.data.message);
      }
    } catch (e) {
      setLoading(false);
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

  const getMockInterviewList = () => {
    return mockInterviewList;
  };

  const selectUniversity = Form.useWatch("university", form);

  const Step1Form = ({ universityList, getMockInterviewList }) => {
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
          name="university"
          label="Which university are you sitting a mock interview for?"
          rules={[{ required: true }]}
          initialValue={interviewSummary?.university}
        >
          <Select
            showSearch
            placeholder="--- Select University ---"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={universityList}
            disabled={true}
          />
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
      <Calender tutorId={interviewSummary?.tutor_id} studentId={interviewSummary?.student_id}  rescheduleDate={interviewSummary?.student_session_start_time}  form={form} next={next} timezone={timezone}/>
      {(userRole == 'tutor') && <Alert style={{ top: 23 }} message="Note: Timings in Calendar are displaying based on Student Timezone." showIcon />}
      </div>
    </>;
  };

  const Step3From = ({form}) => {
    const formData = form.getFieldsValue(true);
    const tutorName = interviewSummary?.tutorName
    const sessionDate =  formatDateV1(moment(formData.date, 'YYYY-MM-DD'))
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
              University
            </h4>
            <div style={{ fontSize: 16 }}>{formData.university}</div>
          </div>

          <Row style={{ marginBottom: 17 }}>
            <Col span={10} sm={8}>
              <h4 style={{ marginBottom: 0, fontSize: 14, fontWeight: 600 }}>
                Interview Type
              </h4>
              <div style={{ fontSize: 16 }}>{formData.mockInterview}</div>
            </Col>
            <Col span={14} sm={16}>
              <h4 style={{ marginBottom: 0, fontSize: 14, fontWeight: 600 }}>
                Tutor
              </h4>
              <div style={{ fontSize: 16 }}>{tutorName}</div>
            </Col>
          </Row>

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
          loading == true ? (
            <Spin />
          ) : (
          activeStep === totalSteps && (
            <Button
              className={"primary-button"}
              htmlType="submit"
              onClick={handleSubmit}
            >
              Confirm
            </Button>
          )
          ),
        ]}
      >
        <Form form={form} layout="vertical">
          {activeStep == 1 && (
            <div style={{ width: "555px" }} className="md-w-full">
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
            <div style={{ width: "600px" }} className="md-w-full">
              <Step3From form={form} />
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default RescheduleInterview;