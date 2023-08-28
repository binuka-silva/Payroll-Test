import {lazy} from "react";

const PayItemAdvanceParameter = lazy(() =>
    import ("./PayItemAdvanceParameter"));

const payItemAdvanceParameterRoutes = [{
    path: "/pay-item-advance-parameter",
    component: PayItemAdvanceParameter,
}];

export default payItemAdvanceParameterRoutes;