import {lazy} from "react";

const PayRollPeriods = lazy(() =>
    import ("./payRollPeriods"));

const payRollPeriodsRoutes = [{
    path: "/payroll-periods",
    component: PayRollPeriods,
    //auth: constant.admin
}];

export default payRollPeriodsRoutes;