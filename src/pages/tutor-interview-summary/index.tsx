import "./index.less";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import Sessiondetails from "./session-details";
import Summarypreview from "./summary-preview";
import Sessionagenda from "./session-agenda";
import Sessionsummary from "./session-summary";
import Postsessiontasks from "./post-session-tasks";
import Sessionrate from "./session-rate";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MockInterviewsService from "../../api/services/MockInterviews"
import MockInterviewSummary from "../../components/mock-interview-summary";

const TutorInterviewSummary = () => {
     let { mockInterviewId } = useParams();
     const [interviewSummary, setInterviewSummary] = useState({});


  const getInterviewSummary = async () => {
     try {
       const response = await MockInterviewsService.getInterviewSummary(
         mockInterviewId
       );
       if (response.data.success) {
         setInterviewSummary(response.data.data);
       } else {
         throw new Error(response.data.message);
       }
     } catch (e) {
       message.error(e.message);
     }
   };
 
   useEffect(() => {
     if (mockInterviewId != "undefined") {
       getInterviewSummary();
     }
   }, [mockInterviewId]);
 
   const backUrl = `/tutor/mock-interview`;
  return (
    <>
      <Section>
        <Breadcrumb>
          <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item key={backUrl}>
          <Link to={backUrl}>Mock Interview</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Interview Summary</Breadcrumb.Item>
        </Breadcrumb>

        <div className={"con-section-wrap session-summary-section-wrap"}>
          <h2 className={"tab-title"}>Interview Summary</h2>
          {/* <MockInterviewSummary /> */}
          <div className={"grid-col-2"}>
            <div style={{ width: "504px" }}>
              <Sessiondetails />
              <div style={{ margin: "40px 0" }}>
                <Sessionagenda />
              </div>
              <Sessionsummary />
              <div style={{ margin: "40px 0" }}>
                <Postsessiontasks />
              </div>
              <Sessionrate />
            </div>
            <div style={{ width: "504px" }}>
              <Summarypreview />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default TutorInterviewSummary;
