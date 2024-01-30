import "./index.less";
import { Button, Modal, message } from "antd";
import { useState } from "react";
import CommonService from "../../api/services/Common";
import { useNavigate } from "react-router-dom";

const CancleSession = ({title,addUpcomingSession,moduleType,cancleUpcomingSession}) => {
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState("");
  const handleSubmit = async () => {
    try{

      let data = {
        sessionId : addUpcomingSession.id
      }
      let response 
      if (moduleType == 'mock') { 
        response = await CommonService.postAPI('/student/mock-cancel-session',data)
      } else {
        response = await CommonService.postAPI('/student/cancel-session',data)
      }
      if(response.data.success){
        cancleUpcomingSession(addUpcomingSession);
        if(moduleType == 'teaching') {
          navigate("/student/teaching-session") 
        }  else if (moduleType == 'mock') { 
          navigate("/student/mock-interview");
        } else {
          navigate("/student/ucat-session")
        }
        message.success('You’ve successfully cancel session');
      }else{
        throw new Error(response.data.message)
      }
    }catch(e){
      message.error(e.message);
    }
    handleCancel();
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
    setModalTitle(title);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} disabled={addUpcomingSession.is_freeze == 1}  className={"secondary-button"}>
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
            <>
            <Button className={"secondary-button"} onClick={handleCancel}>Cancel</Button>
            <Button className={"primary-button"} htmlType="submit" onClick={handleSubmit}>Cancel Sessions</Button>
            </>
        ]}
        >
        <div>
            <h2>Are you sure you want to cancel session? </h2>
        </div>
      </Modal>
    </>
  );
};

export default CancleSession;
