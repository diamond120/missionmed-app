
import "./index.less"
import { useState } from "react";
import { Avatar, Button, message, Upload } from "antd"
import { UserOutlined } from "@ant-design/icons";
import { FC } from "react";
import { UploadProps } from "antd/lib/upload/interface"
import { getToken } from "../../../common/common";
import { BASE_URL } from "../../../config/app-config";
import TutorService from "../../../api/services/Tutor";
import {useTutor, useTutorDispatch} from "../../../api/providers/TutorProvider";

const ProfilePicture: FC<Any> = ({ props }) => {
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const [fileUrl, setFileUrl] = useState<string>(tutor?.profilePicture ?? '');
  //const [idFile, setIdFile] = useState('')
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
    onChange: (info) => {
      !!info.file.response && !!info.fileList.length ? setFileUrl(info.file.response.data) : setFileUrl('')
      // !!info.file.response && setIdFile(info.file.response[0].id)
      const { status, percent } = info.file;
      if (status === 'uploading' && percent === 100) {
        message.success(`${info.file.name} file upload success.`)
      }
      if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onRemove() {
  
    }
  }

  const handleOnChange = () => {
    setIsChanged(!isChanged);
  };
  const handleRemove = async()=>{
    setFileUrl("")
    await TutorService.updateProfile({
      profilePicture: ""
    })
    dispatch({
      type:"update",
      tutor:{
        profilePicture:""
      }
    })
  }
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
            { isChanged && <Button onClick={handleSave} className={"profile-picture-block-btn-change"}>Save</Button>}
            <Button onClick={handleRemove} className={"profile-picture-block-btn-remove"}>
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;







