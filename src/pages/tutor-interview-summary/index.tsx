import "./index.less";
import { Breadcrumb, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import Sessionsummary from "./session-summary";
import PostSessionTasks from "./post-session-tasks";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MockInterviewsService from "../../api/services/MockInterviews"
import SectionDetails from "../../components/mock-interview-summary/section-details";
import SessionDetails from "../../components/mock-interview-summary/session-details";
import Report from "../../components/mock-interview-summary/report";

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
 
   const addPostSessionTasks = async (task) => {
    try{
      const response = await MockInterviewsService.updateMockInterviewData({
        "mockInterviewId":interviewSummary.id,
        "postSessionTasks":task,
      });
      if(response.data.success){
        setInterviewSummary({...interviewSummary, post_session_tasks: task});
      }else{
        throw new Error(response.data.message)
      }
    }catch(e){
      message.error(e.message);
    }
  }
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
          <div className={"grid-col-2"}>
            <div style={{ width: "504px" }}>
            <SectionDetails className={`summary-section`} title="Session Details">
              <SessionDetails interviewSummary={interviewSummary}/>
            </SectionDetails>
            <SectionDetails className={`summary-section`} title="Agenda">
                {interviewSummary?.agenda}
              </SectionDetails>
              <Sessionsummary />
              <div style={{ margin: "40px 0" }}>
                <PostSessionTasks tasks={interviewSummary?.post_session_tasks} addPostSessionTasks={addPostSessionTasks}/>
              </div>
            </div>
            <div style={{ width: "504px" }}>
              <Report report={interviewSummary?.report ?? null} title={"Session Preview"}/>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default TutorInterviewSummary;
