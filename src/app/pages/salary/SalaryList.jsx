import React, {forwardRef, useEffect, useState} from "react";

import MaterialTable from "@material-table/core";

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
import {Delete, Search} from "@material-ui/icons";
import {NotificationManager} from "react-notifications";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import {connect} from "react-redux";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import moment from "moment";
import "moment-precise-range-plugin";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import salaryService from "../../api/salaryServices/salaryService";
import employeesToPayItemsServices from "../../api/employeesToPayItemsServices/employeesToPayItemsServices";
import localStorageService from "../../services/localStorageService";
import handlePageSize from "../../common/tablePageSize";
import {payrollPeriodProcess, payrollProcessStatus, salaryStatus,} from "./constant";

const SalaryList = ({
                        fetchSalaryFunc,
                        setSalaryList,
                        salaryList,
                        employeeData,
                        payItem,
                        dateFromPeriod,
                        dateToPeriod,
                        isLoading,
                        setLoading,
                        setPayrollTaxDetails,
                        payroll,
                        newlyAddedEmployeeList,
                        startDateData,
                        endDateData,
                        prossPeriods,
                        processPeriodData,
                        sPeriods,
                        ePeriods,
                        selectedRows,
                        effectiveDate,
                        setEffectiveDate,
                        payrollProcessEmployeeStatusData,
                        filteredEmployees,
                        closePeriodsData,
                    }) => {
    const [employee, setEmployee] = useState("");
    const [employeeInDropdown, setEmployeeInDropdown] = useState("");
    //const [value, setValue] = useState("");
    //const [effectiveDate, setEffectiveDate] = useState("");

    //Table Columns
    const [columns, setColumns] = useState([]);
    const [deleteData, setDeleteData] = useState([]);


    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
    }, []);

    //Table Columns
    useEffect(() => {
        const selectedEmployee = employeeData.find((p) => p.value === employee) ?? {};

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
                editable: "onAdd",
                editComponent: (props) => {
                    //let filteredEmployees = employeeData?.filter((v)=>v.label !== (salaryList?.find((p)=>(p.employee === v.label))?.label))

                    let x = employeeData.find((b) => b.label === props.value)?.value;
                    x && setEmployee(x);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={employeeData}
                            onChange={(e, selected) => {
                                props.onChange(selected);
                                setEmployee(selected?.value);
                                setEmployeeInDropdown(selected);
                            }}
                            label="Select"
                            defaultValue={employeeInDropdown}
                            //defaultValue={x ?? props.value}
                        />
                    );
                },
            },
            {
                title: "Employee Name",
                field: "empName",
                editable: "never",
                emptyValue: selectedEmployee?.empName ?? "",
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
                validate: (rowData) =>
                    rowData.value === undefined
                        ? {
                            isValid: false,
                            helperText: "Value is required",
                        }
                        : rowData.value === ""
                            ? {
                                isValid: false,
                                helperText: "Value is required",
                            }
                            : rowData.isPercentage === true && rowData.value > 100
                                ? {
                                    isValid: false,
                                    helperText: "Percentage Value must be less than 100",
                                }
                                : rowData.isPercentage === true && rowData.value < 0
                                    ? {
                                        isValid: false,
                                        helperText: "Value must be grater than or equal 0",
                                    }
                                    : rowData.isPercentage === false && rowData.value < 0
                                        ? {
                                            isValid: false,
                                            helperText: "Increment Value must be grater than or equal 0",
                                        }
                                        : true,
            },
            {
                title: "Effective Date",
                field: "effectiveDate",
                type: "date",
                initialEditValue: (sPeriods?.length === 0 ? moment(startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate).format("yyyy-MM-DD") : moment(sPeriods).format("yyyy-MM-DD"))
            },

            {
                title: "Arrears Amount",
                field: "arrearsAmount",
                type: "numeric",
                editable: "never",
            },
            {
                title: "Old Value",
                field: "oldValue",
                type: "numeric",
                editable: "never",
            },
            {
                title: "New Value",
                field: "newValue",
                type: "numeric",
                editable: "never",
            },
            {
                title: "Status",
                field: "salaryStatus",
                editable: "never",
            },
            {
                title: "Applied Date",
                field: "applieddate",
                type: "date",
                editable: "never",
            },
            {
                title: "Excel Upload",
                field: "isExcelUpload",
                type: "boolean",
                editable: "never",
            },
        ]);
    }, [salaryList, employeeData, employee, startDateData]);

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

    //Add Row
    const addRow = (newRow) =>
        new Promise((resolve, reject) => {

            let x = startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate;

            let period = payroll?.payRollPeriod?.payRollPeriodDetails?.find((v) => (moment(v.dateFrom.split(" ")[0]).format("YYYY-MM-DD")) === (moment(sPeriods ? sPeriods : x).format("YYYY-MM-DD")))?.id;

            if (newRow.isPercentage === true) {

                let monthDifference = 0;
                let dayDifference = 0;
                let months = 0;
                let days = 0;

                if ((moment(newRow.effectiveDate).isBetween((sPeriods ? sPeriods : dateFromPeriod), (ePeriods ? ePeriods : dateToPeriod))) || (moment(newRow.effectiveDate).isSame((sPeriods ? sPeriods : dateFromPeriod))) || (moment(newRow.effectiveDate).isSame((ePeriods ? ePeriods : dateToPeriod)))) {
                    monthDifference = 0;
                    dayDifference = 0;
                    months = 0;
                    days = 0;
                } else {

                    //monthDifference = Math.round(moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true)).toFixed(2);
                    //monthDifference  = moment.preciseDiff((moment(x).format("YYYY-MM-DD")),(moment(effectiveDate ? effectiveDate : x).format("YYYY-MM-DD")), true);
                    //monthDifference =  moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true).toFixed(2);
                    //months = monthDifference.months;
                    //days = monthDifference.days;

                    let a = moment(x).date();
                    let b = moment(newRow.effectiveDate ? newRow.effectiveDate : x).add(1, "month").set("date", a).format("YYYY-MM-DD");
                    monthDifference = moment.preciseDiff((moment(x).format("YYYY-MM-DD")), (moment(newRow.effectiveDate ? newRow.effectiveDate : x).format("YYYY-MM-DD")), true);
                    dayDifference = moment.preciseDiff((moment(newRow.effectiveDate ? newRow.effectiveDate : x).format("YYYY-MM-DD")), (moment(b).format("YYYY-MM-DD")), true);

                    months = monthDifference.months;
                    days = dayDifference.days;
                }

                let daysInMonth = moment((newRow.effectiveDate ? newRow.effectiveDate : x), "YYYY-MM").daysInMonth();
                let oldAmount = employeeData?.find((v) => v.value === employee)?.oldValue;
                let percentageValue = (oldAmount * newRow.value) / 100;
                let arrearsMonth = ((percentageValue) * (months)).toFixed(2);
                let arrearsDays = (((percentageValue) * (days)) / (daysInMonth)).toFixed(2);
                let arrearsValue = (Number(arrearsMonth) + Number(arrearsDays)).toFixed(2);
                let newAmount = (Number(percentageValue) + Number(oldAmount)).toFixed(2);

                //Obj Create
                let salary = {
                    employeeId: employee,
                    payrollPayItemId: payItem,
                    payrollDefinitionId: payroll.id,
                    payRollPeriodDetailsId: period,
                    isPercentage: newRow.isPercentage ?? false,
                    value: newRow.value ?? 0,
                    arrearsAmount: arrearsValue ?? 0,
                    oldValue: oldAmount ?? 0,
                    newValue: newAmount ?? 0,
                    effectiveDate: newRow.effectiveDate ? newRow.effectiveDate : sPeriods ? sPeriods : x,
                    salaryStatus: salaryStatus.APPLICATION
                };

                if (isExists(newRow)) {
                    reject();
                    return;
                }

                salaryService()
                    .create(salary)
                    .then(async (response) => {
                        NotificationManager.success(
                            "A record was successfully created",
                            "Success"
                        );

                        //Reload list
                        fetchSalaryFunc(payroll);
                        setEffectiveDate((sPeriods?.length === 0 ? (moment(startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate).format("yyyy-MM-DD")) : (moment(sPeriods).format("yyyy-MM-DD"))));
                        resolve();
                        setLoading(false);

                        // onSave();
                    })
                    .catch((error) => {
                        console.error(error);
                        if (error.statusCode === 409) {
                            NotificationManager.error(error.message, "Error");
                        }
                        reject();
                    });

            } else {

                let monthDifference = 0;
                let dayDifference = 0;
                let months = 0;
                let days = 0;

                if ((moment(newRow.effectiveDate).isBetween((sPeriods ? sPeriods : dateFromPeriod), (ePeriods ? ePeriods : dateToPeriod))) || (moment(newRow.effectiveDate).isSame((sPeriods ? sPeriods : dateFromPeriod))) || (moment(newRow.effectiveDate).isSame((ePeriods ? ePeriods : dateToPeriod)))) {
                    monthDifference = 0;
                    dayDifference = 0;
                    months = 0;
                    days = 0;
                } else {
                    //monthDifference = Math.round(moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true)).toFixed(2);
                    //monthDifference  = moment.preciseDiff((moment(x).format("YYYY-MM-DD")),(moment(effectiveDate ? effectiveDate : x).format("YYYY-MM-DD")), true);
                    //monthDifference =  moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true).toFixed(2);
                    //months = monthDifference.months;
                    //days = monthDifference.days;

                    let a = moment(x).date();
                    let b = moment(newRow.effectiveDate ? newRow.effectiveDate : x).add(1, "month").set("date", a).format("YYYY-MM-DD");
                    monthDifference = moment.preciseDiff((moment(x).format("YYYY-MM-DD")), (moment(newRow.effectiveDate ? newRow.effectiveDate : x).format("YYYY-MM-DD")), true);
                    dayDifference = moment.preciseDiff((moment(newRow.effectiveDate ? newRow.effectiveDate : x).format("YYYY-MM-DD")), (moment(b).format("YYYY-MM-DD")), true);

                    months = monthDifference.months;
                    days = dayDifference.days;
                }

                let daysInMonth = moment((newRow.effectiveDate ? newRow.effectiveDate : x), "YYYY-MM").daysInMonth();
                let oldAmount = employeeData?.find((v) => v.value === employee)?.oldValue;
                let arrearsMonth = (newRow.value * months).toFixed(2);
                let arrearsDays = ((newRow.value * days) / daysInMonth).toFixed(2);
                let arrearsValue = (Number(arrearsMonth) + Number(arrearsDays)).toFixed(2);
                let newAmount = (Number(newRow.value) + Number(oldAmount)).toFixed(2);

                //Obj Create
                let salary = {
                    employeeId: employee,
                    payrollPayItemId: payItem,
                    payrollDefinitionId: payroll.id,
                    payRollPeriodDetailsId: period,
                    isPercentage: newRow.isPercentage ?? false,
                    value: newRow.value ?? 0,
                    arrearsAmount: arrearsValue ?? 0,
                    oldValue: oldAmount ?? 0,
                    newValue: newAmount ?? 0,
                    effectiveDate: newRow.effectiveDate ? newRow.effectiveDate : sPeriods ? sPeriods : x,
                    salaryStatus: salaryStatus.APPLICATION
                };

                if (isExists(newRow)) {
                    reject();
                    return;
                }

                salaryService()
                    .create(salary)
                    .then(async (response) => {
                        NotificationManager.success(
                            "A record was successfully created",
                            "Success"
                        );

                        //Reload list
                        fetchSalaryFunc(payroll);
                        setEffectiveDate((sPeriods?.length === 0 ? (moment(startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate).format("yyyy-MM-DD")) : (moment(sPeriods).format("yyyy-MM-DD"))));
                        resolve();
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error(error);
                        if (error.statusCode === 409) {
                            NotificationManager.error(error.message, "Error");
                        }
                        reject();
                    });
            }
        });

    const isExists = (row) => {

        const x = employeeData.find((b) => b.value === row.employee)?.label;
        const existEmployees = salaryList.find((detail) => detail.employee === x)?.employee;

        const y = startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.endDate;
        const effDateCheck = new Date(row.effectiveDate) > new Date(y);

        const z = employeeData.find((b) => b.value === row.employee)?.employmentDate;
        const regDateCheck = new Date(row.effectiveDate) < new Date(z);

        // if (existEmployees) {
        //   NotificationManager.error("This Employee was already assigned", "Error");
        //   return true;
        // }

        if (effDateCheck) {
            NotificationManager.error("This effective date is out of range.", "Error");
            return true;
        }
        if (regDateCheck) {
            NotificationManager.error("This effective date is after the employee's registered date.", "Error");
            return true;
        }
        return false;
    };

    //Update Row
    const updateRow = (editedRow, prevRow) =>
        new Promise((resolve, reject) => {


            let updateEmployee = employeeData?.find((v) => v.label === editedRow.employee)?.value;
            let x = startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate;
            let period = payroll?.payRollPeriod?.payRollPeriodDetails?.find((v) => (moment(v.dateFrom.split(" ")[0]).format("YYYY-MM-DD")) === (moment(sPeriods ? sPeriods : x).format("YYYY-MM-DD")))?.id;

            if (editedRow.isPercentage === true) {

                let monthDifference = 0;
                let dayDifference = 0;
                let months = 0;
                let days = 0;

                if ((moment(editedRow.effectiveDate).isBetween((sPeriods ? sPeriods : dateFromPeriod), (ePeriods ? ePeriods : dateToPeriod))) || (moment(editedRow.effectiveDate).isSame((sPeriods ? sPeriods : dateFromPeriod))) || (moment(editedRow.effectiveDate).isSame((ePeriods ? ePeriods : dateToPeriod)))) {
                    monthDifference = 0;
                    dayDifference = 0;
                    months = 0;
                    days = 0;
                } else {
                    //monthDifference = Math.round(moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true)).toFixed(2);
                    //monthDifference  = moment.preciseDiff((moment(x).format("YYYY-MM-DD")),(moment(effectiveDate ? effectiveDate : x).format("YYYY-MM-DD")), true);
                    //monthDifference =  moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true).toFixed(2);
                    //months = monthDifference.months;
                    //days = monthDifference.days;

                    let a = moment(x).date();
                    let b = moment(editedRow.effectiveDate ? editedRow.effectiveDate : x).add(1, "month").set("date", a).format("YYYY-MM-DD");
                    monthDifference = moment.preciseDiff((moment(x).format("YYYY-MM-DD")), (moment(editedRow.effectiveDate ? editedRow.effectiveDate : x).format("YYYY-MM-DD")), true);
                    dayDifference = moment.preciseDiff((moment(editedRow.effectiveDate ? editedRow.effectiveDate : x).format("YYYY-MM-DD")), (moment(b).format("YYYY-MM-DD")), true);

                    months = monthDifference.months;
                    days = dayDifference.days;
                }

                let daysInMonth = moment((editedRow.effectiveDate ? editedRow.effectiveDate : x), "YYYY-MM").daysInMonth();
                let oldAmount = employeeData?.find((v) => v.value === updateEmployee)?.oldValue;
                let percentageValue = (oldAmount * (editedRow.value)) / 100;
                let arrearsMonth = ((percentageValue) * (months)).toFixed(2);
                let arrearsDays = (((percentageValue) * (days)) / (daysInMonth)).toFixed(2);
                let arrearsValue = (Number(arrearsMonth) + Number(arrearsDays)).toFixed(2);
                let newAmount = (Number(percentageValue) + Number(oldAmount)).toFixed(2);

                //Obj Create
                let salary = {
                    id: editedRow.id,
                    employeeId: updateEmployee,
                    payrollPayItemId: payItem,
                    payrollDefinitionId: payroll.id,
                    payRollPeriodDetailsId: period,
                    isPercentage: editedRow.isPercentage ?? false,
                    value: editedRow.value ?? 0,
                    arrearsAmount: arrearsValue ?? 0,
                    oldValue: oldAmount ?? 0,
                    newValue: newAmount ?? 0,
                    effectiveDate: editedRow.effectiveDate ? editedRow.effectiveDate : (sPeriods ? sPeriods : x),
                    IsDelete: false,
                    createdDateTime: editedRow.createdDateTime,
                    createdBy: editedRow.createdBy,
                    modifiedDateTime: new Date(),
                    modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
                };

                salaryService()
                    .update(salary, editedRow.id)
                    .then(async (response) => {
                        NotificationManager.success(
                            "A record was successfully updated",
                            "Success"
                        );
                        //Reload list
                        fetchSalaryFunc(payroll);
                        setEffectiveDate((sPeriods?.length === 0 ? (moment(startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate).format("yyyy-MM-DD")) : (moment(sPeriods).format("yyyy-MM-DD"))));
                        resolve();
                        //onSave();
                    })
                    .catch((error) => {
                        console.error(error);
                        reject();
                        NotificationManager.error(
                            "An existing record already found",
                            "Error"
                        );
                    });

            } else {

                let monthDifference = 0;
                let dayDifference = 0;
                let months = 0;
                let days = 0;

                if ((moment(editedRow.effectiveDate).isBetween((sPeriods ? sPeriods : dateFromPeriod), (ePeriods ? ePeriods : dateToPeriod))) || (moment(editedRow.effectiveDate).isSame((sPeriods ? sPeriods : dateFromPeriod))) || (moment(editedRow.effectiveDate).isSame((ePeriods ? ePeriods : dateToPeriod)))) {
                    monthDifference = 0;
                    dayDifference = 0;
                    months = 0;
                    days = 0;
                } else {
                    //monthDifference = Math.round(moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true)).toFixed(2);
                    //monthDifference  = moment.preciseDiff((moment(x).format("YYYY-MM-DD")),(moment(effectiveDate ? effectiveDate : x).format("YYYY-MM-DD")), true);
                    //monthDifference =  moment(new Date(x)).diff(new Date(effectiveDate ? effectiveDate : x), "months", true).toFixed(2);
                    //months = monthDifference.months;
                    //days = monthDifference.days;

                    let a = moment(x).date();
                    let b = moment(editedRow.effectiveDate ? editedRow.effectiveDate : x).add(1, "month").set("date", a).format("YYYY-MM-DD");
                    monthDifference = moment.preciseDiff((moment(x).format("YYYY-MM-DD")), (moment(editedRow.effectiveDate ? editedRow.effectiveDate : x).format("YYYY-MM-DD")), true);
                    dayDifference = moment.preciseDiff((moment(editedRow.effectiveDate ? editedRow.effectiveDate : x).format("YYYY-MM-DD")), (moment(b).format("YYYY-MM-DD")), true);

                    months = monthDifference.months;
                    days = dayDifference.days;
                }

                let daysInMonth = moment((editedRow.effectiveDate ? editedRow.effectiveDate : x), "YYYY-MM").daysInMonth();
                let oldAmount = employeeData?.find((v) => v.value === updateEmployee)?.oldValue;
                let arrearsMonth = (editedRow.value * months).toFixed(2);
                let arrearsDays = ((editedRow.value * days) / daysInMonth).toFixed(2);
                let arrearsValue = (Number(arrearsMonth) + Number(arrearsDays)).toFixed(2);
                let newAmount = (Number(editedRow.value) + Number(oldAmount)).toFixed(2);

                //Obj Create
                let salary = {
                    id: editedRow.id,
                    employeeId: updateEmployee,
                    payrollPayItemId: payItem,
                    payrollDefinitionId: payroll.id,
                    payRollPeriodDetailsId: period,
                    isPercentage: editedRow.isPercentage ?? false,
                    value: editedRow.value ?? 0,
                    arrearsAmount: arrearsValue ?? 0,
                    oldValue: oldAmount ?? 0,
                    newValue: newAmount ?? 0,
                    effectiveDate: editedRow.effectiveDate ? editedRow.effectiveDate : (sPeriods ? sPeriods : x),
                    IsDelete: false,
                    createdDateTime: editedRow.createdDateTime,
                    createdBy: editedRow.createdBy,
                    modifiedDateTime: new Date(),
                    modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
                };

                salaryService()
                    .update(salary, editedRow.id)
                    .then(async (response) => {
                        NotificationManager.success(
                            "A record was successfully updated",
                            "Success"
                        );
                        //Reload list
                        fetchSalaryFunc(payroll);
                        setEffectiveDate((sPeriods?.length === 0 ? (moment(startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate).format("yyyy-MM-DD")) : (moment(sPeriods).format("yyyy-MM-DD"))));
                        resolve();
                        //onSave();
                    })
                    .catch((error) => {
                        console.error(error);
                        reject();
                        NotificationManager.error(
                            "An existing record already found",
                            "Error"
                        );
                    });
            }
        });

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise(async (resolve, reject) => {
            if (isConfirmed(deletedRow)) {
                reject();
                return;
            }

            //Obj Create
            const salaryList = deletedRow.map((deletelist) => deletelist.id);
            if (salaryList?.length == 0) {
                reject();
                return;
            }

            await salaryService()
                .deleteSalary(salaryList)
                .then((response) => {
                    //Reload list
                    fetchSalaryFunc(payroll);
                    resolve();
                    NotificationManager.success(
                        "A record was successfully deleted.",
                        "Success"
                    );
                    //onSave();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    NotificationManager.error("This record was already used", "Error");
                });
        });

    const isConfirmed = (row) => {

        const confirmed = (row.find((v) => v.salaryStatus)?.salaryStatus) === ("CONFIRMED");
        const rollback = (row.find((v) => v.salaryStatus)?.salaryStatus) === ("ROLLBACK");

        if (confirmed) {
            NotificationManager.error("This increment is already confirmed.", "Error");
            return true;
        }
        if (rollback) {
            NotificationManager.error("This increment has already been rolled back.", "Error");
            return true;
        }

        return false;
    };

    const checkConfirmedStatus = (rowData) => {
        new Promise((resolve, reject) => {

            let status = payrollProcessEmployeeStatusData?.find((v) => v.empCode === rowData.employee)?.status;

            if (rowData.salaryStatus === "CONFIRMED") {
                if (status !== payrollProcessStatus.SUCCESSES) {
                    setSalaryStatusByRow(rowData);
                    changeEmployeesToPayItemsAmountByRow(rowData);
                } else {
                    NotificationManager.error(rowData?.employee + "" + "-" + "" + "This employee is already processed.", "Error");
                }
            } else {
                NotificationManager.error("This is not a confirmed increment.", "Error");
            }
        });
    };

    const setSalaryStatusByRow = (rowData) => {
        new Promise((resolve, reject) => {

            let salId = rowData.id;

            //Obj Create
            const salStatus = [{
                id: rowData.id,
                salaryStatus: salaryStatus.ROLLBACK,
                arrearsAmount: 0,
            }];

            salaryService()
                .updateSalaryRollback(salStatus, salId)
                .then((response) => {
                    NotificationManager.success(
                        salStatus?.length + " records was successfully confirmed",
                        "Success"
                    );

                    //Reload list
                    fetchSalaryFunc(payroll);
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    NotificationManager.error("This is not a confirmed increment.", "Error");
                });
        });
    };

    const changeEmployeesToPayItemsAmountByRow = (rowData) => {
        new Promise((resolve, reject) => {

            let empItemId = employeeData.find((v) => v.label === rowData.employee)?.empToPayItemId;

            const salStatus = [{
                id: employeeData.find((v) => v.label === rowData.employee)?.empToPayItemId,
                amount: rowData.oldValue,
            }]


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

    const checkProcessStatus = () => {
        new Promise((resolve, reject) => {

            let filteredEmployeesBySalaryStatus = []
            filteredEmployeesBySalaryStatus = filteredEmployees?.filter((p) => p.salaryStatus === "CONFIRMED")

            let status = payrollProcessEmployeeStatusData?.find((v) => v.empCode === (filteredEmployees?.find((p) => p.employee === v.empCode)?.employee))?.status;
            let filteredEmployeesByEmployeeStatus = filteredEmployeesBySalaryStatus?.filter((p) => (payrollProcessEmployeeStatusData.find((v) => v.empCode === p.employee)?.status) !== payrollProcessStatus.SUCCESSES)
            let emp = payrollProcessEmployeeStatusData?.find((v) => v.empCode === (filteredEmployees?.find((p) => p.employee === v.empCode)?.employee))?.empCode;

            if (filteredEmployeesBySalaryStatus) {

                filteredEmployeesBySalaryStatus.forEach(s => {
                    if (((payrollProcessEmployeeStatusData?.find((v) => v.empCode === s.employee)?.status) !== payrollProcessStatus.SUCCESSES)) {
                        setSalaryStatus(filteredEmployeesByEmployeeStatus);
                        changeEmployeesToPayItemsAmount(filteredEmployeesByEmployeeStatus);
                    } else {
                        (NotificationManager.error(emp + "" + "-" + "" + "This employee is already processed.", "Error"))
                    }
                })
            } else {
                NotificationManager.error("This is not a confirmed increment.", "Error");
            }
        });
    };

    const setSalaryStatus = (filteredEmployeesByEmployeeStatus) => {
        new Promise((resolve, reject) => {
            let salId = salaryList.find((v) => v.id === filteredEmployeesByEmployeeStatus?.find((p) => p.id === v.id)?.id)?.id;

            //Obj Create
            const salStatus = filteredEmployeesByEmployeeStatus?.map((sal) => ({
                id: sal.id,
                salaryStatus: salaryStatus.ROLLBACK,
                arrearsAmount: 0,
            }));

            salaryService()
                .updateSalaryRollback(salStatus, salId)
                .then((response) => {
                    NotificationManager.success(
                        salStatus?.length + " records was successfully confirmed",
                        "Success"
                    );

                    //Reload list
                    fetchSalaryFunc(payroll);
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

    const changeEmployeesToPayItemsAmount = (filteredEmployeesByEmployeeStatus) => {
        new Promise((resolve, reject) => {
            let empItemId = employeeData.find((v) => v.label === filteredEmployeesByEmployeeStatus?.find((p) => p.employee === v.label)?.employee)?.empToPayItemId;

            const salStatus = filteredEmployeesByEmployeeStatus?.map((employee) => ({
                id: employeeData.find((v) => v.label === employee.employee)?.empToPayItemId,
                amount: employee.oldValue,
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
            {moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD") ? (
                <>
                    <MaterialTable
                        icons={tableIcons}
                        title=""
                        columns={columns}
                        data={salaryList}
                        editable={
                            {
                                // onRowAdd: (newRow) => addRow(newRow),
                                // onRowUpdate: (editedRow) => updateRow(editedRow),
                                // onRowDelete: (deletedRow) => deleteRow([deletedRow]),
                            }
                        }
                        options={{
                            toolbar: payItem === "" || moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD") ? false : true,
                            addRowPosition: "first",
                            actionsColumnIndex: -1,
                            filtering: true,
                            pageSizeOptions: [5, 10, 20, 50, 100],
                            pageSize:
                                JSON.parse(
                                    localStorageService.getItem("auth_user")?.tablePageCount
                                )?.[window.location.pathname] ?? 5,
                            //emptyRowsWhenPaging: false,
                            //selection: true,
                            selectionProps: (rowData) => ({
                                color: "primary",
                            }),
                            rowStyle: (rowData, index) => ({
                                background: newlyAddedEmployeeList.includes(rowData.employee)
                                    ? "rgba(199,185,213,0.9)"
                                    : "#FFF",
                            }),
                            //fixedColumns: {right: 1}
                        }}
                        onRowsPerPageChange={(pageSize) =>
                            handlePageSize(pageSize, window.location.pathname)
                        }
                        actions={[
                            // {
                            //   icon: forwardRef((props, ref) => <SettingsBackupRestoreIcon {...props} ref={ref}/>),
                            //   tooltip: 'Rollback',
                            //   onClick: (event, rowData) => checkProcessStatus(rowData)
                            // },
                            // {
                            //   icon: forwardRef((props, ref) => (<Delete {...props} ref={ref} />)),
                            //   tooltip: "Delete all",
                            //   onClick: (evt, data) => deleteRow(data),
                            // },
                            // {
                            //   icon: forwardRef((props, ref) => <SettingsBackupRestoreIcon {...props} ref={ref}/>),
                            //   disabled:payItem === "" || moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD") ? false : true,
                            //   tooltip: 'Rollback',
                            //   position: 'row',
                            //   onClick: (event, rowData) => checkConfirmedStatus(rowData)
                            // }
                        ]}
                        isLoading={isLoading}
                        onSelectionChange={selectedRows}
                    />
                </>
            ) : (
                <>
                    <MaterialTable
                        icons={tableIcons}
                        title=""
                        columns={columns}
                        data={salaryList}
                        editable={{
                            onRowAdd: (newRow) => addRow(newRow),
                            onRowUpdate: (editedRow) => updateRow(editedRow),
                            onRowDelete: (deletedRow) => deleteRow([deletedRow]),
                        }}
                        options={{
                            toolbar: payItem === "" || moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD") ? false : true,
                            addRowPosition: "first",
                            actionsColumnIndex: -1,
                            filtering: true,
                            pageSizeOptions: [5, 10, 20, 50, 100],
                            pageSize:
                                JSON.parse(
                                    localStorageService.getItem("auth_user")?.tablePageCount
                                )?.[window.location.pathname] ?? 5,
                            emptyRowsWhenPaging: false,
                            selection: true,
                            selectionProps: (rowData) => ({
                                color: "primary",
                            }),
                            rowStyle: (rowData, index) => ({
                                background: newlyAddedEmployeeList.includes(rowData.employee)
                                    ? "rgba(199,185,213,0.9)"
                                    : "#FFF",
                            }),
                            //fixedColumns: {right: 1}
                        }}
                        onRowsPerPageChange={(pageSize) =>
                            handlePageSize(pageSize, window.location.pathname)
                        }
                        actions={[
                            {
                                icon: forwardRef((props, ref) => <SettingsBackupRestoreIcon {...props} ref={ref}/>),
                                tooltip: 'Rollback',
                                onClick: (event, rowData) => checkProcessStatus(rowData)
                            },
                            {
                                icon: forwardRef((props, ref) => (<Delete {...props} ref={ref}/>)),
                                tooltip: "Delete all",
                                onClick: (evt, data) => deleteRow(data),
                            },
                            {
                                icon: forwardRef((props, ref) => <SettingsBackupRestoreIcon {...props} ref={ref}/>),
                                tooltip: 'Rollback',
                                position: 'row',
                                onClick: (event, rowData) => checkConfirmedStatus(rowData)
                            }
                        ]}
                        isLoading={isLoading}
                        onSelectionChange={selectedRows}
                    />
                </>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(SalaryList);
