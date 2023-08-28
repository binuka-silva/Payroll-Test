import {lazy} from "react";

const PayrollProcessing = lazy(() =>
    import ("./PayrollProcessing"));

const PayrollProcessingRoutes = [
    {
        path: "/payroll-process",
        component: PayrollProcessing,
    }
];

export default PayrollProcessingRoutes;