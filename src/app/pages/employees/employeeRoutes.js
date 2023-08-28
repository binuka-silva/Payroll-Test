import {lazy} from "react";

const Employees = lazy(() => import("./Employees"));

const employeesRoutes = [
    {
        path: "/employees",
        component: Employees,
    }
];

export default employeesRoutes;