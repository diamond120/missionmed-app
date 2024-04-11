// import "./index.less";
import React from "react";
import { Breadcrumb, Button } from "antd";
import { HomeOutlined, CalendarOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";

const TeachingPremiumLink = () => {

  return (
    <React.Fragment>
      <Section className={"application-review-section"}>
        <Breadcrumb>
          <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Interview Teaching Session</Breadcrumb.Item>
        </Breadcrumb>
        <div className={"con-section-wrap tutor-mock-section-wrap"}>
          <div className="flex">
            <h2 className={"tab-title"}>Interview Teaching Sessions</h2>
            
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
                    <h2 className={"con-box-title"}>
                      
                          Purchase Hours to Book Tutors!
                    </h2>
                    <div style={{ marginBottom: "16px" }}>
                      
                        <>
                          You are only a click away from the best Interview Teaching tutors in< br />
                          Australia! Purchase teaching hour to book
                        </>
                     
                    </div>
                    
                    <Button className={"primary-button"} href="https://missionmed.com.au/checkout_step/interview-private-checkout/" target="_blank" title="Purchase Hours"> Purchase Hours</Button>
                    
                  </div>
                </div>
              </div>
            </div>
        </div>
      </Section>
      </React.Fragment>
  );
};

export default TeachingPremiumLink;
