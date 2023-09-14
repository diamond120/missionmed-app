import { MinusCircleOutlined,PlusOutlined } from "@ant-design/icons";
import { AutoComplete,Button,Form,Input,Select,Space } from "antd";
import React,{ FC,useRef,useState } from "react";
import * as Utility from "../../../common/utility";
// import { useUpdateTutorMutation } from "../../../graphql";
import "./index.less";

const Education: FC<{ tutor: Tutor; id: string }> = ({ tutor, id }) => {
  const [editing, setEditing] = useState(false)
  // const [updateTutor] = useUpdateTutorMutation()
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
   const data = Utility.recursiveToSnake(formData);
    // await updateTutor({
    //   variables: {
    //     id: id!,
    //     input: data
    //   }
    // })
  }
  const onFinish = (values: any) => {
    updatedTutor(values);
    setEditing(false);
  };

  return (
    <div className={"education-section"}>
      <h2 className={"education-section-title"}>Education</h2>
      <Form className={"education-form"} onFinish={onFinish}  initialValues={{ education: tutor?.education.length > 0 ? Utility.recursiveToCamel(tutor.education) : [{schoolName:"" , degreeTitle:""}] }}>
        <Form.List name={"education"}>
          {(fields, { add, remove }) => (
            <React.Fragment>
              {fields.map(({ key, name, ...restField }) => (
                <React.Fragment key={key}>
                  <Form.Item hidden name={[name, "id"]} {...restField}>
                    <Input type={"hidden"} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "schoolName"]}
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
                    name={[name, "degreeTitle"]}
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
                  <div style={{ justifyContent: "right", display: "flex", marginBottom: "10px" }}>
                    {editing && <MinusCircleOutlined  style={{ fontSize: "24px" }} onClick={() => remove(name)} />}
                  </div>
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
