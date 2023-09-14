
import "./index.less";
import { FC, useState } from "react"
import { Button, Form, Radio, RadioChangeEvent } from "antd"
// import { useUpdateTutorMutation } from "../../../graphql"

  const BufferTime: FC<{tutor: Tutor, id: string}> = ({tutor,id}) => {
  const [selectedTime, setSelectedTime] = useState();
  // const [updateTutor]= useUpdateTutorMutation()
    const [editing, setEditing] = useState(false);
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
  const updatedTutor =  () => {
    // updateTutor({
    //   variables: {
    //     id: id!,
    //     input: {
    //       buffer_time: selectedTime !== '' ? selectedTime : tutor?.full_name,


    //     }
    //   }
    // })
  }
  return (
    <div className={"buffer-time-section"}>
      <h2 className={"buffer-time-section-title"}>Buffer Time</h2>
      <Form className={"buffer-time-form"}>
        <Form.Item>
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
