import { memo, useEffect, useState } from "react";
import { Button, Form, Modal, message, Select, Collapse, Avatar, Radio, Row, Col, Input, Spin, Tooltip, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";
import CommonService from "../../../api/services/Common";
import MockInterviewsService from "../../../api/services/MockInterviews";
import { formatDateV1, formatTime, getDay } from "../../../common/common";
import moment from "moment";
import "./index.less";
import { useNavigate } from "react-router-dom";
import Calender from "../../../components/mock-interview-details/calender";
import { useUser } from "../../../api/providers/UserProvider";
import type { SearchProps } from 'antd/es/input/Search';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Search } = Input;

const BookInterview = ({ addUpcomingSession, timezone }) => {

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(1);
  const [modalTitle, setModalTitle] = useState("");
  const [universityList, setUniversityList] = useState([]);
  const [tutors, setTutors] = useState([]);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const [mockInterview, setMockInterview] = useState([]);
  const [search, setSearch] = useState('');
  const user = useUser();

  const getUniversityList = async () => {
    try {
      const response = await CommonService.getAPI("/university-list");
      if (response.data.success) {
        setUniversityList(
          response.data.data.map((university) => ({
            key: university.id,
            label: university.title + " - " + (university.mockinterview ?? '0'),
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
      form.setFieldValue('mockInterview', '');
      const data = {
        lessionType: 'Mock interviews',
        university: form.getFieldValue("university"),
      };
      let response;
      if (user.role == 'student') {
        response = await CommonService.getUniversityTutorList(data)
      } else {
        data.search = search
        response = await CommonService.postAPI("/students-data", data);
      }
      if (response.data.success) {
        const tutorList = user.role == 'student' ? response.data.data.tutors : response.data.data.students;
        const interviewList = response.data.data.mockinterview.mockinterview ? response.data.data.mockinterview.mockinterview.split(',') : [];
        const mockInterviewList = interviewList.map((value, index) => ({
          id: index + 1,
          value,
        }));

        setMockInterview(mockInterviewList);
        setTutors(tutorList);

        if (!response.data.data.mockinterview.mockinterview || response.data.data.mockinterview.mockinterview == null) {
          message.error("Please select other univesity. This university don't have any interview.");
        }

      } else {
        message.error(response.data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    if (form.getFieldValue("university")) {
      getUniversityTutorList()
    }
  }, [search])


  const stepsTitles = ['Specify Your Priorites', `Choose ${user.role === 'tutor' ? 'Student' : 'Tutor'}`, 'Book Time for Interview', 'Check Last Details'];

  const next = async () => {
    try {
      const values = await form.validateFields();
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      setModalTitle(stepsTitles[nextStep - 1]);
    } catch (e) {
      if (activeStep == 3) {
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
    setLoading(true);
    const formData = form.getFieldsValue(true);
    try {
      formData.day = getDay(moment(formData.date));
      formData.role = user.role
      const response = await MockInterviewsService.bookInterview(formData);
      if (response.data.success && response.data.status_code == 200) {
        const result = response.data.data;
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
        setLoading(false);
        navigate(`/${user.role}/mock-interview`)
        message.success('You’ve successfully booked mock interview');
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
    setIsModalOpen(true);
    setActiveStep(1);
    getUniversityList();
    setModalTitle("Specify Your Priorites");
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const selectUniversity = Form.useWatch("university", form);

  const Step1Form = ({ universityList }) => {
    return (
      <>
        <Form.Item
          name="university"
          label="Which university are you sitting a mock interview for?"
          rules={[{ required: true, message: "Please select university" }]}
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
            rules={[{ required: true, message: "Please select mock interview" }]}
          >
            <Radio.Group>

              {mockInterview.map((interview) => (
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

  const checkCredit = (tutor) => {
    if (user.role == 'tutor') {
      if ((tutor?.credit == 0 || tutor?.credit == null)) {
        return 'disabled'
      }
    }
  }

  const TutorPanelHeader = memo(function TutorPanelHeader({ tutor }) {
    return (
      <>
        <Radio key={tutor.id} value={tutor.id} disabled={checkCredit(tutor)} >
          <div className={"avatar"}>
            <Avatar
              src={tutor.profile_picture}
              size={40}
              icon={<UserOutlined />}
            />
            <div className={"name-degree"}>
              <h4 className={"tutor-name"}>{tutor.full_name}</h4>
              {user.role == 'tutor' &&
                <>
                  <span>
                    Ph No: {tutor.phone_number + ', '}
                  </span>
                  {tutor.country &&
                    <span>
                      Country: {tutor.country + ', '}
                    </span>
                  }
                  <span>
                    Credit: {tutor.credit || 0}
                  </span>
                </>
              }
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
                {/* <span>{tutor.degree}</span> &#8226; <span>{tutor.school}</span> */}

                <span>
                  {tutor.university && tutor.university.map((item, index) => (
                    <span key={index}>{item.school}({item.degree}) {tutor.university.length - 1 != index && ','}</span>
                  ))}
                </span>
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
        {user.role === 'student' ?
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
                <div dangerouslySetInnerHTML={{ __html: tutor.biography }} />
              </Panel>
            ))}

          </Collapse>
          :
          <>
            {tutors.map((tutor) => (
              <Panel
                header={<TutorPanelHeader tutor={tutor} />}
                key={tutor.id}
                className="site-collapse-custom-panel tutor_collapse"
                title={checkCredit(tutor) == 'disabled' && 'Please select other student because student credit is 0'}
              >
                <div dangerouslySetInnerHTML={{ __html: tutor.biography }} />
              </Panel>
            ))}
          </>
        }
      </Radio.Group>
    );
  });

  // const handleSearchChange = (e) => {
  //   const value = e.target.value
  //   setSearch(value)
  // };

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {

    setSearch(value);
  }

  const Step2Form = memo(function Step2Form({ tutors }) {
    return (
      <>
        <div className={"choose-tutor"}>
          <div className="btn-group" >
            <h3 className={"title"}>Recommended for you</h3>
            {user.role === 'tutor' && (
              <div className="tutor_Search">
                <Search placeholder="input search text" onSearch={onSearch} allowClear />
              </div>)}
          </div>
          <Form.Item name="tutorId" label="" rules={[{ required: true, message: "Please select tutor" }]}>
            <TutorCollapse tutors={tutors} />
          </Form.Item>
        </div>
      </>
    );
  });

  const Step3From = () => {
    return <>
      <div className={"book-time-cal"}>
        <Calender tutorId={form.getFieldValue('tutorId')} form={form} timezone={timezone} next={next} prev={prev} />
        {(user.role == 'tutor' && (timezone != tutors.find(tutor => tutor.id == form.getFieldValue('tutorId'))?.timezone)) && <Alert style={{ top: 23 }} message="Note: Timings in Calendar are displaying based on Student Timezone." showIcon />}
      </div>
    </>;
  };

  const Step4From = ({ form }) => {
    const formData = form.getFieldsValue(true);
    const tutorName = user.role == 'tutor' ? tutors.find(tutor => tutor.id == formData.studentId)?.full_name : tutors.find(tutor => tutor.id == formData.tutorId)?.full_name
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
                {user.role == 'tutor' ? 'Student' : 'Tutor'}
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
          style={{ marginTop: "17px", marginBottom: "0px" }}
          label={user.role == 'student' ? "Notes for Tutor" : "Notes for Student"}
          name="note"
        >
          <TextArea rows={3} placeholder="Note down questions, content, topics etc. that you’d like to focus on so your tutor know ahead of time..." style={{ fontSize: 16 }} />
        </Form.Item>
      </>
    );
  };

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
            Book Interview
          </Button>
        </Tooltip> :
        <Button className={user.role == 'student' ? "primary-button" : "secondary-button disable-button"} onClick={showModal}>
          Book Interview
        </Button>
      }
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
          <span className={"steps"}>Step {activeStep} of 4</span>,
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
                Book Interview
              </Button>
            )
          ),
        ]}
      >
        <Form form={form} layout="vertical">
          {activeStep == 1 && (
            <div style={{ width: "555px" }}>
              <Step1Form
                universityList={universityList}
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
              <Step4From form={form} />
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default BookInterview;