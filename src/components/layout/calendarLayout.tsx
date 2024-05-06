import "./calendarLayout.less"
import { FC, useState, useMemo, useEffect} from "react"
import { Tabs } from "antd"
import TutorCalendarTeaching from "../../pages/tutor-calendar-teaching"
import TutorCalendarMock from "../../pages/tutor-calendar-mock"
import { useParams } from 'react-router-dom';
import CommonService from "../../api/services/Common";
export const calendarLayout: FC = () => {
  const { TabPane } = Tabs;
  const [slots, setSlots] = useState([]);
  const [spin, setSpin] = useState(false);
  const { ID } = useParams();
  const calTutorId = parseInt(ID); 
  useEffect(() => {
    const fetchData = async () => {
      setSpin(true);
      try {
        const data = {
          tutorId: calTutorId,
        };
        const response = await CommonService.postAPI("/tutors-session-check", data);
        if (response.data.success) {
          const slotList = response.data.data ?? [];
          setSlots(slotList);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        message.error(error.message);
      } finally {
        setSpin(false);
      }
    };

    fetchData();
  }, [calTutorId]);
return(
<div className={"book-time-cal-wrap  without-calendar-login"}>
  <Tabs >
  {slots.ucat_tutoring === 'true' && (
    <TabPane tab={"UCAT Teaching Session"} key={"ucat"}>
    <div className={"working-cal-wrap"}>
      <TutorCalendarTeaching />
      </div>
    </TabPane>
     )}
     {slots.interview_tutoring === 'true' && (
    <TabPane tab={"Interview Teaching Session"} key={"teaching"}>
    <div className={"working-cal-wrap"}>
      <TutorCalendarTeaching />
    </div>
    </TabPane>
      )}
    {slots.mock_interview === 'true' && (
    <TabPane tab={"Mock Interview"} key={"mock"}>
    <div className={"working-cal-wrap"}>
      <TutorCalendarMock />
    </div>
    </TabPane>
   )}
  </Tabs>
</div>
)
};

export default calendarLayout;