import "./index.less";
import { Button, Modal, Spin, Tooltip, message } from "antd";
import { useContext, useState } from "react";
import CommonService from "../../api/services/Common";
import { useNavigate } from "react-router-dom";
import FreezeSession from "../freeze-session";
import { UserContext } from "../../api/providers/UserProvider";
const CancleSession = ({title,addUpcomingSession,moduleType,cancleUpcomingSession}) => {
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const userRole = user.role;
  const handleSubmit = async () => {
    try{
      setLoading(true);
      let data = {
        sessionId : addUpcomingSession.id,
        studentId : addUpcomingSession.student_id
      }
      let response 
      if (moduleType == 'mock') { 
        response = await CommonService.postAPI('/student/mock-cancel-session',data)
      } else {
        response = await CommonService.postAPI('/student/cancel-session',data)
      }
      if(response.data.success){
        cancleUpcomingSession(addUpcomingSession);
        const path = userRole === 'student' ? '/student' : '/tutor';
        if(moduleType == 'teaching') {
          navigate(`${path}/teaching-session`) 
        }  else if (moduleType == 'mock') { 
          navigate(`${path}/mock-interview`);
        } else {
          navigate(`${path}/ucat-session`)
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
      {userRole === 'student' ? (
        <Tooltip
          className={addUpcomingSession.isWithin24Hours ? 'button_tooltip' : ''}
          title={addUpcomingSession.isWithin24Hours ? 'You can’t cancel session less than 24 hours before it starts' : ''}
          color={'#465078'}
        >
          <Button onClick={showModal} disabled={addUpcomingSession.isWithin24Hours} className={'secondary-button'}>
            {title}
          </Button>
        </Tooltip>
      ) : (
        <Button onClick={showModal} className={'secondary-button'}>
          {title}
        </Button>
      )}
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className={"mock-interview-modal "}
        width={"max-content"}
        footer={[
          <div key='cancel-session'>
          {loading == true ? (
            <Spin />
          ) : (
            <>  
            <Button className={"secondary-button"} onClick={handleCancel}>Back</Button>
            {addUpcomingSession.session_type == 'Recurring Session' && userRole === 'student' && (
                <FreezeSession 
                    title='Freeze Sessions' 
                    moduleType="teaching" 
                    addFreezeSession={() => { handleOk(); cancleUpcomingSession(addUpcomingSession); }} 
                    showCancelModal={showModal} 
                    sessionType={addUpcomingSession.session_type} 
                />
            )}
            <Button className={"primary-button"} style={{backgroundColor: 'red'}} htmlType="submit" onClick={handleSubmit}>{addUpcomingSession.session_type == 'Recurring Session' ? 'Cancel Sessions' :  'Cancel Session'}</Button>
            </>
          )}
          </div>
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
