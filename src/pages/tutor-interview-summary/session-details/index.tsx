import "./index.less"
const Sessiondetails = () => {
  return (
    <>
     <div className={"session-details con-box"}>
          <h2 className={"secondary-title"}>Session Details</h2>
          <div className={"con-box-wrap"}>
               <div style={{fontWeight: '600'}}>Student</div>
               <div style={{fontSize:'16px'}}>Leslie Alexander</div>
               <div className={"date-time"}>
                    <div className={"date"}>
                         <div className={"title"}>Date</div>
                         <div className={"text"}>Fri, 16 Jun 2023</div>
                    </div>
                    <div className={"start-time"}>
                         <div className={"title"}>Start Time</div>
                         <div className={"text"}>3:00 pm</div>
                    </div>
                    <div className={"end-time"}>
                         <div className={"title"}>End Time</div>
                         <div className={"text"}>4:00 pm</div>
                    </div>
               </div>
          </div>
     </div>

    </>
  )
}

export default Sessiondetails
