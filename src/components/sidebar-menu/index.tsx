import { useEffect, useState } from "react"
import { Layout, Menu, Select, Avatar, Badge } from 'antd';
import {  UserOutlined,DownOutlined,ReadOutlined, BellOutlined,LogoutOutlined, FileDoneOutlined,CommentOutlined,CaretRightOutlined,CaretDownOutlined, } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from "react-router-dom"
import { SvgIcon } from "../icon";
import {useUser} from "../../api/providers/UserProvider";
import {useStudent} from "../../api/providers/StudentProvider";
import {useTutor} from "../../api/providers/TutorProvider";
import {useAuthContext} from "../../api/context/AuthContext.js";
import NotificationsService from "../../api/services/Notifications"
import {useNotificationContext}  from "../../api/context/NotificationContext"
import "./index.less"

const { Sider } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;

const SidebarMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [appReviewPage,setAppReviewPage]=useState("")
 
  const [avatarProfile,setAvatarProfile]= useState<string | undefined | null>("")
  const {unreadNotificationCount, setUnreadNotificationCount} = useNotificationContext();

  const navigate = useNavigate()
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setSelectedMenu(collapsed ? "2" : "1");
  };

  const user = useUser();
  const student = useStudent();
  const tutor = useTutor();

  const {setAuthenticated} = useAuthContext();
  let isStudent = false;
  const location = useLocation();
  if(user.role == "student"){
    isStudent = true;
  }else{
    isStudent = false;
  }
  

  const defaultUrl =  isStudent ? "/application_review" : "/tutor/application_review";
  const [current, setCurrent] = useState(
   (location.pathname === "/" || location.pathname === "")
        ? defaultUrl
        : location.pathname,
  );

  const navigateProfilePage = ()=>{
    isStudent ?  navigate('student_profile') : navigate('tutor_profile');
  }

  const applicationReviewNavigate = ()=>{
    console.log(isStudent);
    isStudent ?  navigate('application_review') : navigate('/tutor/application_review');
  }
  const removeTokenFromLocalStorage = () => {
    localStorage.removeItem("jwt");
  };
  const handleSignOut = () => {
    removeTokenFromLocalStorage();
    setAuthenticated(false);
    navigate("/sign_in");
    window.location.reload()
  };

  const getUnreadNotificationCount = async () => {
    const config = { 
      params: {
        role:user.role,
      }
    };
    try{
      const result = await NotificationsService.getUnreadNotificationCount(config);
      if(result.data.success){
       const unreadCount  = result.data.data.count;
       setUnreadNotificationCount(unreadCount);
      }else{
        console.log(result.data.message);
      }
    }catch(e){
      console.log(e);
    }
    
  }

  useEffect(() => {
    if (performance.navigation.type === PerformanceNavigation.TYPE_RELOAD) {
      // Redirect to the desired URL
      
      if(location.pathname === '/' || location.pathname === '' ) {
        setCurrent(current);
      } else {
        setCurrent(location.pathname);
      }
      navigate(location.pathname);
    } else {
      navigate(current);
    }
    if(user.role){
      getUnreadNotificationCount();
    }
  },[user.role,current]);

  const handleSelectedMenu = async (e: any) => {
    setCurrent(e.key);
  } 

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      width={280}
      style={{ height: 'auto' }}
      className={"sidebar-menu"}
      trigger={null}
    >
      <div className={"sidebar-menu-logo-wrap"} >
        {collapsed ? <SvgIcon className={"sidebar-menu-logo-small"} type={"logoSidebar"} /> : <SvgIcon className={"sidebar-menu-logo"} type={"fullLogo"} />}
      </div>
      <Menu  onClick={handleSelectedMenu} expandIcon={ collapsed ? <CaretRightOutlined style={{color:"rgb(255,255,255,0.65", }}/> : <CaretDownOutlined style={{color:"rgb(255,255,255,0.65)"}}/>} mode={"inline"} selectedKeys={[current]} style={{ borderRight: 0,height:"0" }}>
        <Menu.Item onClick={applicationReviewNavigate}  key={isStudent ? '/application_review' : '/tutor/application_review'} icon={<FileDoneOutlined  style={{fontSize: "24px", }} />} className={"custom-application-review-item"}>
          Application Review
        </Menu.Item>
        <Menu.Item key={isStudent ? '/student_notifications' : '/tutor_notifications'} onClick={() =>{navigate(isStudent ? 'student_notifications' : 'tutor_notifications')}} style={{position:"fixed", bottom:"128px",width: "280px"}}  icon={<Badge dot={unreadNotificationCount > 0}> <BellOutlined style={{fontSize: "24px"}} /> </Badge>}  className={"notification-item custom-notification-item"}>
          Notifications
        </Menu.Item>
        <Menu.Item
          style={{ position: "fixed", bottom: "72px", width: "280px" }}
          key={isStudent ? '/student_profile' : '/tutor_profile'} 
          onClick={navigateProfilePage}
          icon={
            <Avatar
              src={isStudent ? student.profilePicture : tutor ? tutor.profilePicture: ""}
              size={32}
              icon={<UserOutlined />}
            />
          }
          className={"custom-profile-item"}
        >
          My Profile
        </Menu.Item>

        {/* {!isStudent && (
          <>
          <Menu.Item key={"/tutor/mock-interview"}  onClick={() =>{navigate('tutor/mock-interview')}}  className={"custom-profile-item"} icon={<FileDoneOutlined  style={{fontSize: "24px", }}  />} >
           Mock Interview
          </Menu.Item>
          
          <Menu.Item  key={"/tutor/ucat-session"} onClick={() =>{navigate('tutor/ucat-session')}}  className={"custom-profile-item"} icon={<ReadOutlined  style={{fontSize: "24px", }}  />} >
            UCAT Sessions  
          </Menu.Item>
          </>
        )} */}
        
        {/* {isStudent && ( */}
          <>
            <SubMenu
              key="interview-submenu"
              title = {"Interview"}
              icon={<FileDoneOutlined  style={{fontSize: "24px", color:"white"}}  key={"4"} 
            />}
            >
            <Menu.Item onClick={() =>{navigate(isStudent ? 'student/mock-interview' : 'tutor/mock-interview')}}  key={isStudent ?'/student/mock-interview' : '/tutor/mock-interview'} >Mock Interview </Menu.Item>
            <Menu.Item onClick={() =>{navigate(isStudent ? 'student/teaching-session' : 'tutor/teaching-session')}} key={isStudent ?'/student/teaching-session' : '/tutor/teaching-session'} > Teaching Session </Menu.Item>
            </SubMenu>

            <SubMenu
              key="ucat-submenu"
              title = {"UCAT Sessions"}
              icon={<ReadOutlined  style={{fontSize: "24px", color:"white"}} key={"7"}  />}
            >
            {/* <Menu.Item key={"9"}> Learn (LMS) </Menu.Item> */}
            <Menu.Item onClick={() =>{navigate(isStudent ? 'student/ucat-session' : 'tutor/ucat-session')}} key={isStudent ? '/student/ucat-session':'/tutor/ucat-session'} > Teaching Session </Menu.Item>
            </SubMenu>
          </>
        {/* )} */}

        <Menu.Item onClick={handleSignOut} style={{position:"fixed", bottom:"24px",width: "280px"}} key={"14"}  icon={<LogoutOutlined style={{fontSize: 32, }} />  }  className={"custom-profile-item"}>
          Sign out
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SidebarMenu;
