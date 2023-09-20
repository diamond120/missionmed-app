import { Button } from "antd";
import "./index.less"

import {CalendarOutlined } from "@ant-design/icons";

const Upcsession = () => {
  return (
    <>
      <div className={"upcoming-session con-box"}>
          <h2 className={"secondary-title"}>Upcoming Session</h2>
          <div className={"con-box-wrap"}>
               <CalendarOutlined style={{ fontSize: '50px', color: '#A9A2F8' }}/>

               <h2 className={"con-box-title"}>Next Session Will Be</h2>
               <ul>
                    <li><strong>Student:</strong> Leslie Alexander</li>
                    <li><strong>Date: </strong> Mon, 19 Jun 2023</li>
                    <li><strong>Time: </strong> 3:00 pm - 400 pm</li>
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

export default Upcsession
