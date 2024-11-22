import "./index.less";
import { Button, Form, Modal, message, Select, Collapse, Input, Checkbox, DatePicker, Spin } from "antd";
import { useState } from "react";
import moment from "moment";
import type { RangePickerProps } from 'antd/es/date-picker';
import CommonService from "../../api/services/Common";

import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;
const { TextArea } = Input;


const FreezeSession = ({title,moduleType,addFreezeSession, sessionType='', showCancelModal}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState("");
  const dateFormat = 'DD/MM/YYYY';
  const [startDate, setStartDate] =  useState(new Date());
  const [endDate, setEndDate] =  useState(new Date());

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await form.validateFields();
    const formData = form.getFieldsValue(true);
    try{
      let updatedObject = { ...formData };
      updatedObject.sessionStartDay = moment(formData.sessionStartDay).format('YYYY-MM-DD');
      updatedObject.sessionEndDay = moment(formData.sessionEndDay).format('YYYY-MM-DD');
      updatedObject.sessionType = formData.sessionType.join(', ');
      const response = await CommonService.postAPI('/student/freeze-sessions',updatedObject);
      if(response.data.success){
        setLoading(false);
        addFreezeSession("added freeze session successfully.");
        if(moduleType == 'teaching') {
          navigate("/student/teaching-session")
        } else {
          navigate("/student/ucat-session")
        }
        message.success('You’ve successfully freezed session');
      }else{
        setLoading(false);
        throw new Error(response.data.message)
      }
    }catch(e){
      setLoading(false);
      message.error(e.message);
    }
    setIsModalOpen(false);
    form.resetFields();
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    if(sessionType) showCancelModal()
  };

  const showModal = () => {
    addFreezeSession();
    setIsModalOpen(true);
    setModalTitle(title);
  };

  const handleOk = () => {
   
    setIsModalOpen(false);
  };

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    if(typeof startDate == "string") {
      const parts = startDate.split('/');
      if( parts.length == 3 ) {
        const dateObject = new Date(parts[2], parts[1] - 1, parts[0]);
        const currentDate = new Date(current);
        return current && current.isBefore(dateObject,'DD-MM-YYYY');
      } else {
        return false;
      }
      }
  };

  return (
    <>
      <Button onClick={showModal} className={sessionType ? "primary-button" :"secondary-button"}>
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
            <div key='freeze-footer'>
           
            {loading == true ? (
              <Spin />
            ) : (
            <>
          <Button 
            className={"secondary-button"} 
            onClick={() => sessionType ? (setIsModalOpen(false), showCancelModal()) :handleCancel() }
          >
            Cancel
          </Button>
            <Button className={"primary-button"} htmlType="submit" onClick={handleSubmit}>Freeze Sessions</Button>
            </>
            )}
          </div>
           
        ]}
      >
        <Form form={form} className={'freeze-sessions'} layout="vertical" initialValues= {{sessionType: ['Recurring Session']}}>
            <div style={{ width: "600px" }} className="lg-w-full">
              <Form.Item
                style={{ marginTop: "17px", marginBottom: "0px"}}
                label="Choose types of sessions that you want to freeze"
                name="sessionType"
                rules={[{ required: true , message: 'Please choose session type'}]}
              >
              <Checkbox.Group >
                  <Checkbox value="Recurring Session" >All Recurring Session</Checkbox>
                  <Checkbox value="Individual Session">All Other Session</Checkbox>
              </Checkbox.Group>
              </Form.Item>
              <h5 style={{color:'#000000d9',fontSize:16,fontWeight:600,padding:10,marginTop:10}}>Choose types of sessions that you want to freeze</h5>
              
              <div style={{ display: 'flex', alignItems: 'start' }} className={'freeze_dates'}>
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
                      rules={[{ required: true  , message: 'Please enter End Date'},
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                            const startDateValue = getFieldValue('sessionStartDay');
                            if (startDateValue && !value) {
                                return Promise.reject('Please enter End Date');
                            }
                            if (!startDateValue && !value) {
                                return Promise.resolve();
                            }
                            if (startDateValue && value && value >= startDateValue) {
                                return Promise.resolve();
                            }
                            return Promise.reject('End Date must be after or equal to Start Date');
                        },
                    }), ]}
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