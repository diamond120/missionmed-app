import "./index.less";
import Agenda from "./agenda";
import Mysessions from "./my-sessions";
import UpcomingSession from "./upcoming-session";
// import RescheduleInterview from "./reschedule-interview";

const SessionDetails = ({test,moduleType,upcomingInterview, upcomingSessions, pastSessions, agenda, handleEditAgenda, updatePastSession, handleReschedule,cancleUpSession, handleEditLink, freezeSessions}) => {

    return (
        <>
            <div style={{display:"flex",columnGap:"24px"}}>
            {/* {Object.keys(upcomingInterview).length >0 &&<UpcomingSession upcomingInterview={upcomingInterview} handleReschedule={handleReschedule} sessionType="interview"/>} */}
            {/* {Object.keys(upcomingInterview).length >0 &&<Agenda agenda={agenda} handleEditAgenda={handleEditAgenda} key={"agenda"} />} */}
            {Object.keys(upcomingInterview).length >0 && <UpcomingSession upcomingInterview={upcomingInterview} handleReschedule={handleReschedule} handleEditLink={handleEditLink} sessionType="session"/> }
            {Object.keys(upcomingInterview).length >0 &&<Agenda agenda={agenda} handleEditAgenda={handleEditAgenda} key={"agenda"} />}
            </div>
          
            <Mysessions upcomingSessions={upcomingSessions} pastSessions={pastSessions} updatePastSession={updatePastSession} moduleType={moduleType} handleReschedule={handleReschedule} cancleUpSession={cancleUpSession} handleEditLink={handleEditLink} freezeSessions={freezeSessions}/>
        </>
    )
}
export default SessionDetails;