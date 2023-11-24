
import "./index.less";
import { FC, useState } from "react"
import { Button, Form, Radio, RadioChangeEvent, Spin } from "antd"
import TutorService from "../../../api/services/Tutor";
import {useTutor, useTutorDispatch} from "../../../api/providers/TutorProvider";

const BufferTime: FC<Any> = ({props}) => {
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const [selectedTime, setSelectedTime] = useState(tutor?.bufferTime);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

    const handleTimeChange = (e: RadioChangeEvent) => {
      setSelectedTime(e.target.value);
    };
    const handleEditClick = () => {
      setEditing(true);
    };

    const handleSaveClick =() => {
      updatedTutor()
      setEditing(false);
    };

    const  cancle = () => {
      // form.resetFields();
      setSelectedTime(tutor?.bufferTime);
      setEditing(false);
    }

    const updatedTutor = async() => {
      await TutorService.updateProfile({
        addBufferTime : true,
        bufferTime: selectedTime !== '' ? selectedTime : tutor?.bufferTime,
      });
      dispatch({
        type:"update",
        tutor:{
          bufferTime: selectedTime !== '' ? selectedTime : tutor?.bufferTime,
        }
      })
    }
    
    if(tutor?.loading){
      return(
        <Spin />
      )
    }
    
    return (
      <div className={"buffer-time-section"}>
        <h2 className={"buffer-time-section-title"}>Buffer Time</h2>
        <Form className={"buffer-time-form"} form={form}>
          <Form.Item
          name={"bufferTime"}>
            <div className={"buffer-time-form-item"}>
              <p className={"label"}>Buffer Time</p>
              <Radio.Group className={"buffer-time-checkboxes"} onChange={handleTimeChange} value={selectedTime}>
                <Radio className={"buffer-time-checkbox"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",}} value={'5 minutes'}>5 minutes</Radio>
                <Radio className={"buffer-time-checkbox"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",}} value={'10 minutes'}>10 minutes</Radio>
                <Radio className={"buffer-time-checkbox"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",}} value={'15 minutes'}>15 minutes</Radio>
                <Radio className={"buffer-time-checkbox"} disabled={ !editing } style={{color: !editing? "#bfbfbf" : "",}} value={'20 minutes'}>20 minutes</Radio>
              </Radio.Group>
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
    );
};

export default BufferTime;
