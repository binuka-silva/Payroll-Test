import {lazy} from "react";

const PayrollPayItem = lazy(() =>
    import ("./PayrollPayItem"));

const payrollPayItemRoutes = [{
    path: "/payroll-pay-item",
    component: PayrollPayItem,
}];

export default payrollPayItemRoutes;