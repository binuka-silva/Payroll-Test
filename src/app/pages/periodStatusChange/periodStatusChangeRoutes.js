import {lazy} from "react";

const PeriodStatusChange = lazy(() =>
    import ("./PeriodStatusChange"));

const periodStatusChangeRoutes = [{
    path: "/period-status",
    component: PeriodStatusChange,
}];

export default periodStatusChangeRoutes;