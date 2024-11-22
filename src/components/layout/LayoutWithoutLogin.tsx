import './DefaultLayout.less'
import { Layout } from 'antd'
import { FC, Suspense, useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useBreakpoints } from '../screen'
import WithoutLoginSidebar from '../sidebar-menu/without-login-sidebar'
import { UserContext } from '../../api/providers/UserProvider'
import CommonService from '../../api/services/Common'

const { Content } = Layout

export const LayoutWithoutLogin: FC = () => {
  const { isTablet } = useBreakpoints()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [toggle, setToggle] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if(location.pathname.startsWith('/impersonate')) {
      localStorage.clear()
      return;
    }
    if (localStorage.getItem("jwt") && user) {
      if(user.role == "student"){
        navigate("/application_review")
      }else{
        navigate("/tutor/application_review")
      }
    }
  }, [user])

  useEffect(() => {
    if(location.pathname.startsWith('/impersonate')) {
      localStorage.clear()
      return;
    }
    handleReading();
  }, [])
  const handleReading = async () => {
    try {
      const response = await CommonService.getAPI('/setting-data')
      if (response.data.success) {
        if (localStorage.getItem('jwt') && user) {
          if (response.data.show_story_feature == 1) {
            navigate('/tutor/application_review')
          }
        } else {
          if (response.data.data.show_story_feature == 1 && response.data.data.allow_without_login == 1) {
            if (!['/forgot-password', '/sign_in'].includes(location.pathname) && !String(location.pathname).startsWith('/resetpassword') && !String(location.pathname).startsWith('google5f2b2bf91c3f04a8')) {
              navigate('/')
            }
          } else {
            if (!['/forgot-password'].includes(location.pathname) && !String(location.pathname).startsWith('/resetpassword') && !String(location.pathname).startsWith('google5f2b2bf91c3f04a8')) {
              navigate('/sign_in')
            }
          }
        }
      }
    } catch (e) {
      if (!['/forgot-password'].includes(location.pathname) && !String(location.pathname).startsWith('/resetpassword') && !String(location.pathname).startsWith('google5f2b2bf91c3f04a8')) {
        navigate('/sign_in')
      }
    }
  }
  const closeFunction = () => {
    {
      isTablet
      setToggle(false)
    }
  }

  return (
    <Layout className={'default'} hasSider>
      {/* {!isTablet && <WithoutLoginSidebar />} */}
      <WithoutLoginSidebar className={`${toggle ? 'active-sidebar' : ''}`} callBack={closeFunction} />
      <Content>
        <Suspense>
          <div className={`sideBar-menu-toggle ${toggle ? 'active' : ''}`} onClick={() => setToggle(!toggle)}>
            <div className='bar1'></div>
            <div className='bar2'></div>
            <div className='bar3'></div>
          </div>
          <Outlet />
        </Suspense>
      </Content>
    </Layout>
  )
}

export default LayoutWithoutLogin
