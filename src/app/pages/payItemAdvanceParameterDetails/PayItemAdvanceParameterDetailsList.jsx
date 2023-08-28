import React, {forwardRef, useEffect} from "react";

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
import {Search} from "@material-ui/icons";
import {NotificationManager} from "react-notifications";
import localStorageService from "../../services/localStorageService";
import handlePageSize from "../../common/tablePageSize";

const PayItemAdvanceParameterDetailsList = ({
                                                setPayItemAdvanceParameterDetailsList,
                                                payItemAdvanceParameterDetailsList,
                                                fetchPayItemAdvanceParameterDetailsDataFunc,
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
            title: "Created By",
            field: "createdBy",
            hidden: true,
        },
        {
            title: "Sequence",
            field: "sequence",
            validate: (rowData) =>
                rowData.sequence === undefined
                    ? {isValid: false, helperText: "Sequence is required"}
                    : rowData.sequence === ""
                        ? {isValid: false, helperText: "Sequence is required"}
                        : isNaN(rowData.sequence)
                            ? {isValid: false, helperText: "Sequence must be an number"}
                            : payItemAdvanceParameterDetailsList.find(c => c.sequence === rowData.sequence && c.id !== rowData.id)
                                ? {isValid: false, helperText: "Sequence was already used"}
                                : true,
        },
        {
            title: "Covered Value",
            field: "coveredValue",
            validate: (rowData) =>
                rowData.coveredValue === undefined
                    ? {isValid: false, helperText: "Covered Value is required"}
                    : rowData.coveredValue === ""
                        ? {isValid: false, helperText: "Covered Value is required"}
                        : isNaN(rowData.coveredValue)
                            ? {isValid: false, helperText: "Covered Value must be a number"}
                            : true,
        },
        {
            title: "Value 1",
            field: "value",
            validate: (rowData) => rowData.value ? isNaN(rowData.value) ? {
                isValid: false,
                helperText: "Value must be a number"
            } : true : true,
        },
        {
            title: "Value 2",
            field: "value1",
            validate: (rowData) => rowData.value1 ? isNaN(rowData.value1) ? {
                isValid: false,
                helperText: "Value must be a number"
            } : true : true,
        },
    ];

    //Add Row
    const addRow = (newRow) =>
        new Promise((resolve, reject) => {
            if (payItemAdvanceParameterDetailsList.find(c => c.sequence === newRow.sequence)) {
                NotificationManager.error(
                    "Duplicate Sequence Added",
                    "Error"
                );
                return reject()
            }

            setPayItemAdvanceParameterDetailsList([...payItemAdvanceParameterDetailsList, newRow]);
            resolve();
            NotificationManager.success(
                "A record was successfully created",
                "Success"
            );
        });

    //Update Row
    const updateRow = (editedRow, oldData) =>
        new Promise((resolve, reject) => {
            const dataUpdate = [...payItemAdvanceParameterDetailsList];
            const index = oldData.id ?? oldData.tableData.id;
            dataUpdate[index] = editedRow;

            oldData.id
                ? setPayItemAdvanceParameterDetailsList([
                    ...payItemAdvanceParameterDetailsList.filter(
                        (c) => c.id !== editedRow.id
                    ),
                    editedRow,
                ])
                : setPayItemAdvanceParameterDetailsList([...dataUpdate])
            resolve();
            NotificationManager.success(
                "A record was successfully updated",
                "Success"
            );
        });

    //Delete Row
    const deleteRow = (oldData) =>
        new Promise((resolve, reject) => {
            const dataDelete = [...payItemAdvanceParameterDetailsList];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            setPayItemAdvanceParameterDetailsList([...dataDelete]);
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
                title=" "
                columns={columnsDataTable}
                data={payItemAdvanceParameterDetailsList}
                editable={{
                    onRowAdd: (newRow) => addRow(newRow),
                    onRowUpdate: (editedRow, oldData) => updateRow(editedRow, oldData),
                    onRowDelete: (deletedRow) => deleteRow(deletedRow),
                }}

                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
            />
        </>
    );
};

export default PayItemAdvanceParameterDetailsList;
