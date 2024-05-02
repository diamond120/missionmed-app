import "./calendarLayout.less"
import { FC } from "react"
import { Tabs } from "antd"
import TutorCalendarTeaching from "../../pages/tutor-calendar-teaching"
import TutorCalendarMock from "../../pages/tutor-calendar-mock"
export const calendarLayout: FC = () => {
  const { TabPane } = Tabs;   
return(
<div className={"book-time-cal-wrap"}>
  <Tabs >
    <TabPane tab={"UCAT"} key={"ucat"}>
    <div className={"working-cal-wrap"}>
      <TutorCalendarTeaching />
      </div>
    </TabPane>
    <TabPane tab={"Teaching"} key={"teaching"}>
    <div className={"working-cal-wrap"}>
      <TutorCalendarTeaching />
    </div>
    </TabPane>
    <TabPane tab={"MockInterview"} key={"mock"}>
    <div className={"working-cal-wrap"}>
      <TutorCalendarMock />
    </div>
    </TabPane>
  </Tabs>
</div>

)

};

export default calendarLayout;