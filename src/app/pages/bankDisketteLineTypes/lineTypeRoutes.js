import {lazy} from "react";

const LineTypes = lazy(() =>
    import ("./LineTypes"));

const lineTypeRoutes = [{
    path: "/bank-line-types",
    component: LineTypes,
    // auth: constant.admin
}];

export default lineTypeRoutes;