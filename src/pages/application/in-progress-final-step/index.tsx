
import './index.less'
import { Button, Tooltip } from "antd"
import { useParams } from "react-router-dom"

const InProgressStepFinal = ()=>{

  const {id} = useParams()
  //const [updateApplication] = useUpdateApplicationMutation();
  // const application = useApplicationsQuery({
  //   variables: { filter: { id: { eq: id } } }
  // })
  const application = []
  const selectedApplication = application.data?.applications?.data?.[0]
  const tutorFullname = selectedApplication?.attributes?.reviewer?.data?.attributes?.full_name

  const handleSubmit = () => {
    // try { if(id){
    //   updateApplication({
    //     variables: {
    //       id: id,
    //       input: {
    //         stage: 'Final_Review',

    //       },

    //     },
    //   });
    // }

    // } catch (error) {
    //   console.error('Update application error:', error);
    // }
  };

  const tooltipMessage = "You can’t cancel review because tutor has already started checking your application"
  return(
    <div>
      <div className={"steps-progress-first"}>
        <p className={"steps-progress-first-text"}>
          Your final application draft was successfully uploaded to your tutor for reviewing. We will send you a notification when review will be complete.
        </p>
        <p className={"steps-upload-text tutor"}>Assigned tutor:<span className={"bold"}>{tutorFullname}</span></p>
        <Tooltip title={tooltipMessage} color={"#465078"}>
          <Button onClick={handleSubmit} className={"steps-progress-first-btn"} disabled={true}>Cancel Review</Button>
        </Tooltip>
      </div>
    </div>
  )
}

export default InProgressStepFinal