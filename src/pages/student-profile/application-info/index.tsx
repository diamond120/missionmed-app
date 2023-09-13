import "./index.less"
import { AutoComplete, Button, Form, InputNumber, Select } from "antd"
import { FC, useState } from "react"
import { useUpdateStudentMutation } from "../../../graphql"


const ApplicationInfo: FC<{student: Student, id: string}> = ({student,id}) => {
  const { Option } = Select;
  const [ updateStudent ] = useUpdateStudentMutation()
  const [editing, setEditing] = useState(false);
  const [applCycle, setApplCycle] = useState<string | undefined | null>(student.applicant_cycle)
  const [applType, setApplType] = useState<string | undefined | null>(student.applicant_type)
  const [atar, setAtar] = useState<string | undefined | null>("")
  const [gpa, setGpa] = useState<string | undefined | null>("")
  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick =() => {
    updatedStudent()
    setEditing(false);

  };

  const updatedStudent = async () => {
    await updateStudent({
      variables: {
        id: id!,
        input: {
          applicant_cycle: applCycle !== '' ? applCycle : student?.applicant_cycle,
          applicant_type: applType !== '' ? applType : student?.applicant_type,
          predicted_atar: atar !== '' ? atar: student?.predicted_atar,
          gpa: gpa !== '' ? gpa : student?.gpa,
        }
      }
    })
  }

  const optionsApplicantCycle: string[]= [
    "2022 / 2023",
    "2021 / 2022",
    "2020 / 2021",
  ]
  const optionsApplicantType: string[]= [
    "High School Leaver",
    "High School Leaver",
  ]
  const handleFilter = (inputValue: string, option: any) =>
    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
  return(
    <div className={"application-info-section"}>
      <h2 className={"application-info-section-title"}>Application Information</h2>
        <Form className={"application-info-form"}>

          <Form.Item
            name={"Applicant Cycle"}
            rules={[{ required: false, }]}
          >
            <div className={"application-info-form-item"}>
              <p className={"label"}>Applicant Cycle*</p>
              <AutoComplete
                options={optionsApplicantCycle.map((option) => ({ value: option }))}
                style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
                placeholder={"Enter a value"}
                filterOption={handleFilter}
                value={applCycle}
                disabled={!editing}
                onChange={(value) => setApplCycle(value)}

              />
            </div>
          </Form.Item>
          <Form.Item
            name={"Applicant type"}
            rules={[{ required: false, }]}
          >
            <div className={"application-info-form-item"}>
              <p className={"label"}>Applicant Type*</p>
              <AutoComplete
                options={optionsApplicantType.map((option) => ({ value: option }))}
                style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
                placeholder={"Enter a value"}
                filterOption={handleFilter}
                value={applType}
                disabled={!editing}
                onChange={(value) => setApplType(value)}

              />
            </div>
          </Form.Item>
          <Form.Item
            name={"predicted"}
            rules={[{ required: false, }]}
          >
            <div className={"application-info-form-item"}>
              <p className={"label"}>Predicted ATAR / ATAR</p>
              <InputNumber stringMode={true} parser={(value) => value!.replace(/\$\s?|(,*)/g, '')} className={"input"} disabled={ !editing } defaultValue={student?.predicted_atar ?? ''} style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} onChange={(value) => setAtar(value) } />
            </div>
          </Form.Item>
          <Form.Item
            name={"gpa"}
            rules={[{ required: false, }]}
          >
            <div className={"application-info-form-item"}>
              <p className={"label"}>GPA</p>
              <InputNumber stringMode={true} parser={(value) => value!.replace(/\$\s?|(,*)/g, '')} className={"input"} disabled={ !editing } defaultValue={student?.gpa ?? ''} style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} onChange={value => setGpa(value)} />
            </div>
          </Form.Item>
          {editing ? (

            <div className={"form-basic-button-wrap"}>
              <Button className={"form-button"} onClick={handleSaveClick}>Save</Button>
            </div>

          ) : (

            <div className={"form-basic-button-wrap"}>
              <Button className={"form-button"} onClick={handleEditClick}>Edit</Button>
            </div>

          )}
        </Form>
    </div>
  )
}
export default ApplicationInfo