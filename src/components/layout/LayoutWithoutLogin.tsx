import "./DefaultLayout.less"
import { Layout } from "antd"
import { CSSProperties, FC, Suspense, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useBreakpoints } from "../screen"
import WithoutLoginSidebar from "../sidebar-menu/without-login-sidebar"
import {useUser} from "../../api/providers/UserProvider";

const { Sider, Content } = Layout

const siderStyle: CSSProperties = {
  maxWidth: "200px",
  width: "20%",
  minHeight: "100%",
  backgroundColor: "#1E1450",
}


export const LayoutWithoutLogin: FC = () => {
  
  const { isTablet } = useBreakpoints()
  const navigate = useNavigate()
  const user = useUser();

  useEffect(() => {
    if (localStorage.getItem("jwt") && user) {
      if(user.role == "student"){
        navigate("/application_review")
      }else{
        navigate("/tutor/application_review")
      }
    } 
  }, [user])

  return (
        <Layout className={"default"} hasSider>
          {!isTablet && <WithoutLoginSidebar />}
          <Content>
            <Suspense>
              <Outlet />
            </Suspense>
          </Content>
        </Layout>
  )
}

export default LayoutWithoutLogin