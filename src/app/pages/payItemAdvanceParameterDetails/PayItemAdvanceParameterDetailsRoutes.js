import {lazy} from "react";

const PayItemAdvanceParameterDetails = lazy(() =>
    import ("./PayItemAdvanceParameterDetails"));

const payItemAdvanceParameterDetailsRoutes = [{
    path: "/pay-item-advance-parameter-details",
    component: PayItemAdvanceParameterDetails,
}];

export default payItemAdvanceParameterDetailsRoutes;