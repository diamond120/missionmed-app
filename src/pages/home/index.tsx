import { Typography } from 'antd'
import React, { FC, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../api/providers/UserProvider'

const Home: FC = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  useEffect(() => {
    navigate(user.role == 'student' ? '/application_review' : '/tutor/application_review')
  }, [user.role])

  return (
    <React.Fragment>
      <Typography.Title level={1}>Home</Typography.Title>
    </React.Fragment>
  )
}

export default Home
