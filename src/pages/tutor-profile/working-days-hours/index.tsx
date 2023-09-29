

import { MinusCircleOutlined,PlusOutlined } from '@ant-design/icons';
import { Button,Form,Space,Switch,TimePicker } from 'antd';
import React,{ FC,useMemo,useState } from "react";
import "./index.less";
import moment from 'moment';
import {useTutor, useTutorDispatch} from "../../../api/providers/TutorProvider";
import TutorService from "../../../api/services/Tutor";
import { tutorWorkingHours } from '../../../common/common';

const WorkingDaysHours: FC<Any> = ({props}) => {
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const isMondayOff = Form.useWatch('isMondayOff', form); 
  const isTuesdayOff = Form.useWatch('isTuesdayOff', form); 
  const isWednesdayOff = Form.useWatch('isWednesdayOff', form); 
  const isThursdayOff = Form.useWatch('isThursdayOff', form); 
  const isSaturdayOff = Form.useWatch('isSaturdayOff', form); 
  const isSundayOff = Form.useWatch('isSundayOff', form); 
  
  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  // const disabledDateTime = (day, type) => {
    
  //   const formatStartEnd = (timeArr) => {
  //     if( timeArr.length > 0 ){
  //       return timeArr.map(time => ({start: time.start.format(format), end:time.end.format(format)}));
  //     }
  //     return [];
      
  //   }
  //   switch (day) {
  //     case 'monday':
  //       console.log(day, type)
  //       console.log(formatTimeArr(form.getFieldValue('Monday')))
  //       break;
  //     case 'tuesday':
  //     case 'wend':
  //       console.log('Mangoes and papayas are $2.79 a pound.');
  //       // Expected output: "Mangoes and papayas are $2.79 a pound."
  //       break;
  //     default:
  //       console.log(`Sorry, we are out of ${day}.`);
  //   }
  //   return {
  //     disabledHours: () => range(0, 12).splice(1,1),
  //     disabledMinutes: () => range(30, 60),
  //   }
  // };


  const format = 'h:mm a';

  const checkTimeFrame = async (rule, value) => {
    const [day, index, type] = rule.field.split(".");
    const currentTimeSlots = form.getFieldValue(day);
    console.log(currentTimeSlots, day, index, type);
    if (currentTimeSlots.length > 0 && value) {
      let slotStartTime = null;
      if(type == "end"){
        slotStartTime = currentTimeSlots[index].start 
        console.log("slotStartTime", slotStartTime)
      }
      currentTimeSlots.forEach((slot, i) => {
        console.log( i);
        const beforeTime = moment(slot.start, format);
        const afterTime = moment(slot.end, format);
        console.log(beforeTime, afterTime, value)
        if (i != index) {
          if(slotStartTime){
            if (value.isBetween(beforeTime, afterTime) && slotStartTime.isBetween(beforeTime, afterTime)) {
              throw new Error("Selected time is overlap with otherslot time!");
            } 
          }else{
            if (value.isBetween(beforeTime, afterTime)) {
              throw new Error("Selected time is overlap with otherslot time!");
            } 
          }
        }else{
          console.log(type, (type == "start" && value.isSame(afterTime)))
          if((type == "start" && value.isSame(afterTime)) || (type == "end" && value.isSame(beforeTime))){
            throw new Error(
              "Slot already selected, please select different one!"
            );
          }
          if(type == "start" && value.isAfter(afterTime)){
            throw new Error(
              "Start time must be less than end time"
            );
          }
          if(type =="end" &&  value.isBefore(beforeTime)){
            throw new Error(
              "End time must be less than start time"
            );
          }
        }
      });
    }
  };

  const formattedWorkingHours = useMemo(() => tutorWorkingHours(tutor.workingHours, format), [tutor.workingHours]);
 
  const handleEditClick = (e) => {
    setEditing(true);
    e.preventDefault();
  };

  
  const formatTimeArr = (timeArr) => {
    if( timeArr.length > 0 ){
      return timeArr.map(time => ({start: time.start.format(format), end:time.end.format(format)}));
    }
    return [];
    
  }
  const onFinish = async (values: any) => {
    const Monday = values.isMondayOff ? [] :formatTimeArr(values.Monday ?? []);
    const Tuesday =  values.isTuesdayOff ? [] : formatTimeArr(values.Tuesday ?? []);
    const Wednesday = values.isWednesdayOff ? [] : formatTimeArr(values.Wednesday ?? []);
    const Thursday = values.isThursdayOff ? [] : formatTimeArr(values.Thursday ?? []);
    const Friday = values.isFridayOff ? [] : formatTimeArr(values.Friday) ?? [];
    const Saturday = values.isSaturdayOff ? [] : formatTimeArr(values.Saturday ?? []);
    const Sunday = values.isSundayOff ? [] : formatTimeArr(values.Sunday ?? []);
    const workingHours = [
      {day:"Monday", "hours": Monday,"dayOff": values.isMondayOff},
      {day:"Tuesday", "hours": Tuesday,"dayOff": values.isTuesdayOff},
      {day:"Wednesday", "hours": Wednesday,"dayOff": values.isWednesdayOff},
      {day:"Thursday", "hours": Thursday,"dayOff": values.isThursdayOff},
      {day:"Friday", "hours": Friday,"dayOff": values.isFridayOff},
      {day:"Saturday", "hours":Saturday,"dayOff": values.isSaturdayOff},
      {day:"Sunday", "hours": Sunday,"dayOff": values.isSundayOff}
    ]

    await TutorService.updateProfile({
      workingHours:workingHours
    });

    dispatch({
      type:'updateWorkingHours',
      workingHours: workingHours
    })
    setEditing(false);
    return false;
  };

  const handleSwitchChange = (value, day) => {
    if(value == true){
      return form.setFieldsValue({[day]:[{'start':'', 'end' : ''}]})
    }
  }

  return (
    <div className={"working-section"}>
      <h2 className={"working-section-title"}>Working Days & Hours</h2>
      <Form className={"working-form"} form={form} onFinish={onFinish}
      initialValues={{
        "isMondayOff" : formattedWorkingHours.isMondayOff ?? false,
        "Monday" :  formattedWorkingHours.Monday ?? [{start:moment("9:00", format), end:moment("9:00", format)}],
        "isTuesdayOff" : formattedWorkingHours.isTuesdayOff ?? false,
        "Tuesday" :  formattedWorkingHours.Tuesday ?? [{start:moment("9:00", format), end:moment("9:00", format)}],
        "isWednesdayOff" : formattedWorkingHours.isWednesdayOff ?? false,
        "Wednesday" :  formattedWorkingHours.Wednesday ?? [{start:moment("9:00", format), end:moment("9:00", format)}],
        "isThursdayOff" : formattedWorkingHours.isThursdayOff ?? false,
        "Thursday" :  formattedWorkingHours.Thursday ?? [{start:moment("9:00", format), end:moment("9:00", format)}],
        "isFridayOff":formattedWorkingHours.isFridayOff ?? false,
        "Friday" :  formattedWorkingHours.Friday ?? [{start:moment("9:00", format), end:moment("9:00", format)}],
        "isSaturdayOff" : formattedWorkingHours.isSaturdayOff ?? false,
        "Saturday" :  formattedWorkingHours.Saturday ?? [{start:moment("9:00", format), end:moment("9:00", format)}],
        "isSundayOff" : formattedWorkingHours.isSundayOff ?? false,
        "Sunday" :  formattedWorkingHours.Sunday ?? [{start:moment("9:00", format), end:moment("9:00", format)}],
       
      }}
      >
      <div className='working_days_item'>
        <div className={"label"}>Monday</div>
        <Form.List name="Monday" >
          {(fields, { add, remove }) => (
            <>
            <div className='time-input-group'>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'start']}
                    rules={[{ required: (form.getFieldValue('isMondayOff') == false), message: 'start time required' }, {validator: checkTimeFrame }]}
                    initialValue={moment("9:00", format)}
                  >
                    <TimePicker
                          minuteStep={15}
                          format={format}
                          style={{ width: "140px" }}
                          className={"input"}
                          disabled={(form.getFieldValue('isMondayOff') == true || !editing)}
                          use12Hours
                          //disabledTime={() => disabledDateTime('monday', 'start')}
                        />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'end']}
                    rules={[{ required: (form.getFieldValue('isMondayOff') == false ), message: 'end time required' }, {validator: checkTimeFrame }]}
                    initialValue={moment("9:00", format)}
                  >
                    <TimePicker
                          minuteStep={15}
                          format={format}
                          style={{ width: "140px" }}
                          className={"input"}
                          disabled={form.getFieldValue('isMondayOff') == true || !editing}
                          //disabledTime={() => disabledDateTime('monday', 'end')}
                        />
                  </Form.Item>
                  <Button type="text" disabled={(form.getFieldValue('isMondayOff') == true || !editing)}  onClick={() => remove(name)} block icon={<MinusCircleOutlined />} />
                </Space>
              ))}
              </div>
              <Form.Item className='add-period'>
                <Button type="dashed" disabled={(form.getFieldValue('isMondayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Period
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item 
          className='switch-btn'
          name={"isMondayOff"}
          label="Day off"
          initialValue={formattedWorkingHours.isMondayOff}
        >
          <Switch defaultChecked={formattedWorkingHours.isMondayOff} onChange={(value) => handleSwitchChange(value, 'Monday')}  disabled={!editing}/>
        </Form.Item>
      </div>
          
      <div className='working_days_item'>
        <div className={"label"}>Tuesday</div>    
        <Form.List name="Tuesday">
        {(fields, { add, remove }) => (
          <>
          <div className='time-input-group'>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required:  (form.getFieldValue('isTuesdayOff') == false ), message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={( form.getFieldValue('isTuesdayOff') == true || !editing)}
                       
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: (form.getFieldValue('isTuesdayOff') == false ), message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={form.getFieldValue('isTuesdayOff') == true || !editing}
                        
                      />
                </Form.Item>
                <Button type="text" disabled={(form.getFieldValue('isTuesdayOff') == true || !editing)}  onClick={() => remove(name)} block icon={<MinusCircleOutlined />} />
              </Space>
            ))}
            </div>
            <Form.Item className='add-period'>
              <Button type="dashed" disabled={(form.getFieldValue('isTuesdayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
        </Form.List>

        <Form.Item
          className='switch-btn'
          name={"isTuesdayOff"}
          label="Day off"
        >
          <Switch defaultChecked={formattedWorkingHours.isTuesdayOff} onChange={(value) => handleSwitchChange(value, 'Tuesday')}  disabled={!editing}/>
        </Form.Item>
      </div>
      
      <div className='working_days_item'>
        <div className={"label"}>Wednesday</div>
        <Form.List name="Wednesday">
        {(fields, { add, remove }) => (
          <>
          <div className='time-input-group'>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: (form.getFieldValue('isWednesdayOff') == false ), message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={( form.getFieldValue('isWednesdayOff') == true  || !editing)}
                        
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: (form.getFieldValue('isWednesdayOff') == false ), message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={form.getFieldValue('isWednesdayOff') == true || !editing}
                        
                      />
                </Form.Item>
                <Button type="text" disabled={(form.getFieldValue('isWednesdayOff') == true || !editing)} onClick={() => remove(name)} block icon={<MinusCircleOutlined />} />
              </Space>
            ))}
            </div>
            
            <Form.Item className='add-period'>
              <Button type="dashed" disabled={(form.getFieldValue('isWednesdayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
        </Form.List>
        <Form.Item
        className='switch-btn'
          name={"isWednesdayOff"}
          label="Day off"
        >
          <Switch defaultChecked={formattedWorkingHours.isWednesdayOff} onChange={(value) => handleSwitchChange(value, 'Wednesday')}  disabled={!editing}/>
        </Form.Item>
      </div>

      <div className='working_days_item'>
        <div className={"label"}>Thursday</div>
        <Form.List name="Thursday">
        {(fields, { add, remove }) => (
          <>
          <div className='time-input-group'>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: (form.getFieldValue('isThursdayOff') == false ), message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={( form.getFieldValue('isThursdayOff') == true || !editing)}
                      
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: (form.getFieldValue('isThursdayOff') == false ), message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={form.getFieldValue('isThursdayOff') == true || !editing}
                        
                      />
                </Form.Item>
                <Button type="text" disabled={(form.getFieldValue('isThursdayOff') == true || !editing)} onClick={() => remove(name)} block icon={<MinusCircleOutlined />} />
              </Space>
            ))}
            </div>
            <Form.Item className='add-period'>
              <Button type="dashed" disabled={(form.getFieldValue('isThursdayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      
        <Form.Item
          className='switch-btn'
          name={"isThursdayOff"}
          label="Day off"
        >
          <Switch defaultChecked={formattedWorkingHours.isThursdayOff} onChange={(value) => handleSwitchChange(value, 'Thursday')}  disabled={!editing}/>
        </Form.Item>
      </div>

      <div className='working_days_item'>
        <div className={"label"}>Friday</div>
        <Form.List name="Friday">
        {(fields, { add, remove }) => (
          <>
          <div className='time-input-group'>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: (form.getFieldValue('isFridayOff') == false ), message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={( form.getFieldValue('isFridayOff') == true || !editing)}
                      
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: (form.getFieldValue('isFridayOff') == false ), message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={ form.getFieldValue('isFridayOff') == true || !editing}
                        
                      />
                </Form.Item>
                <Button type="text" disabled={(form.getFieldValue('isFridayOff') == true || !editing)} onClick={() => remove(name)} block icon={<MinusCircleOutlined />} />
              </Space>
            ))}
            </div>
            <Form.Item className='add-period'>
              <Button type="dashed" disabled={(form.getFieldValue('isFridayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
        </Form.List>

        <Form.Item
        className='switch-btn'
          name={"isFridayOff"}
          label="Day off"
        >
          <Switch defaultChecked={formattedWorkingHours.isFridayOff} onChange={(value) => handleSwitchChange(value, 'Friday')}  disabled={!editing}/>
        </Form.Item>
      </div>

      <div className='working_days_item'>
        <div className={"label"}>Saturday</div>        
        <Form.List name="Saturday">
        {(fields, { add, remove }) => (
          <>
          <div className='time-input-group'>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: (form.getFieldValue('isSaturdayOff') == false ), message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={( form.getFieldValue('isSaturdayOff') == true || !editing)}
                       
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: (form.getFieldValue('isSaturdayOff') == false ), message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={form.getFieldValue('isSaturdayOff') == true || !editing}
                        
                      />
                </Form.Item>
                <Button type="text" disabled={(form.getFieldValue('isSaturdayOff') == true || !editing)} onClick={() => remove(name)} block icon={<MinusCircleOutlined />} />
              </Space>
            ))}
            </div>
            <Form.Item className='add-period'>
              <Button type="dashed" disabled={(form.getFieldValue('isSaturdayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
        </Form.List>
        <Form.Item
            className='switch-btn'
            name={"isSaturdayOff"}
            label="Day off"
          >
          <Switch defaultChecked={formattedWorkingHours.isSaturdayOff} onChange={(value) => handleSwitchChange(value, 'Saturday')} disabled={!editing} />
        </Form.Item>
      </div>

      <div className='working_days_item'>
        <div className={"label"}>Sunday</div>     
        <Form.List name="Sunday">
        {(fields, { add, remove }) => (
          <>
          <div className='time-input-group'>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: (form.getFieldValue('isSundayOff') == false ), message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={( form.getFieldValue('isSundayOff') == true || !editing)}
                       
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: (form.getFieldValue('isSundayOff') == false ), message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={form.getFieldValue('isSundayOff') == true || !editing}
                       
                      />
                </Form.Item>
                <Button type="text" disabled={(form.getFieldValue('isSundayOff') == true || !editing)} onClick={() => remove(name)} block icon={<MinusCircleOutlined />} />
              </Space>
            ))}
            </div>
            <Form.Item className='add-period'>
              <Button type="dashed" disabled={(form.getFieldValue('isSundayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
        </Form.List>
        <Form.Item
          className='switch-btn'
          name={"isSundayOff"}
          label="Day off"
        >
          <Switch defaultChecked={formattedWorkingHours.isSundayOff} onChange={(value) => handleSwitchChange(value, 'Sunday')} disabled={!editing}/>
        </Form.Item>
      </div>
      
        {editing ? (
          <div className={"form-basic-button-wrap"}>
            <Button className={"form-button"} htmlType={"submit"}>
              Save
            </Button>
          </div>
        ) : (
          <div className={"form-basic-button-wrap"}>
            <Button className={"form-button"} htmlType={"button"} onClick={handleEditClick}>
              Edit
            </Button>
          </div>
        )}
      </Form>
    </div>
  )
};

export default WorkingDaysHours;


