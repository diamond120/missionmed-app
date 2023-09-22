import "./index.less";
import Agenda from "./agenda";
import Mysessions from "./my-sessions";
import UpcomingSession from "./upcoming-session";

const MockInterviewDetails = ({upcomingInterview, upcomingSessions, pastSessions, agenda, handleEditAgenda}) => {
    
    return (
        <>
            <div style={{display:"flex",columnGap:"24px"}}>
            {Object.keys(upcomingInterview).length >0 &&<UpcomingSession upcomingInterview={upcomingInterview}/>}
            {Object.keys(upcomingInterview).length >0 &&<Agenda agenda={agenda} handleEditAgenda={handleEditAgenda} />}
            </div>
            <Mysessions upcomingSessions={upcomingSessions} pastSessions={pastSessions} />
        </>
    )
}
export default MockInterviewDetails;