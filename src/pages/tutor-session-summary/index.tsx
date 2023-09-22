import "./index.less"
import { Breadcrumb} from "antd"
import { HomeOutlined} from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import Sessiondetails from "./session-details";
import Summarypreview from "./summary-preview";
import Sessionagenda from "./session-agenda";
import Sessionsummary from "./session-summary";
import Postsessiontasks from "./post-session-tasks";
import Sessionrate from "./session-rate";

const TutorSessionSummary = () => {

     return (
     <>
          <Section>

               <Breadcrumb>
                    <Breadcrumb.Item href={"/"}>
                         <HomeOutlined />
                         </Breadcrumb.Item>
                    <Breadcrumb.Item href={"/tutor/mock-interview"}>UCAT Sessions</Breadcrumb.Item>
                    <Breadcrumb.Item>Session Summary</Breadcrumb.Item>
               </Breadcrumb>

               <div className={"con-section-wrap session-summary-section-wrap"}>
                    <h2 className={"tab-title"}>Session Summary</h2>

                    <div className={"grid-col-2"}>
                         <div style={{width:"504px"}}>
                              <Sessiondetails />
                              <div style={{margin:"40px 0"}}>
                                   <Sessionagenda />
                              </div>
                              <Sessionsummary />
                              <div style={{margin:"40px 0"}}>
                                   <Postsessiontasks />
                              </div>
                              <Sessionrate />
                         </div>
                         <div style={{width:"504px"}}>
                              <Summarypreview />
                         </div>
                    </div>
               </div>
          </Section>
     </>
     )
}

export default TutorSessionSummary
