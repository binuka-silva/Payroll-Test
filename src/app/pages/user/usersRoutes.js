import {lazy} from "react";

const Users = lazy(() => import("./Users"));

const userRoutes = [
    {
        path: "/users",
        component: Users,
    }
];

export default userRoutes;