import "./index.less";
import { Breadcrumb, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import SessionSummary from "./session-summary";
import PostSessionTasks from "./post-session-tasks";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionDetails from "../../components/mock-interview-summary/section-details";
import SessionDetails from "../../components/mock-interview-summary/session-details";
import Report from "../../components/mock-interview-summary/report";
import CommonService from "../../api/services/Common";

const TutorInterviewSummary = () => {
  let { mockInterviewId } = useParams();
  let { type } = useParams();
  const [interviewSummary, setInterviewSummary] = useState({});
  // const pagesession = new URLSearchParams(window.location.search).get('type');
  const getInterviewSummary = async () => {
    try {
      const data = {
        sessionId: mockInterviewId,
        bookingFor: type === 'teaching' ? 'Interview 1-to-1 Tutoring' : type === 'ucat' ? 'UCAT 1-to-1 Tutoring' : 'Mock interviews'
      };
      const response = await CommonService.postAPI('/session-summary', data);

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
    try {

      const data = {
        "sessionId": interviewSummary?.id,
        "postSessionTasks": task,
        'bookingFor': type === 'teaching' ? 'Interview 1-to-1 Tutoring' : type === 'ucat' ? 'UCAT 1-to-1 Tutoring' : 'Mock interviews'
      }

      const response = await CommonService.postAPI('/session-data', data)

      if (response.data.success) {
        setInterviewSummary({ ...interviewSummary, post_session_tasks: task });
      } else {
        throw new Error(response.data.message)
      }
    } catch (e) {
      message.error(e.message);
    }
  }

  const uploadReport = async (fileUrl) => {
    try {
      const data = {
        "sessionId": interviewSummary?.id,
        "report": fileUrl,
        'bookingFor': type === 'teaching' ? 'Interview 1-to-1 Tutoring' : type === 'ucat' ? 'UCAT 1-to-1 Tutoring' : 'Mock interviews'
      }

      const response = await CommonService.postAPI('/session-data', data)

      if (response.data.success) {
        setInterviewSummary({ ...interviewSummary, report: fileUrl });
      } else {
        throw new Error(response.data.message)
      }
    } catch (e) {
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
          <Breadcrumb.Item key={backUrl} href={backUrl}>
            {/* <Link href={backUrl} title={type == "ucat" ? 'UCAT Sessions' : 'Mock Interview'}> </Link> */}
            {type == "ucat" ? 'UCAT Sessions' : 'Mock Interview'}
          </Breadcrumb.Item>
          <Breadcrumb.Item> {type == "ucat" ? 'Session Summary' : 'Interview Summary'} </Breadcrumb.Item>
        </Breadcrumb>

        <div className={"con-section-wrap session-summary-section-wrap"}>
          <h2 className={"tab-title"}>{type == "ucat" ? 'Session Summary' : 'Interview Summary'}</h2>
          <div className={"grid-col-2"}>
            <div style={{ width: "504px" }}>
              <SectionDetails className={`summary-section`} title="Session Details">
                <SessionDetails interviewSummary={interviewSummary} />
              </SectionDetails>
              <SectionDetails className={`summary-section`} title="Agenda">
                {interviewSummary?.agenda ? interviewSummary?.agenda : "No agenda found"}
              </SectionDetails>
              <SessionSummary uploadReport={uploadReport} reportUrl={interviewSummary.report ?? null} />
              <div style={{ margin: "40px 0" }}>
                <PostSessionTasks tasks={interviewSummary?.post_session_tasks} addPostSessionTasks={addPostSessionTasks} />
              </div>
            </div>
            <div style={{ width: "504px" }}>
              <Report report={interviewSummary?.report ?? null} title={"Session Preview"} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default TutorInterviewSummary;
