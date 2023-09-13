import { useEffect, useState } from "react"
import { Layout, Menu, Select, Avatar, Badge } from 'antd';
import {  UserOutlined, BellOutlined,LogoutOutlined, FileDoneOutlined,CaretRightOutlined,CaretDownOutlined, } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom"
import { SvgIcon } from "../icon";
import {useUser} from "../../api/providers/UserProvider";
import {useStudent} from "../../api/providers/StudentProvider";
import {useAuthContext} from "../../api/context/AuthContext.js";
import "./index.less"

const { Sider } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;

const SidebarMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [appReviewPage,setAppReviewPage]=useState("")
  const [notificationsPage,setNotificationsPage]=useState("")
  const [avatarProfile,setAvatarProfile]= useState<string | undefined | null>("")
  const navigate = useNavigate()
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setSelectedMenu(collapsed ? "2" : "1");
  };

  const user = useUser();
  const student = useStudent();
  const tutor = {};

  const {setAuthenticated} = useAuthContext();
  let isStudent = false;
  if(user.role == "Student"){
    isStudent = true;
  }else{
    isStudent = false;
  }

  const navigateProfilePage = ()=>{
    isStudent ?  navigate('student_profile') : navigate('tutor_profile');
  }

  const applicationReviewNavigate = ()=>{
    navigate(appReviewPage)
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
  const [dot,setDot] = useState(false)
  // const tutorNotifications = tutortSelected?.attributes?.notifications?.data
  // const studentNotifications = studentSelected?.attributes?.notifications?.data


  // const countStudentUnreadNotifications = () => {
  //   if (!studentNotifications) {
  //     return 0;
  //   }

  //   return studentNotifications.filter(
  //     notification => notification.attributes && !notification.attributes.is_read
  //   ).length;
  // };

  // const countTutorUnreadNotifications = () => {
  //   if (!tutorNotifications) {
  //     return 0;
  //   }

  //   return tutorNotifications.filter(
  //     notification => notification.attributes && !notification.attributes.is_read
  //   ).length;
  // };
  // useEffect(() => {
  //   if (student) {
  //     setDot(countStudentUnreadNotifications() > 0);
  //   } else if (tutor) {
  //     setDot(countTutorUnreadNotifications() > 0);
  //   }
  // }, [studentNotifications?.length, tutorNotifications?.length, countStudentUnreadNotifications,countTutorUnreadNotifications,]);
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
      <Menu expandIcon={ collapsed ? <CaretRightOutlined style={{color:"rgb(255,255,255,0.65", }}/> : <CaretDownOutlined style={{color:"rgb(255,255,255,0.65)"}}/>} mode={"inline"} defaultSelectedKeys={[selectedMenu]} style={{ borderRight: 0,height:"0" }}>
        <Menu.Item onClick={applicationReviewNavigate}  key={"1"} icon={<FileDoneOutlined  style={{fontSize: "24px", }} />} className={"custom-application-review-item"}>
          Application Review
        </Menu.Item>
        <Menu.Item onClick={() =>{navigate(notificationsPage)}} style={{position:"fixed", bottom:"128px",width: "280px"}} key={"12"} icon={<Badge dot={dot}> <BellOutlined style={{fontSize: "24px"}} /> </Badge>}  className={"notification-item custom-notification-item"}>
          Notifications
        </Menu.Item>
       

        <Menu.Item
          style={{ position: "fixed", bottom: "72px", width: "280px" }}
          key={"13"}
          onClick={navigateProfilePage}
          icon={
            <Avatar
              src={isStudent ? student.ProfilePicture : tutor ? tutor.ProfilePicture: ""}
              size={32}
              icon={<UserOutlined />}
            />
          }
          className={"custom-profile-item"}
        >
          My Profile
        </Menu.Item>
        <Menu.Item onClick={handleSignOut} style={{position:"fixed", bottom:"24px",width: "280px"}} key={"14"}  icon={<LogoutOutlined style={{fontSize: 32, }} />  }  className={"custom-profile-item"}>
          Sign out
        </Menu.Item>

      </Menu>
    </Sider>
  );
};

export default SidebarMenu;
