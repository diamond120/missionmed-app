
import "./index.less"
import React from "react"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import { Breadcrumb, Modal, Button, Input, Form } from "antd";
import { HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProgressCard from "../../components/shared-ui/ProgressCard";
import Section from "../../components/shared-ui/Section";


const StudentMockInterview = () => {
  const data = [];
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  }

  const Step1Form = () => (
    <>
        <Form.Item name="note" label="Note" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
    </>
  )
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
              <Form>
                <Step1Form />
              </Form>
            </Modal>
        </div>
      </Section>
    </React.Fragment>
  );
};

export default StudentMockInterview;