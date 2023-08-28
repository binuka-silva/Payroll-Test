import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {connect} from "react-redux";
import {Button, FormLabel} from "react-bootstrap";
import SalaryList from "./SalaryList";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import {NotificationManager} from "react-notifications";
import {payrollPeriodProcess, payrollProcessStatus, requestPath, salaryStatus,} from "./constant";
import EmployeesToPayItemsModal from "./EmployeesToPayItemsModal";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import localStorageService from "../../services/localStorageService";
import payItemService from "app/api/payItemServices/payItemService";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import moment from "moment";
import "moment-precise-range-plugin";
import salaryService from "../../api/salaryServices/salaryService";
import employeesToPayItemsServices from "../../api/employeesToPayItemsServices/employeesToPayItemsServices";
import payrollProcessingService from "../../api/payrollProcessingServices/payrollProcessService";
import PayrollDropDown from "../../components/PayrollDropDown";

const Salary = () => {
    const [isLoading, setLoading] = useState(false);
    const [isWindowLoading, setWindowLoading] = useState(false);
    const [employeesToPayItemsList, setEmployeesToPayItemsList] = useState([]);
    const [salaryList, setSalaryList] = useState([]);
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [dateFromPeriod, setDateFromPeriod] = useState("");
    const [dateToPeriod, setPDateToPeriod] = useState("");

    const [percentage, setPercentage] = useState(false);
    const [value, setValue] = useState("");

    const [payItem, setPayItem] = useState("");
    const [payItemType, setPayItemType] = useState("");
    const [payItemPeriod, setPayItemPeriod] = useState("");
    const [fixedPayItemPeriod, setFixedPayItemPeriod] = useState("");
    const [sPeriods, setSPeriods] = useState("");
    const [ePeriods, setEPeriods] = useState("");
    const [prossPeriods, setProssPeriods] = useState("");

    const [payItemTypeData, setPayItemTypeData] = useState([]);
    const [payItemPeriodData, setPayItemPeriodData] = useState([]);
    const [payItemsData, setPayItemsData] = useState([]);
    const [filteredPayItemTypeData, setFilteredPayItemTypeData] = useState([]);
    const [filteredPayItemsData, setFilteredPayItemsData] = useState([]);
    const [payItemData, setPayItemData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [labelList, setLabelList] = useState([]);
    const [userLabels, setUserLabels] = useState([]);
    const [startDateData, setStartDateData] = useState([]);
    const [endDateData, setEndDateData] = useState([]);
    const [processPeriodData, setProcessPeriodData] = useState([]);
    const [closePeriodsData, setClosePeriodsData] = useState([]);
    const [payrollProcessEmployeeStatusData, setPayrollProcessEmployeeStatusData,] = useState([]);

    const [payroll, setPayroll] = useState(null);

    const [effectiveDate, setEffectiveDate] = useState("");

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        setLabelList(
            localStorageService
                .getItem("label_list")
                ?.filter(
                    (list) => list.permissionPage.path === window.location.pathname
                )
        );
        setUserLabels(localStorageService.getItem("auth_user")?.labels);
        fetchPayItemData();


        fetchPayrollProcessData().then(({data: payrollList}) => {
            payrollList = payrollList.map((payrollProcess) => ({
                value: payrollProcess.id,
                label: `${payrollProcess.code} - ${payrollProcess.name}`,
            }));
            setPayrollProcessList(payrollList);
        });
    }, []);

    useEffect(() => {
        employeeData?.length !== 0 && fetchSalariesData();
    }, [employeeData]);

    useEffect(() => {
        window.scrollTo(0, 0);
        setWindowLoading(true);
        if (payrollProcessList?.length !== 0 && payItemData?.length !== 0) {
            payrollProcessService()
                .findOne(
                    localStorageService.getItem("selected_payroll")?.value ??
                    payrollProcessList.find(
                        (p) =>
                            p.value ===
                            localStorageService.getItem("auth_user")?.payrollDefinitionId
                    )?.value ??
                    payrollProcessList[0].value,
                    window.location.pathname
                )
                .then(({data: details}) => {
                    setPayroll(details);
                    setPayrollDetails(details);
                });
        }
    }, [payrollProcessList, payItemData]);

    const setPayrollDetails = (details) => {
        setLoading(true);

        setCode(details?.code);
        setName(details?.name);

        const payrollPayItems = details.payrollPayItemPageHeader.payrollPayItems
            .filter((v) => v.active === true)
            .map((payrollPayItem) => {
                const payItem = payItemData.find(
                    (v) => v.value === payrollPayItem.payItemId
                );

                return {
                    value: payrollPayItem.id,
                    label: payItem?.label,
                    code: payItem?.code,
                    payItemType: payItemData?.find(
                        (v) => v.value === payrollPayItem.payItemId
                    )?.payItemType,
                    payItemPeriod: payItemData?.find(
                        (v) => v.value === payrollPayItem.payItemId
                    )?.payItemPeriod,
                    paymentType: payItemData?.find(
                        (v) => v.value === payrollPayItem.payItemId
                    )?.paymentType,
                };
            });

        let payrollEmployeeData = details?.selectedEmployeesPageHeader.map((emp) => {
            return {
                value: emp.id,
                label: emp.empNo,
                empName: emp.employeeName,
                designation: emp.empPosCode,
                isActive: emp.employeeStatus,
                employmentDate: emp.employmentDate,
            };
        });

        setEmployeeData(payrollEmployeeData);

        const employeesPayItems =
            details.employeesPayItemsPageHader.employeesToPayItems
                ?.filter((v) => v.payrollPayItemId === payItem)
                ?.map((employeesToPayItem) => ({
                    id: employeesToPayItem.id,
                    amount: employeesToPayItem.amount,
                    units: employeesToPayItem.units,
                    employerAmount: employeesToPayItem.employerAmount,
                    startDate: employeesToPayItem.startDate?.split("T")[0],
                    endDate: employeesToPayItem.endDate?.split("T")[0],
                    employee: payrollEmployeeData?.find(
                        (v) => v.value === employeesToPayItem.employeeId
                    )?.label,
                    empName: payrollEmployeeData?.find(
                        (v) => v.value === employeesToPayItem.employeeId
                    )?.empName,
                }));

        const salaries = details.salaryPageHader.salary
            ?.filter((v) => v.payrollPayItemId === payItem)
            ?.map((sal) => ({
                id: sal.id,
                value: sal.value,
                oldValue: sal.oldValue,
                newValue: sal.newValue,
                arrearsAmount: sal.arrearsAmount,
                isPercentage: sal.isPercentage,
                effectiveDate: sal.effectiveDate?.split("T")[0],
                employee: employeeData?.find((v) => v.value === sal.employeeId)?.label,
                empName: employeeData?.find((v) => v.value === sal.employeeId)?.empName,
            }));

        setPayItemsData(payrollPayItems);
        setEmployeesToPayItemsList(employeesPayItems);
        setSalaryList(salaries);

        setDateFromPeriod(
            details?.payRollPeriod?.payRollPeriodDetails
                ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                ?.dateFrom.split(" ")[0]
        );
        setPDateToPeriod(
            details?.payRollPeriod?.payRollPeriodDetails
                ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                ?.dateTo.split(" ")[0]
        );

        let df = details.payRollPeriod.payRollPeriodDetails.map((period) => {
            return {
                value: period.periodNo,
                periodNo: period.periodProcess,
                label: period.dateFrom.split(" ")[0],
                startDate: period.dateFrom.split(" ")[0],
                endDate: period.dateTo.split(" ")[0],
            };
        });
        setStartDateData(df);

        let dt = details.payRollPeriod.payRollPeriodDetails.map((period) => {
            return {
                value: period.periodNo,
                label: period.dateTo.split(" ")[0],
            };
        });
        setEndDateData(dt);

        let pp = details.payRollPeriod.payRollPeriodDetails.map((period) => {
            return {
                value: period.periodNo,
                periodNo: period.periodProcess,
                sDate: period.dateFrom.split(" ")[0],
                eDate: period.dateTo.split(" ")[0],
                //label: `${period.dateFrom.split(" ")[0]} - ${period.dateTo.split(" ")[0]}`,
                label: `${moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD")} - ${moment(period.dateTo.split(" ")[0]).format("YYYY-MM-DD")}`,
            };
        });
        setProcessPeriodData((prvState) => pp);

        let closePeriods = details.payRollPeriod.payRollPeriodDetails?.filter((v) => v.periodProcess === payrollPeriodProcess.CLOSE).map((period) => {
            return {
                dateFrom: moment(period.dateFrom.split(" ")[0]).format("YYYY-MM-DD"),
            };
        });
        setClosePeriodsData(closePeriods);

        if (details.payrollTaxDetails) {
            setSalaryList(payroll.payrollTaxDetails);
        }

        setLoading(false);
        setWindowLoading(false);
    };

    const fetchPayrollProcessData = async () => {
        return await payrollProcessService().getAll();
    };

    //Load data
    function fetchPayItemData(details) {
        payItemService()
            .getAll()
            .then((response) => {
                let payItemDataArray = [];
                response.data.forEach((item) => {
                    payItemDataArray.push({
                        value: item.id,
                        label: item.name,
                        code: item.code,
                        payItemName: item.name,
                        payItemType: item.payItemType.type,
                        payItemPeriod: item.payItemPeriod.name,
                        paymentType: item.paymentType.type,
                        activeStatus: item.active,
                    });
                });
                setPayItemData(payItemDataArray);
            });
    }

    //Fetch table data
    const fetchSalariesData = () => {
        setLoading(true);
        let data = payroll?.salary?.map((salaries) => ({
            id: salaries.id,
            value: salaries.value,
            oldValue: salaries.oldValue,
            newValue: salaries.newValue,
            arrearsAmount: salaries.arrearsAmount,
            isPercentage: salaries.isPercentage,
            salaryStatus: salaries.salaryStatus,
            effectiveDate: salaries.effectiveDate?.split("T")[0],
            employee: employeeData?.find((v) => v.value === salaries.employeeId)
                ?.label,
            empName: employeeData?.find((v) => v.value === salaries.employeeId)
                ?.empName,
        }));
        setLoading(false);
        //setEmployeesToPayItemsList(data);
    };

    //Fetch table data
    const fetchSalaryData = (details, itemData) => {
        setLoading(true);
        payrollProcessService()
            .getSalary(details.id)
            .then(({data}) => {
                let x = payroll?.payRollPeriod?.payRollPeriodDetails?.find((v) => (moment(v.dateFrom.split(" ")[0]).format("YYYY-MM-DD")) === (moment(sPeriods ? sPeriods : dateFromPeriod).format("YYYY-MM-DD")))?.id;
                let salaryData = data.salary?.filter((v) => v.payrollPayItemId === (itemData?.value ?? payItem));

                data = salaryData
                    ?.filter((v) => v.payRollPeriodDetailsId === x)
                    ?.map((salaries) => ({
                        id: salaries.id,
                        value: salaries.value,
                        oldValue: salaries.oldValue,
                        newValue: salaries.newValue,
                        arrearsAmount: salaries.arrearsAmount,
                        isPercentage: salaries.isPercentage,
                        isExcelUpload: salaries.isExcelUpload,
                        salaryStatus:
                            salaries.salaryStatus === salaryStatus.APPLICATION
                                ? Object.keys(salaryStatus)[0]
                                : salaries.salaryStatus === salaryStatus.CONFIRMED
                                    ? Object.keys(salaryStatus)[1]
                                    : salaries.salaryStatus === salaryStatus.ROLLBACK
                                        ? Object.keys(salaryStatus)[2]
                                        : "",
                        effectiveDate: salaries.effectiveDate?.split("T")[0],
                        applieddate: moment(salaries.createdDateTime?.split("T")[0]).format("YYYY-MM-DD"),
                        employee: employeeData?.find((v) => v.value === salaries.employeeId)
                            ?.label,
                        empName: employeeData?.find((v) => v.value === salaries.employeeId)
                            ?.empName,
                    }));
                setLoading(false);
                setSalaryList(data);
            });
    };

    const clearItems = () => {
        setPercentage(false);
        setValue("");
        setEffectiveDate(sPeriods?.length === 0 ? (moment(startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate).format("yyyy-MM-DD")) : (moment(sPeriods).format("yyyy-MM-DD")));
    };

    const clearRowStyle = () => {
        setFilteredEmployees([]);
    };

    const setNewEmployees = (value) => {
        setFilteredEmployees(value.map((emp) => emp.label));
        window.setTimeout(clearRowStyle, 60000);
    };

    const payrollOnChange = async (e, selected) => {
        if (selected) {
            setWindowLoading(true);
            const {data} = await payrollProcessService().findOne(
                selected.value,
                requestPath
            );
            localStorageService.setItem("selected_payroll", selected);
            setPayrollDetails(data);
            setPayroll(data);
            setPercentage(false);
            setValue("");
            setEffectiveDate(sPeriods?.length === 0 ? (moment(startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate).format("yyyy-MM-DD")) : (moment(sPeriods).format("yyyy-MM-DD")));
            setSalaryList([]);

            let pp = data.payRollPeriod.payRollPeriodDetails.map((period) => {
                return {
                    value: period.periodNo,
                    periodNo: period.periodProcess,
                    label: `${period.dateFrom.split(" ")[0]} - ${
                        period.dateTo.split(" ")[0]
                    }`,
                };
            });

            setProssPeriods(pp?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label);
            setSPeriods(pp?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[0]);
            setEPeriods(pp?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label.split(" ")[2]);
            setWindowLoading(false);
        }
    };

    const payItemOnChang = async (e) => {
        let payrollEmployeeData = payroll?.selectedEmployeesPageHeader
            ?.filter((v) => v.id && v.empNo && v.employeeName && v.empPosCode && v.employeeStatus && v.employmentDate)
            .map((emp) => {
                return {
                    value: emp.id ?? "",
                    label: emp.empNo ?? "",
                    empName: emp.employeeName ?? "",
                    designation: emp.empPosCode ?? "",
                    isActive: emp.employeeStatus ?? "",
                    employmentDate: emp.employmentDate ?? "",
                };
            });

        let payemp = payrollEmployeeData.map((v) => v.value)

        const employeesPayItems =
            payroll?.employeesPayItemsPageHader?.employeesToPayItems
                ?.filter((v) => v.payrollPayItemId === e && payemp.includes(v.employeeId))
                ?.map((employeesToPayItem) => ({
                    value:
                        payrollEmployeeData?.find(
                            (v) => v.value === employeesToPayItem.employeeId
                        )?.value ?? "",
                    label:
                        payrollEmployeeData?.find(
                            (v) => v.value === employeesToPayItem.employeeId
                        )?.label ?? "",
                    empName:
                        payrollEmployeeData?.find(
                            (v) => v.value === employeesToPayItem.employeeId
                        )?.empName ?? "",
                    designation:
                        payrollEmployeeData?.find(
                            (v) => v.value === employeesToPayItem.employeeId
                        )?.designation ?? "",
                    isActive:
                        payrollEmployeeData?.find(
                            (v) => v.value === employeesToPayItem.employeeId
                        )?.isActive ?? false,
                    employmentDate:
                        payrollEmployeeData?.find(
                            (v) => v.value === employeesToPayItem.employeeId
                        )?.employmentDate ?? "",
                    oldValue: employeesToPayItem.amount ?? 0,
                    empToPayItemId: employeesToPayItem.id ?? "",
                }));

        setEmployeeData(employeesPayItems);
    };

    let filteredPayItem = payItemsData
        .filter((v) => v.payItemPeriod === "Fixed")
        .map((payrollProcess) => ({
            value: payrollProcess.value,
            label: `${payrollProcess.code} - ${payrollProcess.label}`,
        }));

    const getSelectedRows = (rows) => {
        setFilteredEmployees(rows);
    };

    let payrollId = payroll?.id;
    let payrollPeriodDetailId = payroll?.payRollPeriod?.payRollPeriodDetails?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)?.id;

    //Load data
    function fetchPayrollProcessEmployeeStatusData() {
        payrollProcessingService().getDetails(payrollId, payrollPeriodDetailId).then((response) => {
            let statusDataArray = [];
            if ((response.data.payrollProcessEmployees) !== null) {
                response.data.payrollProcessEmployees.forEach((item) => {
                    statusDataArray.push({
                        empCode: employeeData?.find((v) => v.value === item.employeeId)?.label,
                        status: item.status,
                    });
                });
            }
            setPayrollProcessEmployeeStatusData(statusDataArray);
        });
    }

    const checkProcessStatus = () => {
        new Promise((resolve, reject) => {

            let status = payrollProcessEmployeeStatusData?.find((v) => v.empCode === (filteredEmployees?.find((p) => p.employee === v.empCode)?.employee))?.status;

            if ((status !== (payrollProcessStatus.SUCCESSES)) && (status !== (payrollProcessStatus.PROCESSING))) {
                setSalaryStatus();
                changeEmployeesToPayItemsAmount();
            } else {
                NotificationManager.error("This employee is already processed.", "Error");
            }

        });

    };

    const setSalaryStatus = () => {
        new Promise((resolve, reject) => {
            let salId = salaryList.find((v) => v.id === filteredEmployees.find((p) => p.id === v.id)?.id)?.id;

            //Obj Create
            const salStatus = filteredEmployees.map((sal) => ({
                id: sal.id,
                salaryStatus: salaryStatus.CONFIRMED,
            }));

            salaryService()
                .updateSalaryStatus(salStatus, salId)
                .then((response) => {
                    NotificationManager.success(
                        salStatus?.length + " records was successfully confirmed",
                        "Success"
                    );

                    //Reload list
                    fetchSalaryData(payroll);
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.statusCode === 409) {
                        NotificationManager.error(error.message, "Error");
                    }
                    reject();
                });
        });
    };

    const changeEmployeesToPayItemsAmount = () => {
        new Promise((resolve, reject) => {

            let empItemId = employeeData.find((v) => v.label === filteredEmployees.find((p) => p.employee === v.label)?.employee)?.empToPayItemId;

            const salStatus = filteredEmployees.map((employee) => ({
                id: employeeData.find((v) => v.label === employee.employee)?.empToPayItemId,
                amount: employee.newValue,
            }));

            employeesToPayItemsServices()
                .updateWithSalaryStatus(salStatus, empItemId)
                .then((response) => {
                    NotificationManager.success(
                        salStatus?.length + " records was successfully updated",
                        "Success"
                    );

                    //Reload list
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.statusCode === 409) {
                        NotificationManager.error(error.message, "Error");
                    }
                    reject();
                });
        });
    };

    return (
        <>
            {isWindowLoading && (
                <div className="overlay">
                    <GullLoadable/>
                </div>
            )}
            {showModal && (
                <EmployeesToPayItemsModal
                    show={showModal}
                    employeeData={employeeData}
                    setShow={setShowModal}
                    fetchSalaryFunc={fetchSalaryData}
                    salaryList={salaryList}
                    clearItemsFunc={clearItems}
                    newlyAddedEmployees={setNewEmployees}
                    payItem={payItem}
                    payrollId={payroll.id}
                    isPercentage={percentage}
                    value={value}
                    effectiveDate={effectiveDate}
                    dateFromPeriod={dateFromPeriod}
                    dateToPeriod={dateToPeriod}
                    payroll={payroll}
                    sPeriods={sPeriods}
                    ePeriods={ePeriods}
                    startDateData={startDateData}
                    closePeriodsData={closePeriodsData}
                    prossPeriods={prossPeriods}
                />
            )}
            <div className="row">
                <div className="col-md-9 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Salary Increment"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-3">
                    <div className="mt-1 d-flex justify-content-end">
                        <PayrollDropDown payrollOnChange={payrollOnChange} payrollProcessList={payrollProcessList}/>
                    </div>
                </div>
            </div>
            <div className="row mb-1">
                <div className="col-md-3">
                    <FormLabel>Payroll Code</FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={code ?? ""}
                        onChange={(e) => setCode(e.target.value)}
                        readOnly={true}
                    />
                </div>

                <div className="col-md-3">
                    <FormLabel>Payroll Name</FormLabel>
                    <input
                        type="text"
                        className="form-control"
                        value={name ?? ""}
                        onChange={(e) => setName(e.target.value)}
                        readOnly={true}
                    />
                </div>

                <div className="col-md-3">
                    <FormLabel>Process Period</FormLabel>
                    <AutoCompleteDropDown
                        dropDownData={processPeriodData}
                        isFreeDropDown={true}
                        onChange={(e, selected) => {
                            setSPeriods(selected?.label.split(" ")[0]);
                            setEPeriods(selected?.label.split(" ")[2]);
                            setProssPeriods(selected?.label);
                            setPercentage(false);
                            setPayItem("");
                            setValue("");
                            setSalaryList([]);
                            effectiveDate &&
                            setEffectiveDate(
                                moment(selected?.label.split(" ")[0]).format("YYYY-MM-DD")
                            );
                        }}
                        size={"small"}
                        label="Search"
                        defaultValue={
                            prossPeriods?.length === 0
                                ? processPeriodData?.find(
                                    (v) => v.periodNo !== payrollPeriodProcess.CLOSE
                                )?.label
                                : prossPeriods
                        }
                    />
                </div>

                <div className="col-md-3">
                    <FormLabel>Pay Item</FormLabel>
                    <AutoCompleteDropDown
                        dropDownData={filteredPayItem}
                        isFreeDropDown={true}
                        onChange={(e, selected) => {
                            setPayItem(selected?.value);
                            fetchSalaryData(payroll, selected);
                            setPercentage(false);
                            setValue("");
                            setEffectiveDate(
                                sPeriods?.length === 0
                                    ? moment(
                                        startDateData?.find(
                                            (v) => v.periodNo !== payrollPeriodProcess.CLOSE
                                        )?.startDate
                                    ).format("yyyy-MM-DD")
                                    : moment(sPeriods).format("yyyy-MM-DD")
                            );
                            payItemOnChang(selected?.value);
                            fetchPayrollProcessEmployeeStatusData();
                        }}
                        size={"small"}
                        label="Search"
                        defaultValue={
                            filteredPayItem?.find((v) => v.value === payItem)?.label
                        }
                    />
                </div>
            </div>

            <br></br>

            <div className="row" style={{paddingInlineStart: "15px"}}>
                <div className="col-md-1">
                    <div className="row">
                        <label className="checkbox checkbox-primary">
                            <input
                                className="ml-4 d-flex"
                                type="checkbox"
                                id="rtl-checkbox"
                                checked={percentage}
                                onChange={(e) => {
                                    setValue("");
                                    return setPercentage(e.target.checked);
                                }}
                            />
                            <span>Percentage</span>
                            <span className="checkmark ml-4"></span>
                        </label>
                    </div>
                </div>

                <div className="col-md-2">
                    <FormLabel>Increment Value</FormLabel>
                    {percentage === true ? (
                        <input
                            type="number"
                            className="form-control"
                            max="100"
                            min="0"
                            value={value ?? ""}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    ) : (
                        <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={value ?? ""}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    )}
                </div>

                <div className="col-md-2">
                    <FormLabel>Effective Date</FormLabel>
                    <input
                        className="form-control"
                        type="date"
                        value={
                            effectiveDate
                                ? effectiveDate
                                : sPeriods?.length === 0
                                    ? moment(
                                        startDateData?.find(
                                            (v) => v.periodNo !== payrollPeriodProcess.CLOSE
                                        )?.startDate
                                    ).format("yyyy-MM-DD")
                                    : moment(sPeriods).format("yyyy-MM-DD")
                        }
                        onChange={(v) => setEffectiveDate(v.target.value)}
                    ></input>
                </div>

                <div className="col-md-3 mt-4 d-flex">
                    <Button
                        variant="primary"
                        type="submit"
                        //disabled={payItem === "" || value === ""}
                        disabled={payItem === "" || value === "" || (moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD") === true)}
                        onClick={() => setShowModal(true)}
                    >
                        Search Employee
                    </Button>
                </div>
            </div>

            <br></br>

            <div className="row">
                <SalaryList
                    fetchSalaryFunc={fetchSalaryData}
                    setSalaryList={setSalaryList}
                    salaryList={salaryList}
                    payItemsData={payItemsData}
                    employeeData={employeeData}
                    payItem={payItem}
                    dateFromPeriod={dateFromPeriod}
                    dateToPeriod={dateToPeriod}
                    isLoading={isLoading}
                    setLoading={setLoading}
                    newlyAddedEmployeeList={filteredEmployees}
                    payroll={payroll}
                    startDateData={startDateData}
                    endDateData={endDateData}
                    prossPeriods={prossPeriods}
                    processPeriodData={processPeriodData}
                    sPeriods={sPeriods}
                    ePeriods={ePeriods}
                    selectedRows={getSelectedRows}
                    setEffectiveDate={setEffectiveDate}
                    effectiveDate={effectiveDate}
                    filteredEmployees={filteredEmployees}
                    closePeriodsData={closePeriodsData}
                    payrollProcessEmployeeStatusData={payrollProcessEmployeeStatusData}
                />
            </div>

            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
                <div className="col-md-3 mt-3 d-flex justify-content-end">
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => {
                            checkProcessStatus();
                        }}
                    >
                        Increment Confirmed
                    </Button>
                </div>
            </div>

            <br></br>
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
})(Salary);
