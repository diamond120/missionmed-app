import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import MockInterviewsService from "../../api/services/MockInterviews";
import { useStudent } from "../../api/providers/StudentProvider";
import { formatDateV1 } from "../../common/common";
import "./index.less";
import SectionDetails from "./section-details";
import Summarypreview from "./report";

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
    getInterviewSummary();
  }, [mockInterviewId]);

  return (
    <>
      <Section>
        <Breadcrumb>
          <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href={"/tutor/mock-interview"}>
            UCAT Sessions
          </Breadcrumb.Item>
          <Breadcrumb.Item>Session Summary</Breadcrumb.Item>
        </Breadcrumb>
        <div className={"con-section-wrap session-summary-section-wrap"}>
          <h2 className={"tab-title"}>Session Summary</h2>

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
                      {formatDateV1(interviewSummary.date)}
                    </div>
                  </div>
                  <div className={"start-time"}>
                    <div className={"title"}>Start Time</div>
                    <div className={"text"}>
                      {interviewSummary.session_start_time}
                    </div>
                  </div>
                  <div className={"end-time"}>
                    <div className={"title"}>End Time</div>
                    <div className={"text"}>
                      {interviewSummary.session_end_time}
                    </div>
                  </div>
                </div>
              </SectionDetails>
              <div style={{ margin: "40px 0" }}>
                <SectionDetails className={`summary-section`} title="Agenda">
                  {interviewSummary.agenda}
                </SectionDetails>
              </div>
              <SectionDetails
                className={`summary-section`}
                title="Post-Session Tasks"
              >
                <ul className={"list-disc"} style={{ marginBottom: 32 }}>
                  <li>
                    Ask about how tutor was able to mentally reach the answer
                    for Q34 in Mock 2 of Medify.
                  </li>
                  <li>Ask tutor to explain how to work through syllogisms.</li>
                </ul>
                <Button className={"secondary-button"}>Add New Task</Button>
              </SectionDetails>
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

export default StudentInterviewSummary;
