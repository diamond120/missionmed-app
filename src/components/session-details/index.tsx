import "./index.less";
import Agenda from "./agenda";
import Mysessions from "./my-sessions";
import UpcomingSession from "./upcoming-session";

const SessionDetails = ({ moduleType, upcomingInterview, upcomingSessions, pastSessions, agenda, handleEditAgenda, updatePastSession, handleReschedule, cancleUpSession, handleEditLink, freezeSessions, credit }) => {

    return (
        <>
            <div style={{ display: "flex", columnGap: "24px" }} className="lg-d-col">
                {Object.keys(upcomingInterview).length > 0 && <UpcomingSession upcomingInterview={upcomingInterview} handleReschedule={handleReschedule} handleEditLink={handleEditLink} sessionType="session" credit={credit} />}
                {Object.keys(upcomingInterview).length > 0 && <Agenda agenda={agenda} handleEditAgenda={handleEditAgenda} key={"agenda"} credit={credit} />}
            </div>
            <Mysessions upcomingSessions={upcomingSessions} pastSessions={pastSessions} updatePastSession={updatePastSession} moduleType={moduleType} handleReschedule={handleReschedule} cancleUpSession={cancleUpSession} handleEditLink={handleEditLink} freezeSessions={freezeSessions} handleEditAgenda={handleEditAgenda} />
        </>
    )
}
export default SessionDetails;