import {lazy} from "react";

const SalaryExcel = lazy(() =>
    import ("./SalaryExcel"));

const salaryExcelRoutes = [{
    path: "/payroll-salary-excel",
    component: SalaryExcel,
}];

export default salaryExcelRoutes;