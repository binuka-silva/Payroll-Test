import {lazy} from "react";

const PayrollProcess = lazy(() =>
    import ("./payrollProcess/PayrollProcess"));

const EmployeesToPayItems = lazy(() =>
    import ("./EmployeesToPayItems"));

const PayrollProcessEmployeesToPayItemsRoutes = [
    // {
    //     path: "/payroll-assign-pay-items",
    //     component: PayrollProcess,
    // },
    {
        path: "/payroll-assign-pay-items",
        component: EmployeesToPayItems,
    },
    {
        path: "/payroll-employees-to-pay-items",
        component: EmployeesToPayItems,
    }
];

export default PayrollProcessEmployeesToPayItemsRoutes;