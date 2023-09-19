import './index.less'
import { Button, Tooltip } from "antd"
import React from "react"
import { useParams } from "react-router-dom"




const InProgressStepFirst = ()=>{

 const {id} = useParams()
  //const [updateApplication] = useUpdateApplicationMutation();
  // const application = useApplicationsQuery({
  //   variables: { filter: { id: { eq: id } } }
  // })
  const application = []
  const selectedApplication = application.data?.applications?.data?.[0]
  const tutorFullname = selectedApplication?.attributes?.reviewer?.data?.attributes?.full_name



  const handleCancelReview = () => {
    // try { if(id){
    //   updateApplication({
    //     variables: {
    //       id: id,
    //       input: {
    //         stage: 'Initial_Draft',
    //       },
    //     },
    //   });
    // }

    // } catch (error) {
    //   console.error('Update application error:', error);
    // }
  };

 const tooltipsMessage = "You can’t cancel review because tutor has already started checking your application"



  return(
    <div>
      {tutorFullname  ?
        <div className={"steps-progress-first"}>
          <p className={"steps-progress-first-text"}>
            Your first application draft was successfully uploaded to your tutor for reviewing. We will send you a notification when review will be complete.
          </p>
          <p className={"steps-upload-text tutor"}>Assigned tutor:<span className={"bold"}>{tutorFullname}</span></p>
          <Tooltip color={"#465078"} title={tooltipsMessage}><Button onClick={handleCancelReview} className={"steps-progress-first-btn"} disabled={true} >Cancel Review</Button></Tooltip>
        </div>
        :
        <div className={"steps-progress-first"}>
          <p className={"steps-progress-first-text"}>
            Your first application draft was successfully uploaded to your tutor for reviewing. We will send you a notification when review will be complete.
          </p>
          <p className={"steps-upload-text tutor"}>Assigned tutor:<span className={"bold"}>{tutorFullname}</span></p>
          <Button onClick={handleCancelReview} className={"steps-progress-first-btn"} disabled={false} >Cancel Review</Button>
        </div>

      }
    </div>
  )
}

export default InProgressStepFirst








