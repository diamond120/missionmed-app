import React, { useEffect, useState } from "react";
import { HomeOutlined, InfoCircleFilled, LockOutlined } from "@ant-design/icons";
import { Alert, Breadcrumb, message } from "antd";
import Section from "../../components/shared-ui/Section";
import { Button, Input, Tabs } from "antd";
import "./index.less";
import Performance from "./performance";
import { createSession, getSessions, getPackages } from "../../api/services/MockSimulation";
import { EXAM_APP_URL, APP_URL } from '../../config/app-config'
import { useUser } from "../../api/providers/UserProvider";
import { Session } from "./types";
import moment from "moment";

const Index = () => {
  const { TabPane } = Tabs;
  const [availableMocks, setAvailableMocks] = useState<Array<Session>>([])
  const [mocks, setMocks] = useState<Array<Session>>([])
  const [pastMocks, setPastMocks] = useState<Array<Session>>([])
  const [activeTab, setActiveTab] = useState<string>('Simulate')
  const [examCode, setExamCode] = useState<string | number>('')
  const [examCodeIndex, setExamCodeIndex] = useState<number>()
  const [selectedMockId, setSelectedMockId] = useState<number>()

  const user = useUser();

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

  console.log("availableMocks", availableMocks);


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
          <div className={"upc-agenda con-box"} style={{ marginTop: "55px" }}>
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
                            <Button className={"secondary-button"} onClick={() => {
                              setActiveTab('Performance')
                              setSelectedMockId(item.id)
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
              <TabPane tab={"Review"} key={"Review"}>
                <div
                  className={"personality-tutor-wrap"}
                  style={{ position: "relative", width: "max-content" }}
                >
                  <img alt={"example"} src="/src/assets/images/mock-simulation-review.png" width={600}  />
                  <div className={"coming-soon"} style={{}}>
                    <span className="freeze-span">Coming Soon</span>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Section>
    </React.Fragment>
  );
}
export default Index
