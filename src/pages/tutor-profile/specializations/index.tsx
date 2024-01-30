import "./index.less"
import { Form, Checkbox, Tooltip, Spin } from "antd";
import { FC, useState, useEffect } from "react";
import TutorService from "../../../api/services/Tutor";
import { useTutor, useTutorDispatch } from "../../../api/providers/TutorProvider";

const Specializations: FC<Any> = ({props}) => {
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const lession = (tutor.lessionTypeID) ? tutor.lessionTypeID.split(',') : [];
  const [lessionTypeID, setLessionTypeID] = useState(lession ?? []);
  const [editing, setEditing] = useState(false);
  const [checkboxlist, setCheckbox] = useState([]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick =() => {
    updatedTutor()
    setEditing(false);
  };
  
  const lessionType = async() => {
    let result = await TutorService.lessionTypes();
    setCheckbox(result.data.data);
  }

  useEffect(() => {
    lessionType()
    // setLessionTypeID(lession ?? []);
  }, [tutor]);

  const updatedTutor = async() => {
    const formData = {
      lessionTypeId : lessionTypeID.join()
    };
    await TutorService.updateProfile(formData);
    dispatch({
      type:"update",
      tutor:{
        lessionTypeID : lessionTypeID.join()
      }
    })
  }

  const cancle = () => {
    setEditing(false);
  }

  const handleCheckbox = async(id,event) => {
    if (event) {
      setLessionTypeID([...lessionTypeID, id.toString()]);
    } else {
      setLessionTypeID(lessionTypeID.filter((item) => item !== id.toString()));
    }
    console.log("lessionTypeID",lessionTypeID);
  }

  if(tutor?.loading){
    return(
      <Spin />
    )
  }
  
  return (
    <>
      <div className={"specializations-section"}>
      <h2 className={"specializations-section-title"}>Specializations</h2>
      <Form className={"specializations-form"}>
        <Form.Item>
          <div className={"specializations-form-item"}>
            <p className={"specializations-label"}>Lesson Types</p>
            <Tooltip
              title={"Please contact your manager if you would like to be qualified to deliver other lesson types."}
              color={"#465078"}
            >
              <div className={"specializations-checkboxes"}  >
                {checkboxlist.map((checkbox) => (
                  <Checkbox
                    key={checkbox.id}
                    checked={ lessionTypeID.includes((checkbox.id).toString())}
                    className="specializations-checkbox"
                    disabled={ !editing }
                    onChange={ (e) => handleCheckbox(checkbox.id,e.target.checked)}
                  >
                    <span style={{ color: !editing ? '#bfbfbf' : '' }}>{checkbox.title} {checkbox.lession_time > 0 && ("("+checkbox.lession_time +" hour)")}</span>
                  </Checkbox>
                ))}
              </div>
            </Tooltip>
          </div>
        </Form.Item>
        {/* {editing ? (

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

          )} */}
      </Form>
    </div>
    </>
  );
};

export default Specializations;