import { useNavigate } from "react-router-dom";
import { Breadcrumb,  Button, Tabs} from "antd"
import {formatDateV1} from "../../../../common/common";

import "./index.less"

const SessionList = ({date, sessions, type}) => (
     <div className="sessions">
          <h4 className="sessions-date">{formatDateV1(date)}</h4>
          <ul className="sessions-list">
          {sessions.map((session) => (
               <SessionItem session={session} type={type} />    
          ))}
          </ul>
     </div>
);

const SessionItem = ({session, type}) => (
     <li className="item">
          <div style={{display:"flex"}}>
               <div className="time">
                    <div style={{paddingBottom:"5px"}}><strong>{session.session_start_time}</strong></div>
                    <div className={"end-time"}>{session.session_end_time}</div>
               </div>
               <div>
                    <div style={{paddingBottom:"5px"}}><strong>{session.mock_interview}</strong></div>
                    <div className={"mock_interview"}>{session.tutor_name}</div>
               </div>
          </div>
         {type == "upcoming" && <Button className={"secondary-button"}>Reschedule</Button>}
         {type == "past" &&  
         <>
          <div className={"button-group"} style={{display:'flex',columnGap:'16px'}}>
                    <Button className={"secondary-button"}>Rate Session</Button>
                    <Button className={"secondary-button"}>View Summary</Button>
          </div>
         </>}
     </li>
)

const Mysessions = ({upcomingSessions, pastSessions}) => {
     const { TabPane } = Tabs;
     const navigation = useNavigate();
     console.log(upcomingSessions)
     return (
     <>
     <div className={"upc-agenda con-box"} style={{marginTop:'55px'}}>
          <h2 className={"secondary-title"}>My Sessions </h2>
          <Tabs defaultActiveKey={"profile"}>
          
               <TabPane tab={"Upcoming"} key={"Upcoming"}>
                    <div className={"upcoming-sessions"}>
                         {Object.keys(upcomingSessions).map(date => (
                             <SessionList date={date} sessions={upcomingSessions[date]} type={"upcoming"}/>
                         ))}                
                    </div>
               </TabPane>

               <TabPane tab={"Past"} key={"Past"}>
                    <div className={"upcoming-past"}>
                         {Object.keys(pastSessions).map(date => (
                             <SessionList date={date} sessions={pastSessions[date]} type={"past"}/>
                         ))}                
                    </div>
               </TabPane>
          </Tabs>
     </div>
     </>
     )
}

export default Mysessions
