import {lazy} from "react";

const EmployeeTemplate = lazy(() => import("./employeeTemplate/EmployeeTemplate"));
const EmployeeTemplateDetails = lazy(() => import("./employeeTemplateDetails/EmployeeTemplateDetails"));

const employeeTemplateDetailsRoutes = [
    {
        path: "/employee-template",
        component: EmployeeTemplate,
    },
    {
        path: "/employee-template-details",
        component: EmployeeTemplateDetails,
    }
];

export default employeeTemplateDetailsRoutes;