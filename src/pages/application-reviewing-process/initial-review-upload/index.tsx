import "./index.less"
import React, { FC, useEffect, useState } from 'react';
import { Button, message, Upload } from 'antd';
import { ReactComponent as UploadIcon } from '../../../components/icon/assets/upload.svg';
import { ReactComponent as QuestionIcon } from '../../../components/icon/assets/question.svg';
import type { UploadProps } from 'antd/lib/upload/interface';
import { PaperClipOutlined } from '@ant-design/icons';
import axios from "axios"


const { Dragger } = Upload;


interface UploadStepProps {
  getUrlFile: (fileUrl: string) => void;
  id: string;
}

const deleteFile = async (id: string) => {
  await axios.delete(`/api/upload/files/${id}`)
}
const InitialReviewUpload: FC<UploadStepProps> = ({ getUrlFile, id, }) => {
  const [fileUrl, setFileUrl] = useState<string>('');
  //const [updateApplication] = useUpdateApplicationMutation();
 // const [createdNotification] = useCreateNotificationMutation()
  const [idFile, setIdFile] = useState('')
  const [linkFile,setLinkFile] = useState("")
  //const studentId = useApplicationsQuery({ variables: { filter: { id: { eq: id}}}})?.data?.applications?.data[0].attributes?.student?.data?.id
  const studentId = 1
  const props: UploadProps = {
    name: 'files',
    multiple: false,
    maxCount: 1,
    accept: '.pdf, .doc, .docx',
    action: `/api/upload`,
    onChange: (info) => {
      !!info.file.response && !!info.fileList.length ? setFileUrl(info.file.response[0].url) : setFileUrl('')
      !!info.file.response && setIdFile(info.file.response[0].id)
      const { status, percent } = info.file;
      if (status === 'uploading' && percent === 100) {
        message.success(`${info.file.name} file upload success.`)
      }
      if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onRemove() {
      setFileUrl('')
      deleteFile(idFile)
    }
  }

  useEffect(() => {
    getUrlFile(fileUrl);
  }, [fileUrl, getUrlFile]);

  const handleSubmit = () => {
    // try {
    //   updateApplication({
    //     variables: {
    //       id: id,
    //       input: {
    //         checked_draft: idFile,
    //         stage: 'Initial_Review_Complete',


    //       },
    //     },
    //   });
    //   sendNotification()
    // } catch (error) {
    //   console.error('Update application error:', error);
    // }
  };
  const sendNotification =()=>{
    // try {
    //   createdNotification({
    //     variables: {
    //       input: {
    //         action: "has uploaded initial review for",
    //         is_read: false,
    //         application: id,
    //         is_from_tutor: true,
    //         student: studentId

    //       },
    //     },
    //   });

    // } catch (error) {
    //   console.error('Update application error:', error);
    // }
  }
  // const application = useApplicationsQuery({
  //   variables: { filter: { id: { eq: id } } }
  // });
  const application = [];
  const selectedApplication = application.data?.applications?.data?.[0];
  const checkedDraftFileLink = selectedApplication?.attributes?.checked_draft?.data?.attributes?.url || '';
  const checkedDraftFileName = selectedApplication?.attributes?.checked_draft?.data?.attributes?.name
  useEffect(() => {
    setLinkFile(checkedDraftFileLink)
  }, [linkFile]);
  return (
    <React.Fragment>
      {linkFile !== ""

        ?

        <div className={"init-draft-loaded-file"} onClick={()=>{setFileUrl(checkedDraftFileLink)}}>
          <p className={"init-draft-loaded-file-title"}>Your Application Review<span style={{marginLeft: "4px",color:"black"}}>:</span></p>
          <div className={"init-draft-loaded-preview-link"}>
            <PaperClipOutlined className={"init-draft-loaded-preview-icon"}/>
            <p className={"init-draft-loaded-preview-name"}>{checkedDraftFileName}</p>
          </div>
        </div>

        :

        <div className={"steps-upload"}>
          <p className={"steps-upload-text"}>
            Here you can upload initial application review.
          </p>
          <p className={"steps-upload-text"}>Supported file formats: PDF, DOC, DOCX</p>
          <p className={"steps-upload-text"}>Maximum file size: 10MB</p>

          <div className={"upload-title"}>
            <p className={"upload-text"}>* Upload your Application Review</p>
            <QuestionIcon className={"upload-title-icon"} />
            <span style={{ marginLeft: '5px' }}>:</span>
          </div>
          <Dragger style={{display: fileUrl !== '' ? "none" : "block"}} className={"steps-upload-field"} name={"file"} {...props}>
            <UploadIcon className={"steps-upload-field-icon"} />
            <h3 className={"steps-upload-field-title"}>Click or drag file to this area to upload</h3>
            <p className={"steps-upload-field-text"}>Support for a single or bulk upload.</p>
          </Dragger>

          <Button
            type={"primary"}
            htmlType={"submit"}
            style={{
              borderRadius: '6px',
              width: '159px',
              color: fileUrl !== '' ? '#fff' : '#9096AE',
              border: '1px solid #B5B9C9',
              marginTop: '24px',
              backgroundColor: fileUrl !== '' ? '#2816EE' : '',
            }}
            disabled={fileUrl === ''}
            block
            onClick={handleSubmit}
          >
            Submit Application
          </Button>
          {fileUrl !== ''
            &&
            <Button
              type={"default"}
              style={{borderRadius : "6px", marginLeft: '8px'}} onClick={() =>{setFileUrl('');deleteFile(idFile) }} >
              Remove Application
            </Button>}
        </div>}
    </React.Fragment>
  );
};

export default InitialReviewUpload;