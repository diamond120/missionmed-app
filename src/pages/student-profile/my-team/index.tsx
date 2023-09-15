
import  "./index.less"
import { UserOutlined } from "@ant-design/icons"
import { Avatar } from "antd"


const MyTeam = () => {
  return(
    <div className={"my-team-section"}>
      <h2 className={"my-team-section-title"}>My MissionMed Team</h2>
      <div className={"my-team-wrap"}>
        <div className={"my-team-item"}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ marginBottom: "16px" }}
          />
          <div className={"my-team-item-text-wrap"}>
            <h2 className={"my-team-item-name"}>Kristin Watson</h2>
            <p className={"my-team-item-position"}>Mock Interview</p>
          </div>
        </div>
        <div className={"my-team-item"}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ marginBottom: "16px" }}
          />
          <div className={"my-team-item-text-wrap"}>
            <h2 className={"my-team-item-name"}>Esther Howard</h2>
            <p className={"my-team-item-position"}>Application Review</p>
          </div>
        </div>
        <div className={"my-team-item"}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ marginBottom: "16px" }}
          />
          <div className={"my-team-item-text-wrap"}>
            <h2 className={"my-team-item-name"}>Ronald Richards</h2>
            <p className={"my-team-item-position"}>Mock Interview </p>
          </div>
        </div>
        <div className={"my-team-item"}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ marginBottom: "16px" }}
          />
          <div className={"my-team-item-text-wrap"}>
            <h2 className={"my-team-item-name"}>Jacob Jones</h2>
            <p className={"my-team-item-position"}>UCAT Tutor</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MyTeam