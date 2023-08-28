import {lazy} from "react";

const Bank = lazy(() => import("./Bank"));

const bankRoutes = [
    {
        path: "/bank",
        component: Bank,
    }
];

export default bankRoutes;