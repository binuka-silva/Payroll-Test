import {lazy} from "react";

const PayrollLoanType = lazy(() =>
    import ("./PayrollLoanType"));

const payrollLoanTypeRoutes = [{
    path: "/payroll-loan-type",
    component: PayrollLoanType,
}];

export default payrollLoanTypeRoutes;