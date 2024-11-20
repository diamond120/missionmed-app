
import "./index.less"
import { useState } from "react";
import { Avatar, Button, message, Spin, Upload } from "antd"
import { UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { FC } from "react";
import { RcFile, UploadProps } from "antd/lib/upload/interface"
import { getToken } from "../../../common/common";
import { BASE_URL } from "../../../config/app-config";
import TutorService from "../../../api/services/Tutor";
import {  useTutor, useTutorDispatch } from "../../../api/providers/TutorProvider";
import confirm from "../../../components/confirm";
import ChangePassword from "../../change-password";
import Reminders from "../reminders";

const ProfilePicture: FC<Any> = ({ props }) => {
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const [fileUrl, setFileUrl] = useState<string>(tutor?.profilePicture ?? '');
  const [uploading, setUploading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const uploadProps: UploadProps = {
    name: 'file',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    multiple: false,
    maxCount: 1,
    accept: 'image/jpeg, image/png, image/svg+xml',
    action: `${BASE_URL}/upload`,
    beforeUpload: (file: RcFile) => {
      const pattern = /\.(jpg|jpeg|png|svg)$/i;
      const isImage = pattern.test(file.name);
      if (!isImage) {
        setIsChanged(false)
        message.error("You can only upload JPG, SVG, or PNG !");
        return false;
      } 
     return isImage;
    },
    onChange: (info) => {
      const { status, percent } = info.file;
      if (status === 'uploading') {
        setUploading(true);
        return;
      }
      if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
      if (status === 'done' && percent === 100) {
        if(info.file.response && info.file.response.success){
          setFileUrl(info.file.response.data);
          message.success(`${info.file.name} file upload success.`)
        }else{
          message.error(`${info.file.name} file upload failed.`);
        }
      }
      setUploading(false);
    },
    onRemove() {
  
    }
  }

  const handleOnChange = () => {
    setIsChanged(!isChanged);
  };

  const handleRemove = async()=>{
    const handleConfirm = async () => {
      setFileUrl("")
      setIsChanged(false);
      await TutorService.updateProfile({
        profilePicture: ""
      })
      dispatch({
        type:"update",
        tutor:{
          profilePicture:""
        }
      })
    };
    await confirm(handleConfirm, "Are you sure?", "You want to delete profile picture!");
  };

  const handleSave = ()=>{
    updatedTutor()
    handleOnChange()
  }

  const updatedTutor =  async () => {
    await TutorService.updateProfile({
      profilePicture: fileUrl
    })
    dispatch({
      type:"update",
      tutor:{
        profilePicture:fileUrl
      }
    })
  }

  if(tutor?.loading){
    return(
      <Spin />
    )
  }
  
  return (
    <div className={"tutor-profile-picture-section"}>
      <h2 className={"profile-picture-title"}>Profile Picture</h2>
      <div className={"profile-picture-wrap"}>
        <div className={"profile-picture-block"}>
          <Avatar
            size={140}
            icon={<UserOutlined />}
            src={fileUrl}
            style={{ marginBottom: "16px" }}
          />
          <p className={"profile-picture-block-text"} >
            You can upload JPG, SVG, or PNG file (max. 300x300px)
          </p>
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
            <Upload
              showUploadList={false}
              {...uploadProps}
            >
              { !isChanged && <Button onClick={handleOnChange} className={"profile-picture-block-btn-change"}>Change</Button>}

            </Upload>
            { isChanged && (uploading ? <Button className={"profile-picture-block-btn-change"} icon={<LoadingOutlined /> }>Loading...</Button>  : <Button  onClick={handleSave} className={"profile-picture-block-btn-change"}>Save</Button>)}
            <Button onClick={handleRemove} disabled={fileUrl==""} className={"profile-picture-block-btn-remove"}>
              Remove
            </Button>
          </div>
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
            <ChangePassword title='Change Password' moduleType={"tutor"}/>
          </div>
        </div>
      </div>
      <Reminders />
    </div>
  );
};

export default ProfilePicture;







