import React, {forwardRef, useEffect, useState} from "react";

import MaterialTable, {MTableToolbar} from "@material-table/core";

import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Edit from "@material-ui/icons/Edit";
import SaveAlt from "@material-ui/icons/SaveAlt";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Remove from "@material-ui/icons/Remove";
import ViewColumn from "@material-ui/icons/ViewColumn";
import {Search} from "@material-ui/icons";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import {connect} from "react-redux";
import localStorageService from "../../services/localStorageService";
import * as XLSX from 'xlsx/xlsx.mjs';
import {Button} from "react-bootstrap";
import SalaryExcelModal from "./SalaryExcelModal";
import {NotificationManager} from "react-notifications";
import employeesToPayItemsServices from "../../api/employeesToPayItemsServices/employeesToPayItemsServices";
import salaryService from "../../api/salaryServices/salaryService";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";

import {UploadFile} from "@mui/icons-material";
import {API_CONFIGURATIONS} from "../../api/constants/apiConfigurations";
import handlePageSize from "../../common/tablePageSize";
import {payrollPeriodProcess, payrollProcessStatus, salaryStatus,} from "./constant";
import moment from "moment";
import "moment-precise-range-plugin";

const SalaryExcelList = ({
                             employeeData,
                             processPeriod,
                             payrollPayItemsData,
                             salaryData,
                             startDateData,
                             dateFromPeriod,
                             dateToPeriod,
                             employeesToPayItemsList,
                             payrollProcessEmployeeStatusData,
                             selectedRows,
                             tableData,
                             setTableData,
                             isLoading,
                             setLoading,
                             payroll,
                             filteredEmployees,
                             setSalaryData,
                         }) => {
    const [columns, setColumns] = useState([]);
    const [selectedFileData, setSelectedFileData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    // const [tableData, setTableData] = useState([]);
    const [invalidData, setInvalidData] = useState([]);
    const [savedData, setSavedData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [invalidBtnStyle, setInvalidBtnStyle] = useState("secondary");
    const [hasDuplicateRecord, setDuplicateRecord] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    //const [filteredEmployees, setFilteredEmployees] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    useEffect(() => {
        if (payroll) {
            setTableData([]);
            fetchInvalidData();
            //fetchPayrollProcessEmployeeStatusData();
        }
    }, [payroll]);

    useEffect(() => {
        hasDuplicateRecord &&
        NotificationManager.warning(
            "Duplicate Data will be Override",
            "Duplicate"
        );
    }, [hasDuplicateRecord]);

    //Table Columns
    useEffect(() => {
        setColumns([
            {
                title: "Id",
                field: "id",
                hidden: true,
            },
            {
                title: "Created Date Time",
                field: "createdDateTime",
                hidden: true,
            },
            {
                title: "Created By",
                field: "createdBy",
                hidden: true,
            },
            {
                title: "Employee Id",
                field: "employee",
            },
            {
                title: "Employee Name",
                field: "empName",
            },
            {
                title: "Pay Item Id",
                field: "payItem",
            },
            {
                title: "Percentage",
                field: "isPercentage",
                type: "boolean",
            },
            {
                title: "Increment Value",
                field: "value",
                type: "numeric",
            },
            {
                title: "Effective Date",
                field: "effectiveDate",
                type: "date",
                dateSetting: {
                    locale: "pa-LK",
                },
            },
            {
                title: "Arrears Amount",
                field: "arrearsAmount",
                type: "numeric",
            },
            {
                title: "Old Value",
                field: "oldValue",
                type: "numeric",
            },
            {
                title: "New Value",
                field: "newValue",
                type: "numeric",
            },
            {
                title: "Status",
                field: "salaryStatus",
            },
            {
                title: "Applied Date",
                field: "applieddate",
                type: "date",
                dateSetting: {
                    locale: "pa-LK",
                },
            },
        ]);
    }, []);

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
        DetailPanel: forwardRef((props, ref) => (
            <ChevronRight {...props} ref={ref}/>
        )),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
        PreviousPage: forwardRef((props, ref) => (
            <ChevronLeft {...props} ref={ref}/>
        )),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
        SortArrow: forwardRef((props, ref) => (
            <ArrowDownward {...props} ref={ref}/>
        )),
        ThirdStateCheck: forwardRef((props, ref) => (
            <Remove {...props} ref={ref}/>
        )),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>),
    };

    const EXTENSIONS = ["xlsx", "xls"];

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const parts = file.name.split(".");
            setSelectedFile(file);
            const extension = parts[parts.length - 1];
            if (EXTENSIONS.includes(extension)) {
                const reader = new FileReader();
                reader.readAsBinaryString(file);

                reader.onload = (event) => {
                    const selected = event.target.result;
                    const workbook = XLSX.read(selected, {
                        type: "binary",
                        cellDates: true,
                        cellNF: false,
                        cellText: false,
                    });
                    const workSheetName = workbook.SheetNames[0];
                    const workSheet = workbook.Sheets[workSheetName];

                    const fileData = XLSX.utils.sheet_to_json(workSheet, {header: 1});
                    fileData.splice(0, 1);
                    setSelectedFileData(fileData);
                };
            } else {
                NotificationManager.error("Invalid File Format", "Error");
            }
        }
        e.target.value = "";
    };

    const convertToJson = (fileData) => {
        setInvalidBtnStyle("secondary");
        let rows = [];
        const inValidRecords = [];
        const headers = [
            "employee",
            "empName",
            "payItem",
            "isPercentage",
            "value",
            "effectiveDate",
        ];
        const timezoneOffset = new Date();
        fileData.forEach((row, rowIndex) => {
            const rowData = {};
            rowData.record = rowIndex + 2;
            row.forEach((element, index) => {

                if (index === 5) {
                    const parsedDate = new Date(element);
                    parsedDate.setHours(
                        parsedDate.getHours() + timezoneOffset.getHours()
                    );
                    rowData[headers[index]] = new Date(parsedDate);
                } else {
                    rowData[headers[index]] = element;
                }
            });

            if (isNaN(rowData.value) && isNaN(parseFloat(rowData.value))) {
                rowData.reason = "Invalid Increment Value";
                inValidRecords.push(rowData);
            } else if (rowData.effectiveDate.getTime() !== rowData.effectiveDate.getTime()) {
                rowData.reason = "Invalid Effective Date";
                inValidRecords.push(rowData);
            } else if (rowData.isPercentage === 1 && 0 > rowData.value) {
                rowData.reason = "Invalid Persentage value";
                inValidRecords.push(rowData);
            } else if (rowData.isPercentage === 1 && rowData.value > 100) {
                rowData.reason = "Invalid Persentage value";
                inValidRecords.push(rowData);
            } else if (rowData.employee === "" || rowData.employee === " " || !rowData.employee) {
                rowData.reason = "The employee number field is blank.";
                inValidRecords.push(rowData);
            }
                // else if (rowData.empName === "" || rowData.empName === " " || !rowData.empName) {
                //   rowData.reason = "The employee name field is blank.";
                //   inValidRecords.push(rowData);
            // }
            else if (rowData.payItem === "" || rowData.payItem === " " || !rowData.payItem) {
                rowData.reason = "The pay item field is blank.";
                inValidRecords.push(rowData);
            }
                // else if (rowData.isPercentage === "" || rowData.isPercentage === " " || !rowData.isPercentage) {
                //   rowData.reason = "The isPercentage field is blank.";
                //   inValidRecords.push(rowData);
            // }
            else if (rowData.value === "" || rowData.value === " " || !rowData.value) {
                rowData.reason = "The increment value field is blank";
                inValidRecords.push(rowData);
            } else if (rowData.effectiveDate === "" || rowData.effectiveDate === " " || !rowData.effectiveDate) {
                rowData.reason = "The effective date field is blank";
                inValidRecords.push(rowData);
            } else {

                const emp = employeeData.find((emp) => emp.empNo === (rowData.employee).toString());
                const payItem = payrollPayItemsData.find((item) => item.payItemCode === (rowData.payItem).toString());

                const y = startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.endDate;
                const effDateCheck = new Date(rowData.effectiveDate) > new Date(y);

                const z = employeeData.find((b) => b.empNo === (rowData.employee).toString())?.employmentDate;
                const regDateCheck = new Date(rowData.effectiveDate) < new Date(z);

                let status = payrollProcessEmployeeStatusData?.find((v) => v.empCode === (rowData.employee).toString())?.status;

                if (!emp) {
                    rowData.reason = "Invalid Employee";
                    inValidRecords.push(rowData);
                } else if (!payItem) {
                    rowData.reason = "Invalid Pay Item";
                    inValidRecords.push(rowData);
                } else if (effDateCheck) {
                    rowData.reason = "This effective date is out of range";
                    inValidRecords.push(rowData);
                } else if (regDateCheck) {
                    rowData.reason = "This effective date is after the employee's registered date";
                    inValidRecords.push(rowData);
                } else if (status === payrollProcessStatus.SUCCESSES || status === payrollProcessStatus.PROCESSING) {
                    rowData.reason = "This employee is already processed.";
                    inValidRecords.push(rowData);
                } else {
                    rows = rows.filter((value, index, self) => index === self.findIndex((t) => t.employee === value.employee && t.payItem === value.payItem));

                    if (payroll.employeesToPayItems.find((p) => p.employeeId === emp.id && p.payrollPayItemId === payItem.id))
                        setDuplicateRecord(true);

                    rows.push(rowData);
                }
            }
        });
        inValidRecords?.length > 0 && setInvalidBtnStyle("warning");
        setInvalidData(inValidRecords);

        //setTableData(rows);

        setTableData(
            rows.map((row) => {

                let x = startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate;
                let y = employeesToPayItemsList.filter((v) => v.payrollPayItemCode === row.payItem);

                let monthDifference = 0;
                let dayDifference = 0;
                let months = 0;
                let days = 0;

                if ((moment(row.effectiveDate).isBetween(dateFromPeriod, dateToPeriod)) || (moment(row.effectiveDate).isSame(dateFromPeriod)) || (moment(row.effectiveDate).isSame(dateToPeriod))) {
                    monthDifference = 0;
                    dayDifference = 0;
                    months = 0;
                    days = 0;
                } else {
                    //monthDifference = Math.round(moment(new Date(x)).diff(new Date(row.effectiveDate ? row.effectiveDate : x), "months", true)).toFixed(2);
                    //monthDifference  = moment.preciseDiff((moment(x).format("YYYY-MM-DD")),(moment(row.effectiveDate ? row.effectiveDate : x).format("YYYY-MM-DD")), true);
                    //months = monthDifference.months;
                    //days = monthDifference.days;

                    let a = moment(x).date();
                    let b = moment(row.effectiveDate ? row.effectiveDate : x).add(1, "month").set("date", a).format("YYYY-MM-DD");
                    monthDifference = moment.preciseDiff((moment(x).format("YYYY-MM-DD")), (moment(row.effectiveDate ? row.effectiveDate : x).format("YYYY-MM-DD")), true);
                    dayDifference = moment.preciseDiff((moment(row.effectiveDate ? row.effectiveDate : x).format("YYYY-MM-DD")), (moment(b).format("YYYY-MM-DD")), true);

                    months = monthDifference.months;
                    days = dayDifference.days;
                }

                let daysInMonth = moment((row.effectiveDate ? row.effectiveDate : x), "YYYY-MM").daysInMonth();
                let oldAmount = 0;
                let percentageValue = 0;
                let arrearsMonth = 0;
                let arrearsDays = 0;
                let arrearsValue = 0;
                let newAmount = 0;

                if (row.isPercentage === 1) {
                    oldAmount = y.find((b) => b.employee === (row.employee).toString())?.amount;
                    percentageValue = (oldAmount * row.value) / 100;
                    arrearsMonth = ((percentageValue) * (months)).toFixed(2);
                    arrearsDays = (((percentageValue) * (days)) / (daysInMonth)).toFixed(2);
                    arrearsValue = (Number(arrearsMonth) + Number(arrearsDays)).toFixed(2);
                    newAmount = (Number(percentageValue) + Number(oldAmount)).toFixed(2);
                } else {
                    oldAmount = y.find((b) => b.employee === (row.employee).toString())?.amount;
                    arrearsMonth = ((row.value) * (months)).toFixed(2);
                    arrearsDays = (((row.value) * (days)) / (daysInMonth)).toFixed(2);
                    arrearsValue = (Number(arrearsMonth) + Number(arrearsDays)).toFixed(2);
                    newAmount = (Number(row.value) + Number(oldAmount)).toFixed(2);
                }

                return {
                    ...row,
                    arrearsAmount: arrearsValue,
                    oldValue: oldAmount,
                    newValue: newAmount,
                    //salaryStatus: Object.keys(salaryStatus)[0],
                    applieddate: new Date(),
                };
            })
        );

    };

    const onReadFile = () => {
        if (selectedFileData) {
            setTableData([]);
            convertToJson(selectedFileData);
        } else {
            NotificationManager.error("Please Select a File", "Error");
        }
    };

    const fetchInvalidData = () => {
        setInvalidBtnStyle("secondary");
        setInvalidData([]);
        salaryService()
            .getAllInvalidSalaries(payroll.id)
            .then(({data}) => {
                setInvalidData(
                    data.map((d) => ({
                        record: d.record,
                        id: d.id,
                        employee: d.employeeId,
                        payItem: d.payrollPayItemId,
                        reason: d.reason,
                    }))
                );
                if (data?.length > 0) setInvalidBtnStyle("warning");
            })
            .catch((e) => {
                console.error(e);
            });
    };

    function saveDetails() {
        if (selectedFile) {
            setLoading(true);

            let x = startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate;
            let period = payroll?.payRollPeriod?.payRollPeriodDetails?.find((v) => moment(v.dateFrom.split(" ")[0]).format("YYYY-MM-DD") === moment(x).format("YYYY-MM-DD"))?.id;

            const employeesToPayItemsList = filteredEmployees.map((data) => ({
                employeeId: employeeData.find((emp) => emp.empNo === data.employee.toString())?.id,
                payrollPayItemId: payrollPayItemsData.find((item) => item.payItemCode === data.payItem.toString())?.id,
                payrollDefinitionId: payroll.id,
                payRollPeriodDetailsId: period,
                isPercentage: data.isPercentage === 1 ? true : false,
                value: data.value,
                arrearsAmount: data.arrearsAmount,
                oldValue: data.oldValue,
                newValue: data.newValue,
                //salaryStatus: data.salaryStatus,
                salaryStatus: data.salaryStatus === Object.keys(salaryStatus)[1] ? salaryStatus.CONFIRMED : salaryStatus.APPLICATION,
                isExcelUpload: true,
                effectiveDate: data.effectiveDate,
            }));

            const invalidEmployeesToPayItemsList = invalidData.map((data) => ({
                employeeId: data.employee,
                payrollPayItemId: data.payItem,
                payrollDefinitionId: payroll.id,
                reason: data.reason,
                record: data.record,
            }));

            const excel = new FormData();
            excel.append("file", selectedFile);
            excel.append("employeesToPayItemsList", JSON.stringify(employeesToPayItemsList));
            excel.append("invalidEmployeesToPayItemsList", JSON.stringify(invalidEmployeesToPayItemsList));

            if (tableData?.length === 0) return;

            salaryService()
                .createExcel(excel)
                .then(({data}) => {
                    NotificationManager.success(
                        tableData?.length + " records was successfully created",
                        "Success"
                    );
                    setSavedData(data.result);

                    // setTableData(
                    //   data.result.map((sal) => {

                    //     return {
                    //       id: sal.id,
                    //       value: sal.value,
                    //       oldValue: sal.oldValue,
                    //       newValue: sal.newValue,
                    //       arrearsAmount: sal.arrearsAmount,
                    //       isPercentage: sal.isPercentage,
                    //       payItem: payrollPayItemsData?.find((v) => v.id === sal.payrollPayItemId)?.payItemCode,
                    //       effectiveDate: sal.effectiveDate?.split("T")[0],
                    //       applieddate: moment(sal.createdDateTime?.split("T")[0]).format("YYYY-MM-DD"),
                    //       employee: employeeData?.find((v) => v.value === sal.employeeId)?.label,
                    //       empName: employeeData?.find((v) => v.value === sal.employeeId)?.empName,
                    //       salaryStatus:sal.salaryStatus === salaryStatus.APPLICATION
                    //           ? Object.keys(salaryStatus)[0]
                    //           : sal.salaryStatus === salaryStatus.CONFIRMED
                    //           ? Object.keys(salaryStatus)[1]
                    //           : sal.salaryStatus === salaryStatus.ROLLBACK
                    //           ? Object.keys(salaryStatus)[2]
                    //           : "",
                    //     };
                    //   })
                    // );

                    let a = data.result.filter((v) => v.employee === (filteredEmployees.find((p) => p.employee === v.employee)?.employee)).map((sal) => {
                        return {
                            ...sal,
                            id: sal.id,
                            value: sal.value,
                            oldValue: sal.oldValue,
                            newValue: sal.newValue,
                            arrearsAmount: sal.arrearsAmount,
                            isPercentage: sal.isPercentage,
                            payItem: payrollPayItemsData?.find((v) => v.id === sal.payrollPayItemId)?.payItemCode,
                            effectiveDate: sal.effectiveDate?.split("T")[0],
                            applieddate: moment(sal.createdDateTime?.split("T")[0]).format("YYYY-MM-DD"),
                            employee: employeeData?.find((v) => v.value === sal.employeeId)?.label,
                            empName: employeeData?.find((v) => v.value === sal.employeeId)?.empName,
                            //salaryStatus: sal.salaryStatus === Object.keys(salaryStatus)[1] ? Object.keys(salaryStatus)[1] : Object.keys(salaryStatus)[0],
                            salaryStatus: sal.salaryStatus === salaryStatus.APPLICATION
                                ? Object.keys(salaryStatus)[0]
                                : sal.salaryStatus === salaryStatus.CONFIRMED
                                    ? Object.keys(salaryStatus)[1]
                                    : sal.salaryStatus === salaryStatus.ROLLBACK
                                        ? Object.keys(salaryStatus)[2]
                                        : "",
                        };
                    })
                    let b = tableData.filter((v) => v.employee !== (filteredEmployees.find((p) => p.employee === v.employee)?.employee))
                    setTableData(a.concat(...b));

                    fetchSalaryData(payroll);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.error(error);
                    if (error.statusCode === 409) {
                        NotificationManager.error(error.message, "Error");
                    } else {
                        NotificationManager.error("Failed to save", "Error");
                    }
                });
        }
    }

    //Fetch table data
    const fetchSalaryData = (details) => {
        setLoading(true);
        payrollProcessService()
            .getSalary(details.id)
            .then(({data}) => {
                data = data.salary?.map((salaries) => ({
                    id: salaries.id,
                    value: salaries.value,
                    oldValue: salaries.oldValue,
                    newValue: salaries.newValue,
                    arrearsAmount: salaries.arrearsAmount,
                    isPercentage: salaries.isPercentage,
                    effectiveDate: salaries.effectiveDate?.split("T")[0],
                    employee: employeeData?.find((v) => v.value === salaries.employeeId)?.label,
                    empName: employeeData?.find((v) => v.value === salaries.employeeId)?.empName,
                }));
                setLoading(false);
                setSalaryData(data);
            });
    };

    const changeEmployeesToPayItemsAmount = () => {
        new Promise((resolve, reject) => {

            let y = employeesToPayItemsList.filter((v) => v.payrollPayItemCode === (filteredEmployees.find((p) => p.payItem === v.payrollPayItemCode)?.payItem));
            let empItemId = y.find((v) => v.employee === (filteredEmployees.find((p) => p.employee === v.employee)?.employee))?.id;

            const salStatus = filteredEmployees.map((employee) => ({
                id: y.find((v) => v.employee === employee.employee)?.id,
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

    const setSalaryStatus = () => {
        new Promise((resolve, reject) => {
            let salId = salaryData.find((v) => v.id === (filteredEmployees.find((p) => p.id === v.id)?.id))?.id;

            //Obj Create
            const salStatus = filteredEmployees.map((sal) => ({
                id: sal.id,
                salaryStatus: salaryStatus.CONFIRMED,
            }));

            salaryService().updateSalaryStatus(salStatus, salId).then((response) => {
                NotificationManager.success(
                    salStatus?.length + " records was successfully confirmed",
                    "Success"
                );

                let a = tableData.filter((v) => v.id !== undefined);
                let b = tableData.filter((v) => v.id === undefined);
                let c = a.map((sal) => ({
                    id: sal.id,
                    salaryStatus: Object.keys(salaryStatus)[1],
                    applieddate: sal.applieddate,
                    arrearsAmount: sal.arrearsAmount,
                    effectiveDate: sal.effectiveDate,
                    empName: sal.empName,
                    employee: sal.employee,
                    isPercentage: sal.isPercentage,
                    newValue: sal.newValue,
                    oldValue: sal.oldValue,
                    payItem: sal.payItem,
                    value: sal.value,
                }));
                let d = b.concat(...c);
                setTableData(b.concat(...c));

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
            {showModal && (
                <SalaryExcelModal
                    show={showModal}
                    setShow={setShowModal}
                    invalidDataList={invalidData}
                />
            )}
            <MaterialTable
                icons={tableIcons}
                title={
                    <>
            <span>
              <strong>Process Period: </strong>
                {processPeriod}
            </span>
                        &nbsp;&nbsp;
                        {tableData?.length > 0 && (
                            <span>
                <strong>Valid Count: </strong>
                                {tableData?.length}
              </span>
                        )}
                        &nbsp;&nbsp;
                        {invalidData?.length > 0 && (
                            <span>
                <strong style={{color: "red"}}>Invalid Count: </strong>
                                {invalidData?.length}
              </span>
                        )}
                        &nbsp;&nbsp;
                        <span>
              <strong>Saved Count: </strong>
                            {savedData?.length}
            </span>
                    </>
                }
                columns={columns}
                data={tableData}
                //isLoading={isLoading}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount)?.[window.location.pathname] ?? 5,
                    //emptyRowsWhenPaging: false,
                    selection: true,
                }}
                onSelectionChange={selectedRows}
                onRowsPerPageChange={(pageSize) =>
                    handlePageSize(pageSize, window.location.pathname)
                }
                actions={[
                    {
                        icon: forwardRef((props, ref) => (<UploadFile {...props} ref={ref}/>)),
                        tooltip: "Upload",
                        onClick: (event, rowData) => saveDetails(),
                    },
                ]}
                components={{
                    Toolbar: (props) => (
                        <div>
                            <MTableToolbar {...props} />
                            <div className="d-flex gap-2">
                                <a
                                    href={`${API_CONFIGURATIONS.STATIC_FILES}/Increments Upload Format.xlsx`}
                                    download
                                >
                                    Download Format
                                </a>
                                <div className="col-md-1">
                                    <label htmlFor="upload-single-file">
                                        <Button className="btn-secondary btn-sm" as="span">
                                            <div className="flex flex-middle">
                                                <i className="i-Share-on-Cloud"> </i>
                                                <span>Browse</span>
                                            </div>
                                        </Button>
                                    </label>
                                    <input
                                        className="d-none"
                                        onChange={handleFileSelect}
                                        id="upload-single-file"
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        type="file"
                                    />
                                </div>
                                {selectedFile && <div>{selectedFile.name}</div>}
                                <div className="col-md-1">
                                    <Button
                                        variant="secondary"
                                        className="btn-sm"
                                        onClick={onReadFile}
                                    >
                                        Read & Verify
                                    </Button>
                                </div>
                                <div className="col-md-1">
                                    <Button
                                        variant={invalidBtnStyle}
                                        className="btn-sm"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Invalid Records
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ),
                }}
            />
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
                <div className="col-md-3 mt-3 d-flex justify-content-end">
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => {
                            let salId = salaryData.find((v) => v.id === (filteredEmployees.find((p) => p.id === v.id)?.id))?.id;
                            let app = filteredEmployees.find((p) => p.salaryStatus === Object.keys(salaryStatus)[0]);
                            let conf = filteredEmployees.find((p) => p.salaryStatus === Object.keys(salaryStatus)[1]);
                            if (app) {
                                setSalaryStatus();
                                changeEmployeesToPayItemsAmount();
                            } else {
                                if (conf) {
                                    NotificationManager.error("This is alredy confirmed.", "Error");
                                } else {
                                    NotificationManager.error("This is not a uploaded increment.", "Error");
                                }
                            }
                        }}
                    >
                        Increment Confirmed
                    </Button>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(SalaryExcelList);
