import "./index.less";
import Agenda from "./agenda";
import Mysessions from "./my-sessions";
import UpcomingSession from "./upcoming-session";

const MockInterviewDetails = ({upcomingInterview, upcomingSessions, pastSessions, agenda, handleEditAgenda, updatePastSession}) => {
    return (
        <>
            <div style={{display:"flex",columnGap:"24px"}}>
            {Object.keys(upcomingInterview).length >0 &&<UpcomingSession upcomingInterview={upcomingInterview} sessionType="interview"/>}
            {Object.keys(upcomingInterview).length >0 &&<Agenda agenda={agenda} handleEditAgenda={handleEditAgenda} key={"agenda"} />}
            </div>
            <Mysessions upcomingSessions={upcomingSessions} pastSessions={pastSessions} updatePastSession={updatePastSession}/>
        </>
    )
}
export default MockInterviewDetails;