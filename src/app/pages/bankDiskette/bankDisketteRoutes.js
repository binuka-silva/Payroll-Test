import {lazy} from "react";

const bankFile = lazy(() =>
    import ("./bankFile/BankFile"));

const bankFileConfigurator = lazy(() =>
    import ("./bankFileConfigurator/BankFileConfigurator"));

const BankFileFormat = lazy(() =>
    import ("./bankFileConfigurator/format/BankFileFormat"));

const bankDisketteRoutes = [{
    path: "/bank-file",
    component: bankFile,
},
    {
        path: "/bank-file-configurator/format",
        component: BankFileFormat,
    },
    {
        path: "/bank-file-configurator",
        component: bankFileConfigurator,
    }
];

export default bankDisketteRoutes;