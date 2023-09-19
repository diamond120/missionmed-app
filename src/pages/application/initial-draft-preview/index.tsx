import { PaperClipOutlined } from "@ant-design/icons"
import React, { FC, useEffect, useState } from "react"

interface InitialDraftPreviewProps {
  getUrlFile: (fileUrl: string) => void;
  id: string;
}
const InitialDraftPreview: FC<InitialDraftPreviewProps> = ({ getUrlFile, id, }) => {
  // const application = useApplicationsQuery({
  //   variables: { filter: { id: { eq: id } } }
  // });

  const application = [];
  const [fileUrl, setFileUrl] = useState<string>('');

  const selectedApplication = application.data?.applications?.data?.[0];
  const initDraftFileLink = selectedApplication?.attributes?.initial_draft?.data?.attributes?.url || '';
  const initDraftFileName = selectedApplication?.attributes?.initial_draft?.data?.attributes?.name
  useEffect(() => {
    getUrlFile(fileUrl);
  }, [fileUrl, getUrlFile]);
  return(
    <div className={"init-draft-loaded-file"} onClick={()=>{setFileUrl(initDraftFileLink)}}>
      <p className={"init-draft-loaded-file-title"}>Your Application<span style={{marginLeft: "4px",color:"black"}}>:</span></p>
      <div className={"init-draft-loaded-preview-link"}>
        <PaperClipOutlined className={"init-draft-loaded-preview-icon"}/>
        <p className={"init-draft-loaded-preview-name"}>{initDraftFileName}</p>

      </div>
    </div>
  )
}

export default InitialDraftPreview