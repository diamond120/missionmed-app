
import  "./index.less"
import { UserOutlined } from "@ant-design/icons"
import { Avatar } from "antd"
import {  useEffect, useState } from "react";

import CommonService from "../../../api/services/Common";





const MyTeam = () => {

  const [team, setTeam] = useState();

const getTeamData = async () => {
  try{
    const result = await CommonService.getAPI('/student/tutor-team');
    
    if(result.data.success){
     const data  = result.data.data;
     setTeam(data);
    }else{
      console.log(result.data.message);
    }
  }catch(e){
    console.log(e);
  }
}


  useEffect(() => {
    getTeamData();
    console.log(team);
  },[] );
  
  return(
    <div className={"my-team-section"}>
      <h2 className={"my-team-section-title"}>My MissionMed Team</h2>
      <div className={"my-team-wrap"}>
        { (!team || team.length <= 0) && (
          <h1>No Team found</h1>
        )
        }
      {team && team.map((item) => (
        <div className={"my-team-item"}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ marginBottom: "16px" }}
          />
          <div className={"my-team-item-text-wrap"}>
            <h2 className={"my-team-item-name"}>{item.full_name}</h2>
            <p className={"my-team-item-position"}>{item.lessionTypes}</p>
          </div>
        </div>
      ))}
        {/* <div className={"my-team-item"}>
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
        </div> */}
      </div>

    </div>
  )
}

export default MyTeam