import "./index.less"
import { QuestionCircleFilled, UserOutlined } from "@ant-design/icons"
import { Avatar, Button } from "antd"

const PersonalityTutor = () => {
  return(
    <div className={"personality-tutor-section"}>
      <h2 className={"personality-section-title"}>Personality<QuestionCircleFilled  style={{marginLeft:"8px"}}/></h2>
      <div className={"personality-tutor-wrap"}>
        <div className={"personality-info"}>
          <Avatar
            size={104}
            icon={<UserOutlined />}
          />
          <div className={"personality-info-text-block"}>
            <h2 className={"personality-info-title"}>Debater</h2>
            <p className={"personality-info-subtitle"}>Personality</p>
            <p className={"personality-info-text"}>INTP-A / INTP-T</p>
          </div>
        </div>
        <div className={"personality-actions"}>
          <Button className={"personality-actions-btn-retake"}>Retake Quiz</Button>
          <Button className={"personality-actions-btn-learn"}>Learn More</Button>
        </div>
      </div>
    </div>
  )
}
export default PersonalityTutor