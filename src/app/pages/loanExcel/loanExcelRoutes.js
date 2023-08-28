import {lazy} from "react";

const LoanExcel = lazy(() =>
    import ("./LoanExcel"));

const loanExcelRoutes = [{
    path: "/payroll-loan-excel",
    component: LoanExcel,
}];

export default loanExcelRoutes;