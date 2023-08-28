import {lazy} from "react";

const PayItem = lazy(() =>
    import ("./PayItem"));

const payItemRoutes = [{
    path: "/pay-items",
    component: PayItem,
}];

export default payItemRoutes;