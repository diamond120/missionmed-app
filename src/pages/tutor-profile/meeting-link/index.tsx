
import "./index.less";
import { FC, useState } from "react"
import { Button, Form, Input, RadioChangeEvent, Spin } from "antd"
import TutorService from "../../../api/services/Tutor";
import { useTutor, useTutorDispatch } from "../../../api/providers/TutorProvider";

const MeetingLink: FC<Any> = () => {
    const tutor = useTutor();
    const dispatch = useTutorDispatch();
    const [personalMeetingId, setPersonalMeetingId] = useState(tutor?.personalMeetingId);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleSaveClick = () => {
        updatedTutor()
        setEditing(false);
    };

    const cancle = () => {
        setPersonalMeetingId(tutor?.personalMeetingId);
        setEditing(false);
    }

    const updatedTutor = async () => {
        await TutorService.updateProfile({
            // personalMeetingId: personalMeetingId !== '' ? personalMeetingId : tutor?.personalMeetingId,
            personalMeetingId: personalMeetingId,
        });
        dispatch({
            type: "update",
            tutor: {
                personalMeetingId: personalMeetingId,
            }
        })
    }

    if (tutor?.loading) {
        return (
            <Spin />
        )
    }

    return (
        <div className={"buffer-time-section"}>
            <h2 className={"buffer-time-section-title"}>Meeting Preferences</h2>
            <Form className={"buffer-time-form"} form={form}>
                <Form.Item
                    name={"bufferTime"}>
                    <div className={"link-form-item"}>
                        <p className={"label"}>Set your personal meeting ID</p>
                        <br />
                        <p>This will be the link that your student receives. Please check to make sure it work properly.</p>
                        <Input.TextArea className={"biography-input w-full"} placeholder={"Set your Personal Meeting Link URL"} disabled={!editing} style={{ color: !editing ? "#bfbfbf" : "", backgroundColor: !editing ? "#f5f5f5" : "" }} defaultValue={tutor?.personalMeetingId ?? ''} onChange={e => setPersonalMeetingId(e.target.value)} />
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

export default MeetingLink;
