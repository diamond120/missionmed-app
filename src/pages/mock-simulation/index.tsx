import React, { useEffect, useRef, useState } from "react";
import { HomeOutlined, InfoCircleFilled, LockOutlined } from "@ant-design/icons";
import { Alert, Breadcrumb, Col, Row, message } from "antd";
import Section from "../../components/shared-ui/Section";
import { Button, Input, Tabs, Modal} from "antd";
import "./index.less";
import Performance from "./performance";
import { createSession, getSessions, getPackages } from "../../api/services/MockSimulation";
import { EXAM_APP_URL, APP_URL } from '../../config/app-config'
import { useUser } from "../../api/providers/UserProvider";
import { Session } from "./types";
import moment from "moment";
import {PlayCircleFilled } from '@ant-design/icons';



const Index = () => {
  const { TabPane } = Tabs;
  const [availableMocks, setAvailableMocks] = useState<Array<Session>>([])
  const [mocks, setMocks] = useState<Array<Session>>([])
  const [pastMocks, setPastMocks] = useState<Array<Session>>([])
  const [activeTab, setActiveTab] = useState<string>('Simulate')
  const [examCode, setExamCode] = useState<string | number>('')
  const [examCodeIndex, setExamCodeIndex] = useState<number>()
  const [selectedMockId, setSelectedMockId] = useState<number>()
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState('https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/VR/VR.mp4');
  const [videotitle, setVideoTitle] = useState('Verbal Reasoning');

  const user = useUser();
  const vidRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      const resAvailable = await getPackages()
      if (resAvailable?.data) {
        const available = await resAvailable.data;
        setAvailableMocks(available);
      }
      const res = await getSessions()
      if (res?.data) {
        // const past = await res?.data?.filter((i: Session) => i?.completed === 1)
        const past = await res.data
        setMocks(res.data)
        setPastMocks(past)
      }
    }
    init()
  }, [])

  async function launchExam(package_id: number) {
    if (examCode) {
      const params = {
        user_id: user?.id,
        package_id: package_id,
        redirect_url: `${APP_URL}/student/mock-simulation`,
        exam_code: examCode
      }
      const res = await createSession(params)
      if (res) {
        if (res?.data?.id) {
          setExamCode('')
          window.open(`${EXAM_APP_URL}?session_id=${res?.data?.id}`, "_blank", "noreferrer")
        }
        else
          message.error('Please enter correct exam code')
      }
    } else
      message.error('Please enter exam code')
  }

  const handlePlayVideo = async (title,url) => {
    await setOpen(true)
    await setVideoTitle(title)
    await setVideo(url);
    await vidRef.current.play();
  }

  useEffect(()=>{
    if(!open && vidRef.current)
      vidRef.current.pause()
  },[open])

  return (
    <React.Fragment>
      <Section className={"application-review-section"}>
        <Breadcrumb>
          <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Mock Simulation</Breadcrumb.Item>
        </Breadcrumb>

        <div className={"con-section-wrap mock-simulation"}>
          <div className="flex">
            <h2 className={"tab-title"}>Mock Simulation</h2>
          </div>
          <div className={"upc-agenda con-box"}>
            <h2 className={"secondary-title"}>UCAT Simulation Mocks </h2>
            <Tabs defaultActiveKey={'Simulate'} activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
              
              <TabPane tab={"Simulate"} key={"Simulate"}>
                <div className={"upcoming-sessions"}>
                  <Alert
                    message="Please read the following carefully."
                    description={
                      <code>
                        <div className="text">You should currently be sitting at a UCAT Mock Testing centre. These mocks are designed to be sat under proctoring and test conditions. Ensure that you have the following equipment before you begin.</div>
                        <ul>
                          <li>Whiteboard & Pen</li>
                          <li>Earplugs</li>
                          <li>Keyboard & Mouse</li>
                        </ul>
                        <div className="text">When you launch the simulation, you will be prompted for a code which you should have with you. If there are any issues, please notify the proctor immediately.</div>
                      </code>
                    }
                    type="info"
                    closable
                    showIcon
                    icon={<InfoCircleFilled />}
                  />

                  <div className="mocks-items available-mocks">
                    <div className="mocks-item">
                      <h4 className="title">Available Mocks</h4>
                      {availableMocks?.map((item, index) => (
                        <div className="item" key={index}>
                          <div>
                            <strong>{item?.name}</strong> <br />
                            <div>{item?.type}</div>
                          </div>
                          <div className="btn-group">
                            <Input className="input-type" placeholder="Exam Code" prefix={<LockOutlined />}
                              onChange={(e) => {
                                setExamCode(e.target.value)
                                setExamCodeIndex(index)
                              }}
                              value={index === examCodeIndex ? examCode : ''}
                            />
                            <Button className={"secondary-button"} onClick={() => launchExam(item?.id)} >Launch Exam</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {(pastMocks?.length > 0) &&
                  <div className="mocks-items past-mocks">
                    <div className="mocks-item">
                      <h4 className="title">Past Mocks</h4>
                      {pastMocks?.map((item, index) => (
                        <div className="item" key={index}>
                          <div>
                            <strong>{item?.package?.name}</strong> <br />
                            <div>{item?.package?.type}</div>
                            <div className="small-date-time">({moment(item?.started_at).format('dddd, MMMM Do YYYY hh:mm A') })</div>
                          </div>
                          <div className="btn-group">
                            <Button className={"secondary-button"} >Review</Button>
                            <Button className={"secondary-button"} onClick={async () => {
                              await setSelectedMockId(item.id)
                              await setActiveTab('Performance')
                            }}>View Performance</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  }
                </div>
              </TabPane>
              
              <TabPane tab={"Performance"} key={"Performance"}>
                <Performance mocks={mocks} selectedMockId={selectedMockId} setActiveTab={setActiveTab} />
              </TabPane>

              <TabPane tab={"Review"} key={"Review"} className="subTabs">

                  <Tabs defaultActiveKey={'verbalReasoning'}>
                    
                    <TabPane tab={"Verbal Reasoning"} key={"verbalReasoning"}>

                    <Row gutter={20}>
                      <Col md={24} xl={12}>
                          <Button type="primary" className="videoplay-btn" onClick={() => handlePlayVideo('Verbal Reasoning','https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/VR/VR.mp4')}>
                            <img src="https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/images/VR.png" className="w-full" alt="" />
                            <PlayCircleFilled />
                          </Button>
                      </Col>
                    </Row>

                      <Modal
                        title={videotitle}
                        centered
                        open={open}
                        onOk={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                        width={1000}
                        footer={null}
                      >
                        <video ref={vidRef} key={video} width="100%" controls autoPlay className="video-player">
                          <source src={video} type="video/mp4" />
                          Your browser does not support HTML video.
                        </video>

                      </Modal>
                              
                    </TabPane>

                    <TabPane tab={"Decision Making"} key={"decisionMaking"}>
                    <Row gutter={20}>
                      <Col md={24} xl={12}> 
                          <Button type="primary" className="videoplay-btn" onClick={() => handlePlayVideo('Decision Making','https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/DM/DM+2+FINAL.mov')}>
                            <img src="https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/images/DM.png" className="w-full" alt="" />
                            <PlayCircleFilled />
                          </Button>
                      </Col>
                      <Col md={24} xl={12}>
                          <Button type="primary" className="videoplay-btn" onClick={() => handlePlayVideo('Decision Making','https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/DM/New+DM+1.mp4')}>
                            <img src="https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/images/DM2.png" className="w-full" alt="" />
                            <PlayCircleFilled />
                          </Button>
                      </Col>
                    </Row>


                    </TabPane>
                    
                    <TabPane tab={"Quantitative Reasoning"} key={"quantitativeReasoning"}>
                      <Row gutter={20}>
                        <Col md={24} xl={12}> 
                          <Button type="primary" className="videoplay-btn" onClick={() => handlePlayVideo('Quantitative Reasoning','https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/QR/QR+Solutions+(USE+THIS)+(FINAL)(1).mp4')}>
                          <img src="https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/images/QR.png" className="w-full" alt="" />
                          <PlayCircleFilled />
                          </Button>
                        </Col>
                      </Row>
                    </TabPane>
                    
                    <TabPane tab={"Abstract Reasoning"} key={"abstractReasoning"}>
                      <Row gutter={20}>
                        <Col md={24} xl={12}> 
                          <Button type="primary" className="videoplay-btn" onClick={() => handlePlayVideo('Abstract Reasoning','https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/AR/AR-LAST+BIT+FINAL.mp4')}>
                          <img src="https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/images/AR.png" className="w-full" alt="" />
                          <PlayCircleFilled />
                            </Button>
                        </Col>
                        <Col md={24} xl={12}> 
                          <Button type="primary" className="videoplay-btn" onClick={() => handlePlayVideo('Abstract Reasoning','https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/AR/AR-Part-1.mp4')}>
                            <img src="https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/images/AR2.png" className="w-full" alt="" />
                            <PlayCircleFilled />
                            </Button>
                        </Col>
                      </Row>
                    </TabPane>
                    
                    <TabPane tab={"Situational Judgement"} key={"situationalJudgement"}>
                      <Row gutter={20}>
                        <Col md={24} xl={12}> 
                            <Button type="primary" className="videoplay-btn" onClick={() => handlePlayVideo('Situational Judgement','https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/SJT/SJT+Solutions.mp4')}>
                              <img src="https://missionmed-app.s3.ap-southeast-2.amazonaws.com/solutions/images/SJT.png" className="w-full" alt="" />
                              <PlayCircleFilled />
                            </Button>
                        </Col>
                      </Row>
                    </TabPane>

                  </Tabs> 
                  
              </TabPane>
              
            </Tabs>
          </div>
        </div>
      </Section>
    </React.Fragment>
  );
}
export default Index
