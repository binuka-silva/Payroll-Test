import React from "react";
import {Redirect} from "react-router-dom";
import sessionsRoutes from "./pages/sessions/sessionsRoutes";
import AuthGuard from "./auth/AuthGuard";
import dashboardRoutes from "./pages/dashboard/dashboardRoutes";
//Master Details
import employeeGroupRoutes from "./pages/employeeGroup/employeeGroupRoutes";
import payItemTypeRoutes from "./pages/payItemType/payItemTypeRoutes";
import payItemPeriodRoutes from "./pages/payItemPeriod/payItemPeriodRoutes";
import paymentTypeRoutes from "./pages/paymentType/paymentTypeRoutes";
import processPeriodRoutes from "./pages/processPeriod/processPeriodRoutes";
import bankRoutes from "./pages/bank/bankRoutes";
import lineTypeRoutes from "./pages/bankDisketteLineTypes/lineTypeRoutes";
import branchRoutes from "./pages/branch/branchRoutes";
import payRollPeriodRoutes from "./pages/payRollPeriodDetails/payRollPeriodRoutes";
import payRollPeriodsRoutes from "./pages/payrollPeriod/payRollPeriodsRoutes";
import payItemRoutes from "./pages/payItem/payItemRoutes";
import payItemParameterRoutes from "./pages/payItemParameter/payItemParameterRoutes";
import bankDisketteRoutes from "./pages/bankDiskette/bankDisketteRoutes";
import payItemAdvanceParameterRoutes from "./pages/payItemAdvanceParameter/PayItemAdvanceParameterRoutes";
import payItemAdvanceParameterDetailsRoutes
    from "./pages/payItemAdvanceParameterDetails/PayItemAdvanceParameterDetailsRoutes";
import payrollProcessRoutes from "./pages/payrollProcess/payrollProcessRoutes";
import PayrollProcessEmployeesToPayItemsRoutes from "./pages/employeesToPayItems/payrollProcessRoutes";
import PayrollProcessPayItemsToEmployeesRoutes from "./pages/payItemsToEmployees/payItemsToEmployeesRoutes";
import SalaryRoutes from "./pages/salary/salaryRoutes";
import salaryExcelRoutes from "./pages/salaryExcel/salaryExcelRoutes";
import loanExcelRoutes from "./pages/loanExcel/loanExcelRoutes";

//User Details
import userRolesRoute from "./pages/userRole/userRoleRoutes";
import userRoutes from "./pages/user/usersRoutes";

//Employee Details
import employeeRoutes from "./pages/employees/employeeRoutes";
import employeeTemplateRoutes from "./pages/employeeTemplate/employeeTemplateRootRoute";

import payItemGroup from "./pages/payItemGroup/PayItemGroupRootRoutes";
import payItemCalculationRoutes from "./pages/payItemCalculation/payItemCalculationRoutes";

import configurationRoutes from "./pages/configuration/configurationRoutes";
import employeesToPayItemsExcelRoutes from "./pages/employeesToPayItemsExcel/employeesToPayItemsExcelRoutes";
import payrollProcessingRoutes from "./pages/payrollProcessing/payrollProcessingRoutes";
import generateBankDisketteRoutes from "./pages/generateBankDiskette/generateBankDisketteRoutes";
import periodStatusChangeRoutes from "./pages/periodStatusChange/periodStatusChangeRoutes";
import quickReportsRoutes from "./pages/quickReports/quickReportsRoutes";
import reportsRoutes from "./pages/reports/ReportsRoutes";

import loanTypeRoutes from "./pages/loanType/loanTypeRoutes";
import loansToEmployeesRoutes from "./pages/loansToEmployees/loansToEmployeesRoutes";

const redirectRoute = [
    {
        path: "/",
        exact: true,
        component: () => <Redirect to="/dashboard/v1"/>,
    },
];

const errorRoute = [
    {
        component: () => <Redirect to="/session/404"/>,
    },
];

const routes = [
    ...sessionsRoutes,
    {
        path: "/",
        component: AuthGuard,
        routes: [
            ...bankRoutes,
            ...lineTypeRoutes,
            ...employeeGroupRoutes,
            ...payItemTypeRoutes,
            ...payItemPeriodRoutes,
            ...paymentTypeRoutes,
            ...processPeriodRoutes,
            ...employeeRoutes,
            ...userRolesRoute,
            ...userRoutes,
            ...branchRoutes,
            ...payRollPeriodRoutes,
            ...payRollPeriodsRoutes,
            ...payItemRoutes,
            ...employeeTemplateRoutes,
            ...payItemParameterRoutes,
            ...payItemCalculationRoutes,
            ...payItemAdvanceParameterRoutes,
            ...payItemAdvanceParameterDetailsRoutes,
            ...generateBankDisketteRoutes,
            ...periodStatusChangeRoutes,
            ...quickReportsRoutes,
            ...reportsRoutes,
            ...payItemGroup,
            ...payrollProcessRoutes,
            ...payrollProcessingRoutes,
            ...PayrollProcessEmployeesToPayItemsRoutes,
            ...employeesToPayItemsExcelRoutes,
            ...PayrollProcessPayItemsToEmployeesRoutes,
            ...bankDisketteRoutes,
            ...SalaryRoutes,
            ...salaryExcelRoutes,
            ...loanTypeRoutes,
            ...loansToEmployeesRoutes,
            ...loanExcelRoutes,

            ...configurationRoutes,
            ...dashboardRoutes,

            ...redirectRoute,
            ...errorRoute,
        ],
    },
];

export default routes;
