import {lazy} from "react";

const QuickReports = lazy(() =>
    import ("./QuickReports"));

const quickReportsRoutes = [{
    path: "/quick-reports",
    component: QuickReports,
}];

export default quickReportsRoutes;