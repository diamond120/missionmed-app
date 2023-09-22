import { Button, Modal, Rate, Input, Form } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import "./index.less";
import { useEffect, useState } from "react";

const { TextArea } = Input;

const RateSession = ({ session, isOpen, handleRateCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(isOpen);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
    handleRateCancel();
  };
  console.log(session);

  const handleOk = () => {
    return "fgdfgdfg";
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
          <Button className={"secondary-button"}>Cancel</Button>
          <Button className={"secondary-button rate-button"}>
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
                <Form.Item>
                  <Rate />
                </Form.Item>
              </div>
            </div>
            <div className={"ratings"}>
              <h4 className={"rat-title"}>Knowledge & Expertise</h4>
              <div className={"ratings-wrap"}>
                <Form.Item>
                  <Rate />
                </Form.Item>
              </div>
            </div>
            <div className={"rating"}>
              <h4 className={"rat-title"}>Knowledge & Expertise</h4>
              <div className={"ratings-wrap"}>
                <Form.Item>
                  <Rate />
                </Form.Item>
              </div>
            </div>
            <div className={"ratings"}>
              <h4 className={"rat-title"}>Knowledge & Expertise</h4>
              <div className={"ratings-wrap"}>
                <Form.Item>
                  <Rate />
                </Form.Item>
              </div>
            </div>
          </div>
          <Form.Item
            label="Extra Comments"
            name="extraComment"
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
