import "./index.less"
import { Breadcrumb,  Button, Tabs} from "antd"

const TutorSessionSummary = () => {
     const { TabPane } = Tabs;

     return (
     <>
     <div className={"upc-agenda con-box"} style={{marginTop:'55px'}}>
          <h2 className={"secondary-title"}>Session Summary </h2>
          <Tabs defaultActiveKey={"profile"}>
          
               <TabPane tab={"Upcoming"} key={"Upcoming"}>
                    <div className={"upcoming-sessions"}>
                         
                         <div className="sessions">
                              <h4 className="sessions-date">Fri, 16 Jun 2023</h4>
                              <ul className="sessions-list"> 
                                   <li className="item">
                                        <div className="time">
                                             <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                             <div className={"end-time"}>3:00 pm</div>
                                        </div>

                                        <div>
                                             <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                             <div className={"mock_interview"}>Cameron Williamson</div>
                                        </div>
                                        <Button className={"secondary-button"}>Reschedule</Button>
                                   </li>
                                   
                                   <li className="item">
                                        <div className="time">
                                             <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                             <div className={"end-time"}>3:00 pm</div>
                                        </div>

                                        <div>
                                             <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                             <div className={"mock_interview"}>Cameron Williamson</div>
                                        </div>
                                        <Button className={"secondary-button"}>Reschedule</Button>
                                   </li>
                              </ul>
                         </div>

                         <div className="sessions">
                              <h4 className="sessions-date">Fri, 16 Jun 2023</h4>
                              <ul className="sessions-list"> 
                                   <li className="item">
                                        <div style={{display:"flex"}}>
                                             <div className="time">
                                                  <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                                  <div className={"end-time"}>3:00 pm</div>
                                             </div>

                                             <div>
                                                  <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                                  <div className={"mock_interview"}>Cameron Williamson</div>
                                             </div>
                                        </div>
                                        <Button className={"secondary-button"}>Reschedule</Button>
                                   </li>
                                   
                              </ul>
                         </div>
                    </div>
               </TabPane>

               <TabPane tab={"Past"} key={"Past"}>
                    <div className={"upcoming-past"}>
                         <div className="sessions">
                              <h4 className="sessions-date">Thus, 16 Jun 2023</h4>
                              <ul className="sessions-list"> 
                                 
                                   <li className="item">
                                        <div style={{display:"flex"}}>
                                             <div className="time">
                                                  <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                                  <div className={"end-time"}>3:00 pm</div>
                                             </div>

                                             <div>
                                                  <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                                  <div className={"mock_interview"}>Cameron Williamson</div>
                                             </div>
                                        </div>
                                        <Button className={"secondary-button"}>Session Summary</Button>
                                   </li>
                              </ul>
                         </div>
                         <div className="sessions">
                              <h4 className="sessions-date">Thus, 16 Jun 2023</h4>
                              <ul className="sessions-list"> 
                                   <li className="item">
                                        <div style={{display:"flex"}}>
                                             <div className="time">
                                                  <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                                  <div className={"end-time"}>3:00 pm</div>
                                             </div>

                                             <div>
                                                  <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                                  <div className={"mock_interview"}>Cameron Williamson</div>
                                             </div>
                                        </div>
                                        <Button className={"secondary-button"}>Session Summary</Button>
                                   </li>
                                   <li className="item">
                                        <div style={{display:"flex"}}>
                                             <div className="time">
                                                  <div style={{paddingBottom:"5px"}}><strong>3:00 pm</strong></div>
                                                  <div className={"end-time"}>3:00 pm</div>
                                             </div>

                                             <div>
                                                  <div style={{paddingBottom:"5px"}}><strong>UCAT Teaching Session</strong></div>
                                                  <div className={"mock_interview"}>Cameron Williamson</div>
                                             </div>
                                        </div>
                                        <Button className={"secondary-button"}>Session Summary</Button>
                                   </li>

                                   
                                   
                              </ul>
                         </div>
                    </div>
               </TabPane>
          </Tabs>
     </div>
     </>
     )
}

export default Mysessions
