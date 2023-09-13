


import React, { FC, lazy, memo } from "react";
import { Outlet, RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";
import { DefaultLayout } from "../components/layout";
import { Loader } from "../components/layout/Loader";
import SignInLayout from "../components/layout/SignInLayout"

const Home = lazy<FC>(/*home-page-bundle*/ () => import("./home"));
// const ApplicationsReview = lazy(/*application-review-page-bundle*/ () => import("./application-review"));
// const Application = lazy(/*application-page-bundle*/ () => import("./application"));
// const ApplicationReviewTutor= lazy(/*application-page-bundle*/ () => import("./application-review-tutor"))
// const ApplicationReviewProcess= lazy(/*application-page-bundle*/ () => import("./application-reviewing-process"))
 const SignIn= lazy(/*application-page-bundle*/ () => import("./sign-in"))
 const StudentProfile= lazy(/*application-page-bundle*/ () => import("./student-profile"))
// const TutorProfile= lazy(/*application-page-bundle*/ () => import("./tutor-profile"))
// const NotificationsTutor= lazy(/*application-page-bundle*/ () => import("./notifications-tutor"))
// const NotificationsStudent= lazy(/*application-page-bundle*/ () => import("./notifications-student"))
const routes: RouteObject[] = [
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
    //   {
    //     Component: ApplicationsReview,
    //     path: "application_review",
    //     index: true,
    //   },
    //   {
    //     Component: Application,
    //     path: "/application_review/application/:id",
    //     index: true,
    //   },
    //   {
    //     Component: ApplicationReviewTutor,
    //     path: "/tutor/application_review",
    //     index: true,
    //   },
    //   {
    //     Component: ApplicationReviewProcess,
    //     path: "/tutor/reviewing_process/:id",
    //     index: true,
    //   },
      {
        Component: StudentProfile,
        path: "/student_profile",
        index: true,
      },
    //   {
    //     Component: TutorProfile,
    //     path: "/tutor_profile",
    //     index: true,
    //   },
    //   {
    //     Component: NotificationsTutor,
    //     path: "/tutor_notifications",
    //     index: true,
    //   },
    //   {
    //     Component: NotificationsStudent,
    //     path: "/student_notifications",
    //     index: true,
    //   },

      {
        Component: Outlet,
        path: "*",
      },

    ],
  },


  {
    Component: SignInLayout,
    loader: () => <Loader spinning />,
    children: [

      {
        Component:  SignIn,
        path: "/sign_in",
        index: true,
      },

    ],
  },

];



const router = createBrowserRouter(routes);

const PageProvider = memo(() => <RouterProvider router={router} />);

export default PageProvider;




