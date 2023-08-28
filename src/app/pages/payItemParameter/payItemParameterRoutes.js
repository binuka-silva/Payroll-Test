import {lazy} from "react";

const PayItemParameter = lazy(() =>
    import ("./payItemParameter"));

const payItemParameterRoutes = [{
    path: "/pay-item-parameter",
    component: PayItemParameter,
}];

export default payItemParameterRoutes;