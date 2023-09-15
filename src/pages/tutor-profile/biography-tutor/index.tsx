import "./index.less"
import { Button, Form, Input } from "antd"
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

  const handleSaveClick =() => {
    updatedTutor();
    setEditing(false);
  };

  return(
    <div className={"biography-tutor-section"}>
      <h2 className={"biography-section-title"}>Biography</h2>
      <div className={"biography-wrap"}>
        <p className={"biography-text"}>You can write about your degrees, years of experience, industry, or skills. People also talk about their achievements or previous job experiences.</p>
        <Input.TextArea className={"biography-input"} placeholder={"Input your text here"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} defaultValue={tutor?.biography ?? ''}  onChange={e => setBiography(e.target.value)} />
        {editing ? (
          <Form.Item>
            <div className={"form-button-wrap"}>
              <Button className={"form-button"} onClick={handleSaveClick}>Save</Button>
            </div>
          </Form.Item>
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