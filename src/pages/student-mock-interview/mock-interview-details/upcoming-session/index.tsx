import { Button } from "antd";
import "./index.less"

import {CalendarOutlined } from "@ant-design/icons";
import {useStudent} from "../../../../api/providers/StudentProvider";
import {formatDateV1} from "../../../../common/common";

const UpcomingSession = ({upcomingInterview}) => {
  const student = useStudent();
  return (
    <>
      <div className={"upcoming-session con-box"}>
          <h2 className={"secondary-title"}>Upcoming Session</h2>
          <div className={"con-box-wrap"}>
               <CalendarOutlined style={{ fontSize: '50px', color: '#A9A2F8' }}/>

               <h2 className={"con-box-title"}>Next Session Will Be</h2>
               <ul>
                    <li><strong>Student:</strong> {student.fullName}</li>
                    <li><strong>Date: </strong> {formatDateV1(upcomingInterview.date)}</li>
                    <li><strong>Time: </strong> {upcomingInterview.time}</li>
               </ul>

               <div className="btn-group" style={{marginTop:"32px"}}>
                    <Button className={"primary-button"}>Join Session </Button>
                    <Button className={"secondary-button"}> Reschedule </Button>
               </div>
          </div>
      </div>
    </>
  )
}

export default UpcomingSession
