import {lazy} from "react";

const PayItemPeriod = lazy(() => import("./PayItemPeriod"));

const payItemPeriodRoutes = [
    {
        path: "/pay-item-period",
        component: PayItemPeriod,
        // auth: constant.admin
    }
];

export default payItemPeriodRoutes;