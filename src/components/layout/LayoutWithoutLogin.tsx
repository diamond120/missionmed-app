import "./DefaultLayout.less"
import { Layout } from "antd"
import { CSSProperties, FC, Suspense, useEffect, useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useBreakpoints } from "../screen"
import WithoutLoginSidebar from "../sidebar-menu/without-login-sidebar"
import {useUser} from "../../api/providers/UserProvider";
import CommonService from "../../api/services/Common";

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
  const [toggle,setToggle] = useState(false)
  const location = useLocation();  


  useEffect(() => {
    if (localStorage.getItem("jwt") && user) {
      if(user.role == "student"){
        navigate("/application_review")
      }else{
        navigate("/tutor/application_review")
      }
    } 
  }, [user])


  useEffect(() => {
    handleReading();
  }, [])
  const handleReading = async () => {
    try {
      const response =  await CommonService.getAPI("/setting-data");
      if (response.data.success) {
        if(localStorage.getItem("jwt") && user) {
          if( response.data.show_story_feature == 1 ) {
            navigate("/tutor/application_review")
          }
        } else {
          if( response.data.data.show_story_feature == 1 && response.data.data.allow_without_login == 1  ) {
            if(!['/forgot-password', '/resetpassword','/sign_in'].includes(location.pathname) ) {
              navigate("/")
            }
          } else {
            if(!['/forgot-password', '/resetpassword'].includes(location.pathname) ) {
              navigate("/sign_in")
            }  
          }
        }
      }
    } catch (e) {
      if(!['/forgot-password', '/resetpassword'].includes(location.pathname) ) {
       navigate("/sign_in")
      }
    }
  }
  const closeFunction = () => {
    {isTablet
      setToggle(false)
    }
  }

  return (
        <Layout className={"default"} hasSider>
          {/* {!isTablet && <WithoutLoginSidebar />} */}
          <WithoutLoginSidebar className={`${toggle ? "active-sidebar":""}`} callBack={closeFunction}/>
          <Content>
            <Suspense>
              <div className={`sideBar-menu-toggle ${toggle ? "active":""}`} onClick={()=>setToggle(!toggle)}>
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
              </div>
              <Outlet />
            </Suspense>
          </Content>
        </Layout>
  )
}

export default LayoutWithoutLogin