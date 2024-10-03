import { FC, lazy, memo } from "react";
import { Outlet, RouteObject, RouterProvider, createBrowserRouter, useLocation } from "react-router-dom";
import { DefaultLayout } from "../components/layout";
import { LayoutWithoutLogin } from "../components/layout/LayoutWithoutLogin";
import { calendarLayout } from "../components/layout/calendarLayout";
import { Loader } from "../components/layout/Loader";
import SignInLayout from "../components/layout/SignInLayout";
import ForgotPassword from "./forgot-password";
import ResetPassword from "./reset-password";
import TutorCalendar from "./tutor-calendar-teaching";

const Home = lazy<FC>(/*home-page-bundle*/ () => import("./home"));
const ApplicationsReview = lazy(/*application-review-page-bundle*/ () => import("./application-review"));
const Application = lazy(/*application-page-bundle*/ () => import("./application"));
const ApplicationReviewTutor= lazy(/*application-page-bundle*/ () => import("./application-review-tutor"))
const ApplicationReviewProcess= lazy(/*application-page-bundle*/ () => import("./application-reviewing-process"))
const SignIn= lazy(/*application-page-bundle*/ () => import("./sign-in"))
const AIStory =lazy(/*application-page-bundle*/ () => import("./ai-component"))
const StudentProfile= lazy(/*application-page-bundle*/ () => import("./student-profile"))
const TutorProfile= lazy(/*application-page-bundle*/ () => import("./tutor-profile"))
const NotificationsTutor= lazy(/*application-page-bundle*/ () => import("./notifications-tutor"))
const NotificationsStudent= lazy(/*application-page-bundle*/ () => import("./notifications-student"))
const TutorMockInterview = lazy(() => import("./tutor-mock-interview"))
const StudentMockInterview = lazy(() => import("./student-mock-interview"))
const TutorInterviewSummary = lazy(() => import("./tutor-interview-summary"))
const StudentInterviewSummary = lazy(() => import("./student-interview-summary"))
const StudentUCATSession = lazy(() => import("./student-ucat-session"))
const TutorUCATSession = lazy(() => import("./tutor-ucat-session"))
const StudentTeachingSession = lazy(() => import("./student-teaching-session"))
const TutorTeachingSession = lazy(() => import("./tutor-teaching-session"))
const StudentReadingTraining = lazy(() => import("./student-reading-training"))
const MockPremiumLink = lazy(() => import("./mock-premium-link"))
const UCATPremiumLink = lazy(() => import("./ucat-premium-link"))
const TeachingPremiumLink = lazy(() => import("./teaching-premium-link"))
const MockSimulation = lazy(() => import("./mock-simulation"))
const SpecialOffers = lazy(() => import("./special-offers"))
const Impersonate = lazy(() => import("./application/impersonate.tsx"))

const routes: RouteObject[] = [
  {
    
    Component: LayoutWithoutLogin,
    loader: () => <Loader spinning />,
    children: [
      {
          Component:  SignIn,
          path: "/sign_in",
          index: true,
      },
      {
          Component: ForgotPassword,
          path: "/forgot-password",
          index: true,
      },
      {
        Component: ResetPassword,
        path: "/resetpassword/:token",
        index: true,
      },

      // {
      //   Component: StudentReadingTraining,
      //   path: "/",
      //   index: true,
      // },
      {
        Component: AIStory,
        path: "/",
        index: true,
      },
      {
        Component: MockPremiumLink,
        path: "/mock-premium",
        index: true,
      },
      {
        Component: UCATPremiumLink,
        path: "/ucat-premium",
        index: true,
      },
      {
        Component: TeachingPremiumLink,
        path: "/teaching-premium",
        index: true,
      },
      {
        Component: Impersonate,
        path: "/impersonate",
        index: true,
      },
  ]},
  {
    Component: DefaultLayout,
    loader: () => <Loader spinning />,
    children: [
      {
        Component: Home,
        path: "",
        index: true,
      },
      {
        Component: Home,
        path: "home",
        index: true,
      },
      {
        Component: ApplicationsReview,
        path: "application_review",
        index: true,
      },
      {
        Component: Application,
        path: "/application_review/application/:id",
        index: true,
      },
      {
        Component: ApplicationReviewTutor,
        path: "/tutor/application_review",
        index: true,
      },
      {
        Component: ApplicationReviewProcess,
        path: "/tutor/reviewing_process/:id",
        index: true,
      },
      {
        Component: StudentProfile,
        path: "/student_profile",
        index: true,
      },
      {
        Component: TutorProfile,
        path: "/tutor_profile",
        index: true,
      },
      {
        Component: NotificationsTutor,
        path: "/tutor_notifications",
        index: true,
      },
      {
        Component: NotificationsStudent,
        path: "/student_notifications",
        index: true,
      },
      {
        Component: TutorMockInterview,
        path: "/tutor/mock-interview",
        index: true,
      },
      {
        Component: StudentMockInterview,
        path: "/student/mock-interview",
        index: true,
      },
      {
        Component: StudentInterviewSummary,
        path: "/student/interview-summary/:mockInterviewId/:type?",
        index: true,
      },
      {
        Component: TutorInterviewSummary,
        path: "/tutor/interview-summary/:mockInterviewId/:type?",
        index: true,
      },
      {
        Component: TutorTeachingSession,
        path: "/tutor/teaching-session",
        index: true,
      },
      {
        Component: StudentTeachingSession,
        path: "/student/teaching-session",
        index: true,
      },
      {
        Component: StudentUCATSession,
        path: "/student/ucat-session",
        index: true,
      },
      {
        Component: TutorUCATSession,
        path: "/tutor/ucat-session",
        index: true,
      },
      {
        Component: AIStory,
        path: "/student/reading-trainer",
        index: true,
      },
      {
        Component: MockSimulation,
        path: "/student/mock-simulation",
        index: true,
      },
      {
        Component: SpecialOffers,
        path: "/student/special-offers",
        index: true,
      },
      {
        Component: Impersonate,
        path: "/impersonate",
        index: true,
      },
      {
        Component: Outlet,
        path: "*",
      },

    ],
  },


  {
    Component: calendarLayout,
    loader: () => <Loader spinning />,
    children: [
      {
        Component: TutorCalendar,
        path: "/tutor-calendar/:ID/:timezone?",
        index: true,
      }
    ],
  },

];



const router = createBrowserRouter(routes);

const PageProvider = memo(() => <RouterProvider router={router} />);

export default PageProvider;




