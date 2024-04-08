// import "./index.less";
import React from "react";
import { Breadcrumb, Button } from "antd";
import { HomeOutlined, CalendarOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";

const MockPremiumLink = () => {

  return (
    <React.Fragment>
      <Section className={"application-review-section"}>
        <Breadcrumb>
          <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Mock Interview</Breadcrumb.Item>
        </Breadcrumb>
        <div className={"con-section-wrap tutor-mock-section-wrap"}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 className={"tab-title"}>Mock Interview</h2>

            <div className="d_flex_center">
            <a href="https://missionmed.com.au/interview-mastery-course-landing/#PricingPanel" target="_blank"><Button className={"primary-button"} >Buy Mock Interview</Button></a>
            </div>

          </div>
          
            <div className="mock-interview">
              <div className={"con-section-wrap"}>
                <div className={"con-box"}>
                  <div
                    className={"con-box-wrap"}
                    style={{ textAlign: "center" }}
                  >
                    <CalendarOutlined
                      style={{
                        fontSize: "50px",
                        color: "#A9A2F8",
                        marginBottom: "17px",
                      }}
                    />
                      <div style={{ marginBottom: "16px" }}>
                        Please add credit after that you can book interview.
                      </div>
                    
                  </div>
                </div>
              </div>
            </div>
        </div>
        </Section>
    </React.Fragment>
  );
};

export default MockPremiumLink;
