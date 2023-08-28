import {lazy} from "react";

const UserRoleDetails = lazy(() => import("./userRoleDetails/UserRoleDetails"));
const UserRoles = lazy(() => import("./userRole/UserRoles"));

const userRolesRoutes = [
    {
        path: "/user-roles/details",
        component: UserRoleDetails,
    },
    {
        path: "/user-roles",
        component: UserRoles,
    }
];

export default userRolesRoutes;