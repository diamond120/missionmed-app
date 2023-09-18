

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
  
  const formattedWorkingHours = useMemo(() => tutorWorkingHours(tutor.workingHours), [tutor.workingHours]);
 
  const handleEditClick = (e) => {
    setEditing(true);
    e.preventDefault();
  };

  const format = 'HH:mm';
  
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
  
 console.log(form.getFieldsValue());

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
      <p className={"label"}>Monday</p>
      <Form.List name="Monday" >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: (form.getFieldValue('isMondayOff') == false), message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={(form.getFieldValue('isMondayOff') == true || !editing)}
                        
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: (form.getFieldValue('isMondayOff') == false ), message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={form.getFieldValue('isMondayOff') == true || !editing}
                       
                      />
                </Form.Item>
                <Button type="text" disabled={(form.getFieldValue('isMondayOff') == true || !editing)}  onClick={() => remove(name)} block icon={<MinusCircleOutlined />} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" disabled={(form.getFieldValue('isMondayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isMondayOff"}
          label="Day off"
          initialValue={formattedWorkingHours.isMondayOff}
        >
        <Switch defaultChecked={formattedWorkingHours.isMondayOff} onChange={(value) => handleSwitchChange(value, 'Monday')}  disabled={!editing}/>
        </Form.Item>
        <Form.List name="Tuesday">
        {(fields, { add, remove }) => (
          <>
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
            <Form.Item>
              <Button type="dashed" disabled={(form.getFieldValue('isTuesdayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isTuesdayOff"}
          label="Day off"
        >
        <Switch defaultChecked={formattedWorkingHours.isTuesdayOff} onChange={(value) => handleSwitchChange(value, 'Tuesday')}  disabled={!editing}/>
        </Form.Item>
        <Form.List name="Wednesday">
        {(fields, { add, remove }) => (
          <>
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
            <Form.Item>
              <Button type="dashed" disabled={(form.getFieldValue('isWednesdayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isWednesdayOff"}
          label="Day off"
        >
        <Switch checked={formattedWorkingHours.isWednesdayOff} onChange={(value) => handleSwitchChange(value, 'Wednesday')}  disabled={!editing}/>
        </Form.Item>

        <Form.List name="Thursday">
        {(fields, { add, remove }) => (
          <>
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
            <Form.Item>
              <Button type="dashed" disabled={(form.getFieldValue('isThursdayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isThursdayOff"}
          label="Day off"
        >
        <Switch defaultChecked={formattedWorkingHours.isThursdayOff} onChange={(value) => handleSwitchChange(value, 'Thursday')}  disabled={!editing}/>
        </Form.Item>


        <Form.List name="Friday">
        {(fields, { add, remove }) => (
          <>
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
            <Form.Item>
              <Button type="dashed" disabled={(form.getFieldValue('isFridayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isFridayOff"}
          label="Day off"
        >
        <Switch defaultChecked={formattedWorkingHours.isFridayOff} onChange={(value) => handleSwitchChange(value, 'Friday')}  disabled={!editing}/>
        </Form.Item>

        <Form.List name="Saturday">
        {(fields, { add, remove }) => (
          <>
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
            <Form.Item>
              <Button type="dashed" disabled={(form.getFieldValue('isSaturdayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isSaturdayOff"}
          label="Day off"
         
        >
        <Switch defaultChecked={formattedWorkingHours.isSaturdayOff} onChange={(value) => handleSwitchChange(value, 'Saturday')} disabled={!editing} />
        </Form.Item>

        <Form.List name="Sunday">
        {(fields, { add, remove }) => (
          <>
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
            <Form.Item>
              <Button type="dashed" disabled={(form.getFieldValue('isSundayOff') == true || !editing)} onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isSundayOff"}
          label="Day off"
        >
        <Switch defaultChecked={formattedWorkingHours.isSundayOff} onChange={(value) => handleSwitchChange(value, 'Sunday')} disabled={!editing}/>
        </Form.Item>
        
      {/* <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className={"label"}>Monday</p>
            <div>
              {mondayPeriods.map(period => (
                <div key={period.id} className={"working-form-item"}>
                  <div className={"time-wrap"}>
                    <div className={"time-input-group"}>
                      <TimePicker
                        defaultValue={moment("9:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isMondayDayOff || !editing}
                      />
                      <TimePicker
                        defaultValue={moment("13:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isMondayDayOff || !editing}
                      />
                      <MinusCircleOutlined
                        style={{ fontSize: "24px" }}
                        onClick={() => handleRemovePeriod(period.id, "Monday")}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className={"time-actions-group"}>
                <div className={"time-actions-group-switch-wrap"}>
                  <Switch
                    onChange={checked => handleSwitchChange(checked, "Monday")}
                    disabled={!editing}
                    checked={isMondayDayOff}
                  />
                  <p className={"switch-text"}>Day off</p>
                </div>
                <button
                  style={{ color: !editing ? "grey" : "" }}
                  disabled={!editing}
                  className={"time-actions-btn"}
                  onClick={() => handleAddPeriod("Monday")}
                >
                  <PlusOutlined /> Add Period
                </button>
              </div>
            </div>
          </div>
        </Form.Item> 
      
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className={"label"}>Tuesday</p>
            <div>
              {tuesdayPeriods.map(period => (
                <div key={period.id} className={"working-form-item"}>
                  <div className={"time-wrap"}>
                    <div className={"time-input-group"}>
                      <TimePicker
                        defaultValue={moment("9:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isTuesdayDayOff || !editing}
                      />
                      <TimePicker
                        defaultValue={moment("13:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isThursdayDayOff || !editing}
                      />
                      <MinusCircleOutlined
                        style={{ fontSize: "24px" }}
                        onClick={() => handleRemovePeriod(period.id, "Tuesday")}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className={"time-actions-group"}>
                <div className={"time-actions-group-switch-wrap"}>
                  <Switch
                    onChange={checked => handleSwitchChange(checked, "Tuesday")}
                    disabled={!editing}
                    checked={isTuesdayDayOff}
                  />
                  <p className={"switch-text"}>Day off</p>
                </div>
                <button
                  style={{ color: !editing ? "grey" : "" }}
                  disabled={!editing}
                  className={"time-actions-btn"}
                  onClick={() => handleAddPeriod("Tuesday")}
                >
                  <PlusOutlined /> Add Period
                </button>
              </div>
            </div>
          </div>
        </Form.Item>
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className={"label"}>Wednesday</p>
            <div>
              {wednesdayPeriods.map(period => (
                <div key={period.id} className={"working-form-item"}>
                  <div className={"time-wrap"}>
                    <div className={"time-input-group"}>
                      <TimePicker
                        defaultValue={moment("9:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isWednesdayDayOff || !editing}
                      />
                      <TimePicker
                        defaultValue={moment("13:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isWednesdayDayOff || !editing}
                      />
                      <MinusCircleOutlined
                        style={{ fontSize: "24px" }}
                        onClick={() => handleRemovePeriod(period.id, "Wednesday")}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className={"time-actions-group"}>
                <div className={"time-actions-group-switch-wrap"}>
                  <Switch
                    onChange={checked => handleSwitchChange(checked, "Wednesday")}
                    disabled={!editing}
                    checked={isWednesdayDayOff}
                  />
                  <p className={"switch-text"}>Day off</p>
                </div>
                <button
                  style={{ color: !editing ? "grey" : "" }}
                  disabled={!editing}
                  className={"time-actions-btn"}
                  onClick={() => handleAddPeriod("Wednesday")}
                >
                  <PlusOutlined /> Add Period
                </button>
              </div>
            </div>
          </div>
        </Form.Item>
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className={"label"}>Thursday</p>
            <div>
              {thursdayPeriods.map(period => (
                <div key={period.id} className={"working-form-item"}>
                  <div className={"time-wrap"}>
                    <div className={"time-input-group"}>
                      <TimePicker
                        defaultValue={moment("9:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isThursdayDayOff || !editing}
                      />
                      <TimePicker
                        defaultValue={moment("13:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isThursdayDayOff || !editing}
                      />
                      <MinusCircleOutlined
                        style={{ fontSize: "24px" }}
                        onClick={() => handleRemovePeriod(period.id, "Thursday")}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className={"time-actions-group"}>
                <div className={"time-actions-group-switch-wrap"}>
                  <Switch
                    onChange={checked => handleSwitchChange(checked, "Thursday")}
                    disabled={!editing}
                    checked={isThursdayDayOff}
                  />
                  <p className={"switch-text"}>Day off</p>
                </div>
                <button
                  style={{ color: !editing ? "grey" : "" }}
                  disabled={!editing}
                  className={"time-actions-btn"}
                  onClick={() => handleAddPeriod("Thursday")}
                >
                  <PlusOutlined /> Add Period
                </button>
              </div>
            </div>
          </div>
        </Form.Item>
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className={"label"}>Friday</p>
            <div>
              {fridayPeriods.map(period => (
                <div key={period.id} className={"working-form-item"}>
                  <div className={"time-wrap"}>
                    <div className={"time-input-group"}>
                      <TimePicker
                        defaultValue={moment("9:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isFridayDayOff || !editing}
                      />
                      <TimePicker
                        defaultValue={moment("13:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isFridayDayOff || !editing}
                      />
                      <MinusCircleOutlined
                        style={{ fontSize: "24px" }}
                        onClick={() => handleRemovePeriod(period.id, "Friday")}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className={"time-actions-group"}>
                <div className={"time-actions-group-switch-wrap"}>
                  <Switch
                    onChange={checked => handleSwitchChange(checked, "Friday")}
                    disabled={!editing}
                    checked={isFridayDayOff}
                  />
                  <p className={"switch-text"}>Day off</p>
                </div>
                <button
                  style={{ color: !editing ? "grey" : "" }}
                  disabled={!editing}
                  className={"time-actions-btn"}
                  onClick={() => handleAddPeriod("Friday")}
                >
                  <PlusOutlined /> Add Period
                </button>
              </div>
            </div>
          </div>
        </Form.Item>
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className={"label"}>Saturday</p>
            <div>
              {saturdayPeriods.map(period => (
                <div key={period.id} className={"working-form-item"}>
                  <div className={"time-wrap"}>
                    <div className={"time-input-group"}>
                      <TimePicker
                        defaultValue={moment("9:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isSaturdayDayOff || !editing}
                      />
                      <TimePicker
                        defaultValue={moment("13:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isSaturdayDayOff || !editing}
                      />
                      <MinusCircleOutlined
                        style={{ fontSize: "24px" }}
                        onClick={() => handleRemovePeriod(period.id, "Saturday")}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className={"time-actions-group"}>
                <div className={"time-actions-group-switch-wrap"}>
                  <Switch
                    onChange={checked => handleSwitchChange(checked, "Saturday")}
                    disabled={!editing}
                    checked={isSaturdayDayOff}
                  />
                  <p className={"switch-text"}>Day off</p>
                </div>
                <button
                  style={{ color: !editing ? "grey" : "" }}
                  disabled={!editing}
                  className={"time-actions-btn"}
                  onClick={() => handleAddPeriod("Saturday")}
                >
                  <PlusOutlined /> Add Period
                </button>
              </div>
            </div>
          </div>
        </Form.Item>
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className={"label"}>Sunday</p>
            <div>
              {sundayPeriods.map(period => (
                <div key={period.id} className={"working-form-item"}>
                  <div className={"time-wrap"}>
                    <div className={"time-input-group"}>
                      <TimePicker
                        defaultValue={moment("9:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isSundayDayOff || !editing}
                      />
                      <TimePicker
                        defaultValue={moment("13:00", format)}
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isSundayDayOff || !editing}
                      />
                      <MinusCircleOutlined
                        style={{ fontSize: "24px" }}
                        onClick={() => handleRemovePeriod(period.id, "Sunday")}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className={"time-actions-group"}>
                <div className={"time-actions-group-switch-wrap"}>
                  <Switch
                    onChange={checked => handleSwitchChange(checked, "Sunday")}
                    disabled={!editing}
                    checked={isSundayDayOff}
                  />
                  <p className={"switch-text"}>Day off</p>
                </div>
                <button
                  style={{ color: !editing ? "grey" : "" }}
                  disabled={!editing}
                  className={"time-actions-btn"}
                  onClick={() => handleAddPeriod("Sunday")}
                >
                  <PlusOutlined /> Add Period
                </button>
              </div>
            </div>
          </div>
        </Form.Item>*/}
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


