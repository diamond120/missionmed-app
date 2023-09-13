import "./index.less"
import { Button, Form, Input } from "antd"
import { FC, useState } from "react"
//import { useUpdateStudentMutation } from "../../../graphql"


const Biography: FC<{student: Student, id: string}> = ({student, id}) => {
  const [editing, setEditing] = useState(false);
  const [biography,setBiography] = useState<string | undefined | null>("")
  //const [ updateStudent ] = useUpdateStudentMutation()
  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick =() => {
   // updatedStudent()
    setEditing(false);
  };
  // const updatedStudent = async () => {
  //   await updateStudent({
  //     variables: {
  //       id: id!,
  //       input: {
  //         biography: biography !== '' ? biography : student?.full_name,

  //       }
  //     }
  //   })
  // }
  return(
    <div className={"biography-section"}>
      <h2 className={"biography-section-title"}>Biography</h2>
      <div className={"biography-wrap"}>
        <p className={"biography-text"}>Here you can add notable experiences that you have had in the past.</p>
        <Input.TextArea className={"biography-input"} placeholder={"Input your text here"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} defaultValue={student?.biography ?? ''}  onChange={e => setBiography(e.target.value)} />
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
export default Biography