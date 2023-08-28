import {lazy} from "react";

const PayItemGroup = lazy(() =>
    import ("./payItemGroup/PayItemGroup"));

const PayItemGroupDetails = lazy(() =>
    import ("./payItemGroupDetails/PayItemGroupDetails"));

const payItemGroupRootRoutes = [
    {
        path: "/pay-item-groups/details",
        component: PayItemGroupDetails,
    },
    {
        path: "/pay-item-groups",
        component: PayItemGroup,
    }
];

export default payItemGroupRootRoutes;