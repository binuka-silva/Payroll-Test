import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import {connect, useSelector} from "react-redux";
import {Button, FormLabel} from "react-bootstrap";
import {setPayrollTaxDetails} from "../../../redux/actions/PayrollTaxDetailsActions";
import {isBack, requestPath} from "../constant";
import AutoCompleteDropDown from "../../../components/AutoCompleteDropDown";
import localStorageService from "../../../services/localStorageService";
import moment from "moment";
import GullLoadable from "../../../../@gull/components/GullLoadable/GullLoadable";
import {NotificationManager} from "react-notifications";
import PayrollDropDown from "../../../components/PayrollDropDown";
import loanTypeService from "app/api/LoanTypeServices/loanTypeService";
import payrollProcessService from "../../../api/payrollProcessServices/payrollProcessService";
import LoansToEmployeesList from "./LoansToEmployeesList";
import LoansToEmployeesModal from "./LoansToEmployeesModal";
import history from "../../../../@history";
import {omit} from "lodash";


const LoansToEmployees = () => {
    const [labelList, setLabelList] = useState([]);
    const [userLabels, setUserLabels] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [employee, setEmployee] = useState("");
    const [allLoanTypeData, setAllLoanTypeData] = useState([]);
    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [loanTypesData, setLoanTypesData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isWindowLoading, setWindowLoading] = useState(true);

    const [payroll, setPayroll] = useState(null);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [employeeData, setEmployeeData] = useState([]);

    const [startDateData, setStartDateData] = useState([]);
    const [endDateData, setEndDateData] = useState([]);
    const [processPeriodData, setProcessPeriodData] = useState([]);

    const [closePeriodsData, setClosePeriodsData] = useState([]);
    const [employeeName, setEmployeeName] = useState("");
    const [prossPeriods, setProssPeriods] = useState("");
    const [sPeriods, setSPeriods] = useState("");
    const [ePeriods, setEPeriods] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [fixed, setFixed] = useState([]);
    const [variable, setVariable] = useState([]);
    const [loansToEmployeesData, setLoansToEmployeesData] = useState([]);
    const [isPayrollChange, setPayrollChange] = useState(true);
    const [loansToEmployeesList, setLoansToEmployeesList] = useState([]);

    const loansToEmployee = useSelector((state) => state.loansToEmployees);

    useEffect(() => {
        NotificationManager.listNotify.forEach((n) => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
        setLabelList(localStorageService.getItem("label_list")?.filter((list) => list.permissionPage.path === window.location.pathname));
        setUserLabels(localStorageService.getItem("auth_user")?.labels);

        fetchPayrollData();
    }, []);

    useEffect(() => {
        if (allLoanTypeData?.length === 0 && selectedEmployee !== "") {
            fetchLoanTypeData();
        }
    }, [selectedEmployee]);

    useEffect(() => {
        if (isPayrollChange && selectedEmployee !== "") {
            setPayrollChange(false);
            fetchLoansToEmployeesData(payroll, selectedEmployee);

            let df = payroll?.payRollPeriod.payRollPeriodDetails.map((period) => {
                return {
                    value: period.periodNo,
                    periodNo: period.periodProcess,
                    label: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
                    startDate: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
                    endDate: moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD"),
                };
            });
            setStartDateData(df);
        }
    }, [selectedEmployee]);

    useEffect(() => { 
        
        if (history.action === isBack && payroll && employeeData.length > 0 && loanTypesData.length > 0) {
            setSelectedEmployee({...loansToEmployee.employee, label: loansToEmployee.employee.empNo, value: loansToEmployee.employee.id});
            setEmpName(loansToEmployee.employee.id);
            setEmployee(loansToEmployee.employee.id);
            fetchLoansToEmployeeData(payroll, loansToEmployee.employee.id);
        }
    },[payroll, employeeData, loanTypesData]);

    useEffect(() => {
        setPayrollChange(true);
    }, [payroll]);

    useEffect(() => {
        if (payroll && allLoanTypeData?.length !== 0) {
            setLoanTypeDetails(payroll);
        }
    }, [allLoanTypeData]);

    function fetchPayrollData() {
        const storedPayrollId = localStorageService.getItem("selected_payroll")?.value ?? localStorageService.getItem("auth_user")?.payrollDefinitionId;
        payrollProcessService().getNames()
            .then(({data: payrollList}) => {
                payrollList = payrollList.map((payrollProcess) => ({
                    value: payrollProcess.id,
                    label: `${payrollProcess.code} - ${payrollProcess.name}`,
                }));
                setPayrollProcessList(payrollList);

                if (!storedPayrollId) {
                    payrollProcessService().findOne(payrollList[0], window.location.pathname)
                        .then(({data: details}) => {
                            setPayrollDetails(details);
                            setWindowLoading(false);
                            setPayroll(details);
                        })
                        .catch((error) => {
                            if (error.status === 404) {
                                NotificationManager.error("There is no active employees for selected payroll", "Error");
                                setWindowLoading(false);
                                return {};
                            }
                        });
                }
            });

        if (storedPayrollId) {
            payrollProcessService()
                .findOne(storedPayrollId, window.location.pathname)
                .then(({data: details}) => {
                    setPayrollDetails(details);
                    setWindowLoading(false);
                    setPayroll(details);
                })
                .catch((error) => {
                    if (error.status === 404) {
                        NotificationManager.error("There is no active employees for selected payroll", "Error");
                        setWindowLoading(false);
                        return {};
                    }
                });
        }
    }

    const setPayrollDetails = (details) => {
        setCode(details?.code);
        setName(details?.name);

        let payrollEmployeeData = details.selectedEmployeesPageHeader.map((emp) => {
            return {
                value: emp.id,
                label: emp.empNo,
                empName: emp.employeeName,
                designation: emp.empPosCode,
                isActive: emp.employeeStatus,
            };
        });

        setEmployeeData(payrollEmployeeData);

        let pp = details.payRollPeriod.payRollPeriodDetails.map((period) => {
            return {
                id: period.id,
                value: period.periodNo,
                //Todo: Why
                periodNo: period.periodProcess,
                periodProcess: period.periodProcess,
                sDate: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
                eDate: moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD"),
                label: `${moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD")} - ${moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD")}`,
            };
        });
        setProcessPeriodData(pp);

        fetchLoanTypeData();
        setLoanTypeDetails(details);
    };

    //Load loan type data
    function fetchLoanTypeData() {
        loanTypeService()
            .getAll()
            .then(({data: response}) => {
                response = response.map((loantype) => ({
                    value: loantype.id,
                    label: loantype.code,
                    name: loantype.name,
                    code: loantype.code,
                    maxAmount: loantype.maxAmount,
                    maxInstalments: loantype.maxInstalments,
                    interestRate: loantype.interestRate,
                    active: loantype.active,
                    allowMultiple: loantype.allowMultiple,
                }));

                setAllLoanTypeData(response);
            });
    }

    const setLoanTypeDetails = (details) => {
        const payrollLoanTypes = details.payrollLoanTypePageHeader.payrollLoanType.filter((v) => v.active === true)
            .map((payrollLoanType) => {
                const loanType = allLoanTypeData.find((v) => v.value === payrollLoanType.loanTypeId);
                return {
                    value: payrollLoanType.id,
                    label: loanType?.label,
                    name: loanType?.name,
                    code: loanType?.code,
                    maxAmount: loanType?.maxAmount,
                    maxInstalments: loanType?.maxInstalments,
                    interestRate: loanType?.interestRate,
                    active: loanType?.active,
                    allowMultiple: loanType?.allowMultiple,
                };
            });
        setLoanTypesData(payrollLoanTypes);
    };

    //Fetch table data
    const fetchLoansToEmployeesData = (details, empData) => {
        setLoading(true);
        payrollProcessService()
            .getLoansToEmployees(details.id)
            .then(({data}) => {
                setLoansToEmployeesData(data);
                setLoading(false);
            });
    };

    //Fetch table data
    const fetchLoansToEmployeeData = (details, itemData) => {
        setLoading(true);
        payrollProcessService().getLoansToEmployees(details.id).then(({data}) => {
                let loansToEmployeeData = data.loansToEmployees?.filter((v) => v.employeeId === (itemData ?? employee));
                data = loansToEmployeeData?.map((loans) => ({
                    id: loans.id,
                    amount: loans.amount,
                    instalments: loans.instalments,
                    active: loans.active,
                    sequence: loans.sequence,
                    capitalAmount: loans?.monthlyEmis[0]?.principal,
                    interestAmount: loans?.monthlyEmis[0]?.interest,
                    instalmentAmount: (Number(loans?.monthlyEmis[0]?.principal) + Number(loans?.monthlyEmis[0]?.interest)).toFixed(2),
                    effectiveDate: loans.effectiveDate?.split("T")[0],
                    applyDate: loans.applyDate?.split("T")[0],
                    monthlyEmis: loans.monthlyEmis,
                    loanType: loanTypesData?.find((v) => v.value === loans.payrollLoanTypeId)?.label,
                    loanTypeName: loanTypesData?.find((v) => v.value === loans.payrollLoanTypeId)?.name,
                }));
                setLoading(false);
                setLoansToEmployeesList(data);
            });
    };

    const payrollOnChange = async (e, selected) => {
        if (!selected) return;
        setWindowLoading(true);
        const {data} = await payrollProcessService().findOne(selected.value, requestPath)
            .catch((error) => {
                if (error.status === 404) {
                    NotificationManager.error("There is no active employees for selected payroll", "Error");
                    setWindowLoading(false);
                    return {};
                }
            });
        if (!data) return;
        localStorageService.setItem("selected_payroll", selected);
        setPayroll(data);
        setEmployeeName("");
        setSelectedEmployee("");
        setLoansToEmployeesList([]);

        window.scrollTo(0, 0);
        setPayrollDetails(data);
        setLoanTypeDetails(data);
        setWindowLoading(false);
    };

    const setEmpName = (emp) => {
        const data = employeeData?.find((v) => v.value === emp)?.empName;
        setEmployeeName(data);
    };

    return (
        <>
            {isWindowLoading && (
                <div className="overlay">
                    <GullLoadable/>
                </div>
            )}
            {showModal && (
                <LoansToEmployeesModal
                    show={showModal}
                    employeeData={employeeData}
                    setShow={setShowModal}
                    payrollId={payroll.id}
                    setEmployee={setSelectedEmployee}
                    setEmployeeName={setEmployeeName}
                />
            )}

            <div className="row">
                <div className="col-md-9 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Loans To Employees"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-3">
                    <div className="mt-1 d-flex justify-content-end">
                        <PayrollDropDown
                            payrollOnChange={payrollOnChange}
                            payrollProcessList={payrollProcessList}
                        />
                    </div>
                </div>
            </div>
            <div className="row mb-1 ">
                <div className="col-md-2">
                    <FormLabel>Payroll Code</FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={code ?? ""}
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

                <div className="col-md-2">
                    <FormLabel>Employee Id</FormLabel>
                    <AutoCompleteDropDown
                        isFreeDropDown={true}
                        dropDownData={employeeData}
                        onChange={(e, selected) => {
                            setSelectedEmployee(selected);
                            setEmpName(selected?.value);
                            setEmployee(selected?.value);
                            fetchLoansToEmployeeData(payroll, selected?.value);
                        }}
                        size={"small"}
                        label="Search"
                        defaultValue={selectedEmployee}
                    />
                </div>

                <div className="col-md-2">
                    <FormLabel>Employee Name</FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={employeeName ?? ""}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        readOnly={true}
                    />
                </div>

                <div className="col-md-2 mt-4 d-flex">
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => setShowModal(true)}
                    >
                        Search Employee
                    </Button>
                </div>
            </div>

            <br></br>
            <br></br>

            <div className="row">
                <LoansToEmployeesList
                    fetchLoansToEmployeesFunc={fetchLoansToEmployeesData}
                    loanTypesData={loanTypesData}
                    employee={selectedEmployee?.value}
                    employees={selectedEmployee}
                    isLoading={isLoading}
                    setLoading={setLoading}
                    payroll={payroll}
                    fixed={fixed}
                    variable={variable}
                    startDateData={startDateData}
                    endDateData={endDateData}
                    prossPeriods={prossPeriods}
                    sPeriods={sPeriods}
                    setSPeriods={setSPeriods}
                    setEPeriods={setEPeriods}
                    ePeriods={ePeriods}
                    closePeriodsData={closePeriodsData}
                    setLoansToEmployeesList={setLoansToEmployeesList}
                    fetchLoansToEmployeeFunc={fetchLoansToEmployeeData}
                    loansToEmployeesList={loansToEmployeesList}
                    processPeriodData={processPeriodData}
                />
            </div>

            <br></br>
            <br></br>

            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(LoansToEmployees);
