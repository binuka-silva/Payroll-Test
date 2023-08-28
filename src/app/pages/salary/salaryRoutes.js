import {lazy} from "react";

const Salary = lazy(() =>
    import ("./Salary"));

const SalaryRoutes = [

    {
        path: "/payroll-salary-increment",
        component: Salary,
    }
];

export default SalaryRoutes;