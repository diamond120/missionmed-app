
import "./index.less";
import { Form, Select, Radio, Button, Spin } from "antd"
import { QuestionCircleFilled } from "@ant-design/icons";
import { FC, useState } from "react";
import {useStudent, useStudentDispatch} from "../../../api/providers/StudentProvider";
import StudentService from "../../../api/services/Student";

const ExtraInfo: FC<any> = ({props}) => {
  const student = useStudent();
  const dispatch = useStudentDispatch();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [residenceStatus, setResidenceStatus] = useState<string | null | undefined>(student.statusOfResidence);
  const [specification, setSpecification] = useState<string | null | undefined>(student.specification);
  const [atsi, setAtsi] = useState<any>(student.atsi);
  const [rural, setRural] = useState<any>(student.rural);
  const [financialHardship, setFinancialHardship] = useState<any>(student.financialHardship);
  const [gws, setGws] = useState<any>(student.gws);
  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    updatedStudent()
    setEditing(false);
  };

  const updatedStudent = async () => {
    await StudentService.updateAppInfo({
      statusOfResidence: residenceStatus !== '' ? residenceStatus: student?.statusOfResidence,
      specification: specification !== '' ? specification: student?.specification,
      atsi: atsi !== '' ? atsi : student?.atsi,
      rural: rural!== '' ? rural : student?.rural,
      financialHardship: financialHardship !== '' ? financialHardship : student?.financialHardship,
      gws: gws !== '' ? gws : student?.gws,
    })
    dispatch({
      type:"update",
      student:{
        statusOfResidence: residenceStatus !== '' ? residenceStatus: student?.statusOfResidence,
        specification: specification !== '' ? specification: student?.specification,
        atsi: atsi !== '' ? atsi : student?.atsi,
        rural: rural!== '' ? rural : student?.rural,
        financialHardship: financialHardship !== '' ? financialHardship : student?.financialHardship,
        gws: gws !== '' ? gws : student?.gws,
      }
    })
  }

  const cancle = () => {
    setResidenceStatus(student?.statusOfResidence);
    setSpecification(student?.specification);
    setAtsi(student?.atsi);
    setRural(student?.rural);
    setFinancialHardship(student?.financialHardship);
    setGws(student?.gws);
    form.resetFields();
    setEditing(false);
  }

  const optionsSpecification: string[]= [
    "Citizen",
    "Permanent Resident",
    "Other",
  ]
  if(student?.loading){
    return(
      <Spin />
    )
  }
  
  const handleFilter = (inputValue: string, option: any) =>
    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
  return (
    <div className={"extra-info-section"}>
      <h2 className={"extra-info-section-title"}>
        Extra Information <QuestionCircleFilled style={{ color: "#6B7393" }} title={"Extra Information"} />
      </h2>
      <Form className={"extra-info-form"} form={form} colon={false}>
        <Form.Item label={"Status of Residence"} name={"status"} rules={[{ required: false }]}>
            <Radio.Group disabled={!editing} defaultValue={residenceStatus} onChange={(e) => setResidenceStatus(e.target.value)}>
              <Radio value={"I’m Domestic"}>I’m Domestic</Radio>
              <Radio value={"I’m International"}>I’m International</Radio>
            </Radio.Group>
        </Form.Item>

        {residenceStatus === "I’m Domestic" && (
          <div>

            <Form.Item
              name={"specification"}
              label={"Specification"}
              rules={[{ required: true, }]}
            >
              <input type="hidden" value={specification} ></input>
              <Select
                options={optionsSpecification.map((option) => ({ value: option }))}
                style={{ width: 328, color: !editing ? "#bfbfbf" : "" }}
                placeholder={"Enter a value"}
                filterOption={handleFilter}
                value={specification? specification :undefined }
                disabled={!editing}
                onChange={(value) => setSpecification(value)}

              />
            </Form.Item>
            <Form.Item 
              name={"aboriginal"} 
              rules={[{ required: false }]}
              className="aboriginal-torres"
              >
              <div className={"extra-info-form-item"}>
                <p className={"label"}>Aboriginal and <br/> Torres Strait <br/> Islander <br/> Applicant (ATSI)<br/> i.e. Indigenous</p>
                <Radio.Group disabled={!editing} defaultValue={atsi} onChange={(e) => setAtsi(e.target.value)}>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </div> 
            </Form.Item>
            
            <Form.Item label={"Rural"} name={"rural"} rules={[{ required: false }]}>
              <Radio.Group disabled={!editing} defaultValue={rural} onChange={(e) => setRural(e.target.value)}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item label={"Financial Hardship"} name={"financial"} rules={[{ required: false }]}>
              <Radio.Group disabled={!editing} defaultValue={financialHardship} onChange={(e) => setFinancialHardship(e.target.value)}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label={"GWS (Greater Western Sydney)"} name={"gws"} rules={[{ required: false }]}>
              <Radio.Group disabled={!editing} defaultValue={gws} onChange={(e) => setGws(e.target.value)}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        )}

        {editing ? (
          <div className={"form-basic-button-wrap"}>
            <Button className={"form-button"} onClick={handleSaveClick}>
              Save
            </Button>
            <Button className={"form-button button-space"} onClick={cancle}>
                Cancel
              </Button>
          </div>
        ) : (
          <div className={"form-basic-button-wrap"}>
            <Button className={"form-button"} onClick={handleEditClick}>
              Edit
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default ExtraInfo;