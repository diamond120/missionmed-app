import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import MockInterviewsService from "../../api/services/MockInterviews";
import { useStudent } from "../../api/providers/StudentProvider";
import { formatDateV1 } from "../../common/common";
import "./index.less";
import SectionDetails from "./section-details";
import Report from "./report";
import { NoSessionRate, SessionRateDetails } from "./session-rate";

const StudentInterviewSummary = () => {
  let { mockInterviewId } = useParams();
  const [interviewSummary, setInterviewSummary] = useState({});
  const student = useStudent();

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
            <Link to={backUrl}>Mock Interview</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Interview Summary</Breadcrumb.Item>
        </Breadcrumb>
        <div className={"con-section-wrap session-summary-section-wrap"}>
          <h2 className={"tab-title"}>Interview Summary</h2>

          <div className={"grid-col-2"}>
            <div style={{ width: "504px" }}>
              <SectionDetails
                className={`summary-section`}
                title="Session Details"
              >
                <div style={{ fontWeight: "600" }}>Student</div>
                <div style={{ fontSize: "16px" }}>{student.fullName}</div>
                <div className={"date-time"}>
                  <div className={"date"}>
                    <div className={"title"}>Date</div>
                    <div className={"text"}>
                      {formatDateV1(interviewSummary?.date)}
                    </div>
                  </div>
                  <div className={"start-time"}>
                    <div className={"title"}>Start Time</div>
                    <div className={"text"}>
                      {interviewSummary?.session_start_time}
                    </div>
                  </div>
                  <div className={"end-time"}>
                    <div className={"title"}>End Time</div>
                    <div className={"text"}>
                      {interviewSummary?.session_end_time}
                    </div>
                  </div>
                </div>
              </SectionDetails>

              <SectionDetails className={`summary-section`} title="Agenda">
                {interviewSummary?.agenda}
              </SectionDetails>
              <SectionDetails
                className={`summary-section`}
                title="Post-Session Tasks"
              >
                {interviewSummary?.post_session_tasks}
              </SectionDetails>
              <SectionDetails className={`session-rate`} title="Session Rate">
                {!interviewSummary.sessionrate &&<NoSessionRate session={{id:interviewSummary?.id, tutorId:interviewSummary?.tutor_id}} handleUpdateSummary={handleUpdateSummary}/>}
                {interviewSummary.sessionrate &&<SessionRateDetails rateDetails={interviewSummary.sessionrate} />}
              </SectionDetails>
            </div>
            <div style={{ width: "504px" }}>
              <Report report={interviewSummary?.report ?? null} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default StudentInterviewSummary;
