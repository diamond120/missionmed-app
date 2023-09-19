import "./index.less"
import { SvgIcon } from "../../../components/icon"
import { Button } from "antd"
import React from "react"
import { useParams } from "react-router-dom"


const FinalReviewCompleteStep = () => {

  const{id} = useParams()
  // const application = useApplicationsQuery({
  //   variables: { filter: { id: { eq: id } } }
  // })

  const application = []

  const selectedApplication = application.data?.applications?.data?.[0]
  const fileName = selectedApplication?.attributes?.final_review?.data?.attributes?.name
  const downLoadFile = selectedApplication?.attributes?.final_review?.data?.attributes?.url
  return(
    <div>
      <div className={"steps-initial-review-first"}>
        <p className={"steps-initial-review-first-text"}>
          Your final review is completed. You can download it to make new edits to your application. You’re doing great. Good luck!
        </p>
        <div className={"steps-initial-review-first-preview-file"}>
          <div><SvgIcon type={"clip"}/></div>
          <p className={"steps-initial-review-first-preview-tex"}>{fileName}</p></div>
       <a href={downLoadFile} target={"_blank"} rel={"noreferrer"}><Button className={"med-custom-button-download"}>Download</Button></a>
      </div>
    </div>
  )
}
export default FinalReviewCompleteStep