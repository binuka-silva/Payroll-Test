import {lazy} from "react";

const Signup = lazy(() => import("./Signup"));

const Signin = lazy(() => import("./Signin"));

const ForgotPassword = lazy(() => import("./ForgotPassword"));

const ResetPassword = lazy(() => import("./ResetPasswrod"));

const Error404 = lazy(() => import("./Error"));

const sessionsRoutes = [
    /*  {
        path: "/session/signup",
        component: Signup
      },*/
    {
        path: "/session/signin",
        component: Signin
    },
    /*  {
        path: "/session/forgot-password",
        component: ForgotPassword
      },*/
    {
        path: "/session/reset-password",
        component: ResetPassword
    },
    {
        path: "/session/404",
        component: Error404
    }
];

export default sessionsRoutes;
