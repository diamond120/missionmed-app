

import { MinusCircleOutlined,PlusOutlined } from '@ant-design/icons';
import { Button,Form,Switch,TimePicker } from 'antd';
import React,{ FC,useState } from "react";
import "./index.less";
import * as Utility from "../../../common/utility";
import moment from 'moment';
// import { useUpdateTutorMutation } from "../../../graphql";


const WorkingDaysHours: FC<{tutor: Tutor, id: string}> = ({tutor,id}) => {
  const [editing, setEditing] = useState(false);
  // const [updateTutor]= useUpdateTutorMutation()

  const handleEditClick = (e) => {
    setEditing(true);
    e.preventDefault();
  };

  const handleSaveClick =() => {
    updatedTutor()
    setEditing(false);
  };

  const [mondayPeriods, setMondayPeriods] = useState([{ id: 1 }]);
  const [tuesdayPeriods, setTuesdayPeriods] = useState([{ id: 1 }]);
  const [wednesdayPeriods, setWednesdayPeriods] = useState([{ id: 1 }]);
  const [thursdayPeriods, setThursdayPeriods] = useState([{ id: 1 }]);
  const [fridayPeriods, setFridayPeriods] = useState([{ id: 1 }]);
  const [saturdayPeriods, setSaturdayPeriods] = useState([{ id: 1 }]);
  const [sundayPeriods, setSundayPeriods] = useState([{ id: 1 }]);

  const [isMondayDayOff, setMondayDayOff] = useState<boolean | undefined>(false);
  const [isTuesdayDayOff, setTuesdayDayOff] = useState<boolean | undefined>(false);
  const [isWednesdayDayOff, setWednesdayDayOff] = useState<boolean | undefined>(false);
  const [isThursdayDayOff, setThursdayDayOff] = useState<boolean | undefined>(false);
  const [isFridayDayOff, setFridayDayOff] = useState<boolean | undefined>(false);
  const [isSaturdayDayOff, setSaturdayDayOff] = useState<boolean | undefined>(false);
  const [isSundayDayOff, setSundayDayOff] = useState<boolean | undefined>(false);
  // tp Strapi
  const format = 'HH:mm';
  const [mondayFromTime, setMondayFromTime] = useState<moment.Moment | null>(moment(new Date(), format));
  const [mondayToTime, setMondayToTime] = useState<moment.Moment | null>(moment(new Date(),format));
  const [tuesdayFromTime,setTuesdayFromTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const [tuesdayToTime,setTuesdayToTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const [wednesdayFromTime,setWednesdayFromTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const [wednesdayToTime,setWednesdayToTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const [thursdayFromTime, setThursdayFromTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const [thursdayToTime, setThursdayToTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const [fridayFromTime,setFridayFromTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const [fridayToTime,setFridayToTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const [saturdayFromTime,setSaturdayFromTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const [saturdayToTime,setSaturdayToTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const [sundayFromTime,setSundayFromTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const [sundayToTime,setSundayToTime] = useState<moment.Moment | null>(moment(new Date(), format))
  const handleRemovePeriod = (id: number, day: string) => {



    switch (day) {
      case 'Monday':
        if (mondayPeriods.length === 1) {
          return;
        }
        const filteredMondayPeriods = mondayPeriods.filter((period) => period.id !== id);
        setMondayPeriods(filteredMondayPeriods);
        break;
      case 'Tuesday':
        if (tuesdayPeriods.length === 1) {
          return;
        }
        const filteredTuesdayPeriods = tuesdayPeriods.filter((period) => period.id !== id);
        setTuesdayPeriods(filteredTuesdayPeriods);
        break;
      case 'Wednesday':
        if (wednesdayPeriods.length === 1) {
          return;
        }
        const filteredWednesdayPeriods = wednesdayPeriods.filter((period) => period.id !== id);
        setWednesdayPeriods(filteredWednesdayPeriods);
        break;
      case 'Thursday':
        if (thursdayPeriods.length === 1) {
          return;
        }
        const filteredThursdayPeriods = thursdayPeriods.filter((period) => period.id !== id);
        setThursdayPeriods(filteredThursdayPeriods);
        break;
      case 'Friday':
        if (fridayPeriods.length === 1) {
          return;
        }
        const filteredFridayPeriods = fridayPeriods.filter((period) => period.id !== id);
        setFridayPeriods(filteredFridayPeriods);
        break;
      case 'Saturday':
        if (saturdayPeriods.length === 1) {
          return;
        }
        const filteredSaturdayPeriods = saturdayPeriods.filter((period) => period.id !== id);
        setSaturdayPeriods(filteredSaturdayPeriods);
        break;
      case 'Sunday':
        if (sundayPeriods.length === 1) {
          return;
        }
        const filteredSundayPeriods = sundayPeriods.filter((period) => period.id !== id);
        setSundayPeriods(filteredSundayPeriods);
        break;
      default:
        break;
    }
  };

  const handleSwitchChange = (checked: boolean, day: string) => {
    switch (day) {
      case 'Monday':
        setMondayDayOff(checked);
        break;
      case 'Tuesday':
        setTuesdayDayOff(checked);
        break;
      case 'Wednesday':
        setWednesdayDayOff(checked);
        break;
      case 'Thursday':
        setThursdayDayOff(checked);
        break;
      case 'Friday':
        setFridayDayOff(checked);
        break;
      case 'Saturday':
        setSaturdayDayOff(checked);
        break;
      case 'Sunday':
        setSundayDayOff(checked);
        break;
      default:
        break;
    }
  };

  const handleAddPeriod = (day: string) => {
    switch (day) {
      case 'Monday':
        const newMondayId = mondayPeriods.length + 1;
        const newMondayPeriod = { id: newMondayId };
        setMondayPeriods([...mondayPeriods, newMondayPeriod]);
        break;
      case 'Tuesday':
        const newTuesdayId = tuesdayPeriods.length + 1;
        const newTuesdayPeriod = { id: newTuesdayId };
        setTuesdayPeriods([...tuesdayPeriods, newTuesdayPeriod]);
        break;
      case 'Wednesday':
        const newWednesdayId = wednesdayPeriods.length + 1;
        const newWednesdayPeriod = { id: newWednesdayId };
        setWednesdayPeriods([...wednesdayPeriods, newWednesdayPeriod]);
        break;
      case 'Thursday':
        const newThursdayId = thursdayPeriods.length + 1;
        const newThursdayPeriod = { id: newThursdayId };
        setThursdayPeriods([...thursdayPeriods, newThursdayPeriod]);
        break;
      case 'Friday':
        const newFridayId = fridayPeriods.length + 1;
        const newFridayPeriod = { id: newFridayId };
        setFridayPeriods([...fridayPeriods, newFridayPeriod]);
        break;
      case 'Saturday':
        const newSaturdayId = saturdayPeriods.length + 1;
        const newSaturdayPeriod = { id: newSaturdayId };
        setSaturdayPeriods([...saturdayPeriods, newSaturdayPeriod]);
        break;
      case 'Sunday':
        const newSundayId = sundayPeriods.length + 1;
        const newSundayPeriod = { id: newSundayId };
        setSundayPeriods([...sundayPeriods, newSundayPeriod]);
        break;
      default:
        break;
    }
  };
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

  const onFinish = (values: any) => {
    console.log(values);
    //Utility.formatTime(values, format);
    console.log(values.mondayWorkingHours[0].from.format(format));
    // console.log(values.mondayWorkingHours[1].from.format(format));
    
    return false;
   // updatedTutor(values);
    setEditing(false);
  };

  return (
    <div className={"working-section"}>
      <h2 className={"working-section-title"}>Working Days & Hours</h2>
      <Form className={"working-form"} onFinish={onFinish}>
      <Form.Item>
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
        </Form.Item> */}
          

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
        </Form.Item>
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


