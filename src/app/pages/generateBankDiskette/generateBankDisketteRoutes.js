import {lazy} from "react";

const GenerateBankDiskette = lazy(() =>
    import ("./GenerateBankDiskette"));

const GenerateBankDisketteRoutes = [
    {
        path: "/bank-diskette",
        component: GenerateBankDiskette,
    }
];

export default GenerateBankDisketteRoutes;