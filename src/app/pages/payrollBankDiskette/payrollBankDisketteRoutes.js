import {lazy} from "react";

const PayrollBankDiskette = lazy(() =>
    import ("./payrollBankDiskette"));

const payrollBankDisketteRoutes = [{
    path: "/payroll-bank-file",
    component: PayrollBankDiskette,
}];

export default payrollBankDisketteRoutes;