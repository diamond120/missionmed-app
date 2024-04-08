import { useState } from "react"
import { Layout, Menu, Badge } from 'antd';
import { ReadOutlined, BellOutlined, LoginOutlined, FileDoneOutlined, CaretRightOutlined, CaretDownOutlined, CommentOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom"
import { SvgIcon } from "../icon";

const { Sider } = Layout;
const { SubMenu } = Menu;

const WithoutLoginSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState('/')
  const navigate = useNavigate()
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleSelectedMenu = async (e: any) => {
    setCurrent(e.key);
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      width={280}
      style={{ height: 'auto', backgroundColor: '#1E1450' }}
      className={"sidebar-menu"}
      trigger={null}
    >
      <div className={"sidebar-menu-logo-wrap"} >
        {collapsed ? <SvgIcon className={"sidebar-menu-logo-small"} type={"logoSidebar"} /> : <SvgIcon className={"sidebar-menu-logo"} type={"fullLogo"} />}
      </div>
      <Menu onClick={handleSelectedMenu} expandIcon={collapsed ? <CaretRightOutlined style={{ color: "rgb(255,255,255,0.65", }} /> : <CaretDownOutlined style={{ color: "rgb(255,255,255,0.65)" }} />} mode={"inline"} selectedKeys={[current]} style={{ borderRight: 0, height: "0" }}>
        <Menu.Item  key={'/application_review'} icon={<FileDoneOutlined style={{ fontSize: "24px", }} />} className={"custom-application-review-item"}>
          Application Review
        </Menu.Item>
        
       
        <>
          <SubMenu
            key="interview-submenu"
            title={"Interview"}
            icon={<CommentOutlined style={{ fontSize: "24px", color: "white" }} key={"4"}

            />}
          >
            <Menu.Item onClick={() => { navigate('student/mock-interview' ) }} key={'/student/mock-interview' } >Mock Interview </Menu.Item>
            <Menu.Item onClick={() => { navigate('student/teaching-session') }} key={'/student/teaching-session'} > Teaching Session </Menu.Item>
          </SubMenu>

          <SubMenu
            key="ucat-submenu"
            title={"UCAT Sessions"}
            icon={<ReadOutlined style={{ fontSize: "24px", color: "white" }} key={"7"} />}
          >
            <Menu.Item onClick={() => { navigate( 'tutor/ucat-session') }} key={'/tutor/ucat-session'} > Teaching Session </Menu.Item>
          </SubMenu>
            <Menu.Item  key={"/"} onClick={() =>{navigate('/')}}  className={"custom-profile-item"} icon={<ReadOutlined  style={{fontSize: "24px", }}  />} >
              Speed Reading Trainer  
            </Menu.Item>
        </>

        <Menu.Item key={ '/student_notifications'} onClick={() => { navigate('tutor_notifications') }} style={{ position: "fixed", bottom: "70px", width: "280px" }} icon={<Badge > <BellOutlined style={{ fontSize: "24px" }} /> </Badge>} className={"notification-item custom-notification-item"}>
          Notifications
        </Menu.Item>

        <Menu.Item style={{ position: "fixed", bottom: "24px", width: "280px" }} onClick={() => { navigate('sign_in') }} key={"14"} icon={<LoginOutlined style={{ fontSize: 32, }} />} className={"custom-profile-item"}>
          Login
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default WithoutLoginSidebar;