import "./index.less";
import { Button, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import UCATSessionService from "../../api/services/UCATSession";
import TeachingSessionService from "../../api/services/TeachingSession";
import { useNavigate } from "react-router-dom";

const CancleSession = ({title,addUpcomingSession,moduleType,cancleUpcomingSession}) => {
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState("");
  const handleSubmit = async () => {
    try{
      let response;
     
      let data = {
        sessionId : addUpcomingSession.id
      }
      if(moduleType == 'teaching') {
        response = await TeachingSessionService.cancleSession(data);
      } else {
        response = await UCATSessionService.cancleSession(data);
      }
      if(response.data.success){
        cancleUpcomingSession(addUpcomingSession);
        if(moduleType == 'teaching') {

          navigate("/student/teaching-session") 
        }
        else {
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
