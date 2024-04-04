import "./index.less";
import { Button, Form, Modal, message, Select, Input, DatePicker, Spin, Radio, Space } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import CommonService from "../../../api/services/Common";
import {  PlusOutlined, ClockCircleOutlined,  MinusCircleOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const AddException = ({title, callAdded, editedData = null }) => {
  const [form] = Form.useForm();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState("");
  const dateFormat = 'DD/MM/YYYY';
  const format = "h:mm a";  
  const { RangePicker } = DatePicker;
  const [modal, contextHolder] = Modal.useModal();


  const [loading, setLoading] = useState(false);

  const formatTimeArr = (timeArr) => {
    if (timeArr.length > 0) {
      return timeArr.map((time) => ({
        start: time.start,
        end: time.end,
      }));
    }
    return [];
  };

  const handleSubmit = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue(true);
    try{
      const updatedObject = { ...formData };
      updatedObject.start_day = moment(formData.dateRange[0]).format('YYYY-MM-DD');
      updatedObject.end_day = moment(formData.dateRange[1]).format('YYYY-MM-DD');
      delete updatedObject.dateRange;
      updatedObject.hours = formatTimeArr(formData.hours)
      let response
      if(editedData) {
        response = await CommonService.postAPI(`tutor/edit-exception/${editedData?.id}`,updatedObject);
      } else {
        response = await CommonService.postAPI('/tutor/add-exception',updatedObject);
      }
      if(response.data.success){
        
        if(response.data.data.alreadyBook) {
          const result = response.data.data.student.map(item => `${item.full_name} (${item.email})`).join(', ');
          const contentElement = (
            <table>
              <tbody>
                <tr>
                  <th style={{width:'15%'}}>Students :</th>
                  <td>{result}</td>
                </tr>
              </tbody>
            </table>
          );
          modal.confirm({
            title: 'Below Students Booked some sessions for this time slots. Please let them know to cancel first.',
            icon: <ExclamationCircleOutlined />,
            content: contentElement,
            okText: 'Okay'
          });
        } else {
          callAdded()
          setLoading(false);
          message.success('You’ve successfully added special days');
        }
        
      }else{
        setLoading(false);
        throw new Error(response.data.message)
      }
    }catch(e){
      setLoading(false);
      message.error(e.message);
    }
    handleCancel();
    
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    if (editedData) {
      setIntialValue(editedData)
    }
    form.resetFields();
  };

  const showModal = () => {
    setIsModalOpen(true);
    setModalTitle(title);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const setIntialValue = (editedData) => {
    const { name, type, start_day, end_day, hours } = editedData;
      const dateRange = [moment(start_day), moment(end_day)];
      const formattedHours = JSON.parse(hours);
      form.setFieldsValue({
        name,
        type,
        dateRange,
        hours: formattedHours
      });
  }

  useEffect(() => {
    if (editedData) {
      setIntialValue(editedData)
    }
  }, [editedData, form]);

  const checkTimeFrame = async (rule, value) => {
    value = moment(value, format);
    const [day, index, type] = rule.field.split(".");
    const currentTimeSlots = form.getFieldValue(day);
    if (currentTimeSlots.length > 0 && value) {
      let slotStartTime = null;
      if (type == "end") {
        slotStartTime =moment(currentTimeSlots[index].start, format);
      }
      currentTimeSlots.forEach((slot, i) => {
        const beforeTime = moment(slot.start, format);
        const afterTime = moment(slot.end, format);
        if (i != index) {
          if (slotStartTime) {
            if (
              value.isBetween(beforeTime, afterTime, undefined, "()") ||
              slotStartTime.isBetween(beforeTime, afterTime, undefined, "()")
            ) {
              throw new Error("Selected time is overlap with other slot time!");
            }
            if (value.isSame(afterTime)) {
              throw new Error("Slot already exist!");
            }
          } else {
            if (value.isBetween(beforeTime, afterTime, undefined, "()")) {
              throw new Error("Selected time is overlap with other slot time!");
            }
            if (value.isSame(beforeTime)) {
              throw new Error("Slot already exist!");
            }
          }
        } else {
          if (type == "start" && value.isSameOrAfter(afterTime)) {
          throw new Error("Start time must be less than end time!");
          } else if (type == "end" && value.isSameOrBefore(beforeTime)) {
          throw new Error("End time must be greater than start time!");
          }
        }
      });
    }
  };

  const timeIntervals = [
    { value: '12:00 am', label: '12:00 am' },
    { value: '12:30 am', label: '12:30 am' },
    { value: '1:00 am', label: '1:00 am' },
    { value: '1:30 am', label: '1:30 am' },
    { value: '2:00 am', label: '2:00 am' },
    { value: '2:30 am', label: '2:30 am' },
    { value: '3:00 am', label: '3:00 am' },
    { value: '3:30 am', label: '3:30 am' },
    { value: '4:00 am', label: '4:00 am' },
    { value: '4:30 am', label: '4:30 am' },
    { value: '5:00 am', label: '5:00 am' },
    { value: '5:30 am', label: '5:30 am' },
    { value: '6:00 am', label: '6:00 am' },
    { value: '6:30 am', label: '6:30 am' },
    { value: '7:00 am', label: '7:00 am' },
    { value: '7:30 am', label: '7:30 am' },
    { value: '8:00 am', label: '8:00 am' },
    { value: '8:30 am', label: '8:30 am' },
    { value: '9:00 am', label: '9:00 am' },
    { value: '9:30 am', label: '9:30 am' },
    { value: '10:00 am', label: '10:00 am' },
    { value: '10:30 am', label: '10:30 am' },
    { value: '11:00 am', label: '11:00 am' },
    { value: '11:30 am', label: '11:30 am' },
    { value: '12:00 pm', label: '12:00 pm' },
    { value: '12:30 pm', label: '12:30 pm' },
    { value: '1:00 pm', label: '1:00 pm' },
    { value: '1:30 pm', label: '1:30 pm' },
    { value: '2:00 pm', label: '2:00 pm' },
    { value: '2:30 pm', label: '2:30 pm' },
    { value: '3:00 pm', label: '3:00 pm' },
    { value: '3:30 pm', label: '3:30 pm' },
    { value: '4:00 pm', label: '4:00 pm' },
    { value: '4:30 pm', label: '4:30 pm' },
    { value: '5:00 pm', label: '5:00 pm' },
    { value: '5:30 pm', label: '5:30 pm' },
    { value: '6:00 pm', label: '6:00 pm' },
    { value: '6:30 pm', label: '6:30 pm' },
    { value: '7:00 pm', label: '7:00 pm' },
    { value: '7:30 pm', label: '7:30 pm' },
    { value: '8:00 pm', label: '8:00 pm' },
    { value: '8:30 pm', label: '8:30 pm' },
    { value: '9:00 pm', label: '9:00 pm' },
    { value: '9:30 pm', label: '9:30 pm' },
    { value: '10:00 pm', label: '10:00 pm' },
    { value: '10:30 pm', label: '10:30 pm' },
    { value: '11:00 pm', label: '11:00 pm' },
    { value: '11:30 pm', label: '11:30 pm' },
  ];


  return (
    <>
      {editedData ? 
        <EditOutlined  onClick={showModal}/>
       :
        <Button onClick={showModal} className={"secondary-button  exception-btn"}>
          <PlusOutlined /> {title}
        </Button>
      }
      
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className={"mock-interview-modal "}
        width={"max-content"}
        footer={[
          <> 
            {loading == true ? (
              <Spin />
            ) : (
              <Button className={"primary-button"} htmlType="submit" onClick={handleSubmit}>Save</Button>
            )}
          </>
        ]}
      >
        <Form form={form} className={'freeze-sessions add-exception-form'} layout="vertical" >
            <div style={{ width: "600px" }}>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true , message: 'Please enter name '}]}
                >
                   <Input placeholder="Family  Holidays" />
                </Form.Item>
                
                <Form.Item
                    style={{ marginTop: "17px", marginBottom: "0px"}}
                    label="Type"
                    name="type"
                    rules={[{ required: true , message: 'Please choose type'}]}
                >
                <Radio.Group style={{ display: 'flex' }} onChange={() => { console.log('test')}}>
                    <Radio value="Off">Off</Radio>
                    <Radio value="Extra Availability">Extra Availability</Radio>
                </Radio.Group>
                </Form.Item>

                <Form.Item 
                    style={{width: '100%', marginTop: "17px"}}
                    name={"dateRange"}
                    label={"Select Range"}
                    rules={[{ required: true , message: 'Please enter Start & End Date'}]}
                >
                <RangePicker  size={'large'}  style={{width: '100%'}} format={dateFormat}/>
                    {/* <DatePicker className={"input"}    placeholder="dd/mm/yyyy"  format={dateFormat} onChange={(value, valueString) => setStartDate(valueString)}  /> */}
                </Form.Item>

                <h3 className="hours-title">Select Hours</h3>
                <Form.List name="hours" initialValue={[{ start: "9:00 am", end: "9:00 am" }]}>
                        {(fields, { add, remove }) => (
                        <>
                            <div className="time-input-group">
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                key={key}
                                style={{ display: "flex", marginBottom: 8 }}
                                align="baseline"
                                >
                                
                                <Form.Item
                                    {...restField}
                                    name={[name, "start"]}
                                    rules={[
                                    {
                                        required:true,
                                        message: "start time required",
                                    },
                                    { validator: checkTimeFrame }]}
                                    dependencies={[["hours", name, "end"]]}
                                    style={{width: '100%',  marginBottom: "10px"}}
                                    initialValue={"9:00 am"}
                                >
                                    <Select
                                    placeholder="Select Start time"
                                    style={{ width: "140px" }}
                                    className={"input time-date_select"}
                                    options={timeIntervals}
                                    suffixIcon={<ClockCircleOutlined />}
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, "end"]}
                                    rules={[
                                    {
                                        required:true,
                                        message: "end time required",
                                    },
                                    { validator: checkTimeFrame }
                                    ]}
                                    dependencies={[["hours", name, "start"]]}
                                    style={{width: '100%',  marginBottom: "10px"}}
                                    initialValue={"9:00 am"}
                                >
                                    <Select
                                    placeholder="Select End time"
                                    style={{ width: "140px" }}
                                    className={"input time-date_select"}
                                    options={timeIntervals}
                                    suffixIcon={<ClockCircleOutlined />}
                                    />
                                </Form.Item>
                                {key != 0 && <Button
                                    type="text"
                                    onClick={() => remove(name)}
                                    block
                                    icon={<MinusCircleOutlined />}
                                    className="remove-icon"
                                />}
                                </Space>
                            ))}
                            </div>
                            <Form.Item className="add-period">
                            <Button
                                type="text"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                            >
                                Add Period
                            </Button>
                            </Form.Item>
                        </>
                        )}
                </Form.List>
            </div>
          </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default AddException;