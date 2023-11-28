import './index.less'
import { Button } from "antd"
import { SvgIcon } from "../../../components/icon"
import { useParams } from "react-router-dom"

const InitialReviewCompleteStep = () =>{
  const {id} = useParams()
  //const [updateApplication] = useUpdateApplicationMutation();
  // const application = useApplicationsQuery({
  //   variables: { filter: { id: { eq: id } } }
  // })
  const application = [];
  const selectedApplication = application.data?.applications?.data?.[0]
  const fileName = selectedApplication?.attributes?.checked_draft?.data?.attributes?.name
  const downloadFile = selectedApplication?.attributes?.checked_draft?.data?.attributes?.url
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

  return(
    <div>
      <div className={"steps-initial-review-first"}>
        <p className={"steps-initial-review-first-text"}>
          Your initial review is completed. You can download it to make corrections. Don’t forget to send it back for final review!
        </p>
        <div className={"steps-initial-review-first-preview-file"}>
          <div><SvgIcon type={"clip"}/></div>
          <p className={"steps-initial-review-first-preview-tex"}>{fileName}</p></div>
        <a href={downloadFile} target={"_blank"} rel={"noreferrer"}><Button onClick={handleSubmit} className={"med-custom-button-download"}>Download</Button></a>
      </div>
    </div>
  )
}

export default InitialReviewCompleteStep;