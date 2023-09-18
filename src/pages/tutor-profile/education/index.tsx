import { MinusCircleOutlined,PlusOutlined } from "@ant-design/icons";
import { AutoComplete,Button,Form,Input,Select,Space } from "antd";
import React,{ FC,useRef,useState } from "react";
import TutorService from "../../../api/services/Tutor";
import {useTutor, useTutorDispatch} from "../../../api/providers/TutorProvider";
import "./index.less";

const Education: FC<Any> = ({ props }) => {
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const [editing, setEditing] = useState(false)
  const { Option } = Select
  const optionsSchools: string[] = [
    "James Cook University",
    "The University of Melbourne",
    "Medicine Academy",
    "The University of Sydney",
    "The University of Queensland",
    "Monash University",
    "The University of New South Wales",
    "Australian National University",
    "University of Western Australia",
    "University of Adelaide",
    "University of Technology Sydney",
    "University of Newcastle",
    "University of Wollongong",
  ]
  const optionsDegrees: string[] = ["MBBS", "MD", "DO", "BDS", "DVM", "DPharm", "BPT"]
  
  const handleEditClick = (e) => {
    setEditing(true);
    e.preventDefault();
  }

  const updatedTutor =  async (formData) => {
    const res = await TutorService.updateProfile({
     educations:formData.educations
    });
    if(res.success){
      dispatch({
        type:"updateEducations",
        educations:res.data.data.educations.map((edu) => ({school : edu.school?? "", degree:edu.degree ?? ""}))
      })
    }else{
      console.log(res.message);
    }
    
  }
  const onFinish = (values: any) => {
    updatedTutor(values);
    setEditing(false);
  };

  return (
    <div className={"education-section"}>
      <h2 className={"education-section-title"}>Education</h2>
      <Form className={"education-form"} onFinish={onFinish}  initialValues={{ educations: tutor?.educations.length > 0 ? tutor.educations : [{school:"" , degree:""}] }}>
        <Form.List name={"educations"}>
          {(fields, { add, remove }) => (
            <React.Fragment>
              {fields.map(({ key, name, ...restField }) => (
                <React.Fragment key={key}>
                  {/* <Form.Item hidden name={[name, "id"]} {...restField}>
                    <Input type={"hidden"} />
                  </Form.Item> */}
                  <Form.Item
                    {...restField}
                    name={[name, "school"]}
                    rules={[{ required: true, message: "Please enter your school" }]}
                    label={"School"}
                  >
                    <Select
                      options={optionsSchools.map(option => ({ value: option }))}
                      style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
                      placeholder={"Enter a value"}
                      disabled={!editing}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "degree"]}
                    rules={[{ required: true, message: "Please enter your degree" }]}
                    label={"Degree"}
                  
                  >
                    <Select
                      options={optionsDegrees.map(option => ({ value: option }))}
                      style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
                      placeholder={"Enter a value"}
                      disabled={!editing}
                    />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <div style={{ justifyContent: "right", display: "flex", marginBottom: "10px" }}>
                    {editing && <MinusCircleOutlined  style={{ fontSize: "24px" }} onClick={() => remove(name)} />}
                  </div>
                  ): null}
                </React.Fragment>
              ))}
              <div className={"education-form-item add-item-btn"} style={{marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "left" }}>
                  <Button disabled={!editing} onClick={() => add()} icon={<PlusOutlined />}>Add Education</Button>
                </div>
              </div>
            </React.Fragment>
          )}
        </Form.List>
        <div className={"education-button-wrap"}>
          {editing ? (
            <Form.Item>
              <Button className={"form-button"} htmlType={"submit"}>Save</Button>
            </Form.Item>
          ) : (
            <Form.Item>
              <Button className={"form-button"} htmlType={"button"} onClick={handleEditClick}>Edit</Button>
            </Form.Item>
          )}
        </div>
      </Form>
    </div>
  )
}
export default Education
