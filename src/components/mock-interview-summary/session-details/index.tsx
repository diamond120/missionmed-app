import { formatDateV1, formatTime } from "../../../common/common";
import "./index.less";

const SessionDetails = ({interviewSummary}) => {
  return (
    <>
      <div style={{ fontWeight: "600" }}>Student</div>
      <div style={{ fontSize: "16px" }}>{interviewSummary.studentName}</div>
      <div className={"date-time"}>
        <div className={"date"}>
          <div className={"title"}>Date</div>
          <div className={"text"}>{formatDateV1(interviewSummary?.date)}</div>
        </div>
        <div className={"start-time"}>
          <div className={"title"}>Start Time</div>
          <div className={"text"}>{formatTime(interviewSummary?.session_start_time)}</div>
        </div>
        <div className={"end-time"}>
          <div className={"title"}>End Time</div>
          <div className={"text"}>{formatTime(interviewSummary?.session_end_time)}</div>
        </div>
      </div>
    </>
  );
};
export default SessionDetails;
