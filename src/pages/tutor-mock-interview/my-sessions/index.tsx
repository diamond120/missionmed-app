import { useNavigate } from "react-router-dom";
import "./index.less"
import { Form,Modal,Button, Tabs, Rate,Input, Row, Col} from "antd"
import { useEffect, useState } from "react";

const { TextArea } = Input;
import {SmileOutlined} from '@ant-design/icons';
const Mysessions = () => {
     const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
     const [modalTitle, setModalTitle] = useState("");

     const showModal = () => {
          setIsModalOpen(true);
          
          setModalTitle("Rate Session");
     };
     const handleCancel = () => {
          setIsModalOpen(false);
     };
     const handleOk = () => {
          setIsModalOpen(false);
     };

     const { TabPane } = Tabs;
     const navigation = useNavigate();
     return (
     <>
     <div className={"upc-agenda con-box"} style={{marginTop:'55px'}}>
          <h2 className={"secondary-title"}>My Sessions </h2>
          <Tabs defaultActiveKey={"profile"}>
          
               <TabPane tab={"Upcoming"} key={"Upcoming"}>
                    <div className={"upcoming-sessions"}>
                         
                         <div className="sessions">
                              <h4 className="sessions-date">Fri, 16 Jun 2023</h4>
                              <ul className="sessions-list"> 
                                   <li className="item">
                                        <div style={{display:"flex"}}>
                                             <div className="time">
                                                  <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                                  <div className={"end-time"}>3:00 pm</div>
                                             </div>

                                             <div>
                                                  <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                                  <div className={"mock_interview"}>Cameron Williamson</div>
                                             </div>
                                        </div>
                                        <div className={"button-group"} style={{display:'flex',columnGap:'16px'}}>
                                             <Button className={"secondary-button"} onClick={showModal}>Rate Session</Button>
                                             <Button className={"secondary-button"}>Reschedule</Button>

                                        </div>
                                   </li>
                                   
                                   <li className="item">
                                        <div style={{display:"flex"}}> 
                                             <div className="time">
                                                  <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                                  <div className={"end-time"}>3:00 pm</div>
                                             </div>

                                             <div>
                                                  <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                                  <div className={"mock_interview"}>Cameron Williamson</div>
                                             </div>
                                        </div>
                                        <Button className={"secondary-button"}>Reschedule</Button>
                                   </li>
                              </ul>
                         </div>

                         <div className="sessions">
                              <h4 className="sessions-date">Fri, 16 Jun 2023</h4>
                              <ul className="sessions-list"> 
                                   <li className="item">
                                        <div style={{display:"flex"}}>
                                             <div className="time">
                                                  <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                                  <div className={"end-time"}>3:00 pm</div>
                                             </div>
                                             <div>
                                                  <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                                  <div className={"mock_interview"}>Cameron Williamson</div>
                                             </div>
                                        </div>
                                        <Button className={"secondary-button"}>Reschedule</Button>
                                   </li>
                                   
                              </ul>
                         </div>
                    </div>
               </TabPane>

               <TabPane tab={"Past"} key={"Past"}>
                    <div className={"upcoming-past"}>
                         <div className="sessions">
                              <h4 className="sessions-date">Thus, 16 Jun 2023</h4>
                              <ul className="sessions-list"> 
                                 
                                   <li className="item">
                                        <div style={{display:"flex"}}>
                                             <div className="time">
                                                  <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                                  <div className={"end-time"}>3:00 pm</div>
                                             </div>

                                             <div>
                                                  <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                                  <div className={"mock_interview"}>Cameron Williamson</div>
                                             </div>
                                        </div>
                                        <Button className={"secondary-button"} onClick={() => navigation('/tutor/session-summary')}>Session Summary</Button>
                                   </li>
                              </ul>
                         </div>
                         <div className="sessions">
                              <h4 className="sessions-date">Thus, 16 Jun 2023</h4>
                              <ul className="sessions-list"> 
                                   <li className="item">
                                        <div style={{display:"flex"}}>
                                             <div className="time">
                                                  <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                                  <div className={"end-time"}>3:00 pm</div>
                                             </div>

                                             <div>
                                                  <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                                  <div className={"mock_interview"}>Cameron Williamson</div>
                                             </div>
                                        </div>
                                        <Button className={"secondary-button"} onClick={() => navigation('/tutor/session-summary')}>Session Summary</Button>
                                   </li>
                                   <li className="item">
                                        <div style={{display:"flex"}}>
                                             <div className="time">
                                                  <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                                  <div className={"end-time"}>3:00 pm</div>
                                             </div>

                                             <div>
                                                  <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                                  <div className={"mock_interview"}>Cameron Williamson</div>
                                             </div>
                                        </div>
                                        <Button className={"secondary-button"} onClick={() => navigation('/tutor/session-summary')}>Session Summary</Button>
                                   </li>
                              </ul>
                         </div>
                    </div>
               </TabPane>
          </Tabs>
     </div>
     
     <Modal
          title={modalTitle}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={'600px'}
          className={"rate-session-modal"}
          footer={[
          <div className={"button-group"}>
               <Button className={"secondary-button"}>Cancel</Button>
               <Button className={"secondary-button rate-button"}>Rate Session</Button>
          </div>
          ]}
     >
          <div style={{textAlign:'center'}}>
               <SmileOutlined style={{fontSize:100,color:'#A9A2F8'}}/>
               <h3 className={"title"}>How Was Your Session?</h3>
               <div className={"text"}>We pride ourselves on quality and take your feedback very seriously. Please rate your today’s interaction with a tutor according to the following properties:</div>
               
               <Row className={"ratings-group"} gutter={[5,24]}>
                    <Col xs={24} xl={12} className='ratings'>
                         <h4 className={"rat-title"}>Knowledge & Expertise</h4>
                         <Rate allowHalf/>
                    </Col>
                    <Col sm={24} xl={12} className='ratings'>
                         <h4 className={"rat-title"}>Engagement & Enthusiasm</h4>
                         <Rate allowHalf/>
                    </Col>
                    <Col xs={24} xl={12} className='ratings'>
                         <h4 className={"rat-title"}>Clarity & Understandability</h4>
                         <Rate allowHalf/>
                    </Col>
                    <Col xs={24} xl={12} className='ratings'>
                         <h4 className={"rat-title"}>Punctuality & Preparedness</h4>
                         <Rate allowHalf />
                    </Col>
               </Row>

               <Form style={{marginTop:'32px'}}  layout="vertical">
                    <Form.Item label="Extra Comments" style={{marginBottom:0}}>
                         <TextArea rows={3} />
                    </Form.Item>

               </Form>
          </div>
     </Modal>
     
     </>
     )
}

export default Mysessions
