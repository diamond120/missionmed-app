import "./index.less";
import {
    Button,
    Form,
    Modal,
    message,
    Select,
    Collapse,
    Input,
    Checkbox,
    DatePicker
} from "antd";
import React, { useState } from "react";
import UCATSessionService from "../../api/services/UCATSession";
import TeachingSessionService from "../../api/services/TeachingSession";
import {formatDateV1, formatTime, formatDate,getDay} from "../../common/common";
import moment from "moment";
import type { RangePickerProps } from 'antd/es/date-picker';


import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;
const { TextArea } = Input;


const FreezeSession = ({title,moduleType}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState("");
  const dateFormat = 'DD/MM/YYYY';
  const [startDate, setStartDate] =  useState(new Date());
  const [endDate, setEndDate] =  useState(new Date());

  const handleSubmit = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue(true);
    try{
      let updatedObject = { ...formData };
      updatedObject.sessionStartDay = moment(formData.sessionStartDay).format('YYYY-MM-DD');
      updatedObject.sessionEndDay = moment(formData.sessionEndDay).format('YYYY-MM-DD');
      updatedObject.sessionType = formData.sessionType.join(', ');
      let response;
      if(moduleType == 'teaching') {
        response = await TeachingSessionService.freezeSession(updatedObject);
      } else {
        response = await UCATSessionService.bookFreezeSession(updatedObject);
      }
      if(response.data.success){
        if(moduleType == 'teaching') {
          navigate("/student/teaching-session")
        } else {
          navigate("/student/ucat-session")
        }
        message.success('You’ve successfully freezed session');
      }else{
        throw new Error(response.data.message)
      }
    }catch(e){
      message.error(e.message);
    }
    handleCancel();
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const showModal = () => {
    setIsModalOpen(true);
    setModalTitle(title);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    const parts = startDate.split('/');
    if( parts.length == 3 ) {
      const dateObject = new Date(parts[2], parts[1] - 1, parts[0]);
      const currentDate = new Date(current);
      return current && current.isBefore(dateObject,'DD-MM-YYYY');
    } else {
      return false;
    }
  };

  return (
    <>
      <Button onClick={showModal} className={"secondary-button"}>
        {title}
      </Button>
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className={"mock-interview-modal "}
        width={"max-content"}
        footer={[
            <>
            <Button className={"secondary-button"} onClick={handleSubmit}>Cancle</Button>
            <Button className={"primary-button"} htmlType="submit" onClick={handleSubmit}>Freeze Sessions</Button>
          </>
           
        ]}
      >
        <Form form={form} className={'freeze-sessions'} layout="vertical" initialValues= {{sessionType: ['Recurring Session']}}>
            <div style={{ width: "600px" }}>
              <Form.Item
                style={{ marginTop: "17px", marginBottom: "0px"}}
                label="Choose types of sessions that you want to freeze"
                name="sessionType"
                rules={[{ required: true , message: 'Please choose session type'}]}
              >
              <Checkbox.Group >
                  <Checkbox value="Recurring Session" >All Recurrtion Session</Checkbox>
                  <Checkbox value="Individual Session">All Other Session</Checkbox>
              </Checkbox.Group>
              </Form.Item>
              <h5 style={{color:'#000000d9',fontSize:16,fontWeight:600,padding:10,marginTop:10}}>Choose types of sessions that you want to freeze</h5>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Form.Item 
                      style={{width: '100%'}}
                      name={"sessionStartDay"}
                      label={"Freeze Start Date *"}
                      rules={[{ required: true , message: 'Please enter Start Date'}]}
                  >
                      <DatePicker className={"input"}   placeholder="dd/mm/yyyy"  format={dateFormat} onChange={(value, valueString) => setStartDate(valueString)}  />
                  </Form.Item>

                  <Form.Item
                      style={{width: '100%'}}
                      name={"sessionEndDay"}
                      label={"Freeze End Date *"}
                      rules={[{ required: true , message: 'Please enter End Date'}]}
                  >
                      <DatePicker className={"input"}  placeholder="dd/mm/yyyy"  format={dateFormat}  onChange={(value, valueString) => setEndDate(valueString)} 
                      
                    // disabledDate={current =>
                    //   startDate
                    //     ? current.isBefore(moment(startDate).format('DD-MM-YYYY'), dateFormat)
                    //     : false
                    // } 

                    disabledDate={disabledDate}
                    // disabledDate={current => current && current.isBefore(moment(startDate).format('DD-MM-YYYY'))}
                    />
                  </Form.Item>
              </div>
              <Form.Item
                style={{marginBottom: "0px"}}
                label="Reason *"
                name="reason"
                rules={[{ required: true , message: 'Please enter Reason'}]}
              >
                  <Select placeholder="Select an option">
                      <Select.Option value="holiday">Holiday</Select.Option>
                      <Select.Option value="medical">Medical</Select.Option>
                      <Select.Option value="study">Study</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                  </Select>
              </Form.Item>
            </div>
          </Form>
      </Modal>
    </>
  );
};

export default FreezeSession;
