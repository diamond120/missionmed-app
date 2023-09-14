import "./DefaultLayout.less"
import { Layout } from "antd"
import { CSSProperties, FC, Suspense, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useBreakpoints } from "../screen"
import SidebarMenu from "../sidebar-menu"
import User from "../../api/services/User";
import {useUserDispatch, useUser } from "../../api/providers/UserProvider.jsx";
import {useStudentDispatch} from "../../api/providers/StudentProvider.jsx";
//import Tutor from  "../../api/services/Tutor.js";
import Student from  "../../api/services/Student.js";

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

  const getUserDetails = async(token) => {
    const result = await User.getUserDetails(token);
    dispatch({
      type:"set",
      id:result.data.data.id,
      name:result.data.data.name,
      email:result.data.data.email,
      role:result.data.data.role
    })
  }
  
  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      navigate("/sign_in")
    }else {
      if(Object.keys(user).length === 0){
        getUserDetails(localStorage.getItem("jwt"));
      }
      navigate("/")
    }
  }, []);

  useEffect(() => {
    if(Object.keys(user).length > 0){
      if(user.role == "Student"){
        const getStudentProfile = async() => {
          const result = await Student.getProfile();
          //console.log(result);
          console.log({
            type:"add",
            id:result.data.data.id,
            userId:result.data.data.user_id,
            fullName:result.data.data.full_name ?? null,
            gender:result.data.data.gender ?? null,
            pronouns:result.data.data.pronouns ?? null,
            birthday:result.data.data.birthday ?? null,
            email:result.data.data.email ?? null,
            phoneNumber:result.data.data.phone_number ?? null,
            state:result.data.data.state ?? null,
            location:result.data.data.location ?? null,
            timezone:result.data.data.timezone ?? null,
            biography:result.data.data.biography ?? null,
            profilePicture:result.data.data.profile_picture ?? null,
            applicantCycle:result.data.data.applicant_cycle ?? null,
            applicantTypeId:result.data.data.applicant_type_id ?? null,
            atar:result.data.data.atar ?? null,
            gpa:result.data.data.gpa ?? null,
            statusOfResidence:result.data.data.status_of_residence ?? null,
            specification:result.data.data.specification ?? null,
            atsi:result.data.data.atsi ?? null,
            rural:result.data.data.rural ?? null,
            financialHardship:result.data.data.financial_hardship ?? null,
            gws:result.data.data.gws ?? null,
          });
          studentDispatch({
            type:"add",
            id:result.data.data.id,
            userId:result.data.data.user_id,
            fullName:result.data.data.full_name ?? null,
            gender:result.data.data.gender ?? null,
            pronouns:result.data.data.pronouns ?? null,
            birthday:result.data.data.birthday ?? null,
            email:result.data.data.email ?? null,
            phoneNumber:result.data.data.phone_number ?? null,
            state:result.data.data.state ?? null,
            location:result.data.data.location ?? null,
            timezone:result.data.data.timezone ?? null,
            biography:result.data.data.biography ?? null,
            profilePicture:result.data.data.profile_picture ?? null,
            applicantCycle:result.data.data.applicant_cycle ?? null,
            applicantTypeId:result.data.data.applicant_type_id ?? null,
            atar:result.data.data.atar ?? null,
            gpa:result.data.data.gpa ?? null,
            statusOfResidence:result.data.data.status_of_residence ?? null,
            specification:result.data.data.specification ?? null,
            atsi:result.data.data.atsi ?? null,
            rural:result.data.data.rural ?? null,
            financialHardship:result.data.data.financial_hardship ?? null,
            gws:result.data.data.gws ?? null,
          })
        }
        getStudentProfile();
      }
    }
  }, [user]);

  const { isTablet } = useBreakpoints()
  return (
    <Layout className={"default"} hasSider>
      {!isTablet && <SidebarMenu/>}
      <Content>
        <Suspense>
          <Outlet />
        </Suspense>
      </Content>
    </Layout>
  )
}
export default DefaultLayout
