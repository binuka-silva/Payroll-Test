import React, {forwardRef, useEffect} from "react";

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
import MaterialTable from "@material-table/core";
import {NotificationManager} from "react-notifications";
import {Search} from "@material-ui/icons";
import moment from "moment";
import localStorageService from "../../services/localStorageService";
import handlePageSize from "../../common/tablePageSize";
import StartIcon from '@mui/icons-material/Start';
import {payrollPeriodProcess} from "./constant";

const PayRollPeriodList = ({
                               fetchPayRollPeriodDataFunc,
                               payRollPeriodList, isUpdate,
                               setPayRollPeriodList, onExtend
                           }) => {

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
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

    //Table Columns
    const columnsDataTable = [
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
            title: "Period No",
            field: "periodNo",
            validate: (rowData) =>
                rowData.periodNo === undefined
                    ? {isValid: false, helperText: "Period number is required"}
                    : rowData.periodNo === ""
                        ? {isValid: false, helperText: "Period number is required"}
                        : true,
            editable: "onAdd",
        },
        {
            title: "Date From",
            field: "dateFrom",
            type: "date",
            dateSetting: {
                locale: "pa-LK",
            },
            validate: (rowData) =>
                rowData.dateFrom === undefined
                    ? {isValid: false, helperText: "Period date from is required"}
                    : rowData.dateFrom === ""
                        ? {isValid: false, helperText: "Period date from is required"}
                        : true,
        },
        {
            title: "Date To",
            field: "dateTo",
            type: "date",
            dateSetting: {
                locale: "pa-LK",
            },
            validate: (rowData) =>
                rowData.dateTo === undefined
                    ? {isValid: false, helperText: "Period date to is required"}
                    : rowData.dateTo === ""
                        ? {isValid: false, helperText: "Period date to is required"}
                        : true,
        },
        {
            title: "Tax Period",
            field: "taxPeriod",
            validate: (rowData) =>
                rowData.taxPeriod === undefined
                    ? {isValid: false, helperText: "Tax period is required"}
                    : rowData.taxPeriod === ""
                        ? {isValid: false, helperText: "Tax period is required"}
                        : true,
        },
        {
            title: "Accounting Period",
            field: "accountingPeriod",
            validate: (rowData) =>
                rowData.accountingPeriod === undefined
                    ? {isValid: false, helperText: "Accounting period is required"}
                    : rowData.accountingPeriod === ""
                        ? {isValid: false, helperText: "Accounting period is required"}
                        : true,
        },
        {
            title: "Pay Date",
            field: "payDate",
            type: "date",
            dateSetting: {
                locale: "pa-LK",
            },
            validate: (rowData) =>
                rowData.payDate === undefined
                    ? {isValid: false, helperText: "Pay date is required"}
                    : rowData.payDate === ""
                        ? {isValid: false, helperText: "Pay date is required"}
                        : true,
        },
        {
            title: "Pay Day",
            field: "payDay",
            validate: (rowData) =>
                rowData.payDay === undefined
                    ? {isValid: false, helperText: "Pay day is required"}
                    : rowData.payDay === ""
                        ? {isValid: false, helperText: "Pay day is required"}
                        : true,
            editable: "onAdd",
        },
    ];

    //Update Row
    const updateRow = (editedRow, oldData) =>
        new Promise((resolve, reject) => {
            editedRow.payDay = moment(editedRow.payDate).format("dddd");
            const dataUpdate = [...payRollPeriodList];
            const index = oldData.tableData.id;
            dataUpdate[index] = editedRow;

            oldData.id
                ? setPayRollPeriodList(
                    [
                        ...payRollPeriodList.filter((c) => c.id !== editedRow.id),
                        editedRow,
                    ].sort((a, b) => a.periodNo - b.periodNo)
                )
                : setPayRollPeriodList([...dataUpdate]);

            resolve();
            NotificationManager.success(
                "A record was successfully updated",
                "Success"
            );
        });

    //Delete Row
    const deleteRow = (oldData) =>
        new Promise((resolve, reject) => {
            const dataDelete = [...payRollPeriodList];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            setPayRollPeriodList([...dataDelete]);
            resolve();
            NotificationManager.success(
                "A record was successfully deleted.",
                "Success"
            );
        });

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={columnsDataTable}
                data={payRollPeriodList}
                editable={{
                    onRowUpdate: (editedRow, oldData) => updateRow(editedRow, oldData),
                    onRowDelete: (oldData) => deleteRow(oldData),
                }}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false,
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                actions={[
                    {
                        icon: forwardRef((props, ref) => <StartIcon {...props} ref={ref}/>),
                        tooltip: 'Extend',
                        disabled: !isUpdate || !!payRollPeriodList.find(period => period.periodProcess !== payrollPeriodProcess.CLOSE),
                        isFreeAction: true,
                        onClick: (event, rowData) => onExtend()
                    },
                ]}
            />
        </>
    );
};

export default PayRollPeriodList;
