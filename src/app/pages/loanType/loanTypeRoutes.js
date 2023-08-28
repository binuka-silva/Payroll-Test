import {lazy} from "react";

const LoanType = lazy(() =>
    import ("./LoanType"));

const loanTypeRoutes = [{
    path: "/loan-type",
    component: LoanType,
}];

export default loanTypeRoutes;