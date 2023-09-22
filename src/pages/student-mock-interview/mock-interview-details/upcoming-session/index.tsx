import { Button, Tooltip } from "antd";
import {CalendarOutlined } from "@ant-design/icons";
import {useStudent} from "../../../../api/providers/StudentProvider";
import {formatDateV1, checkSessionOnToday} from "../../../../common/common";
import "./index.less"
import { useMemo } from "react";

const UpcomingSession = ({upcomingInterview}) => {
  const student = useStudent();
  const isSessionOnToday = useMemo(
    () => checkSessionOnToday(upcomingInterview.date),
    [upcomingInterview.date]
  );
  return (
    <>
      <div className={"upcoming-session con-box"}>
        <h2 className={"secondary-title"}>Upcoming Session</h2>
        <div className={"con-box-wrap"}>
          <CalendarOutlined style={{ fontSize: "50px", color: "#A9A2F8" }} />

          <h2 className={"con-box-title"}>Next Session Will Be</h2>
          <ul>
            <li>
              <strong>Student:</strong> {student.fullName}
            </li>
            <li>
              <strong>Date: </strong> {formatDateV1(upcomingInterview.date)}
            </li>
            <li>
              <strong>Time: </strong> {upcomingInterview.time}
            </li>
          </ul>

          <div className="btn-group" style={{ marginTop: "32px" }}>
            <Button className={"primary-button"}>Join Session </Button>
            {isSessionOnToday ? (
              <Tooltip
                title={
                  "You can’t reschedule session less than 24 hours before it starts"
                }
                color={"#465078"}
              >
                <Button className={"secondary-button"} onClick={() => false}> Reschedule </Button>
              </Tooltip>
            ) : (
              <Button className={"secondary-button"}> Reschedule </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UpcomingSession
