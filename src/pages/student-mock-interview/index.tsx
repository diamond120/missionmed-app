
import "./index.less"
import React from "react"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import { Breadcrumb, Modal, Button, Input, Form, message, Select, Radio } from "antd";
import { HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProgressCard from "../../components/shared-ui/ProgressCard";
import Section from "../../components/shared-ui/Section";
import CommonService from "../../api/services/Common";

const StudentMockInterview = () => {
  const data = [];
  const navigate = useNavigate();
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [universityList, setUniversityList] = useState([]);
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  }

  const getUniversityList = async () => {
    try{
      const response = await CommonService.getUniversityList();
      if(response.data.success){
        setUniversityList(response.data.data.map((university) =>({key:university.id, label:university.title, value:university.title})))
      }else{
        throw new Error(response.data.message)
      }
    }catch(e){
      message.error(e.message);
    }
  }

  useEffect(() => {
    getUniversityList();
  },[]);

  const mockInterviewList = [
    {"id" : 1, "value" : "Mock Interview#1"},
    {"id" : 2, "value" : "Mock Interview#2"},
    {"id" : 3, "value" : "Mock Interview#3"},
  ];

  const getMockInterviewList = () => {
    return mockInterviewList
  }

   const handleChange = (value:string) => {
    console.log(`Selected: ${value}`);
  }
  const selectUniversity = Form.useWatch('university', form);

  const Step1Form = () => {
    return (<>
          <Form.Item name="university" label="Which university are you sitting a mock interview for?" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="--- Select University ---"
              optionFilterProp="children"
              onChange={handleChange}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={universityList}
            />
          </Form.Item>
          {selectUniversity && <Form.Item name="mockInterview" label="Which mock interview are you sitting?" rules={[{ required: true }]}>
          <Radio.Group>
              {getMockInterviewList(selectUniversity).map((interview) => <Radio key={interview.id} value={interview.value}>{interview.value}</Radio>)}
          </Radio.Group>
        </Form.Item>}
      </>)

  }

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
              title="Specify Your Priorites"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={[
                <span>Step 1 of 4</span>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  Next Step
                </Button>,
              ]}
            >
              <Form form={form} layout="vertical">
                <Step1Form />
              </Form>
            </Modal>
        </div>
      </Section>
    </React.Fragment>
  );
};

export default StudentMockInterview;