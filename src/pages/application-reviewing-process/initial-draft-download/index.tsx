
import './index.less'
import { Button } from "antd"
import React, { FC } from "react"
import { SvgIcon } from "../../../components/icon"
import { useParams } from "react-router-dom"


interface InitialDraftDownloadProps{
  setCurrentStepInitReview : ()=> void
}





const InitialDraftDownload: FC<InitialDraftDownloadProps> = ({setCurrentStepInitReview}) =>{
  const {id} = useParams()
  // const [updateApplication] = useUpdateApplicationMutation();

  // const application = useApplicationsQuery({
  //   variables: { filter: { id: { eq: id } } }
  // })
  const application = [];
  const selectedApplication = application.data?.applications?.data?.[0]
  const fileName = selectedApplication?.attributes?.initial_draft?.data?.attributes?.name
  const downloadFile = selectedApplication?.attributes?.initial_draft?.data?.attributes?.url
  const handleSubmit = () => {
    // try { if(id){
    //   updateApplication({
    //     variables: {
    //       id: id,
    //       input: {
    //         stage: 'In_Progress',

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
      <div className={"initial-draft-download"}>
        <p className={"initial-draft-download-text"}>
          Your student has just uploaded their first draft application. Don't forget to check out university-specific review tips.
        </p>
        <div className={"initial-draft-download-preview-file"}>
          <div><SvgIcon type={"clip"}/></div>
          <p className={"initial-draft-download-preview-tex"}>{fileName}</p></div>
          <a href={downloadFile} onClick={setCurrentStepInitReview} target={"_blank"} rel={"noreferrer"}><Button  className={"med-custom-button-download"}>Download</Button></a>
          <Button style={{borderRadius: "6px", marginLeft: "8px",color:'black'}}>Report a problem</Button>
      </div>
    </div>
  )
}
export default InitialDraftDownload ;