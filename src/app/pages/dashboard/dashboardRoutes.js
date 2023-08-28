import {lazy} from "react";

const Dashboard1 = lazy(() => import("./dashboard1/Dashboard1"));

const dashboardRoutes = [
    {
        path: "/dashboard/v1",
        component: Dashboard1,
    }
];

export default dashboardRoutes;
