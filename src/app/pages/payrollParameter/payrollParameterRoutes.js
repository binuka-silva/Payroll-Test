import {lazy} from "react";

const PayrollParameter = lazy(() =>
    import ("./PayrollParameter"));

const payrollParameterRoutes = [{
    path: "/payroll-parameter",
    component: PayrollParameter,
}];

export default payrollParameterRoutes;