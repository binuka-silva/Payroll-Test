import {lazy} from "react";

const LoansToEmployees = lazy(() =>
    import ("./loansToEmployees/LoansToEmployees"));

const LoansToEmployeesDetails = lazy(() =>
    import ("./loansToEmployeesDetails/loansToEmployeesDetails"));

const loansToEmployeesRoutes = [{
    path: "/payroll-apply-loan",
    component: LoansToEmployees,
},
    {
        path: "/payroll-apply-loan-details",
        component: LoansToEmployeesDetails,
    }
];

export default loansToEmployeesRoutes;