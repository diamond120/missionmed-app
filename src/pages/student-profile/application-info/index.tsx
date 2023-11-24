import "./index.less"
import { AutoComplete, Button, Form, InputNumber, Select, Spin } from "antd"
import { FC, useState } from "react"
import {useStudent, useStudentDispatch} from "../../../api/providers/StudentProvider";
import {useProfileStaticDataContext} from "../../../api/context/ProfileStaticDataContext";
import StudentService from "../../../api/services/Student";

const ApplicationInfo: FC<any> = ({props}) => {
  const student = useStudent();
  const dispatch = useStudentDispatch();
    const profileStaticData = useProfileStaticDataContext();

  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [applCycle, setApplCycle] = useState<string | undefined | null>(student.applicantCycle)
  const [applType, setApplType] = useState<string | undefined | null>(student.applicantTypeId)
  const [atar, setAtar] = useState<string | undefined | null>("")
  const [gpa, setGpa] = useState<string | undefined | null>("")

  const optionsApplicantCycle: string[]= [
    "2022 / 2023",
    "2021 / 2022",
    "2020 / 2021",
  ]
  const optionsApplicantType: string[]= profileStaticData.applicantType;

  const handleEditClick = () => {
    setEditing(true);
  };

  const updatedStudent = async () => {
    await StudentService.updateAppInfo({
      applicantCycle: applCycle !== '' ? applCycle : student?.applicantCycle,
      applicantTypeId: applType !== '' ? applType : student?.applicantTypeId,
      atar: atar !== '' ? atar: student?.atar,
      gpa: gpa !== '' ? gpa : student?.gpa,
    })

    dispatch({
      type:"update",
      student:{
        applicantCycle: applCycle !== '' ? applCycle : student?.applicantCycle,
        applicantTypeId: applType !== '' ? applType : student?.applicantTypeId,
        atar: atar !== '' ? atar: student?.atar,
        gpa: gpa !== '' ? gpa : student?.gpa,
      }
    })
  }

  const handleSaveClick = async () => {
    try{
      await form.validateFields();
      updatedStudent()
      setEditing(false);
    }catch(e){
      console.log(e);
      return false;
    }
  }; 

  const cancle = () => {
    form.resetFields();
    setEditing(false);
  }

  if(student?.loading){
    return(
      <Spin />
    )
  }

  const handleFilter = (inputValue: string, option: any) =>
    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
  return(
    <div className={"application-info-section"}>
      <h2 className={"application-info-section-title"}>Application Information</h2>
        <Form className={"application-info-form"} form={form}>

          <Form.Item
            name={"Applicant Cycle"}
            rules={[{ required: true, }]}
            label={"Applicant Cycle"}
            initialValue={student.applicantCycle}
          > 
            <AutoComplete
              options={optionsApplicantCycle && optionsApplicantCycle.map((option) => ({ value: option}))}
              style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
              placeholder={"Enter a value"}
              filterOption={handleFilter}
              value={applCycle}
              disabled={!editing}
              onChange={(value) => {setApplCycle(value); form.setFieldValue('Applicant Cycle',value )}}

            />
          </Form.Item>
          <Form.Item
            name={"Applicant type"}
            label={"Applicant Type"}
            rules={[{ required: true, }]}
            initialValue={student.applicantTypeId}
          >
              <Select
                options={optionsApplicantType && optionsApplicantType.map((option) => ({ value: option.id , label:option.title}))}
                style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
                placeholder={"Enter a value"}
                value={applType}
                disabled={!editing}
                onChange={(value) => {setApplType(value);  form.setFieldValue('Applicant type',value ) } }

              />
          </Form.Item>
          <Form.Item
            name={"predicted"}
            rules={[
              { required: false, },
              {
                pattern: /^[\d]{0,8}$/,
                message: "Value should be less than 8 character"
              }
            ]}
            label={"Predicted ATAR / ATAR"}
          >
            <InputNumber stringMode={true} parser={(value) => value!.replace(/\$\s?|(,*)/g, '')} className={"input"} disabled={ !editing } defaultValue={student?.atar ?? ''} style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} onChange={(value) => setAtar(value) } />
          </Form.Item>
          <Form.Item
            name={"gpa"}
            rules={[{ required: false, }]}
            label={"GPA"}
          >
            <InputNumber stringMode={true} parser={(value) => value!.replace(/\$\s?|(,*)/g, '')} className={"input"} disabled={ !editing } defaultValue={student?.gpa ?? ''} style={{color: !editing? "#bfbfbf" : "",backgroundColor: !editing? "#f5f5f5" : ""}} onChange={value => setGpa(value)} />
          </Form.Item>
          {editing ? (

            <div className={"form-basic-button-wrap"}>
              <Button className={"form-button"} onClick={handleSaveClick}>Save</Button>
              <Button className={"form-button button-space"} onClick={cancle}>
                Cancel
              </Button>
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