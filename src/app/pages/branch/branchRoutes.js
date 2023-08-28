import {lazy} from "react";

const Branch = lazy(() =>
    import ("./Branch"));

const branchRoutes = [{
    path: "/branch",
    component: Branch,
}];

export default branchRoutes;