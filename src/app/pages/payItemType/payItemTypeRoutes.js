import {lazy} from "react";

const PayItemType = lazy(() => import("./PayItemType"));

const payItemTypeRoutes = [
    {
        path: "/pay-item-type",
        component: PayItemType,
        // auth: constant.admin
    }
];

export default payItemTypeRoutes;