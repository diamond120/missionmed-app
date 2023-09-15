

import { MinusCircleOutlined,PlusOutlined } from '@ant-design/icons';
import { Button,Form,Space,Switch,TimePicker } from 'antd';
import React,{ FC,useState } from "react";
import "./index.less";
import * as Utility from "../../../common/utility";
import moment from 'moment';
// import { useUpdateTutorMutation } from "../../../graphql";


const WorkingDaysHours: FC<{tutor: Tutor, id: string}> = ({tutor,id}) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const isMondayOff = Form.useWatch('isMondayOff', form);
  const isTuesdayOff = Form.useWatch('isTuesdayOff', form);
  const isWednesdayOff = Form.useWatch('isWednesdayOff', form);
  const isThursdayOff = Form.useWatch('isThursdayOff', form);
  const isFridayOff = Form.useWatch('isFridayOff', form);
  const isSaturdayOff = Form.useWatch('isSaturdayOff', form);
  const isSundayOff = Form.useWatch('isSundayOff', form);
  console.log("isMondayOff", isMondayOff)
  console.log("editing", editing)
  const handleEditClick = (e) => {
    setEditing(true);
    e.preventDefault();
  };

  const handleSaveClick =() => {
    updatedTutor()
    setEditing(false);
  };

  // tp Strapi
  const format = 'HH:mm';
  const [mondayFromTime, setMondayFromTime] = useState<moment.Moment | null>(moment(new Date(), format));
  
  const updatedTutor =  () => {
    // updateTutor({
    //   variables: {
    //     id: id!,
    //     input: {
    //       monday_is_day_off: isMondayDayOff,
    //       monday_working_from: mondayFromTime?.format('HH:mm') || null,
    //       monday_working_to: mondayToTime?.format('HH:mm') || null,
    //       tuesday_is_day_off: isTuesdayDayOff,
    //       tuesday_working_from: tuesdayToTime?.format('HH:mm') || null,
    //       tuesday_working_to: tuesdayFromTime?.format('HH:mm') || null,
    //       wednesday_is_day_off: isWednesdayDayOff,
    //       wednesday_working_from: wednesdayFromTime?.format('HH:mm') || null,
    //       wednesday_working_to: wednesdayToTime?.format('HH:mm') || null,
    //       thursday_is_day_off: isThursdayDayOff,
    //       thursday_working_from: thursdayFromTime?.format('HH:mm') || null,
    //       thursday_working_to: thursdayToTime?.format('HH:mm') || null,
    //       friday_is_day_off: isFridayDayOff,
    //       friday_working_from: fridayFromTime?.format('HH:mm') || null,
    //       friday_working_to: fridayToTime?.format('HH:mm') || null,
    //       saturday_is_day_off: isSaturdayDayOff,
    //       saturday_working_from: saturdayFromTime?.format('HH:mm') || null,
    //       saturday_working_to: saturdayToTime?.format('HH:mm') || null,
    //       sunday_is_day_off: isSundayDayOff,
    //       sunday_working_from: sundayFromTime?.format('HH:mm') || null,
    //       sunday_working_to: sundayToTime?.format('HH:mm') || null,

    //     }
    //   }
    // })
  }

  const formatTimeArr = (timeArr) => {
    if( timeArr.length > 0 ){
      return timeArr.map(time => ({start: time.start.format(format), end:time.end.format(format)}));
    }
    return [];
    
  }
  const onFinish = async (values: any) => {
    console.log(values);
    const Monday = formatTimeArr(values.Monday ?? []);
    const Tuesday = formatTimeArr(values.Tuesday ?? []);
    const Wednesday = formatTimeArr(values.Wednesday ?? []);
    const Thursday = formatTimeArr(values.Thursday ?? []);
    const Friday = formatTimeArr(values.Friday ?? []);
    const Saturday = formatTimeArr(values.Saturday ?? []);
    const Sunday = formatTimeArr(values.Sunday ?? []);
    let WorkingDaysHours:[
      {day:"Monday", "hours": Monday,"dayOff": values.isMondayOff},
      {day:"Tuesday", "hours": Tuesday,"dayOff": values.isTuesDayOff},
      {day:"Wednesday", "hours": Wednesday,"dayOff": values.isWednesdayOff},
      {day:"Thursday", "hours": Thursday,"dayOff": values.isThursdayOff},
      {day:"Friday", "hours": Friday,"dayOff": values.isFridayOff},
      {day:"Saturday", "hours":Saturday,"dayOff": values.isSaturdayOff},
      {day:"Sunday", "hours": Sunday,"dayOff": values.isSundayOff}
    ]
    console.log(WorkingDaysHours);
    await TutorService.updateProfile(WorkingDaysHours);
    // dispatch({
    //   type:'update',
    //   tutor:{
    //     fullName: fullName !== '' ? fullName : tutor?.fullName,
    //     gender: gender !== '' ? gender : tutor?.gender,
    //     email: email !== '' ? email : tutor?.email,
    //     pronouns: pronouns !== '' ? pronouns : tutor?.pronouns,
    //     location: autoSelected ? autoSelectedLocation : location !== '' ? location : tutor?.location,
    //     timezone: autoSelected ? localTimezone.label : selectedTimezone !== '' ? selectedTimezone : tutor?.timezone
    //   }
    // })

    setEditing(false);
    return false;
    //Utility.formatTime(values, format);
    console.log(values.mondayWorkingHours[0].from.format(format));
    // console.log(values.mondayWorkingHours[1].from.format(format));
    
    return false;
   // updatedTutor(values);
    
  };
  console.log(isMondayOff || !editing);

  return (
    <div className={"working-section"}>
      <h2 className={"working-section-title"}>Working Days & Hours</h2>
      <Form className={"working-form"} form={form} onFinish={onFinish}>
      <p className={"label"}>Monday</p>
      <Form.List name="Monday">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: true, message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={(isMondayOff || !editing)}
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: true, message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isMondayOff || !editing}
                      />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isMondayOff"}
          label="Day off"
          initialValue={"false"}
        >
        <Switch />
        </Form.Item>
        <Form.List name="Tuesday">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: true, message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={(isTuesdayOff || !editing)}
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: true, message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isTuesdayOff || !editing}
                      />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isTuesdayOff"}
          label="Day off"
          initialValue={"false"}
        >
        <Switch />
        </Form.Item>
        <Form.List name="Wednesday">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: true, message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={(isWednesdayOff || !editing)}
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: true, message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isWednesdayOff || !editing}
                      />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isWednesdayOff"}
          label="Day off"
          initialValue={"false"}
        >
        <Switch />
        </Form.Item>

        <Form.List name="Thursday">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: true, message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={(isThursdayOff || !editing)}
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: true, message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isThursdayOff || !editing}
                      />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isThursdayOff"}
          label="Day off"
          initialValue={"false"}
        >
        <Switch />
        </Form.Item>


        <Form.List name="Friday">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: true, message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={(isFridayOff || !editing)}
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: true, message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isFridayOff || !editing}
                      />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isFridayOff"}
          label="Day off"
          initialValue={"false"}
        >
        <Switch />
        </Form.Item>

        <Form.List name="Saturday">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: true, message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={(isSaturdayOff || !editing)}
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: true, message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isSaturdayOff || !editing}
                      />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isSaturdayOff"}
          label="Day off"
          initialValue={"false"}
        >
        <Switch />
        </Form.Item>

        <Form.List name="Sunday">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'start']}
                  rules={[{ required: true, message: 'start time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={(isSundayOff || !editing)}
                      />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'end']}
                  rules={[{ required: true, message: 'end time required' }]}
                  initialValue={moment("9:00", format)}
                >
                   <TimePicker
                        minuteStep={15}
                        format={format}
                        style={{ width: "140px" }}
                        className={"input"}
                        disabled={isSundayOff || !editing}
                      />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Period
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.Item
          name={"isSundayOff"}
          label="Day off"
          initialValue={"false"}
        >
        <Switch />
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


