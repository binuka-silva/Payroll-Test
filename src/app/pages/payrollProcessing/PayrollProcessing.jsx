import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import PayrollProcessingList from "./PayrollProcessingList";
import {
    inactiveEmployee,
    payrollDefinitionStatus,
    payrollPeriodProcess,
    payrollProcessStatus,
    requestPath,
} from "./constant";
import swal from "sweetalert2";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import localStorageService from "../../services/localStorageService";
import payItemService from "../../api/payItemServices/payItemService";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import {setPayrollDetailsData} from "../../common/payrollDetails";
import {Button, ProgressBar} from "react-bootstrap";
import payrollProcessingService from "../../api/payrollProcessingServices/payrollProcessService";
import {NotificationManager} from "react-notifications";
import {NavLink} from "react-router-dom";
import PayrollDropDown from "../../components/PayrollDropDown";
import moment from "moment";
import generatePeriod from "../../common/generatePeriod";

const PayrollProcessing = () => {
    const [isLoading, setLoading] = useState(false);
    const [dateFromPeriod, setDateFromPeriod] = useState("");
    const [dateToPeriod, setDateToPeriod] = useState("");
    const [progressValue, setProgressValue] = useState(0);
    const [isProcess, setProcess] = useState(false);
    const [payrollPeriod, setPayrollPeriod] = useState({});

    const [payItemsData, setPayItemsData] = useState([]);
    const [failedProcess, setFailedProcess] = useState([]);
    const [negativeSalaryProcess, setNegativeSalaryProcess] = useState([]);
    const [takeHomeProcess, setTakeHomeProcess] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [empDataList, setEmpDataList] = useState([]);
    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [payrollStatusList, setPayrollStatusList] = useState([]);
    const [selectedEmpList, setSelectedEmpList] = useState([]);
    const [intervalTimout, setIntervalTimout] = useState(0);

    const [processData, setProcessData] = useState({});
    const [payrollStatus, setPayrollStatus] = useState(null);
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [showNegativeSalaryModal, setShowNegativeSalaryModal] = useState(false);
    const [showTakeHomeModal, setShowTakeHomeModal] = useState(false);
    const [invalidBtnStyle, setInvalidBtnStyle] = useState("secondary");
    const [negativeSalaryBtnStyle, setNegativeSalaryBtnStyle] = useState("warning");
    const [takeHomeBtnStyle, setTakeHomeBtnStyle] = useState("warning");

    const [payroll, setPayroll] = useState(null);
    const [isInactiveEmp, setInactiveEmp] = useState(true);
    const [disableRollback, setDisableRollback] = useState(false);
    const [disableProcess, setDisableProcess] = useState(false);

    let isNotifyShow = false;

    useEffect(() => {
        fetchPayItem();
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        setPayrollStatusList([
            /*{value: payrollDefinitionStatus.OPEN, label: Object.keys(payrollDefinitionStatus)[0]},
            {
              value: payrollDefinitionStatus.PROCESSED,
              label: Object.keys(payrollDefinitionStatus)[1],
            },*/
            {
                value: payrollDefinitionStatus.CLOSE,
                label: Object.keys(payrollDefinitionStatus)[2],
            },
            {
                value: payrollDefinitionStatus.APPROVED,
                label: Object.keys(payrollDefinitionStatus)[3],
            },
        ]);
    }, []);

    useEffect(() => {
        return () => clearInterval(intervalTimout);
    }, [intervalTimout]);

    useEffect(() => {
        if (isProcess && payroll) {
            const intervalId = setInterval(() => {
                processPayroll(payroll, intervalId);
            }, 6000);
            setIntervalTimout(intervalId);
        }
    }, [isProcess]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!payroll && payItemsData.length !== 0) {
            const storedPayrollId =
                localStorageService.getItem("selected_payroll")?.value ??
                localStorageService.getItem("auth_user")?.payrollDefinitionId;
            setLoading(true);
            fetchPayrollProcessData().then(({data: payrollList}) => {
                payrollList = payrollList.map((payrollProcess) => ({
                    value: payrollProcess.id,
                    label: `${payrollProcess.code} - ${payrollProcess.name}`,
                }));

                if (!storedPayrollId) {
                    payrollProcessService()
                        .findOne(payrollList[0].value, window.location.pathname)
                        .then(({data: details}) => {
                            fetchProcessingDetails(details);
                            setPayroll(details);
                        });
                }
                setPayrollProcessList(payrollList);
            });

            if (storedPayrollId) {
                payrollProcessService()
                    .findOne(storedPayrollId, window.location.pathname)
                    .then(({data: details}) => {
                        fetchProcessingDetails(details);
                        setPayroll(details);
                    });
            }
        }
    }, [payroll, payItemsData]); 

    const fetchProcessingDetails = (payroll, isProcessing = false) => {
        const {empData} = setPayrollDetails(payroll);
        const payrollPeriodDetailId =
            payroll?.payRollPeriod?.payRollPeriodDetails?.find(
                (v) => v.periodProcess !== payrollPeriodProcess.CLOSE
            )?.id;
        payrollProcessingService()
            .getDetails(payroll.id, payrollPeriodDetailId)
            .then(({data}) => {   
                const payrollNegativeData = data.payrollProcessEmployees?.filter((v)=>v.negativeSalary) ?? [];
                if (payrollNegativeData) {
                const negativeSalary = empData.filter(e =>data.payrollProcessEmployees.find(p => p.payrollProcessEmployeeResults.find(m => m.payItemId === payroll.payItemForNetSalaryId) && p.negativeSalary.length > 0 && e.id === p.employeeId));
                const takeHome = empData.filter(e =>data.payrollProcessEmployees.find(p => p.payrollProcessEmployeeResults.find(m => m.payItemId === payroll.payItemForNetSalaryId) && p.deductionExceeds.length > 0 && e.id === p.employeeId));
                const negativeSalaryArr = [];
                const takeHomeArr = [];
                negativeSalary.forEach(n => {
                    const x = data.payrollProcessEmployees.find(m => m.employeeId === n.id);
                    x.negativeSalary.forEach(m => {
                        negativeSalaryArr.push({
                            employeeId: n.empNo,
                            amount: m.amount,
                            payItemId: x.payrollProcessEmployeeResults.find(p => p.id === m.payrollProcessEmployeeResultId)?.payItem?.code
                        })
                    })
                });
                takeHome.forEach(n => {
                    const x = data.payrollProcessEmployees.find(m => m.employeeId === n.id);
                    x.deductionExceeds.forEach(m => {
                        takeHomeArr.push({
                            employeeId: n.empNo,
                            amount: m.amount,
                            payItemId: x.payrollProcessEmployeeResults.find(p => p.id === m.payrollProcessEmployeeResultId)?.payItem?.code
                        })
                    })
                });
                    setNegativeSalaryProcess(negativeSalaryArr);
                    setTakeHomeProcess(takeHomeArr);
                }       
 
                if (data.status === payrollProcessStatus.PROCESSING) {
                    processPayroll(payroll, 0, empData);
                    const intervalId = setInterval(() => {
                        processPayroll(payroll, intervalId, empData, data);
                    }, 6000);
                    setIntervalTimout(intervalId);
                } else if (data.payrollProcessEmployees) {
                    setProcessData(data);
                    setTableData(empData, data, payroll, isProcessing);
                }
            }).catch((err) => {
                console.error(err);
            });
    };

    const processPayroll = (payroll, intervalId, empData = null) => {
       
        const payrollPeriodDetailId =
            payroll?.payRollPeriod?.payRollPeriodDetails?.find(
                (v) => v.periodProcess !== payrollPeriodProcess.CLOSE
            )?.id;
        payrollProcessingService()
            .getDetails(payroll.id, payrollPeriodDetailId)
            .then(({data}) => {
                if (
                    data.noOfEmployees > 0 &&
                    data.status !== payrollProcessStatus.NEW
                ) {
                    setProcessData(data);
                    const empIds = data?.lastProcessEmployees ? data?.lastProcessEmployees.split(",") : [];
                    const failedProcess = data.payrollProcessEmployees?.filter(
                        (value) => value.status === payrollProcessStatus.FAILED && empIds.includes(value.employeeId)
                    );
                    const progressPercentage =
                        ((data.noOfProcessedEmployees + failedProcess.length) /
                            data.noOfEmployees) *
                        100;
 

                    !isNotifyShow && setProgressValue((prevState) => progressPercentage);
                    empData
                        ? setTableData(empData, data, payroll, true)
                        : setTableData(employeeData, data, payroll, true);

                    if (progressPercentage >= 100 && !isNotifyShow && data.status !== payrollProcessStatus.PROCESSING) {
                        setProcess(false);
                        setDisableProcess(false);
                        setDisableRollback(false);
 
                        const empIds = data?.lastProcessEmployees ? data?.lastProcessEmployees.split(",") : [];
                        const lastProccEmp = data.payrollProcessEmployees.filter((e)=> empIds.includes(e.employeeId));
                        const deductionExceed = lastProccEmp.filter(e => data.payrollProcessEmployees.find(p => p.payrollProcessEmployeeResults.find(m => m.payItemId === payroll.payItemForNetSalaryId) && p.deductionExceeds.length > 0 && e.employeeId === p.employeeId));
                        const deductionExceedAll = data.payrollProcessEmployees.filter(e =>data.payrollProcessEmployees.find(p => p.payrollProcessEmployeeResults.find(m => m.payItemId === payroll.payItemForNetSalaryId) && p.deductionExceeds.length > 0 && e.employeeId === p.employeeId));
                        const negativeSalary = lastProccEmp.filter(e => data.payrollProcessEmployees.find(p => p.payrollProcessEmployeeResults.find(m => m.payItemId === payroll.payItemForNetSalaryId) && p.negativeSalary.length > 0 && e.employeeId === p.employeeId));
                        const negativeSalaryAll = data.payrollProcessEmployees.filter(e =>data.payrollProcessEmployees.find(p => p.payrollProcessEmployeeResults.find(m => m.payItemId === payroll.payItemForNetSalaryId) && p.negativeSalary.length > 0 && e.employeeId === p.employeeId));

                        const negativeSalaryArr = [];
                        negativeSalaryAll.forEach(n => {
                           const x = data.payrollProcessEmployees.find(m => m.employeeId === n.employeeId);
                           x.negativeSalary.forEach(m => {
                               negativeSalaryArr.push({
                                   employeeId: n.empNo,
                                   amount: m.amount,
                                   payItemId: x.payrollProcessEmployeeResults.find(p => p.id === m.payrollProcessEmployeeResultId)?.payItem?.code
                               })
                           })
                        });
                        setNegativeSalaryProcess(negativeSalaryArr);

                        const takeHomeArr = [];
                        deductionExceedAll.forEach(n => {
                           const x = data.payrollProcessEmployees.find(m => m.employeeId === n.employeeId);
                            const emp = employeeData.find(e => e.id === n.employeeId);
                           x.deductionExceeds.forEach(m => {
                               takeHomeArr.push({
                                   employeeId: emp.empNo,
                                   amount: m.amount,
                                   payItemId: x.payrollProcessEmployeeResults.find(p => p.id === m.payrollProcessEmployeeResultId)?.payItem?.code
                               })
                           })
                        });
                        setTakeHomeProcess(takeHomeArr);

                        if (negativeSalary.length > 0 && !isNotifyShow) {
                            setNegativeSalaryBtnStyle("warning");
                            swal.fire({
                                icon: "error",
                                title: "Negative Salary Processed",
                                confirmButtonText: "Ok",
                                text: "Negative Salary Processed Employee/s Found",
                                toast: true,
                            }).then(() => {
                                setProgressValue(0);
                            });
                        } else if (deductionExceed.length > 0 && !isNotifyShow){
                            setTakeHomeBtnStyle("warning");
                            swal.fire({
                                icon: "warning",
                                title: "Deduction Exceeded",
                                confirmButtonText: "Ok",
                                text: `Deduction Exceeded Employee/s Found`,
                                toast: true,
                            }).then(() => {
                                setProgressValue(0);
                            });
                        } else if (!isNotifyShow) {
                            swal.fire({
                                icon: "success",
                                title: "Completed",
                                confirmButtonText: "Ok",
                                text: "Process Completed",
                                toast: true,
                            }).then(() => {
                                    setProgressValue(0);
                            });
                        }

                        isNotifyShow = true;
                        clearInterval(intervalId);
                    }
                }
            })
            .catch((err) => {
                console.error(err);
                setDisableProcess(false);
                setDisableRollback(false);

                if (!isNotifyShow) {
                    swal.fire({
                        icon: "error",
                        title: "Error",
                        confirmButtonText: "Ok",
                        text: "Process Failed",
                        toast: true,
                    });
                }

                isNotifyShow = true;
                clearInterval(intervalId);
            });
    };

    const setTableData = (empData, processData, payroll = null, isProcessing = false) => {
        const processCount = processData.payrollProcessEmployees?.length;
        const successCount = processData.payrollProcessEmployees
            ?.map((value) =>
                value.status === payrollProcessStatus.SUCCESSES ? 1 : 0
            )
            .reduce((prev, current) => prev + current, 0);
        const failedProcess = processData.payrollProcessEmployees?.filter(
            (value) => value.status === payrollProcessStatus.FAILED
        );

        const failedCount = failedProcess?.length ?? 0;
        let tableData = empData.map((emp) => {

            const payrollProcessEmployee = processData.payrollProcessEmployees?.find(
                (payrollEmp) => payrollEmp.employeeId === emp.id
            );
            return {
                ...emp,
                processCount,
                successCount,
                failedCount,
                payrollProcessEmployee,
                payrollProcessEmployeeResults: JSON.stringify(
                    payrollProcessEmployee?.payrollProcessEmployeeResults.map(
                        (result) => result.id
                    )
                ),
                status:
                    payrollProcessEmployee?.status === payrollProcessStatus.NEW
                        ? Object.keys(payrollProcessStatus)[0]
                        : payrollProcessEmployee?.status === payrollProcessStatus.PROCESSING
                            ? Object.keys(payrollProcessStatus)[1]
                            : payrollProcessEmployee?.status === payrollProcessStatus.SUCCESSES
                                ? Object.keys(payrollProcessStatus)[2]
                                : payrollProcessEmployee?.status === payrollProcessStatus.FAILED
                                    ? Object.keys(payrollProcessStatus)[3]
                                    : payrollProcessEmployee?.status === payrollProcessStatus.CANCELLED
                                        ? Object.keys(payrollProcessStatus)[4]
                                        : "",
            };
        });

        if (isInactiveEmp) {
            const inactive = tableData.filter((emp) => emp.isProcessedInactive);
            if (inactive.length > 0) {
                swal.fire({
                    title: "Wish to Rollback Processed Inactive Employee/s?",
                    text: `There are ${inactive.length} Inactive Employee/s`,
                    type: "question",
                    showCancelButton: true,
                    width: 500,
                    icon: "question",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                })
                    .then(async (result) => {
                        if (result.isConfirmed) {
                            await rollbackDetails(inactive, payroll);
                            tableData = tableData.filter((emp) => !emp.isProcessedInactive);

                            setEmployeeData(tableData);
                        } else {
                            setInactiveEmp(false);
                        }
                    });
            }
        }

        setEmployeeData(tableData);
        setFailedProcess(failedProcess);
 
        if (failedCount === 0 ) {
            setInvalidBtnStyle("secondary");
        } else {
            setInvalidBtnStyle("warning");
        }

        if (failedCount > 0 && processCount === successCount + failedCount && !isProcessing) {
            NotificationManager.warning(
                "To certain Employee/s, the Process Failed",
                "Warning"
            );

            setProgressValue(0);
        }
    };

    const setPayrollDetails = (details) => {
        setLoading(true);

        let {empData} = setPayrollDetailsData(details, payItemsData);
        
        setEmployeeData(empData);
        setEmpDataList(empData);

        if (empData.find((emp) => inactiveEmployee.includes(emp.isActive)))
            NotificationManager.warning("Inactive Employees Exists", "Warning");

        const payrollPeriodDetail =
            details?.payRollPeriod?.payRollPeriodDetails?.find(
                (v) => v.periodProcess !== payrollPeriodProcess.CLOSE
            );

        if (payrollPeriodDetail.periodProcess === payrollPeriodProcess.FINALIZED) {
            setDisableProcess(true);
            setDisableRollback(true);
        }

        setPayrollPeriod(payrollPeriodDetail);
        setPayrollStatus({
            value: payrollPeriodDetail.periodProcess,
            label:
                payrollPeriodDetail.periodProcess === payrollDefinitionStatus.OPEN
                    ? Object.keys(payrollDefinitionStatus)[0]
                    : payrollPeriodDetail.periodProcess === payrollDefinitionStatus.PROCESSED
                        ? Object.keys(payrollDefinitionStatus)[1]
                        : payrollPeriodDetail.periodProcess === payrollDefinitionStatus.CLOSE
                            ? Object.keys(payrollDefinitionStatus)[2]
                            : payrollPeriodDetail.periodProcess === payrollDefinitionStatus.APPROVED
                                ? Object.keys(payrollDefinitionStatus)[3]
                                : Object.keys(payrollDefinitionStatus)[0],
        });

        setDateFromPeriod(
            details?.payRollPeriod?.payRollPeriodDetails
                ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                ?.dateFrom.split(" ")[0]
        );
        setDateToPeriod(
            details?.payRollPeriod?.payRollPeriodDetails
                ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                ?.dateTo.split(" ")[0]
        );

        setLoading(false);

        return {empData};
    };

    const fetchPayrollProcessData = async () => {
        return await payrollProcessService().getNames();
    };

    //Fetch table data
    const fetchPayItem = () => {
        setLoading(true);
        payItemService()
            .getAllNames()
            .then(({data}) => {
                data = data
                    .filter((v) => v.active === true)
                    .map((payItem) => ({
                        id: payItem.id,
                        code: payItem.code,
                        name: payItem.name,
                    }));
                setPayItemsData(data);
            });
    };

    const payrollOnChange = async (e, selected) => {
        if (!selected) return;
        setProgressValue(0);
        setInvalidBtnStyle("secondary");
        clearInterval(intervalTimout);
        setEmployeeData([]);
        setLoading(true);
        const {data} = await payrollProcessService().findOne(
            selected?.value,
            requestPath
        );
        fetchProcessingDetails(data);
        localStorageService.setItem("selected_payroll", selected);
        setPayrollDetails(data);
        setPayroll(data);
    };

    async function confirmPayrollOnChange(e, selected) {
        if (selected) {
            setPayrollStatus(selected);
            changePeriod(selected);
        }
    }

    const changePeriod = (selected) => {
        const period = payroll.payRollPeriod;
        const index = period.payRollPeriodDetails.findIndex(p => p.id === payrollPeriod.id);
        let isExtend = false;

        if (index === period.payRollPeriodDetails.length - 1 && selected.value === payrollPeriodProcess.CLOSE) {
            swal.fire({
                title: "Wish to Proceed to Next Schedule?",
                text: `There will be start schedule from the beginning`,
                type: "question",
                showCancelButton: true,
                width: 500,
                icon: "question",
                toast: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
            })
                .then(async (result) => {
                    let details = [];
                    if (result.isConfirmed) {
                        details = generatePeriod(period.period, period.payDay, period.tax, period.periodYear, moment(period.periodYear).add(1, "years").format("DD.MM.YYYY"))
                        isExtend = true;
                    }
                    changeProcessPeriod(details, selected);
                    setLoading(true);
                });
        } else {
            changeProcessPeriod([], selected);
        }
    };

    function changeProcessPeriod(details, selected) {
        payrollProcessingService()
            .confirmPayroll({
                payroll: payroll.id,
                payrollPeriodDetail: payrollPeriod.id,
                PayrollPeriodProcess: selected?.value,
                details
            })
            .then(({data}) => {
                setLoading(false);
                const status = selected.value;
                if (status === payrollPeriodProcess.FINALIZED || status === payrollPeriodProcess.CLOSE) {
                    setDisableRollback(true);
                    setDisableProcess(true);
                }

                NotificationManager.success("Status Change", "Success");
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                NotificationManager.error("Confirmation Failed", "Error");
            });
    }

    function saveDetails(rowData) {
        setProgressValue(0);
        isNotifyShow = false;
        setDisableProcess(true);
        setDisableRollback(true);
        const inactive = rowData.find((data) => data.isProcessedInactive);
        if (inactive)
            return NotificationManager.error("Inactive Employees Exists", "Error");

        const empIds = rowData.map((data) => data.id);
        const payrollPeriodDetail =
            payroll.payRollPeriod?.payRollPeriodDetails?.find(
                (v) => v.periodProcess !== payrollPeriodProcess.CLOSE
            );
        rollbackDetails(rowData, null, true)
            .then((rollbackProcessing) => {
                if (!rollbackProcessing) {
                    processPayrollFunc(empIds, payrollPeriodDetail);
                }
            })
            .catch((err) => {
                setDisableProcess(false);
                setDisableRollback(false);
                console.error(err);
            });
    }

    const processPayrollFunc = (empIds, payrollPeriodDetail) => {
        payrollProcessingService()
            .process({
                employeeIds: empIds,
                payroll: payroll.id,
                PayrollPeriodDetail: payrollPeriodDetail.id,
                processDateTime: new Date().toJSON()
            })
            .then(({data}) => {
                setTableData(employeeData, {payrollProcessEmployees: []}, null, true);
                setSelectedEmpList(data);
                setProcess(true);
            })
            .catch((err) => {
                setDisableProcess(false);
                setDisableRollback(false);
                console.error(err);
            });
    };

    async function rollbackDetails(
        rowData,
        tempPayroll,
        isProcess,
        isRollbackProcessing = false
    ) {
        try {
            setLoading(true);
            setDisableProcess(true);
            setDisableRollback(true);
            
            const empList = rowData.map((data) => ({
                    id: data.payrollProcessEmployee?.id,
                    employeeId: data.payrollProcessEmployee?.employeeId,
                    results: data.payrollProcessEmployeeResults
                        ? JSON.parse(data.payrollProcessEmployeeResults)
                        : [],
                }))
                .filter((d) => d.id !== undefined);
            const payrollPeriodDetail = tempPayroll
                ? tempPayroll.payRollPeriod?.payRollPeriodDetails?.find(
                    (v) => v.periodProcess !== payrollPeriodProcess.CLOSE
                )
                : payroll.payRollPeriod?.payRollPeriodDetails?.find(
                    (v) => v.periodProcess !== payrollPeriodProcess.CLOSE
                );
            const {data} = await payrollProcessingService().rollback({
                employeeProcess: empList.map((emp) => emp.id),
                employees: empList.map((emp) => emp.employeeId),
                payroll: tempPayroll ? tempPayroll.id : payroll.id,
                PayrollPeriodDetail: payrollPeriodDetail.id,
                isRollbackProcessing,
                results: empList.map((emp) => emp.results).flat(),
            });
            !tempPayroll && fetchProcessingDetails(payroll, true);
            setLoading(true);

            let rollbackProcessing = false;
            if (data) {
                if (
                    data.status === payrollProcessStatus.NEW ||
                    data.status === payrollProcessStatus.PROCESSING
                ) {
                    rollbackProcessing = true;
                    setTimeout(() => {
                        rollbackDetails(rowData, tempPayroll, isProcess, true);
                    }, 3000);
                    return rollbackProcessing;
                } else {
                    setLoading(false);
                    if (isProcess) {
                        const empIds = rowData.map((data) => data.id);
                        const payrollPeriodDetail =
                            payroll.payRollPeriod?.payRollPeriodDetails?.find(
                                (v) => v.periodProcess !== payrollPeriodProcess.CLOSE
                            );

                        processPayrollFunc(empIds, payrollPeriodDetail);
                    }
                }
            }

            if (!isProcess && !rollbackProcessing) {
                swal.fire({
                    icon: "success",
                    title: "Success",
                    confirmButtonText: "Ok",
                    text: "Rollback Success",
                    toast: true,
                });
                setDisableProcess(false);
                setDisableRollback(false);
            }
        } catch (e) {
            console.error(e);
            swal.fire({
                icon: "error",
                title: "Error",
                confirmButtonText: "Ok",
                text: "Rollback Failed",
                toast: true,
            });

            setDisableProcess(false);
            setDisableRollback(false);
        }
    }

    return (
        <>
            <div className="row">
                {isLoading && (
                    <div className="overlay">
                        <GullLoadable/>
                    </div>
                )}
                <div className="col-md-8 row">
                    <div className="col-md-9">
                        <Breadcrumb
                            routeSegments={[
                                {name: "Dashboard", path: "/dashboard/v1/"},
                                {name: "Payroll Process"},
                            ]}
                            breadCrumbSeparatorStyles={{
                                marginBottom: 0,
                            }}
                        ></Breadcrumb>
                    </div>
                    <div className="col-md-3 row">
                        <div className="mt-2 d-flex justify-content-end">
                            <NavLink to={"/payroll"}>
                <span className="capitalize text-muted">
                  |&nbsp;&nbsp;Payroll&nbsp;&nbsp;|&nbsp;&nbsp;
                </span>
                            </NavLink>
                            <NavLink to={"/pay-items"}>
                <span className="capitalize text-muted">
                  PayItem&nbsp;&nbsp;|&nbsp;&nbsp;
                </span>
                            </NavLink>
                            <NavLink to={"/payroll-assign-employees"}>
                <span className="capitalize text-muted">
                  PayItems&nbsp;to&nbsp;Employees&nbsp;&nbsp;|
                </span>
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 row">
                    <div className="col-md-5 mt-1 d-flex justify-content-end">
                        <AutoCompleteDropDown
                            dropDownData={payrollStatusList}
                            isFreeDropDown={true}
                            onChange={confirmPayrollOnChange}
                            variant="filled"
                            isLabelVisible={true}
                            size="small"
                            label="Status"
                            sx={{width: 170, backgroundColor: "#edd5ff"}}
                            defaultValue={payrollStatus ?? payrollStatusList[0]}
                        />
                    </div>
                    <div className="col-md-7 mt-1 d-flex justify-content-end">
                        <PayrollDropDown
                            payrollOnChange={payrollOnChange}
                            payrollProcessList={payrollProcessList}
                        />
                    </div>
                </div>
            </div>
            <div className="mb-2 mt-3">
                <Button
                    variant={invalidBtnStyle}
                    className="btn-sm"
                    onClick={() => setShowProcessingModal(true)}
                >
                    Errors and Warnings
                </Button>
                &nbsp;&nbsp;
                <Button
                    variant={negativeSalaryBtnStyle}
                    className="btn-sm"
                    onClick={() => setShowNegativeSalaryModal(true)}
                    hidden={(negativeSalaryProcess.length) < 1}
                >
                    Negative Salary
                </Button>
                <Button
                    variant={takeHomeBtnStyle}
                    className="btn-sm"
                    onClick={() => setShowTakeHomeModal(true)}
                    hidden={(takeHomeProcess.length) < 1}
                >
                    Take Home
                </Button>
                &nbsp;&nbsp;
                <span><strong>Process Period: </strong>{`${dateFromPeriod} - ${dateToPeriod}`}</span>
                &nbsp;&nbsp;
                <span><strong>Last Process Date: </strong>
                    {processData?.modifiedDateTime?.split("T") ? moment(new Date(processData.modifiedDateTime)).subtract(new Date(processData.modifiedDateTime).getTimezoneOffset(), "minutes").format("MM/DD/YYYY hh:mm A") : ""}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {isProcess && (
                    <span
                        style={{
                            backgroundColor: "#9890ff",
                            padding: 3,
                            borderRadius: 5,
                        }}
                    >
            <strong>PROCESSING...</strong>
          </span>
                )}
            </div>
            <div className="row col-md-12">
                <ProgressBar
                    now={progressValue > 100 ? 100 : progressValue}
                    animated
                    striped
                    label={`${parseInt(progressValue > 100 ? 100 : progressValue + "")}%`}
                    variant={"primary"}
                    className="mb-3"
                ></ProgressBar>
            </div>
            <div className="row col-md-12">
                <PayrollProcessingList
                    processData={processData}
                    tableData={employeeData}
                    saveDetails={saveDetails}
                    rollbackDetails={rollbackDetails}
                    negativeSalaryProcess={negativeSalaryProcess}
                    takeHomeProcess={takeHomeProcess}
                    periodStatus={payrollStatus}
                    processPeriod={`${dateFromPeriod} - ${dateToPeriod}`}
                    failedProcess={failedProcess}
                    empDataList={empDataList}
                    setShowProcessingModal={setShowProcessingModal}
                    showProcessingModal={showProcessingModal}
                    isLoading={isLoading}
                    disableProcess={disableProcess}
                    setDisableProcess={setDisableProcess}
                    disableRollback={disableRollback}
                    setShowNegativeSalaryModal={setShowNegativeSalaryModal}
                    setShowTakeHomeModal={setShowTakeHomeModal}
                    showNegativeSalaryModal={showNegativeSalaryModal}
                    showTakeHomeModal={showTakeHomeModal}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default PayrollProcessing;
