import "./index.less"
import { Button, Form, Input, Spin } from "antd"
import { FC, useState } from "react"
import TutorService from "../../../api/services/Tutor";
import {useTutor, useTutorDispatch} from "../../../api/providers/TutorProvider";

const BiographyTutor: FC<ANY> = ({props}) => {
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const [editing, setEditing] = useState(false);
  const [biography,setBiography] = useState<string | undefined | null>("")

  const updatedTutor = async() => {
    await TutorService.updateProfile({
      addBiography: true,
      biography: biography !== '' ? biography: tutor?.biography,
    })
    dispatch({
      type:'update',
      tutor:{
        biography: biography !== '' ? biography: tutor?.biography
      }
    })
  }

  const handleEditClick = () => {
    setEditing(true);
  };

  const  cancle = () => {
    setEditing(false);
  }

  const handleSaveClick =() => {
    updatedTutor();
    setEditing(false);
  };

  if(tutor?.loading){
    return(
      <Spin />
    )
  }

  return(
    <div className={"biography-tutor-section"}>
      <h2 className={"biography-section-title"}>Biography</h2>
      <div className={"biography-wrap"}>
        <p className={"biography-text"}>You can write about your degrees, years of experience, industry, or skills. People also talk about their achievements or previous job experiences.</p>
        <Input.TextArea className={"biography-input"} placeholder={"Input your text here"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} defaultValue={tutor?.biography ?? ''}  onChange={e => setBiography(e.target.value)} />
        {editing ? (
          <>
           <Form.Item>
            <div className={"form-button-wrap"}>
              <Button className={"form-button"} onClick={handleSaveClick}>Save</Button>
              <Button className={"form-button button-space"} onClick={cancle}>
          Cancel
          </Button>
            </div>
            
          </Form.Item>
        
          </>
        ) : (
          <Form.Item>
            <div className={"form-button-wrap"}>
              <Button className={"form-button"} onClick={handleEditClick}>Edit</Button>
            </div>
          </Form.Item>
        )}
      </div>

    </div>
  )
}
export default BiographyTutor