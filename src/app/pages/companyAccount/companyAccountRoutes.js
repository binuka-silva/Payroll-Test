import {lazy} from "react";

const CompanyAccount = lazy(() =>
    import ("./CompanyAccount"));

const companyAccountRoutes = [{
    path: "/company-account",
    component: CompanyAccount,
}];

export default companyAccountRoutes;