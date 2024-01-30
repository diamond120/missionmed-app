
import './index.less';
import React, { FC, useEffect, useState } from 'react';
import { Button, message, Upload } from 'antd';
import { ReactComponent as UploadIcon } from '../../../components/icon/assets/upload.svg';
import { ReactComponent as QuestionIcon } from '../../../components/icon/assets/question.svg';
import type { UploadProps } from 'antd/lib/upload/interface';

import axios from "axios"

const { Dragger } = Upload;


interface UploadStepProps {
  getUrlFile: (fileUrl: string) => void;
  id: string;
}

const deleteFile = async (id: string) => {
  await axios.delete(`/api/upload/files/${id}`)
}
const FinalReviewStep: FC<UploadStepProps> = ({ getUrlFile, id, }) => {
  const [fileUrl, setFileUrl] = useState<string>('');
  // const [updateApplication] = useUpdateApplicationMutation();
  // const [createNotification] = useCreateNotificationMutation()
  const [idFile, setIdFile] = useState('')
  const tutorId = useApplicationsQuery({ variables: { filter: { id: { eq: id}}}})?.data?.applications?.data[0].attributes?.reviewer?.data?.id
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
    //         stage: 'In_Progress_Final',
    //         final_draft: idFile

    //       },
    //     },
    //   });
    //   sendNotification()
    // } catch (error) {
    //   console.error('Update application error:', error);
    // }
  };

  const sendNotification = () => {
    // try {
    //   createNotification({
    //     variables: {

    //       input: {
    //         action: "has uploaded",
    //         is_read: false,
    //         application: id,
    //         is_from_student: true,
    //         tutor: tutorId

    //       },
    //     },
    //   });

    // } catch (error) {
    //   console.error('Update application error:', error);
    // }
  }

  return (
    <React.Fragment>
      <div className={"steps-upload"}>
        <p className={"steps-upload-text"}>
          Here you can upload your renewed application file for final reviewing.
        </p>
        <p className={"steps-upload-text"}>Supported file formats: PDF, DOC, DOCX</p>

        <div className={"upload-title"}>
          <p className={"upload-text"}>* Upload your Application</p>
          <QuestionIcon className={"upload-title-icon"} />
          <span style={{ marginLeft: '5px' }}>:</span>
        </div>
        <Dragger style={{display: fileUrl !== "" ? "none" : "block"}} className={"steps-upload-field"} name={"file"} {...props}>
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

      </div>
    </React.Fragment>
  );
};

export default FinalReviewStep;
