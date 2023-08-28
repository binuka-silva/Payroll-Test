import { lazy } from "react";

const PayrollProcess = lazy(() =>
    import ("./payrollProcess/PayrollProcess"));

const PayrollProcessDetails = lazy(() =>
    import ("./payrollProcessDetails/PayrollProcessDetails"));

const TaxDetails = lazy(() =>
    import ("../payrollProcess/payrollProcess/TaxDetails"));

const CompanyAccount = lazy(() =>
    import ("../companyAccount/CompanyAccount"));

const Employees = lazy(() =>
    import ("./employees/Employee"));

const PayrollParameter = lazy(() =>
    import ("../payrollParameter/PayrollParameter"));

const PayrollPayItem = lazy(() =>
    import ("../payrollPayItem/PayrollPayItem"));

const PayrollBankDiskette = lazy(() =>
    import ("../payrollBankDiskette/payrollBankDiskette"));

const PayrollLoanType = lazy(() =>
    import ("../payrollLoanType/PayrollLoanType"));

const PayrollDeduction = lazy(() =>
    import ("../payrollDeductions/PayrollDeductions"));

const PayrollTakeProfit = lazy(() =>
    import ("../payrollTakeProfit/PayrollTakeProfit"));

const payrollProcessRoutes = [{
        path: "/payroll",
        exact: true,
        component: PayrollProcess,
    },
    {
        path: "/payroll-details",
        component: PayrollProcessDetails,
        routes: [{
                path: "/tax",
                exact: true,
                component: TaxDetails,
            },
            {
                path: "/company-accounts",
                exact: true,
                component: CompanyAccount,
            },
            {
                path: "/payroll-parameter",
                exact: true,
                component: PayrollParameter,
            },
            {
                path: "/payroll-pay-item",
                exact: true,
                component: PayrollPayItem,
            },
            {
                path: "/payroll-bank-file",
                exact: true,
                component: PayrollBankDiskette,
            },
            {
                path: "/employees",
                exact: true,
                component: Employees,
            },
            {
                path: "/payroll-loan-type",
                exact: true,
                component: PayrollLoanType,
            },
            {
                path: "/payroll-deductions",
                exact: true,
                component: PayrollDeduction,
            },
            {
                path: "/payroll-take-profit",
                exact: true,
                component: PayrollTakeProfit,
            },
        ]
    }
];

export default payrollProcessRoutes;