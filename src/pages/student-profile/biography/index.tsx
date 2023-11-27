import "./index.less"
import { Button, Form, Input, Spin } from "antd"
import { FC, useState } from "react"
import {useStudent, useStudentDispatch} from "../../../api/providers/StudentProvider";
import {default as StudentService} from "../../../api/services/Student";

const Biography: FC<any> = ({props}) => {
  const student = useStudent();
  const dispatch = useStudentDispatch();
  const [editing, setEditing] = useState(false);
  const [biography,setBiography] = useState<string | undefined | null>("")
  //const [ updateStudent ] = useUpdateStudentMutation()
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
        <Input.TextArea className={"biography-input"} placeholder={"Input your text here"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} defaultValue={student?.biography ?? ''}  onChange={e => setBiography(e.target.value)} />
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