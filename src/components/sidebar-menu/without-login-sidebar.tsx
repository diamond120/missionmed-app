import { useState, useEffect } from "react"
import { Layout, Menu } from 'antd';
import { ReadOutlined, LoginOutlined, CaretRightOutlined, CaretDownOutlined, CommentOutlined, CrownOutlined , DashboardOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router-dom"
import { SvgIcon } from "../icon";
import CommonService from "../../api/services/Common";

const { Sider } = Layout;
const { SubMenu } = Menu;

const WithoutLoginSidebar: React.FC = ({className, callBack}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState('/')
  const navigate = useNavigate()
  const [showStory, setShowStory] = useState(false)

  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleSelectedMenu = async (e: any) => {
    setCurrent(e.key);
    callBack();
  }

  useEffect (() => {
    handleReading();
  }, [])

  const handleReading = async () => {
    try {
      debugger;
      const response =  await CommonService.getAPI("/setting-data");
      if (response.data.success) {
        if(localStorage.getItem("jwt")) {
          if( response.data.data.show_story_feature == 1 ) {
            setShowStory(true);
          }
        } else {
          debugger;
          if( response.data.data.show_story_feature == 1 && response.data.data.allow_without_login == 1  ) {
            setShowStory(true);
          } else {
            setShowStory(false);
          }
        }
      }
    } catch (e) {
      setShowStory(false);
    }
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      width={280}
      style={{ height: 'auto', backgroundColor: '#1E1450' }}
      className={`sidebar-menu ${className}`}
      trigger={null}
    >
      <div className={"sidebar-menu-logo-wrap"} >
        {collapsed ? <SvgIcon className={"sidebar-menu-logo-small"} type={"logoSidebar"} /> : <SvgIcon className={"sidebar-menu-logo"} type={"fullLogo"} />}
      </div>
      <Menu onClick={handleSelectedMenu} expandIcon={collapsed ? <CaretRightOutlined style={{ color: "rgb(255,255,255,0.65", }} /> : <CaretDownOutlined style={{ color: "rgb(255,255,255,0.65)" }} />} mode={"inline"} selectedKeys={[current]} style={{ borderRight: 0, height: "0" }}>
       
        <>
          <SubMenu
            key="interview-submenu"
            title={<>Interview <CrownOutlined  className="yellow-svg"/></>}
            icon={<CommentOutlined style={{ fontSize: "24px", color: "white" }} key={"4"}

            />}
          >
            <Menu.Item onClick={() => { navigate('/mock-premium' ) }} key={'/mock-premium' } >Mock Interview <CrownOutlined  className="yellow-svg"/> </Menu.Item>
            <Menu.Item onClick={() => { navigate('/teaching-premium') }} key={'/teaching-premium'} > Teaching Session <CrownOutlined  className="yellow-svg"/> </Menu.Item>
          </SubMenu>

          <SubMenu
            key="ucat-submenu"
            title={<>UCAT Sessions <CrownOutlined  className="yellow-svg"/>  </>}
            icon={<ReadOutlined style={{ fontSize: "24px", color: "white" }} key={"7"} />}
          >
            <Menu.Item onClick={() => { navigate( '/ucat-premium') }} key={'/ucat-premium'} > Teaching Session <CrownOutlined  className="yellow-svg"/> </Menu.Item>
          </SubMenu>
          {showStory && 
            <Menu.Item key={"/"} onClick={() =>{navigate('/')}} className={"custom-profile-item reading-trainer-item"} icon={<DashboardOutlined />}>
              Speed Reading Trainer  
            </Menu.Item>
          }
        </>

        <Menu.Item style={{ position: "fixed", bottom: "24px", width: "280px" }} onClick={() => { navigate('sign_in') }} key={"14"} icon={<LoginOutlined style={{ fontSize: 32, }} />} className={"custom-profile-item"}>
          Login
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default WithoutLoginSidebar;