import {lazy} from "react";

const Configuration = lazy(() =>
    import ("./Configuration"));
const PageLabelConfiguration = lazy(() =>
    import ("./PageLabelConfiguration"));

const configurationRoutes = [{
    path: "/configurations",
    component: Configuration,
    // auth: constant.admin
},
    {
        path: "/page-label-configurations",
        component: PageLabelConfiguration,
        // auth: constant.admin
    },
];

export default configurationRoutes;