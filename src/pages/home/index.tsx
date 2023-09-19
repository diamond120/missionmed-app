
import { Typography } from "antd"
import React, { FC, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {useUser} from "../../api/providers/UserProvider";

const Home: FC = () => {
  const navigate = useNavigate()
  const user = useUser();

  if(user.role == "student"){
    navigate("/application_review")
  }else{
    navigate("/tutor/application_review")
  }

  return (
    <React.Fragment>
      <Typography.Title level={1}>Home</Typography.Title>
    </React.Fragment>
  )
}

export default Home