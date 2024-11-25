import "./index.less";
import { Button, Form, Upload, message } from "antd";
import { QuestionCircleOutlined, PaperClipOutlined } from "@ant-design/icons";
import { ReactComponent as UploadDragIcon } from "../../../components/icon/assets/upload-drag.svg";
import type { UploadProps } from "antd";
import { RcFile } from "antd/lib/upload";
import { useState } from "react";
import { getToken, fileName } from "../../../common/common";
import { BASE_URL } from "../../../config/app-config";
import confirm from "~/components/confirm";
import axios from "axios";

const SessionSummary = ({ uploadReport, reportUrl, sessionId }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [form] = Form.useForm();
  const [reUpload, setReUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadProps: UploadProps = {
    accept: ".doc,.docx,.pdf",
    action: `${BASE_URL}/upload/report`,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    name: "file",
    maxCount: 1,
    beforeUpload: (file: RcFile) => {
      const extension = file.name.split(".").pop();

      const isDocOrPdf = extension === "pdf" || extension === "doc" || extension === "docx";
      if (!isDocOrPdf) {
        setFileList([]);
        message.error("You can only upload PDF,DOC or DOCX file!");
      } else {
        setFileList([file]);
      }
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   message.error('Image must smaller than 2MB!');
      // }
      // return isDocOrPdf && isLt2M;
      return isDocOrPdf;
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    onChange: (info) => {
      const { status, percent } = info.file;
      if (status === "uploading") {
        setUploading(true);
        return;
      }
      if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      if(status === "done"){
        if(info.file.response && info.file.response.success){
          setFileUrl(info.file.response.data);
          message.success(`${info.file.name} file upload success.`)
        }else{
          message.error(`${info.file.name} file upload failed.`);
        }
      }
      setUploading(false);
    },
    fileList,
  };

  const handleSubmit = () => {
    setUploading(true);
    uploadReport(fileUrl).then(() => {
      setFileList([])
      setFileUrl("")
      setUploading(false);
      setReUpload(false);
    });
  };
  const handleReUpload = () => {
    setReUpload(true);
    setFileList([]);
  };

  const handleRemove = async(sessionId: number, reportUrl: string) => {
    const handleConfirm = async () => {
      await axios.post(`${BASE_URL}/delete/report`, {
        sessionId,
        reportUrl
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        }
      });
      setFileUrl("")
      setReUpload(true);
      setFileList([])
    };
    await confirm({handleOk: handleConfirm, title: 'Are you sure?', content: 'You want to delete session summary!' })
  };
  return (
    <>
      <div className={"session-summary con-box"}>
        <h2 className={"secondary-title"}>Session Summary </h2>
        <div className={"con-box-wrap"}>
          <ul style={{ marginBottom: "24px" }}>
            <li>Here you can upload session summary.</li>
            <li>Supported file formats: <b>PDF, DOC, DOCX</b></li>
            <li>Maximum file size: <b>10MB</b></li>
          </ul>

          <div style={{ marginBottom: "16px" }}>
            <span style={{ color: "#C92A2A" }}>*</span> Upload Session Summary{" "}
            <QuestionCircleOutlined
              style={{ color: "#B5B9C9", fontSize: "14px", marginLeft: 3 }}
            />{" "}
            :
          </div>
          {!reportUrl || reUpload == true ? (
            <Form form={form}>
              <Form.Item valuePropName="report">
                <Upload {...uploadProps} className={"upload-file"}>
                  {fileList.length == 0 && (
                    <div>
                      <span className="upload-icon">
                        <UploadDragIcon />
                      </span>
                      <div
                        style={{
                          marginTop: 13,
                          fontSize: "16px",
                          color: "#312D42",
                        }}
                      >
                        Click or drag file to this area to upload{" "}
                      </div>
                      <div style={{ marginTop: 3, color: "#9096AE" }}>
                        Support for a single or bulk upload.
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                {(fileList.length == 0 || fileUrl== "") ? (
                  <Button
                    key="submit"
                    disabled={true}
                    className={"secondary-button"}
                    loading={uploading}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    key="submitSummary"
                    disabled={fileList.length == 0 || uploading}
                    loading={uploading}
                    className={"secondary-button"}
                    onClick={handleSubmit}
                  >
                    Submit Summary
                  </Button>
                )}
              </Form.Item>
            </Form>
          ) : (
            <div>
              <div>
                <PaperClipOutlined />
                {fileName(reportUrl)}
              </div>
              <div style={{marginTop:10,display:"flex",justifyContent:"start",gap:10}}>
                <Button
                  key="download"
                  href={reportUrl}
                  target="_blank"
                  className={"secondary-button"}
                >
                  Download
                </Button>
  
                <Button
                  key="reUpload"
                  className={"secondary-button"}
                  onClick={handleReUpload}
                >
                  Re-upload
                </Button>
                <Button onClick={() => handleRemove(sessionId, reportUrl)} className={"secondary-button"} style={{backgroundColor: 'red', color: 'white'}}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SessionSummary;
