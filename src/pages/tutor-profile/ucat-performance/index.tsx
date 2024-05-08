import "./index.less";
import { Button, Form, Input } from "antd";
import { FC, useState } from "react";
import TutorService from "../../../api/services/Tutor";
import { useTutorDispatch, useTutor } from "../../../api/providers/TutorProvider";

const UcatPerformance: FC<any> = ({ props }) => {
  const [form] = Form.useForm();
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const [editing, setEditing] = useState(false);
  const [percentile, setPercentile] = useState('');
  const [score, setScore] = useState('');
  const [tagline, setTagline] = useState<string | undefined | null>('');

  const updatedTutor = async () => {
    await TutorService.updateProfile({
      percentile: percentile !== '' ? percentile : tutor?.percentile,
      score: score !== '' ? score : tutor?.score,
      tagline: tagline !== '' ? tagline : tutor?.tagline,
    });
    dispatch({
      type: 'update',
      tutor: {
        percentile: percentile !== '' ? percentile : tutor?.percentile,
        score: score !== '' ? score : tutor?.score,
        tagline: tagline !== '' ? tagline : tutor?.tagline,
      }
    })
  }
  const handleEditClick = () => {
    setEditing(true);
  };

  const cancle = () => {
    setEditing(false);
  };

  const handleSaveClick = async () => {
    try {
        await form.validateFields();
        updatedTutor()
        setEditing(false);
      } catch (e) {
        return false;
      }
      return false;
  };

  return (
    <div className="basic-information">
      <h2 className="basic-information-title">UCAT Performance</h2>

      <Form className="basic-information-form" form={form} colon={false}>
        <Form.Item
          name="percentile"
          label={"Percentile"}
          rules={[
            { required: true },
            {
            pattern: /^[0-9]*$/,
            message: 'Please enter a valid integer percentile',
            },
          ]}
          initialValue={tutor?.percentile ?? ""}
        >
          <Input
            className="input"
            disabled={!editing}
            onChange={(e) => setPercentile(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="score"
          label={"Score"}
          rules={[
            { required: true },
            {
            pattern: /^[0-9]*$/,
            message: 'Please enter a valid integer score',
            },
          ]}
          initialValue={tutor?.score ?? ""}
        >
          <Input
            className="input"
            disabled={!editing}
            onChange={(e) => setScore(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="tagline"
          label={"Tagline"}
          rules={[
            { required: true},
            {
                max: 40,
                message: 'Tagline should not exceed 40 characters',
            },
          ]}
          initialValue={tutor?.tagline ?? ""}
        >
          <Input
            className="input"
            disabled={!editing}
            onChange={(e) => setTagline(e.target.value)}
          />
        </Form.Item>
        {editing ? (
          <div className="form-basic-button-wrap">
            <Button className="form-button" onClick={handleSaveClick}>
              Save
            </Button>
            <Button className="form-button button-space" onClick={cancle}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="form-basic-button-wrap">
            <Button className="form-button" onClick={handleEditClick}>
              Edit
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default UcatPerformance;
