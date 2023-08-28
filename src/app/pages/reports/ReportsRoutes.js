import {lazy} from "react";

const Reports = lazy(() => import ("./reports/Reports"));
const ReportsViewer = lazy(() => import ("./reportsViewer/Reports"));

const reportsRoutes = [
    {
        path: "/reports/viewer",
        component: ReportsViewer,
    },
    {
        path: "/reports",
        component: Reports,
    }];

export default reportsRoutes;