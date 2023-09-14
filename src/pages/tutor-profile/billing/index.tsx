import "./index.less"
import { Button, Form, Input } from "antd"
import { valueType } from "antd/lib/statistic/utils";
import { FC, useState } from "react"
// import { useUpdateTutorMutation } from "src/graphql";

const Billing: FC<{tutor: Tutor, id: string}> = ({tutor,id}) => {
  // const [updateTutor]= useUpdateTutorMutation();
  const [editing, setEditing] = useState(false);
  const [ucatTutoringPrice, setUcatTutoringPrice] = useState<valueType | undefined | null>();
  const [interviewTutoringPrice, setInterviewTutoringPrice] = useState<valueType | undefined | null>();
  const [mockInterviewPrice, setMockInterviewPrice] = useState<valueType | undefined | null>();
  const [applicationReviewPrice, setApplicationReviewPrice] = useState<valueType | undefined | null>();

  const updatedTutor =  async () => {
    // await updateTutor({
    //   variables: {
    //     id: id!,
    //     input: {
    //       ucat_tutoring_price: ucatTutoringPrice ? ucatTutoringPrice.toString() : tutor?.ucat_tutoring_price,
    //       interview_tutoring_price: interviewTutoringPrice ? interviewTutoringPrice.toString() : tutor?.interview_tutoring_price,
    //       mock_interview_price: mockInterviewPrice ? mockInterviewPrice.toString() : tutor?.mock_interview_price,
    //       application_review_price: applicationReviewPrice ? applicationReviewPrice.toString() : tutor?.application_review_price,
    //     }
    //   }
    // })
  }

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick =() => {
    updatedTutor()
    setEditing(false);
  };

  return(
    <div className={"billing-section"}>
      <h2 className={"billing-section-title"}>Billing</h2>
        <Form className={"billing-form"}>
          <Form.Item
            name={"UCAT 1-to-1 Tutoring"}
            rules={[{ required: false,}]}
          >
            <div className={"billing-form-item"}>
              <p className={"label"}>UCAT 1-to-1 Tutoring</p>
              <div className={"price-wrap"}>
                <p className={"price"}>
                  <Input className={"input"} disabled={ !editing } style={{width: 200, color: !editing? "#bfbfbf" : "", backgroundColor: !editing? "#f5f5f5" : "" }} defaultValue={tutor?.ucat_tutoring_price ?? ""} onChange={e => setUcatTutoringPrice(e.target.value) }/>
                </p>
                <p className={"rate"}>Rate per Hour</p>
              </div>
            </div>
          </Form.Item>
          <Form.Item
            name={"Interview 1-to-1 Tutoring"}
            rules={[{ required: false,}]}
          >
            <div className={"billing-form-item"}>
              <p className={"label"}>Interview 1-to-1 Tutoring</p>
              <div className={"price-wrap"}>
                <p className={"price"}>
                  <Input className={"input"} disabled={ !editing } style={{width: 200, color: !editing? "#bfbfbf" : "", backgroundColor: !editing? "#f5f5f5" : "" }} defaultValue={tutor?.interview_tutoring_price ?? ""} onChange={e => setInterviewTutoringPrice(e.target.value)}/>
                </p>
                  <p className={"rate"}>Rate per Hour</p>
              </div>
            </div>
          </Form.Item>
          <Form.Item
            name={"Mock Interview"}
            rules={[{ required: false,}]}
          >
            <div className={"billing-form-item"}>
              <p className={"label"}>Mock Interview</p>
              <div className={"price-wrap"}>
                <p className={"price"}>
                  <Input className={"input"}  disabled={ !editing } style={{width: 200, color: !editing? "#bfbfbf" : "", backgroundColor: !editing? "#f5f5f5" : "" }} defaultValue={tutor?.mock_interview_price ?? ""} onChange={e => setMockInterviewPrice(e.target.value)}/>
                </p>
                <p className={"rate"}>Rate per Hour</p>
              </div>
            </div>
          </Form.Item>
          <Form.Item
            name={"Application Review"}
            rules={[{ required: false,}]}
          >
            <div className={"billing-form-item"}>
              <p className={"label"}>Application Review</p>
              <div className={"price-wrap"}>
                <p className={"price"}>
                  <Input className={"input"} disabled={ !editing } style={{width: 200, color: !editing? "#bfbfbf" : "", backgroundColor: !editing? "#f5f5f5" : "" }}  
                  defaultValue={tutor?.application_review_price ?? ""} onChange={(e) => setApplicationReviewPrice(e.target.value)}/>
                </p>
                <p className={"rate"}>Rate per Hour</p>
              </div>
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
  )
}
export default Billing