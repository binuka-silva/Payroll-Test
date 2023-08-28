import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {NavLink, withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../../api/payrollProcessServices/payrollProcessService";
import TaxDetails from "../payrollProcess/TaxDetails";
import CompanyAccount from "../../companyAccount/CompanyAccount";
import PayrollParameter from "../../payrollParameter/PayrollParameter";
import PayrollPayItem from "../../payrollPayItem/PayrollPayItem";
import PayrollBankDiskette from "../../payrollBankDiskette/payrollBankDiskette";
import PayrollLoanType from "../../payrollLoanType/PayrollLoanType";
import PayrollDeductions from "../../payrollDeductions/PayrollDeductions";
import PayrollTakeProfit from "../../payrollTakeProfit/PayrollTakeProfit"; 
import {useSelector} from "react-redux";
import {NotificationManager} from "react-notifications";
import {FormLabel, Tab, Tabs} from "react-bootstrap";
import history from "../../../../@history";
import Employee from "../employees/Employee";

// import "./styles/payroll.scss";

const customTabHeader = (title, icon) => (
    <div className="d-flex align-items-center">
    <span className="me-2">
      <i className={icon}></i>
    </span>
        <span>{title}</span>
    </div>
);

const PayrollProcessDetails = () => {
    const [location, setLocation] = useState("");
    const [isEdit, setEdit] = useState(false);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [payRollPeriod, setPayRollPeriod] = useState("");
    const [employeeTemplate, setEmployeeTemplate] = useState("");
    const [cutoffDateList, setCutoffDateList] = useState([]);
    const [cutoffDate, setCutoffDate] = useState("");

    const [navigationList, setNavigationList] = useState([]);

    const payrolltaxDetails = useSelector((state) => state.payrollTaxDetails);

    useEffect(() => {
        window.scrollTo(0, 0);
        setCode(payrolltaxDetails?.code);
        setName(payrolltaxDetails?.name);
        setPayRollPeriod(payrolltaxDetails?.payRollPeriodId);
        setCutoffDate(payrolltaxDetails?.cutOffDate);
        setEmployeeTemplate(payrolltaxDetails.employeeTemplateId);
        setCutoffDateList([
            {label: "Monday", value: "Monday"},
            {label: "Tuesday", value: "Tuesday"},
            {label: "Wednesday", value: "Wednesday"},
            {label: "Thursday", value: "Thursday"},
            {label: "Friday", value: "Friday"},
            {label: "Saturday", value: "Saturday"},
            {label: "Sunday", value: "Sunday"},
        ]);
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        setNavigationList([
            {
                icon: "i-Receipt-4",
                name: "Tax Details",
                path: "/payroll-details/tax",
                component: (
                    <TaxDetails
                        setTaxNumber={handleTaxNumberSet}
                        setEpfId={handleEPFIdSet}
                        setEtfId={handleETFIdSet}
                        payrollProcessList={payrolltaxDetails?.payrollProcessList}
                    />
                ),
            },
            {
                icon: "i-Receipt-4",
                name: "Company Accounts",
                path: "/payroll-details/company-accounts",
                component: (
                    <CompanyAccount
                        payrollProcessList={payrolltaxDetails?.payrollProcessList}
                    />
                ),
            },
            {
                icon: "i-Receipt-4",
                name: "Payroll Parameters",
                path: "/payroll-details/payroll-parameter",
                component: <PayrollParameter/>,
            },
            {
                icon: "i-Receipt-4",
                name: "Employees",
                path: "/payroll-details/employees",
                component: <Employee/>,
            },
            {
                icon: "i-Receipt-4",
                name: "Assign Pay Items",
                path: "/payroll-details/payroll-pay-item",
                component: (
                    <PayrollPayItem
                        payrollProcessList={payrolltaxDetails?.payrollProcessList}
                    />
                ),
            },
            {
                icon: "i-Receipt-4",
                name: "Assign Loan Types",
                path: "/payroll-details/payroll-loan-type",
                component: (
                    <PayrollLoanType
                        payrollProcessList={payrolltaxDetails?.payrollProcessList}
                    />
                ),
            },
            {
                icon: "i-Receipt-4",
                name: "Assign Bank Diskettes",
                path: "/payroll-details/payroll-bank-file",
                component: (
                    <PayrollBankDiskette
                        payrollProcessList={payrolltaxDetails?.payrollProcessList}
                    />
                ),
            },
            {
                icon: "i-Receipt-4",
                name: "Negative Salary Config Order",
                path: "/payroll-details/payroll-deductions",
                component: (
                    <PayrollDeductions
                        payrollProcessList={payrolltaxDetails?.payrollProcessList}
                    />
                ),
            },
            {
                icon: "i-Receipt-4", 
                name: "Take Home Config Order",
                path: "/payroll-details/payroll-take-profit",
                component: (
                    <PayrollTakeProfit
                        payrollProcessList={payrolltaxDetails?.payrollProcessList}
                    />
                ),
            },
        ]);
        // fetchPayrollProcessData();
    }, []);

    useEffect(() => {
        setLocation(window.location.pathname);
    }, [window.location.pathname]);

    const isExists = (row) => {
        const x = payrolltaxDetails.payrollPeriodList.find(
            (b) => b.value === row.payRollPeriodId
        )?.label;
        const y = payrolltaxDetails?.employeeTemplateList.find(
            (b) => b.value === row.employeeTemplateId
        )?.label;
        const exists = payrolltaxDetails?.payrollProcessList
            .filter((b) => b.id !== payrolltaxDetails.id)
            .find(
                (detail) => detail.payRollPeriod === x || detail.employeeTemplate === y
            );

        if (exists) {
            NotificationManager.error("Duplicate data added", "Error");
            return true;
        }
        return false;
    };

    const handleSubmit = () => {
        const payrollProcess = {
            code: payrolltaxDetails.code,
            name: payrolltaxDetails.name,
            cutOffDate: cutoffDate,
            employeeTemplateId: employeeTemplate,
            payRollPeriodId: payRollPeriod,
            isProcessed: false,
            IsDelete: false,
            modifiedDateTime: new Date(),
        };

        if (isExists(payrollProcess)) {
            return NotificationManager.error(
                "An existing record already found",
                "Error"
            );
        }

        payrollProcessService()
            .update(payrollProcess, payrolltaxDetails.id)
            .then((response) => {
                NotificationManager.success(
                    "A record was successfully updated",
                    "Success"
                );
                history.push("/payroll");
            })
            .catch((error) => {
                console.error(error);
                NotificationManager.error("An existing record already found", "Error");
            });
    };

    const handleTaxNumberSet = async (e) => {
        try {
            const res = await payrollProcessService().setTaxNumber(
                payrolltaxDetails.id,
                e
            );
            NotificationManager.success(
                "A record was successfully updated",
                "Success"
            );
        } catch (e) {
            console.error(e);
            NotificationManager.error("Saving Failed", "Error");
        }
    };

    const handleEPFIdSet = async (e) => {
        try {
            const res = await payrollProcessService().setEPFId(
                payrolltaxDetails.id,
                e
            );
        } catch (e) {
            console.error(e);
            NotificationManager.error("Saving Failed", "Error");
        }
    };

    const handleETFIdSet = async (e) => {
        try {
            const res = await payrollProcessService().setETFId(
                payrolltaxDetails.id,
                e
            );
        } catch (e) {
            console.error(e);
            NotificationManager.error("Saving Failed", "Error");
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-md-8 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Payroll", path: "/payroll"},
                            location === "/payroll-details/tax"
                                ? {name: "Payroll - Tax Details"}
                                : location === "/payroll-details/payroll-parameter"
                                    ? {name: "Payroll - Parameter Details"}
                                    : location === "/payroll-details/employees"
                                        ? {name: "Payroll - Employee Details"}
                                        : location === "/payroll-details/payroll-pay-item"
                                            ? {name: "Payroll - Pay Item Details"}
                                            : location === "/payroll-details/payroll-bank-file"
                                                ? {name: "Payroll - Bank File Details"}
                                                : location === "/payroll-details/company-accounts"
                                                    ? {name: "Payroll - Company Accounts Details"}
                                                    : location === "/payroll-details/payroll-loan-type"
                                                        ? {name: "Payroll - Loan Details"}
                                                    : location === "/payroll-details/payroll-deductions"
                                                        ? {name: "Payroll - Negative Salary Configuration"}
                                                    : location === "/payroll-details/payroll-take-profit"
                                                        ? {name: "Payroll - Take Home Configuration" }
                                                        : "",
                        ]}
                    ></Breadcrumb>
                </div>
                {location === "/payroll-details/payroll-pay-item" ? (
                    <div className="col-md-4">
                        <div className="mt-2 d-flex justify-content-start">
                            <NavLink to={"/pay-items"}>
                  <span className="capitalize text-muted">
                    |&nbsp;Pay&nbsp;Items&nbsp;|
                  </span>
                            </NavLink>
                        </div>
                    </div>
                ) : location === "/payroll-details/payroll-bank-file" ? (
                    <div className="col-md-4">
                        <div className="mt-2 d-flex justify-content-start">
                            <NavLink to={"/bank-file"}>
                  <span className="capitalize text-muted">
                    |&nbsp;Bank&nbsp;Files&nbsp;|
                  </span>
                            </NavLink>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div className="row mb-1">
                <div className="col-md-2">
                    <FormLabel>Payroll Code</FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={code ?? ""}
                        onChange={(e) => setCode(e.target.value)}
                        readOnly={true}
                    />
                </div>

                <div className="col-md-2">
                    <FormLabel>Payroll Name</FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={name ?? ""}
                        onChange={(e) => setName(e.target.value)}
                        readOnly={true}
                    />
                </div>
            </div>
            <br/>
            <Tabs
                defaultActiveKey={window.location.pathname}
                id="uncontrolled-tab-example"
                onSelect={(k) => history.push(k)}
            >
                {navigationList.map((nav) => (
                    <Tab
                        eventKey={nav.path}
                        title={customTabHeader(nav.name, nav.icon)}
                    >
                        {location === nav.path && nav.component}
                    </Tab>
                ))}
            </Tabs>
            <NotificationContainer/>
        </>
    );
};

export default withRouter(PayrollProcessDetails);
