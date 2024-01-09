import "./index.less"
import { Button, Form, Input, Spin } from "antd"
import { valueType } from "antd/lib/statistic/utils";
import { FC, useState } from "react"
import TutorService from "../../../api/services/Tutor";
import { useTutor, useTutorDispatch } from "../../../api/providers/TutorProvider";

const Billing: FC<Any> = ({ props }) => {
  const tutor = useTutor();
  const dispatch = useTutorDispatch();
  const [editing, setEditing] = useState(false);
  const [ucatTutoringPrice, setUcatTutoringPrice] = useState<valueType | undefined | null>();
  const [interviewTutoringPrice, setInterviewTutoringPrice] = useState<valueType | undefined | null>();
  const [mockInterviewPrice, setMockInterviewPrice] = useState<valueType | undefined | null>();
  const [applicationReviewPrice, setApplicationReviewPrice] = useState<valueType | undefined | null>();

  const updatedTutor = async () => {
    await TutorService.updateProfile({
      ucatTutoringPrice: ucatTutoringPrice ? ucatTutoringPrice.toString() : tutor?.ucatTutoringPrice,
      interviewTutoringPrice: interviewTutoringPrice ? interviewTutoringPrice.toString() : tutor?.interviewTutoringPrice,
      mockInterviewPrice: mockInterviewPrice ? mockInterviewPrice.toString() : tutor?.mockInterviewPrice,
      applicationReviewPrice: applicationReviewPrice ? applicationReviewPrice.toString() : tutor?.applicationReviewPrice,
    });
    dispatch(({
      type: "update",
      tutor: {
        ucatTutoringPrice: ucatTutoringPrice ? ucatTutoringPrice.toString() : tutor?.ucatTutoringPrice,
        interviewTutoringPrice: interviewTutoringPrice ? interviewTutoringPrice.toString() : tutor?.interviewTutoringPrice,
        mockInterviewPrice: mockInterviewPrice ? mockInterviewPrice.toString() : tutor?.mockInterviewPrice,
        applicationReviewPrice: applicationReviewPrice ? applicationReviewPrice.toString() : tutor?.applicationReviewPrice,
      }
    }))
  }

  const handleEditClick = () => {
    setEditing(true);
  };

  const cancle = () => {
    setEditing(false);
  }

  const handleSaveClick = () => {
    updatedTutor()
    setEditing(false);
  };

  if (tutor?.loading) {
    return (
      <Spin />
    )
  }

  return (
    <div className={"billing-section"}>
      <h2 className={"billing-section-title"}>Billing</h2>
      <Form className={"billing-form"}>
        <Form.Item
          name={"UCAT 1-to-1 Tutoring"}
          rules={[{ required: false, }]}
        >
          <div className={"billing-form-item"}>
            <p className={"label"}>UCAT 1-to-1 Tutoring</p>
            <div className={"price-wrap"}>
              <p className={"price"}>
                <Input type="hidden" value={JSON.stringify(tutor)} />
                <Input className={"input"} value={tutor?.ucatTutoringPrice} disabled={!editing} style={{ width: 200, color: !editing ? "#bfbfbf" : "", backgroundColor: !editing ? "#f5f5f5" : "" }} defaultValue={tutor?.ucatTutoringPrice ?? ""} onChange={e => setUcatTutoringPrice(e.target.value)} />
              </p>
              <p className={"rate"}>Rate per Session</p>
            </div>
          </div>
        </Form.Item>
        <Form.Item
          name={"Interview 1-to-1 Tutoring"}
          rules={[{ required: false, }]}
        >
          <div className={"billing-form-item"}>
            <p className={"label"}>Interview 1-to-1 Tutoring</p>
            <div className={"price-wrap"}>
              <p className={"price"}>
                <Input className={"input"} value={tutor?.interviewTutoringPrice} disabled={!editing} style={{ width: 200, color: !editing ? "#bfbfbf" : "", backgroundColor: !editing ? "#f5f5f5" : "" }} defaultValue={tutor?.interviewTutoringPrice ?? ""} onChange={e => setInterviewTutoringPrice(e.target.value)} />
              </p>
              <p className={"rate"}>Rate per Session</p>
            </div>
          </div>
        </Form.Item>
        <Form.Item
          name={"Mock Interview"}
          rules={[{ required: false, }]}
        >
          <div className={"billing-form-item"}>
            <p className={"label"}>Mock Interview</p>
            <div className={"price-wrap"}>
              <p className={"price"}>
                <Input className={"input"} value={tutor?.mockInterviewPrice} disabled={!editing} style={{ width: 200, color: !editing ? "#bfbfbf" : "", backgroundColor: !editing ? "#f5f5f5" : "" }} defaultValue={tutor?.mockInterviewPrice ?? ""} onChange={e => setMockInterviewPrice(e.target.value)} />
              </p>
              <p className={"rate"}>Rate per Session</p>
            </div>
          </div>
        </Form.Item>
        <Form.Item
          name={"Application Review"}
          rules={[{ required: false, }]}
        >
          <div className={"billing-form-item"}>
            <p className={"label"}>Application Review</p>
            <div className={"price-wrap"}>
              <p className={"price"}>
                <Input className={"input"} disabled={!editing} value={tutor?.applicationReviewPrice} style={{ width: 200, color: !editing ? "#bfbfbf" : "", backgroundColor: !editing ? "#f5f5f5" : "" }}
                  defaultValue={tutor?.applicationReviewPrice ?? "0"} onChange={(e) => setApplicationReviewPrice(e.target.value)} />
              </p>
              <p className={"rate"}>Rate per Session</p>
            </div>
          </div>
        </Form.Item>
        {editing && (
          <div className={"form-basic-button-wrap"}>
            <Button className={"form-button"} onClick={handleSaveClick}>Save</Button>
            <Button className={"form-button button-space"} onClick={cancle}>
              Cancel
            </Button>
          </div>
        )
          // : (
          // <div className={"form-basic-button-wrap"}>
          //   <Button className={"form-button"} onClick={handleEditClick}>Edit</Button>
          // </div>
          // )
        }
      </Form>

    </div>
  )
}

export default Billing