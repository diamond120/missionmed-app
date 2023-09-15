
import { Typography } from "antd"
import React, { FC, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Tutor from  "../../api/services/Tutor.js";
import Student from  "../../api/services/Student.js";

const Home: FC = () => {
  const navigate = useNavigate()
  
  const student = true;
  const tutor = false;
  // const student = dataMe.data?.me?.student?.data?.id
  // const tutor = dataMe.data?.me?.tutor?.data?.id


 // const props = data?.home?.data?.attributes?.hero

  // useEffect(() => {
  //   if (student) {
  //     navigate("/application_review")
  //   }else if(tutor) {
  //     navigate("/tutor/application_review")
  //   }
    
  // }, [student, tutor])
  // useEffect(() => {
  //   navigate("/application_review");
  // })

  return (
    <React.Fragment>
      <Typography.Title level={1}>Home</Typography.Title>
    </React.Fragment>
  )
}

export default Home