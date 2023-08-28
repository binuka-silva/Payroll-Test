import {lazy} from "react";

const PayRollPeriod = lazy(() =>
    import ("./PayRollPeriod"));

const payRollPeriodRoutes = [{
    path: "/payroll-period",
    component: PayRollPeriod,
    //auth: constant.admin
}];

export default payRollPeriodRoutes;