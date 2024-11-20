import "./index.less"
import { Form, Checkbox, Tooltip, Spin, Button } from "antd";
import { FC, useState, useEffect } from "react";
import TutorService from "../../../api/services/Tutor";
import { useTutor, useTutorDispatch } from "../../../api/providers/TutorProvider";

const Reminders: FC<Any> = ({props}) => {
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const [editing, setEditing] = useState(false);
  const [reminders, setReminders] = useState({
    is48HourRemainderEnable: tutor.is48HourRemainderEnable,
    is24HourRemainderEnable: tutor.is24HourRemainderEnable,
    is30MinuteRemainderEnable: tutor.is30MinuteRemainderEnable,
  });
  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick =() => {
    updatedTutor()
    setEditing(false);
  };
  
  useEffect(() => {
  }, [tutor]);

  const updatedTutor = async() => {
    const formData = {
      ...reminders
    };
    await TutorService.updateProfile(formData);
    dispatch({
      type:"update",
      tutor:{
        ...reminders
      }
    })
  }

  const cancle = () => {
    setReminders({
      is48HourRemainderEnable: tutor.is48HourRemainderEnable,
      is24HourRemainderEnable: tutor.is24HourRemainderEnable,
      is30MinuteRemainderEnable: tutor.is30MinuteRemainderEnable,
    });
    setEditing(false);
  }

  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>, reminderType: string) => {
    setReminders((prevState) => ({
      ...prevState,
      [reminderType]: e.target.checked,
    }));
  };
  
  if(tutor?.loading){
    return(
      <Spin />
    )
  }
  
  return (
    <>
      <div className={"reminders-section"}>
      <h2 className={"reminders-section-title"}>Receive Reminder Email Before</h2>
      <Form className={"reminders-form"}>
        <Form.Item>
            <div className={"reminders-form-item"}>
              <Checkbox
                checked={reminders.is48HourRemainderEnable == 1}
                className="reminders-checkbox"
                onChange={(e) => handleReminderChange(e, 'is48HourRemainderEnable')}
                disabled={!editing}
              >
                48 Hours
              </Checkbox>
              </div>
              <div className={"reminders-form-item"}>
              <Checkbox
                checked={reminders.is24HourRemainderEnable == 1}
                className="reminders-checkbox"
                onChange={(e) => handleReminderChange(e, 'is24HourRemainderEnable')}
                disabled={!editing}
              >
                24 Hours
              </Checkbox>
              </div>
              <div className={"reminders-form-item"}>
              <Checkbox
                checked={reminders.is30MinuteRemainderEnable == 1}
                className="reminders-checkbox"
                onChange={(e) => handleReminderChange(e, 'is30MinuteRemainderEnable')}
                disabled={!editing}
              >
                30 Minutes
              </Checkbox>
            </div>
          </Form.Item>
        {editing ? (

          <div className={"form-basic-button-wrap"}>
            <Button className={"form-button"} onClick={handleSaveClick}>Save</Button>
            <Button className={"form-button button-space"} onClick={cancle}>
              Cancel
            </Button>
          </div>

          ) : (

          <div className={"form-basic-button-wrap"}>
            <Button className={"form-button"} onClick={handleEditClick}>Edit</Button>
          </div>

          )}
      </Form>
    </div>
    </>
  );
};

export default Reminders;