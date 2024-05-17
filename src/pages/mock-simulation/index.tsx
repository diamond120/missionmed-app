import React from "react";
import { HomeOutlined, InfoCircleFilled, LockOutlined} from "@ant-design/icons";
import { Alert, Breadcrumb } from "antd";
import Section from "../../components/shared-ui/Section";
import { Button, Input,Tabs } from "antd";
import "./index.less";
import Performance from "./performance";

export default function index() {
  const { TabPane } = Tabs;

 
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
            <Tabs defaultActiveKey={"Upcoming"}>
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
                      <div className="item">
                         <div>
                              <strong>UCAT Mock I</strong> <br />
                              <div>Good Luck!</div>
                         </div>
                         <div className="btn-group">
                              <Input className="input-type" placeholder="Exam Code" prefix={<LockOutlined />} />
                              <Button className={"secondary-button"} >Launch Exam</Button>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="mocks-items past-mocks">
                    <div className="mocks-item">
                      <h4 className="title">Past Mocks</h4>
                      <div className="item">
                         <div>
                              <strong>UCAT Mock I</strong> <br />
                              <div>Good Luck!</div>
                         </div>
                         <div className="btn-group">
                              <Button className={"secondary-button"} >Review</Button>
                              <Button className={"secondary-button"} >View Performance</Button>
                         </div>
                      </div>
                      <div className="item">
                         <div>
                              <strong>UCAT Mock I</strong> <br />
                              <div>Good Luck!</div>
                         </div>
                         <div className="btn-group">
                              <Button className={"secondary-button"} >Review</Button>
                              <Button className={"secondary-button"} >View Performance</Button>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>

              <TabPane tab={"Performance"} key={"Performance"}>
                <Performance/>
              </TabPane>
              <TabPane tab={"Review"} key={"Review"}>
                <div className={"upcoming-sessions"}>Tab 3</div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Section>
    </React.Fragment>
  );
}
