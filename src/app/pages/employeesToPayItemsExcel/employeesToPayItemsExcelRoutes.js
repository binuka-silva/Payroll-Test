import {lazy} from "react";

const EmployeesToPayItemsExcel = lazy(() =>
    import ("./EmployeesToPayItemsExcel"));

const PayrollProcessEmployeesToPayItemsRoutes = [
    {
        path: "/payroll-employees-to-pay-items-excel",
        component: EmployeesToPayItemsExcel,
    }
];

export default PayrollProcessEmployeesToPayItemsRoutes;