import { Button, Modal, Rate, Input, Form, message } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import "./index.less";
import { useEffect, useRef, useState } from "react";
import TutorService from "../../api/services/Tutor";

const { TextArea } = Input;

const RateSession = ({ session, isOpen, handleRateCancel, updatePastSession, handleUpdateSummary }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(isOpen);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    handleRateCancel();
    form.resetFields();
  };

  const giveSessionRate = async (data) => {
    try{
     const response = await TutorService.sessionRate(data)
     if(response.data.success){
      if(updatePastSession){
        updatePastSession(session.id, {hasSessionRate:true})
      }
      if(handleUpdateSummary){
        handleUpdateSummary(response.data.data)
      }
      message.success(response.data.message)
     }
    }catch(e){
     message.error(e.message)
    }
  }

  const handleOk = async () => {
    try{
     const values = await form.validateFields();
     const formData = {...values, 
          tutorId:session.tutorId,
          mockInterviewId:session.id
     }
     giveSessionRate(formData);
     handleRateCancel();
     form.resetFields();
    }catch(e){
     console.log(e.message);
     return false;
    }
    
  };
  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  return (
    <Modal
      title="Rate Session"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={"600px"}
      className={"rate-session-modal"}
      footer={[
        <div key="btnGrp" className={"button-group"}>
          <Button className={"secondary-button"} onClick={handleCancel}>Cancel</Button>
          <Button className={"secondary-button rate-button"} onClick={handleOk}>
            Rate Session
          </Button>
        </div>,
      ]}
    >
      <div style={{ textAlign: "center" }}>
        <SmileOutlined style={{ fontSize: 100, color: "#A9A2F8" }} />
        <h3 className={"title"}>How Was Your Session?</h3>
        <div className={"text"}>
          We pride ourselves on quality and take your feedback very seriously.
          Please rate your today’s interaction with a tutor according to the
          following properties:
        </div>
        <Form form={form} layout="vertical">
          <div className={"ratings-group"}>
            <div className={"ratings"}>
              <h4 className={"rat-title"}>Knowledge & Expertise</h4>
              <div className={"ratings-wrap"}>
                <Form.Item name="knowledgeExpertise" rules={[{required:true, "message":"Add rate of Knowledge & Expertise"}]}>
                  <Rate />
                </Form.Item>
              </div>
            </div>
            <div className={"ratings"}>
              <h4 className={"rat-title"}>Engagement & Enthusiasm</h4>
              <div className={"ratings-wrap"}>
                <Form.Item name="engagementEnthusiasm" rules={[{required:true, "message":"Add rate of Engagement & Enthusiasm"}]}>
                  <Rate />
                </Form.Item>
              </div>
            </div>
            <div className={"rating"}>
              <h4 className={"rat-title"}>Clarity & Understandability</h4>
              <div className={"ratings-wrap"}>
                <Form.Item name="clarityUnderstandability" rules={[{required:true, "message":"Add rate of Clarity & Understandability"}]}>
                  <Rate />
                </Form.Item>
              </div>
            </div>
            <div className={"ratings"}>
              <h4 className={"rat-title"}>Punctuality & Preparedness</h4>
              <div className={"ratings-wrap"}>
                <Form.Item name="punctualityPreparedness" rules={[{required:true, "message":"Add rate of Punctuality & Preparedness"}]}>
                  <Rate />
                </Form.Item>
              </div>
            </div>
          </div>
          <Form.Item
            label="Extra Comments"
            name="comments"
            style={{ marginTop: "32px" }}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
export default RateSession;
