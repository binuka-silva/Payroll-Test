import { lazy } from "react";

const PayrollTakeProfit = lazy(() =>
    import ("./PayrollTakeProfit"));

const payrollTakeProfitRoutes = [{
    path: "/payroll-take-profit",
    component: PayrollTakeProfit,
}];

export default payrollTakeProfitRoutes;