import { Button, Form, Modal,Input, Row, Col } from 'antd';
import './index.less'
import { QuestionCircleFilled } from "@ant-design/icons";
import { useState } from 'react';
const { TextArea } = Input;

const Agenda = ({agenda, handleEditAgenda}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDetails, setisModalDetails] = useState(false);
  const handleClick = () => {
    setIsModalOpen(true)
    handleEditAgenda()
  }
  const handleDeClick = () => {
    setisModalDetails(true)
    handleEditAgenda()
  }

  const handleSubmit = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handledeCancel = () => {
    setisModalDetails(false)
  };
  return (
    <>
      <div className={"upc-agenda con-box"}>
          <h2 className={"secondary-title"}>Agenda<QuestionCircleFilled  style={{marginLeft:"8px"}}/></h2>
          <div className={"con-box-wrap"}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'start', justifyContent:'space-between',height:'100%'}}>
                <ul className={'list-disc'}>
                      {/* <li>Ask about how tutor was able to mentally reach the answer for Q34 in Mock 2 of Medify.</li>
                      <li>Ask tutor to explain how to work through syllogisms.</li> */}
                      {agenda}
                </ul>
                
                <div style={{display:'flex',gap:20}}>
                  <Button className={"secondary-button"} onClick={handleClick}>Edit Agenda</Button>
                  <Button className={"primary-button"} onClick={handleDeClick}>Check Last Details</Button>
                </div>

              </div>
          </div>
      </div>
      <Modal
        title="Edit Agenda"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        className={"mock-interview-modal"}
        width={"600px"}
        footer={[
          <div className='button-group'>
            <Button key="discard" type="dashed" className={"secondary-button"} onClick={handleCancel}>
              Discard 
            </Button>
            <Button key="submit" className={"primary-button"} onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        ]}
      >
        <Form layout="vertical">
            <Form.Item label="Here you can put down your thoughts and questions to your tutor on the upcoming session" name="agenda" rules={[{required:true}]}>
            <TextArea
              style={{ height: 200 }}
              placeholder="can resize"
            />
        </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Check Last Details"
        open={isModalDetails}
        onCancel={handledeCancel}
        className={"session-last-details"}
        width={"600px"}
        footer={[
          <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
              <Button className={'secondary-button'}>Previous Step</Button>
              <span className={"steps"}>Step 4 of 4</span>
              <Button className={'secondary-button'}> Book Interview</Button>
          </div>
        ]}
      >
        <div className={'session-details'} style={{padding:'0 10px'}}>
          <h3 style={{fontSize:16,color:'#312D42',fontWeight:'600'}}>Session Details</h3>
            <div style={{marginBottom:21}}>
              <h4 style={{marginBottom:0,fontSize:14,fontWeight:600}}>University</h4>
              <div style={{fontSize:16}}>University of New South Wales</div>
            </div>

            <Row style={{marginBottom:17}}>
              <Col span={10} sm={8}>
                <h4 style={{marginBottom:0,fontSize:14,fontWeight:600}}>Interview Type</h4>
                <div style={{fontSize:16}}>Mock #3</div>
              </Col>
              <Col span={14} sm={16}>
                <h4 style={{marginBottom:0,fontSize:14,fontWeight:600}}>Tutor</h4>
                <div style={{fontSize:16}}>Mock #3</div>
              </Col>
            </Row>

            <Row>
              <Col span={10} sm={8}>
                <h4 style={{marginBottom:0,fontSize:14,fontWeight:600}}>Date</h4>
                <div style={{fontSize:16}}>Thu, 22 Jun 2023</div>
              </Col>
              <Col span={7} sm={5}>
                <h4 style={{marginBottom:0,fontSize:14,fontWeight:600}}>Start Time</h4>
                <div style={{fontSize:16}}>3:00 pm</div>
              </Col>
              <Col span={7} sm={11}>
                <h4 style={{marginBottom:0,fontSize:14,fontWeight:600}}>End Time</h4>
                <div style={{fontSize:16}}>4:30 pm</div>
              </Col>
            </Row>

        </div>


        <Form style={{marginTop:'17px'}}  layout="vertical">
            <Form.Item label="Leave a quick note" style={{marginBottom:0}}>
                  <TextArea rows={3} placeholder='Textarea' style={{fontSize:16}}/>
            </Form.Item>
        </Form>
      </Modal>

    </>
  )
}

export default Agenda
