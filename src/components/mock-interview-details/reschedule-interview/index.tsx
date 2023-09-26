import { memo, useState } from "react";
import {
  Button,
  Form,
  Modal,
  message,
  Select,
  Collapse,
  Avatar,
  Radio,
  Row,
  Col,
  Input,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import CommonService from "../../../api/services/Common";
import MockInterviewService from "../../../api/services/MockInterviews";
import Calender from "../calender";
import {formatDateV1} from "../../../common/common";
import moment from "moment";
import "./index.less";
import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;
const { TextArea } = Input;


const RescheduleInterview = ({addUpcomingSession}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(1);
  const [modalTitle, setModalTitle] = useState("");
  const [universityList, setUniversityList] = useState([]);
  const [tutors, setTutors] = useState([]);
  const totalSteps = 4;

  const getUniversityList = async () => {
    try {
      const response = await CommonService.getUniversityList();
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

  const getUniversityTutorList = async () => {
    try {
      const data = {
        university: form.getFieldValue("university"),
      };
      const response = await CommonService.getUniversityTutorList(data);
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

  const stepsTitles = ['Specify Your Priorites','Choose Tutor','Book Time for Interview','Check Last Details'];

  const next = async () => {
    try{
      const values = await form.validateFields();
      console.log(values);
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      setModalTitle(stepsTitles[nextStep-1]);
    }catch(e){
      if (activeStep == 3) {
        message.error("Please select slot.");
      }
    }
  };

  const prev = ()  => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
    setModalTitle(stepsTitles[prevStep-1]);
  }

  const handleSubmit = async () => {
    console.log(form.getFieldsValue(true));
    const formData = form.getFieldsValue(true);
    try{
     const response = await MockInterviewService.bookInterview(formData);
     if(response.data.success){
      const result = response.data.data;
      addUpcomingSession({
        date:result.date,
        hasSessionRate:false,
        id:result.id,
        mock_interview:result.mock_interview,
        session_end_time:result.session_end_time,
        session_start_time:result.session_start_time,
        student_id:result.student_id,
        tutor_id:result.tutor_id,
        tutor_name:tutors.find(tutor => tutor.id==result.tutor_id)?.full_name
      });
      navigate("/student/mock-interview")
      message.success('You’ve successfully booked mock interview');
     }else{
      throw new Error(response.data.message)
     }
    }catch(e){
      message.error(e.message);
    }
    handleCancel()
    
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const showModal = () => {
    setIsModalOpen(true);
    setActiveStep(1);
    getUniversityList();
    setModalTitle("Specify Your Priorites");
  };

  const handleOk = () => {
    setIsModalOpen(false);
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
    return (
      <>
        <Form.Item
          name="university"
          label="Which university are you sitting a mock interview for?"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            placeholder="--- Select University ---"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={getUniversityTutorList}
            options={universityList}
          />
        </Form.Item>
        {selectUniversity && (
          <Form.Item
            name="mockInterview"
            label="Which mock interview are you sitting?"
            rules={[{ required: true }]}
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

  const TutorPanelHeader = memo(function TutorPanelHeader({ tutor }) {
    return (
      <>
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
                <span>{tutor.degree}</span> &#8226; <span>{tutor.school}</span>
              </div>
            </div>
          </div>
        </Radio>
      </>
    );
  });

  const TutorCollapse = memo(function TutorCollapse({
    value = null,
    onChange,
    tutors,
  }) {
    return (
      <Radio.Group onChange={onChange} value={value}>
        <Collapse
          bordered={false}
          defaultActiveKey={["1"]}
          expandIconPosition={`end`}
          className="site-collapse-custom-collapse"
        >
          {tutors.map((tutor) => (
            <Panel
              header={<TutorPanelHeader tutor={tutor} />}
              key={tutor.id}
              className="site-collapse-custom-panel"
            >
              {tutor.biography}
            </Panel>
          ))}
        </Collapse>
      </Radio.Group>
    );
  });

  const Step2Form = memo(function Step2Form({ tutors }) {
    return (
      <>
        <div className={"choose-tutor"}>
          <h3 className={"title"}>Recommended for you</h3>
          <Form.Item name="tutorId" label="" rules={[{ required: true }]}>
            <TutorCollapse tutors={tutors} />
          </Form.Item>
        </div>
      </>
    );
  });

  const Step3From = () => {
    return <>
      <div className={"book-time-cal"}>
      <Calender tutorId={form.getFieldValue('tutorId')} form={form}/>
      </div>
    </>;
  };

  const Step4From = ({form}) => {
    const formData = form.getFieldsValue(true);
    const dateTimeFormat = "YYYY-MM-DD HH:mm a"
    const timeFormat = "HH:mm a"
    const tutorName = tutors.find(tutor => tutor.id==formData.tutorId)?.full_name 
    const sessionDate =  formatDateV1(moment(formData.date, 'YYYY-MM-DD'))
    const sessionStartTime =  moment(moment(formData.sessionStartTime, dateTimeFormat)).format("HH:mm a")
    const sessionEndTime =  moment(moment(formData.sessionEndTime, dateTimeFormat)).format("HH:mm a")
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
      <Button className={"primary-button"} onClick={showModal}>
        Book Interview
      </Button>
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className={"mock-interview-modal "}
        width={"max-content"}
        footer={[
          activeStep > 1 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous Step
            </Button>
          ),
          <span className={"steps"}>Step {activeStep} of 4</span>,
          activeStep < totalSteps && (
            <Button
              className={"secondary-button"}
              onClick={next}
            >
              Next Step
            </Button>
          ),
          activeStep === totalSteps && (
            <Button className={"primary-button"} htmlType="submit" onClick={handleSubmit}>
              Book Interview
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
              />
            </div>
          )}
          {activeStep == 2 && (
            <div style={{ width: "555px" }}>
              <Step2Form tutors={tutors} />
            </div>
          )}
          {activeStep == 3 && (
            <div style={{ width: "1155px" }}>
              <Step3From />
            </div>
          )}
          {activeStep == 4 && (
            <div style={{ width: "600px" }}>
              <Step4From form={form}/>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default RescheduleInterview;
