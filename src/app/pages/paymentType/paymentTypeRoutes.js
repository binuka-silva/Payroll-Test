import {lazy} from "react";

const PaymentType = lazy(() => import("./PaymentType"));

const paymentTypeRoutes = [
    {
        path: "/payment-type",
        component: PaymentType,
        // auth: constant.admin
    }
];

export default paymentTypeRoutes;