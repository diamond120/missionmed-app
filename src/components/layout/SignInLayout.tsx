import React, { Suspense } from "react"
import { FC } from "react"
import { Layout } from "antd"

import { Outlet } from "react-router-dom"


const SignInLayout: FC = () => {
  const { Content } = Layout
return(

    <Content>
      <Suspense>
        <Outlet />
      </Suspense>
    </Content>

)

};

export default SignInLayout;