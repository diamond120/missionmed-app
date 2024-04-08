import "./index.less";
import { Button, Modal, Spin, message } from "antd";
import { useState } from "react";
import CommonService from "../../api/services/Common";
import { useNavigate } from "react-router-dom";
import FreezeSession from "../freeze-session";

const CancleSession = ({title,addUpcomingSession,moduleType,cancleUpcomingSession}) => {
  // console.log(addUpcomingSession.session_type);
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try{
      setLoading(true);
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
    setLoading(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
    setModalTitle(addUpcomingSession.session_type == 'Recurring Session' ? 'Cancel All Recurring Sessions' : title);
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
          {loading == true ? (
            <Spin />
          ) : (
            <>  
            <Button className={"secondary-button"} onClick={handleCancel}>Back</Button>
            {addUpcomingSession.session_type == 'Recurring Session' &&
            <FreezeSession title='Freeze Session' moduleType="teaching" addFreezeSession={() => {handleOk() , cancleUpcomingSession(addUpcomingSession) }} showCancelModal={showModal} sessionType={addUpcomingSession.session_type} /> }
            <Button className={"primary-button"} style={{backgroundColor: 'red'}} htmlType="submit" onClick={handleSubmit}>Cancel Sessions</Button>
            </>
          )}
          </>
        ]}
        >
        <div>
          {addUpcomingSession.session_type == 'Recurring Session' ?
           <p>Are you sure you want to cancel your recurring sessions with your tutor? <br />If you meant to pause, click <b>Freeze Sessions</b> instead. </p>:
           <p>Are you sure you want to cancel session? </p>
          }   
        </div>
      </Modal>
    </>
  );
};

export default CancleSession;
