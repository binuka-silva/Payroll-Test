import { lazy } from "react";

const PayrollDeduction = lazy(() =>
    import ("./PayrollDeductions"));

const payrollDeductionsRoutes = [{
    path: "/payroll-deductions",
    component: PayrollDeduction,
}];

export default payrollDeductionsRoutes;