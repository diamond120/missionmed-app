import "./index.less";
import Agenda from "./agenda";
import Mysessions from "./my-sessions";
import UpcomingSession from "./upcoming-session";

const MockInterviewDetails = ({upcomingInterview, upcomingSessions, pastSessions, agenda, handleEditAgenda, updatePastSession, handleReschedule,handleEditLink,cancleUpSession}) => {
     
    return (
        <>
            <div style={{display:"flex",columnGap:"24px"}} className="lg-d-col">
            {Object.keys(upcomingInterview).length >0 &&<UpcomingSession upcomingInterview={upcomingInterview} handleReschedule={handleReschedule} sessionType="interview" handleEditLink={handleEditLink}/>}
            {Object.keys(upcomingInterview).length >0 &&<Agenda agenda={agenda} handleEditAgenda={handleEditAgenda} key={"agenda"} />}
            </div>
            <Mysessions upcomingSessions={upcomingSessions} pastSessions={pastSessions} updatePastSession={updatePastSession} handleReschedule={handleReschedule} handleEditLink={handleEditLink} cancleUpSession={cancleUpSession} handleEditAgenda={handleEditAgenda}/>
        </>
    )
}
export default MockInterviewDetails;