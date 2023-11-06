import "./index.less";
import Agenda from "./agenda";
import Mysessions from "./my-sessions";
import UpcomingSession from "./upcoming-session";
import RescheduleInterview from "./reschedule-interview";

const MockInterviewDetails = ({upcomingInterview, upcomingSessions, pastSessions, agenda, handleEditAgenda, updatePastSession, handleReschedule,handleEditLink}) => {
    return (
        <>
            <div style={{display:"flex",columnGap:"24px"}}>
            {Object.keys(upcomingInterview).length >0 &&<UpcomingSession upcomingInterview={upcomingInterview} handleReschedule={handleReschedule} sessionType="interview" handleEditLink={handleEditLink}/>}
            {Object.keys(upcomingInterview).length >0 &&<Agenda agenda={agenda} handleEditAgenda={handleEditAgenda} key={"agenda"} />}
            </div>
            <Mysessions upcomingSessions={upcomingSessions} pastSessions={pastSessions} updatePastSession={updatePastSession} handleReschedule={handleReschedule}/>
        </>
    )
}
export default MockInterviewDetails;