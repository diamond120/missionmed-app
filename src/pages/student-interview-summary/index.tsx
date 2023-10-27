import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import MockInterviewsService from "../../api/services/MockInterviews";
import UCATSessionService from "../../api/services/UCATSession";
import TeachingSessionService from "../../api/services/TeachingSession";
import { useStudent } from "../../api/providers/StudentProvider";
import SectionDetails from "../../components/mock-interview-summary/section-details";
import { NoSessionRate, SessionRateDetails } from "../../components/mock-interview-summary/session-rate";
import SessionDetails from "../../components/mock-interview-summary/session-details";
import Report from "../../components/mock-interview-summary/report";
import "./index.less";

const StudentInterviewSummary = () => {
  let { mockInterviewId } = useParams();
  const [interviewSummary, setInterviewSummary] = useState({});
  const student = useStudent();
  let { type } = useParams();

  const getInterviewSummary = async () => {
    try {
      let response;
      if(type == 'ucat') {
        response = await UCATSessionService.getSessionummary(
          mockInterviewId
        );
      } else if(type == 'teaching'){
        response = await TeachingSessionService.getSessionummary(
          mockInterviewId
        );
      } else {
        response = await MockInterviewsService.getInterviewSummary(
          mockInterviewId
        );
      }
      
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

  const backUrl = `/student/mock-interview`;

  const handleUpdateSummary = (rateDetails) => {
    setInterviewSummary({...interviewSummary, sessionrate:rateDetails})
  }
  return (
    <>
      <Section>
        <Breadcrumb>
          <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item key={backUrl}>
            <Link to={backUrl}>{type === "ucat" ? 'UCAT Teaching Sessions' : (type === "teaching" ? 'Interview Teaching Sessions' : 'Mock Interview')}
           </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{(type == "ucat"  || type == 'teaching') ? 'Session Summary' : 'Interview Summary'}</Breadcrumb.Item>
        </Breadcrumb>
        <div className={"con-section-wrap session-summary-section-wrap"}>
          <h2 className={"tab-title"}>{(type == "ucat"  || type == 'teaching')  ? 'Session Summary' : 'Interview Summary'}</h2>

          <div className={"grid-col-2"}>
            <div style={{ width: "504px" }}>
            <SectionDetails className={`summary-section`} title="Session Details">
              <SessionDetails interviewSummary={interviewSummary} pagesession={type}/>
            </SectionDetails>
              <SectionDetails className={`summary-section`} title="Agenda">
                {interviewSummary?.agenda ? interviewSummary?.agenda : 'No agenda found'}
              </SectionDetails>
              <SectionDetails
                className={`summary-section`}
                title="Post-Session Tasks"
              >
                {interviewSummary?.post_session_tasks ? interviewSummary?.post_session_tasks: 'No tasks found' }
              </SectionDetails>
              <SectionDetails className={`session-rate`} title="Session Rate">
                {!interviewSummary.sessionrate &&<NoSessionRate session={{id:interviewSummary?.id, tutorId:interviewSummary?.tutor_id}} pagesession={type} handleUpdateSummary={handleUpdateSummary}/>}
                {interviewSummary.sessionrate &&<SessionRateDetails rateDetails={interviewSummary.sessionrate} />}
              </SectionDetails>
            </div>
            <div style={{ width: "504px" }}>
              <Report report={interviewSummary?.report ?? null}  title={(type == "ucat" || type == 'teaching' ) ?"Tutor's Summary" : "Diagnostic Report"} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default StudentInterviewSummary;
