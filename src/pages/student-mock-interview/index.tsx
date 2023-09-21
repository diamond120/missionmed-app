import "./index.less";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Modal,
  Button,
  Input,
  Form,
  message,
  Select,
  Radio,
  Collapse,
  Avatar,
} from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProgressCard from "../../components/shared-ui/ProgressCard";
import Section from "../../components/shared-ui/Section";
import CommonService from "../../api/services/Common";

const { Panel } = Collapse;

const StudentMockInterview = () => {
  const data = [];
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(1);
  const [modalTitle, setModalTitle] = useState("");
  const [sessionDetails, setSessionDetails] = useState({});
  const [universityList, setUniversityList] = useState([]);
  const [tutors, setTutors] = useState([]);

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

  const next = async () => {
    console.log(form.getFieldsValue());
    await form.validateFields();
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    if(nextStep == "2"){
      getUniversityTutorList();
    }
    setModalTitle("Choose Tutor");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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

  const handleChange = (value: string) => {
    console.log(`Selected: ${value}`);
  };
  const selectUniversity = Form.useWatch("university", form);

  const Step1Form = ({universityList, getMockInterviewList}) => {
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
            onChange={handleChange}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
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
          <Avatar
            src={tutor.profile_picture}
            size={32}
            icon={<UserOutlined />}
          />
          {tutor.full_name}
          <div>
            <span>{tutor.degree}</span> <span>{tutor.school}</span>
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

  const Step2Form = memo(function Step2Form({tutors}) {

    return (
      <>
        <div>Recommended for you</div>
        <Form.Item name="tutor" label="" rules={[{ required: true }]}>
          <TutorCollapse tutors={tutors} />
        </Form.Item>
      </>
    );
  });

  const Step3From = () => {
    return <>Calender</>;
  };

  return (
    <React.Fragment>
      <Section className={"application-review-section"}>
        <Breadcrumb>
          <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Mock Interview</Breadcrumb.Item>
        </Breadcrumb>

        <div>
          <h2>Mock Interview</h2>
          <Button type="primary" onClick={showModal}>
            Book Interview
          </Button>

          <Modal
            title={modalTitle}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <span>Step {activeStep} of 4</span>,
              <Button key="submit" type="primary" onClick={next}>
                Next Step
              </Button>,
            ]}
          >
            <Form form={form} layout="vertical">
              {activeStep == 1 && <Step1Form universityList={universityList} getMockInterviewList={getMockInterviewList}/>}
              {activeStep == 2 && <Step2Form tutors={tutors}/>}
              {activeStep == 3 && <Step3From />}
            </Form>
          </Modal>
        </div>
      </Section>
    </React.Fragment>
  );
};

export default StudentMockInterview;
