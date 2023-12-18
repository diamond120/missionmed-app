import { Button, Form, Input, Modal, Tooltip } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useUser } from "../../../api/providers/UserProvider";
import { formatDateV1, checkSessionOnToday, formatTime } from "../../../common/common";
import "./index.less";
import { useMemo, useState } from "react";

const UpcomingSession = ({ upcomingInterview, sessionType, handleReschedule, handleEditLink }) => {
  const user = useUser();
  const isSessionOnToday = useMemo(
    () => checkSessionOnToday(upcomingInterview.date),
    [upcomingInterview.date]
  );
  const title = sessionType == "interview" ? "Interview" : "Session";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { TextArea } = Input;
  const [form] = Form.useForm();
  

  const handleClick = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
      const values = await form.validateFields();
      const data = {
        link : values.sessionLink,
        sessionId : values.sessionId
      }
      handleEditLink(data);
      setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const validateURL = (rule, value, callback) => {
    if (value && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)) {
      callback('Please enter a valid URL');
    } else {
      callback();
    }
  };

  form.setFieldsValue({sessionLink :  upcomingInterview.sessionLink});

  return (
    <>
      <div className={"upcoming-session con-box"}>
        <h2 className={"secondary-title"}>Upcoming {title}</h2>
        <div className={"con-box-wrap"}>
          <CalendarOutlined style={{ fontSize: "50px", color: "#A9A2F8" }} />

          <h2 className={"con-box-title"}>Next Session Will Be</h2>
          <ul>
            {user.role == "tutor" && (
              <li>
                <strong>Student:</strong> {upcomingInterview.student_name}
              </li>
            )}
            <li>
              <strong>Date: </strong> {formatDateV1(upcomingInterview.date)}
            </li>
            <li>
              <strong>Time: </strong> {`${formatTime(upcomingInterview['session_start_time'])} - ${formatTime(upcomingInterview['session_end_time'])}`}
            </li>
          </ul>
          
          <div className="btn-group" style={{ marginTop: "32px" }}>
            <a href={upcomingInterview['sessionLink']} target="_blank">
              <Button className={"primary-button"}>Join Session </Button>
            </a>
            
            {user.role == "student" ? (
              isSessionOnToday ? (
                <Tooltip
                  className={'button_tooltip'}
                  title={
                    "You can’t reschedule session less than 24 hours before it starts"
                  }
                  color={"#465078"}
                >
                  <Button
                    className={`secondary-button `}
                    onClick={() => false}
                    disabled={isSessionOnToday} 
                  >
                    {" "}
                    Reschedule{" "}
                    
                  </Button>
                </Tooltip>
              ) : (
                <Button className={"secondary-button"} onClick={() => handleReschedule(upcomingInterview.id)}> Reschedule </Button>
              )
            ) : null}
              {user.role == "tutor" && (
            // <div className="btn-group" style={{ marginTop: "10px" }}>
              <Button className={"secondary-button"} onClick={handleClick}>Edit Session Link</Button>
            // </div>
          )}
          </div>
        
        </div>
      </div>

      <Modal
        title="Edit Session Link"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        className={"mock-interview-modal"}
        width={"600px"}
        footer={[
          <div key="buttonGroup" className='button-group'>
            <Button key="discard" type="dashed" className={"secondary-button"} onClick={handleCancel}>
              Discard 
            </Button>
            <Button key="submit" className={"primary-button"} onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
              label="Edit Session Link" 
              name="sessionLink" 
              rules={[{required:true},
                { validator: validateURL }]}
              initialValue={upcomingInterview?.sessionLink}
              >
              <TextArea
                style={{ height: 50 }}
                placeholder=""
              />
          </Form.Item>
          <Form.Item 
              
              name="sessionId" 
              initialValue={upcomingInterview?.id}
              >
              <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpcomingSession;