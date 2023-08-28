import {lazy} from "react";

const PayItemsToEmployees = lazy(() =>
    import ("./PayItemsToEmployees"));

const PayrollProcessPayItemsToEmployeesRoutes = [{
    path: "/payroll-assign-employees",
    component: PayItemsToEmployees,
}];

export default PayrollProcessPayItemsToEmployeesRoutes;