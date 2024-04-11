import "./DefaultLayout.less"
import { Layout } from "antd"
import { CSSProperties, FC, Suspense, useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useBreakpoints } from "../screen"
import SidebarMenu from "../sidebar-menu"
import User from "../../api/services/User";
import { useUserDispatch, useUser } from "../../api/providers/UserProvider.jsx";
import Student from "../../api/services/Student.js";
import { useStudentDispatch } from "../../api/providers/StudentProvider.jsx";
import { useTutorDispatch } from "../../api/providers/TutorProvider.jsx";
import Tutor from "../../api/services/Tutor.js";
import ProfileStaticDataContext from "../../api/context/ProfileStaticDataContext";
import CommonService from "../../api/services/Common";
import NotificationContext from "../../api/context/NotificationContext";

const { Sider, Content } = Layout

const siderStyle: CSSProperties = {
  maxWidth: "200px",
  width: "20%",
  minHeight: "100%",
  backgroundColor: "#1E1450",
}

export const DefaultLayout: FC = () => {
  const navigate = useNavigate()
  const dispatch = useUserDispatch();
  const user = useUser();
  const studentDispatch = useStudentDispatch();
  const tutorDispatch = useTutorDispatch();
  const [profileStaticData, setProfileStaticData] = useState({});
  const [loading, setLaoding] = useState(true)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [toggle,setToggle] = useState(false)
  const resetTutorContext = () => {
    tutorDispatch({
      type: "reset"
    })
  }

  const resetStudentContext = () => {
    studentDispatch({
      type: "reset"
    });
  }

  const getUserDetails = async (token) => {
    const result = await User.getUserDetails(token);
    dispatch({
      type: "set",
      id: result.data.data.id,
      name: result.data.data.name,
      email: result.data.data.email,
      role: result.data.data.role
    })
  }

  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      navigate("/sign_in")
    } else {
      if (Object.keys(user).length === 0) {
        getUserDetails(localStorage.getItem("jwt"));
      }
      (async () => {
        await setLaoding(true)
        const res = await CommonService.getProfileStaticData();
        await setProfileStaticData({
          location: res.data.data.location,
          state: res.data.data.state,
          timezone: res.data.data.timezone,
          timezone_id: res.data.data.timezone_id,
          applicantType: res.data.data.applicantType,
          university: res.data.data.university,
          degree: res?.data?.data?.degree
        })
        await setLaoding(false)
      })();
      // navigate("/")
    }
  }, []);

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      if (user.role == "student") {
        // resetTutorContext();
        const getStudentProfile = async () => {
          try {
            await studentDispatch({ type: 'loading', loading: true })
            const result = await Student.getProfile();
            studentDispatch({
              type: "add",
              id: result.data.data.id,
              userId: result.data.data.user_id,
              fullName: result.data.data.full_name ?? null,
              gender: result.data.data.gender ?? null,
              pronouns: result.data.data.pronouns ?? null,
              birthday: result.data.data.birthday ?? null,
              email: result.data.data.email ?? null,
              phoneNumber: result.data.data.phone_number ?? null,
              state: result.data.data.state ?? null,
              location: result.data.data.location ?? null,
              timezone: result.data.data.timezone ?? null,
              biography: result.data.data.biography ?? null,
              profilePicture: result.data.data.profile_picture ?? null,
              applicantCycle: result.data.data.applicant_cycle ?? null,
              applicantTypeId: result.data.data.applicant_type_id ?? null,
              atar: result.data.data.atar ?? null,
              gpa: result.data.data.gpa ?? null,
              statusOfResidence: result.data.data.status_of_residence ?? null,
              specification: result.data.data.specification ?? null,
              atsi: result.data.data.atsi ?? null,
              rural: result.data.data.rural ?? null,
              financialHardship: result.data.data.financial_hardship ?? null,
              gws: result.data.data.gws ?? null,
              credit: result.data.data.credit ?? 0,
              card_digit: result.data.data.card_digit ?? '',
              country: result.data.data.country ?? '',
              timezone_id: result.data.data.timezone_id ?? ''
            })
            await studentDispatch({ type: 'loading', loading: false })
          } catch (error) {
            studentDispatch({ type: 'loading', loading: false })
          }
        }
        getStudentProfile();
      } else {
        //resetStudentContext();
        const getTutorProfile = async () => {
          try {
            await tutorDispatch({ type: 'loading', loading: true })
            const result = await Tutor.getProfile();
            await tutorDispatch({
              type: "add",
              id: result.data.data.id,
              userId: result.data.data.user_id,
              fullName: result.data.data.full_name ?? null,
              preferredName: result.data.data.preferred_name ?? null,
              gender: result.data.data.gender ?? null,
              pronouns: result.data.data.pronouns ?? null,
              email: result.data.data.email ?? null,
              phoneNumber: result.data.data.phone_number ?? null,
              location: result.data.data.location ?? null,
              timezone: result.data.data.timezone ?? null,
              biography: result.data.data.biography ?? null,
              lessionType: result.data.data.lession_type ?? null,
              bufferTime: result.data.data.buffer_time ?? null,
              workingHours: result.data.data.working_hours ?? null,
              ucatTutoring: result.data.data.ucat_tutoring ?? null,
              ucatTutoringPrice: result.data.data.ucat_tutoring_price ?? null,
              interviewTutoring: result.data.data.interview_tutoring ?? null,
              interviewTutoringPrice: result.data.data.interview_tutoring_price ?? null,
              mockInterview: result.data.data.mock_interview ?? null,
              mockInterviewPrice: result.data.data.mock_interview_price ?? null,
              applicationReview: result.data.data.application_review ?? null,
              applicationReviewPrice: result.data.data.application_review_price ?? null,
              profilePicture: result.data.data.profile_picture ?? null,
              educations: result.data.data.tutor_educations.length > 0 ? result.data.data.tutor_educations.map((edu) => ({ school: edu.school ?? "", degree: edu.degree ?? "" })) : [],
              lessionTypeID: result.data.data.lession_type_id ?? null,
              applicationLessionTime: result.data.data.application_lession_time ?? null,
              interviewLessionTime: result.data.data.interview_lession_time ?? null,
              mockLessionTime: result.data.data.mock_lession_time ?? null,
              ucatLessionTime: result.data.data.ucat_lession_time ?? null,
              personalMeetingId: result.data.data.personal_meeting_id ?? '',
              country: result.data.data.country ?? '',
              timezone_id: result.data.data.timezone_id ?? ''
            })
            await tutorDispatch({ type: 'loading', loading: false })
          } catch (error) {
            tutorDispatch({ type: 'loading', loading: false })
          }
        }
        getTutorProfile();
      }
    }

    return () => {
      // resetTutorContext();
      // resetStudentContext();
    };
  }, [user]);

  const { isTablet } = useBreakpoints()
  if (loading)
    return null

  return (
    <ProfileStaticDataContext.Provider value={profileStaticData}>
      <NotificationContext.Provider value={{ unreadNotificationCount, setUnreadNotificationCount }}>
        <Layout className={"default"} hasSider>
          {/* {!isTablet && <SidebarMenu />} */}
          <SidebarMenu className={`${toggle ? "active-sidebar":""}`}/>
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
      </NotificationContext.Provider>
    </ProfileStaticDataContext.Provider>
  )
}

export default DefaultLayout