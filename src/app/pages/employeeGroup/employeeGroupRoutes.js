import {lazy} from "react";

const EmployeeGroup = lazy(() => import("./EmployeeGroup"));

const employeeGroupRoutes = [
    {
        path: "/employee-group",
        component: EmployeeGroup,
        // auth: constant.user
    }
];

export default employeeGroupRoutes;