import { memo, useState, useEffect } from "react";
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
  Spin
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import CommonService from "../../api/services/Common";
import UCATSessionService from "../../api/services/UCATSession";
import TeachingSessionService from "../../api/services/TeachingSession";
import {formatDateV1, formatTime, getDay} from "../../common/common";
import moment from "moment";
import "./index.less";
import { useNavigate } from "react-router-dom";
import Calender from "../../components/session-details/calender";


const { Panel } = Collapse;
const { TextArea } = Input;


const BookSession = ({addUpcomingSession,title,moduleType}) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(1);
  const [modalTitle, setModalTitle] = useState("");
  const [tutors, setTutors] = useState([]);
  const totalSteps = 3;
  const [showDropdown, setShowDropdown] = useState(true);
  const [dayOfWeek, setDayOfWeek] = useState('Weekly on Monday');
  const [form] = Form.useForm();
  const [recurringAvailable, setRecurringAvailable] = useState(false);
  const [selectedVal,setSelectedVal] = useState("Individual Session");
  const [loading, setLoading] = useState(false);
  


  const getUniversityTutorList = async () => {
    try {
      let type = 'Mock interviews';
      if(moduleType == 'ucatStudent') {
        type = 'UCAT 1-to-1 Tutoring';
      } else if(moduleType == 'teaching') {
        type = 'Interview 1-to-1 Tutoring';
      }
      const data = {
        lessionType : type
      };
      const response = await CommonService.getTutorList(data);
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

  // const stepsTitles = ['Specify Your Priorites','Choose Tutor','Book Time for Sessions','Check Last Details'];
  const stepsTitles = ['Choose Tutor','Book Time for Sessions','Check Last Details'];

  const next = async () => {
    try{
      const values = await form.validateFields();
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
        if(nextStep == 3) {
          const formData = form.getFieldsValue(true);
          const sessionStartTime =  formatTime(formData.sessionStartTime)
          const sessionEndTime =  formatTime(formData.sessionEndTime)
          const getday = getDay(moment(formData.date));
          checkingDate(formData.date,sessionStartTime,sessionEndTime,getday);
        }
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
    setLoading(true);
    await form.validateFields();
    let formData = form.getFieldsValue(true);
    if(!formData.frequency) {
      formData.frequency = dayOfWeek;
    }
    formData.startTime =  formatTime(formData.sessionStartTime);
    formData.endTime =  formatTime(formData.sessionEndTime);
    formData.day = getDay(moment(formData.date));
    
    let type = 'Mock interviews';
    if(moduleType == 'ucatStudent') {
      type = 'UCAT 1-to-1 Tutoring';
    } else if(moduleType == 'teaching') {
      type = 'Interview 1-to-1 Tutoring';
    }
    formData.bookingFor = type;
    try{
      const response = await CommonService.postAPI('/student/book-teaching-session',formData);

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
      setLoading(false);
      if(moduleType== 'ucatStudent'){
        navigate("/student/ucat-session")
      } else {
        navigate("/student/teaching-session")
      }
      
      message.success('You’ve successfully booked session');
     }else{
      setLoading(false);
      throw new Error(response.data.message)
     }
    }catch(e){
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
    getUniversityTutorList();
    setIsModalOpen(true);
    setActiveStep(1);
    setModalTitle("Choose Tutor");
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  
  const handleRadioChange = (e) => {
    setShowDropdown(e.target.value === 'Recurring Session');
  }

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
          <Form.Item name="tutorId" label="" rules={[{ required: true, message:"Please select tutor" }]}>
            <TutorCollapse tutors={tutors} />
          </Form.Item>
        </div>
      </>
    );
  });


  const Step3From = () => {
    return <>
      <div className={"book-time-cal"}>
      <Calender tutorId={form.getFieldValue('tutorId')} form={form} moduleType={moduleType}  />
      </div>
    </>;
  };

  const checkingDate = async (date,startTime,endTime,getday) => {
    const data = {
      date : date,
      startTime : startTime,
      endTime : endTime,
      day :getday
    };
    const response = await CommonService.checkSession(data);

    try {
      if (response.data.success) {
        setRecurringAvailable(response.data.data.recurring);
          if(response.data.data.recurring == true) {
            form.setFieldsValue({ sessionType: 'Individual Session' });
            setShowDropdown(false);
          } else {
            form.setFieldsValue({ sessionType: 'Recurring Session' });
            setShowDropdown(true);
          }
      } else {
          throw new Error(response.data.message); 
      }
    } catch (e) {
      message.error(e.message);
    }
}

  const Step4From = ({form}) => {
   
    const formData = form.getFieldsValue(true);
  
    const tutorName = tutors.find(tutor => tutor.id==formData.tutorId)?.full_name 
    setDayOfWeek(`Weekly on ${getDay(moment(formData.date))}`)
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
          rules={[{ required: true, message:"Please select session type" }]}
        > 
         <Radio.Group onChange={handleRadioChange} >
            <Radio value="Individual Session">Individual Session</Radio>
            <Radio value="Recurring Session" disabled={recurringAvailable}>Recurring Session</Radio>
         </Radio.Group>
        </Form.Item>
        {showDropdown && (
          <>
        <Form.Item
          style={{ marginTop: "17px", marginBottom: "0px"}}
          label="Frequency"
          name="frequency"
        >
            <Select placeholder="Select an option" value={dayOfWeek}
                 onChange={(value) => {
                  setDayOfWeek(value); // Update dayOfWeek state
                  form.setFieldsValue({ frequency: value }); // Update the form field value
                }} defaultValue={dayOfWeek} >
                <Select.Option value="Weekly on Monday">Weekly on Monday</Select.Option>
                <Select.Option value="Weekly on Tuesday">Weekly on Tuesday</Select.Option>
                <Select.Option value="Weekly on Wednesday">Weekly on Wednesday</Select.Option>
                <Select.Option value="Weekly on Thursday">Weekly on Thursday</Select.Option>
                <Select.Option value="Weekly on Friday">Weekly on Friday</Select.Option>
                <Select.Option value="Weekly on Saturday">Weekly on Saturday</Select.Option>
            </Select>
        </Form.Item>
        {/* <Form.Item
            style={{ marginTop: "17px", marginBottom: "0px" }}
            label="Recurring Week"
            name="recurringWeeks"
        >
            <Select
                style={{ width: '100%' }}
                placeholder="Select Recurring Week"
            >
                {Array.from({ length: 200 }, (_, i) => (
                    <Select.Option key={i+1} value={i+1}>
                        {i+1} Week
                    </Select.Option>
                ))}
            </Select>
        </Form.Item> */}
        </>        
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

  useEffect(() => {
  }, [dayOfWeek,recurringAvailable]); 

  return (
    <>
      <Button className={"primary-button"} onClick={showModal}>
        {title}
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
            <Button className={"secondary-button previous-button"} onClick={() => prev()}>
              Previous Step
            </Button>
          ),
          <span className={"steps"}>Step {activeStep} of {totalSteps}</span>,
          activeStep < totalSteps && (
            <Button
              className={"secondary-button"}
              onClick={next}
            >
              Next Step
            </Button>
          ),
          loading == true ? (
            <Spin />
          ) : (
          activeStep === totalSteps && (
              <Button className={"primary-button"} htmlType="submit" onClick={handleSubmit}>
                Book Session
                {/* {loading == false ? ("false") : ("true")} */}
              </Button>
            )
          ),
          // activeStep === totalSteps && (
          //   <Button className={"primary-button"} htmlType="submit" onClick={handleSubmit}>
          //     Book Session
          //   </Button>
          // ),
        ]}
      >
        {/* <Form form={form} layout="vertical" 
          initialValues={{ sessionType: 'Recurring Session'}} >
          {activeStep == 1 && (
            <div style={{ width: "555px" }}>
              <Step1Form universityList={universityList} />
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
        </Form> */}
        <Form form={form} layout="vertical" 
          // initialValues={{ sessionType: 'Recurring Session'}} 
          >
          {activeStep == 1 && (
            <div style={{ width: "555px" }}>
              <Step2Form tutors={tutors} />
            </div>
          )}
          {activeStep == 2 && (
            <div style={{ width: "1155px" }}>
              <Step3From />
            </div>
          )}
          {activeStep == 3 && (
            <div style={{ width: "600px" }}>
              <Step4From form={form}/>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default BookSession;
// function useEffect(arg0: () => void, arg1: string[]) {
//   throw new Error("Function not implemented.");
// } 

