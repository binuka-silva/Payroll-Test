import {lazy} from "react";

const ProcessPeriod = lazy(() => import("./ProcessPeriod"));

const processPeriodRoutes = [
    {
        path: "/process-period",
        component: ProcessPeriod,
        // auth: constant.admin
    }
];

export default processPeriodRoutes;