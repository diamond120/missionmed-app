import "./index.less"
import { Button, Form, Input, Spin } from "antd"
import { FC, useState } from "react"
import TutorService from "../../../api/services/Tutor";
import { useTutor, useTutorDispatch } from "../../../api/providers/TutorProvider";
import { Editor } from '@tinymce/tinymce-react';
import { TINYMCE_API_KEY } from "../../../config/app-config"

const BiographyTutor: FC<ANY> = ({ props }) => {
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const [editing, setEditing] = useState(false);
  const [biography, setBiography] = useState<string | undefined | null>("")
  const [form] = Form.useForm();

  const updatedTutor = async () => {
    await TutorService.updateProfile({
      addBiography: true,
      biography: biography !== '' ? biography : tutor?.biography,
    })
    dispatch({
      type: 'update',
      tutor: {
        biography: biography !== '' ? biography : tutor?.biography
      }
    })
  }

  const handleEditClick = () => {
    setEditing(true);
  };

  const cancle = () => {
    form.resetFields();
    setEditing(false);
  }

  const handleSaveClick = () => {
    updatedTutor();
    setEditing(false);
  };

  if (tutor?.loading) {
    return (
      <Spin />
    )
  }

  return (
    <div className={"biography-tutor-section"}>
      <h2 className={"biography-section-title"}>Biography</h2>
      <Form form={form} className="biographyForm">
        <div className={"biography-wrap"}>
          <p className={"biography-text"}>You can write about your degrees, years of experience, industry, or skills. People also talk about their achievements or previous job experiences.</p>

          <Form.Item
            name={"bio"}
          >
            <Editor
              apiKey={TINYMCE_API_KEY}
              disabled={!editing}
              initialValue={tutor?.biography ?? ''}
              onEditorChange={(content) => {
                setBiography(content)
              }}
            />
          </Form.Item>
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
      </Form>
    </div>
  )
}

export default BiographyTutor