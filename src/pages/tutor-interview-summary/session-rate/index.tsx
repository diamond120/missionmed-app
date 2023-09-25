import {SmileOutlined} from '@ant-design/icons';
import { Button, Col, Rate, Row } from 'antd';
import './index.less'

const Sessionrate = () => {
  return (
    <>
         <div className={"session-rate con-box"}>
               <h2 className={"secondary-title"}>Session Rate </h2>

               
               <div className={"con-box-wrap"}>
                    <div style={{textAlign:'center'}}>
                         <SmileOutlined style={{fontSize:47,color:'#A9A2F8'}}/>
                         <h3 className={"title"}>How Was Your Session?</h3>
                         <div className="text">You can do it any other time by pressing “Rate Session” button below</div>
                         <Button className={'primary-button'}>Rate Session</Button>
                    </div>
                    
                    <div className={'rat-comments'}>
                         <Row className={"ratings-group"} gutter={[5,24]}>
                              <Col xs={24} xl={12} className='ratings'>
                                   <h4 className={"rat-title"}>Knowledge & Expertise</h4>
                                   <Rate disabled defaultValue={4.5} allowHalf/>
                              </Col>
                              <Col xs={24} xl={12} className='ratings'>
                                   <h4 className={"rat-title"}>Engagement & Enthusiasm</h4>
                                   <Rate disabled defaultValue={5} allowHalf/>
                              </Col>
                              <Col xs={24} xl={12} className='ratings'>
                                   <h4 className={"rat-title"}>Clarity & Understandability</h4>
                                   <Rate disabled defaultValue={5} allowHalf/>
                              </Col>
                              <Col xs={24} xl={12} className='ratings'>
                                   <h4 className={"rat-title"}>Punctuality & Preparedness</h4>
                                   <Rate disabled defaultValue={4} allowHalf/>
                              </Col>
                         </Row>
                              
                         <div className={'ex-comments'}>
                              <h4 style={{color:'#465078',fontWeight:'600',marginTop:24}}>Extra Comments</h4>
                              <div style={{color:'#312D42'}}>Wonderful tutor! Explains clearly. Lots of fun activities during the session. </div>
                         </div>
                    </div>
               </div>
          </div>
    </>
  )
}

export default Sessionrate
