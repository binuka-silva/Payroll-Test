import {lazy} from "react";

const PayItemCalculations = lazy(() =>
    import ("./PayItemCalculation"));

const payItemCalculationsRootRoutes = [
    {
        path: "/pay-items-calculations",
        component: PayItemCalculations,
    }
];

export default payItemCalculationsRootRoutes;