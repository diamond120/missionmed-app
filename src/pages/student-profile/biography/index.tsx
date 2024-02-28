import "./index.less"
import { Button, Form, Input, Spin } from "antd"
import { FC, useState } from "react"
import { useStudent, useStudentDispatch } from "../../../api/providers/StudentProvider";
import { default as StudentService } from "../../../api/services/Student";
import { Editor } from '@tinymce/tinymce-react';
import { TINYMCE_API_KEY } from "../../../config/app-config"

const Biography: FC<any> = ({props}) => {
  const student = useStudent();
  const dispatch = useStudentDispatch();
  const [editing, setEditing] = useState(false);
  const [biography,setBiography] = useState<string | undefined | null>("")
  const [form] = Form.useForm();

  const handleEditClick = () => {
    setEditing(true);
  };
  
  const handleSaveClick =() => {
    updatedStudent()
    setEditing(false);
  };

  const updatedStudent = async () => {
    await StudentService.updateProfile({
      addBiography: true,
      biography: biography !== '' ? biography : student?.biography,
    })
    dispatch({
      type:"update",
      student:{
        biography: biography !== '' ? biography : student?.biography,
      }
    })
  }

  const  cancle = () => {
    form.resetFields();
    setEditing(false);
  }

  if(student?.loading){
    return(
      <Spin />
    )
  }
 
  return(
    <div className={"biography-section"}>
      <h2 className={"biography-section-title"}>Biography</h2>
      <Form form={form}  className="biographyForm" >
      <div className={"biography-wrap"}>
        <p className={"biography-text"}>Here you can add notable experiences that you have had in the past.</p>
        <Form.Item
          name={"bio"}
          >
             <Editor
              apiKey={TINYMCE_API_KEY}
              disabled={!editing}
              initialValue={student?.biography ?? ''}
              onEditorChange={(content) => {
                setBiography(content)
              }}
            />
        </Form.Item>
        {editing ? (
          <Form.Item>
            <div className={"form-button-wrap"}>
              <Button className={"form-button"} onClick={handleSaveClick}>Save</Button>
              <Button className={"form-button button-space"} onClick={cancle}>
                  Cancel
              </Button>
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
      </Form>
    </div>
  )
}

export default Biography