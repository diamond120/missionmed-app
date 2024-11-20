import "./index.less"
import { Form, Checkbox, Spin, Button } from "antd";
import { FC, useState, useEffect } from "react";
import StudentService from "../../../api/services/Student";
import { useStudent, useStudentDispatch } from "../../../api/providers/StudentProvider";

const Reminders: FC<Any> = ({props}) => {
  const student = useStudent();
  const dispatch = useStudentDispatch();
  const [editing, setEditing] = useState(false);
  const [reminders, setReminders] = useState({
    is_48_hour_remainder_enable: student.is_48_hour_remainder_enable,
    is_24_hour_remainder_enable: student.is_24_hour_remainder_enable,
    is_30_minute_remainder_enable: student.is_30_minute_remainder_enable,
  });
  console.log(student)
  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick =() => {
    updatedStudent()
    setEditing(false);
  };
  
  useEffect(() => {
  }, [student]);

  const updatedStudent = async() => {
    const formData = {
      ...reminders
    };
    await StudentService.updateProfile(formData);
    dispatch({
      type:"update",
      student:{
        ...reminders
      }
    })
  }

  const cancle = () => {
    setReminders({
      is_48_hour_remainder_enable: student.is_48_hour_remainder_enable,
      is_24_hour_remainder_enable: student.is_24_hour_remainder_enable,
      is_30_minute_remainder_enable: student.is_30_minute_remainder_enable,
    });
    setEditing(false);
  }

  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>, reminderType: string) => {
    setReminders((prevState) => ({
      ...prevState,
      [reminderType]: e.target.checked,
    }));
  };
  
  if(student?.loading){
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
                checked={reminders.is_48_hour_remainder_enable == 1}
                className="reminders-checkbox"
                onChange={(e) => handleReminderChange(e, 'is_48_hour_remainder_enable')}
                disabled={!editing}
              >
                48 Hours
              </Checkbox>
              </div>
              <div className={"reminders-form-item"}>
              <Checkbox
                checked={reminders.is_24_hour_remainder_enable == 1}
                className="reminders-checkbox"
                onChange={(e) => handleReminderChange(e, 'is_24_hour_remainder_enable')}
                disabled={!editing}
              >
                24 Hours
              </Checkbox>
              </div>
              <div className={"reminders-form-item"}>
              <Checkbox
                checked={reminders.is_30_minute_remainder_enable == 1}
                className="reminders-checkbox"
                onChange={(e) => handleReminderChange(e, 'is_30_minute_remainder_enable')}
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