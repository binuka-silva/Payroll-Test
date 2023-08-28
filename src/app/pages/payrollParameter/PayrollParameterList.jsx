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
import {Search} from "@material-ui/icons";
import {NotificationManager} from "react-notifications";
import {FormSelect} from "react-bootstrap";

import payrollParameterService from "../../api/payrollParameterServices/payrollParameterService";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import handlePageSize from "../../common/tablePageSize";

const PayrollParameterList = ({
                                  fetchPayrollParameterDataFunc,
                                  payrollParameterList,
                                  dataTypeData,
                                  setDataTypeData,
                                  payrollParameters,
                                  isLoading
                              }) => {

    const [dataType, setDataType] = useState("");
    const [value, setValue] = useState("");
    let [type, setType] = useState("");

    //Table Columns
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

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
                title: "Parameter Code",
                field: "code",
                validate: (rowData) =>
                    rowData.code === undefined
                        ? {isValid: false, helperText: "Code is required"}
                        : rowData.code === ""
                            ? {isValid: false, helperText: "Code is required"}
                            : true,
                editable: "onAdd",
            },
            {
                title: "Parameter Name",
                field: "name",
                validate: (rowData) =>
                    rowData.name === undefined
                        ? {isValid: false, helperText: "Name is required"}
                        : rowData.name === ""
                            ? {isValid: false, helperText: "Name is required"}
                            : true,
                editable: "onAdd",
            },
            {
                title: "Data Type",
                field: "dataType",
                editComponent: (props) => {
                    let x = dataTypeData.find((b) => b.label === props.value)?.value;
                    x && setDataType(x);
                    return (
                        <FormSelect
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setDataType(e.target.value);
                            }}
                            value={x ?? props.value}
                            disabled={props.value === "3" ? (props.rowData.value !== undefined && props.rowData.value !== "Select" && props.rowData.value !== "")
                                : props.value === undefined ? false :
                                    (props.rowData.value !== "") && (props.rowData.value !== undefined)}
                        >
                            <option>Select</option>
                            {dataTypeData.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
            {
                title: "Value",
                field: "value",
                filtering: false,
                editComponent: (props) => {
                    let boolean = [
                        {value: "Yes", label: "Yes"},
                        {value: "No", label: "No"},
                    ];
                    const x = boolean.find((b) => b.label === props.value)?.value;
                    x && setValue(x);
                    return props.rowData.dataType === "3" ? (
                        <FormSelect
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setValue(e.target.value);
                            }}
                            value={x ?? props.value}
                        >
                            <option>Select</option>
                            {boolean.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </FormSelect>
                    ) : props.rowData.dataType === "4" ? (
                        <input
                            className="form-control"
                            type="date"
                            value={props.value ?? ""}
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setValue(e.target.value);
                            }}
                        ></input>
                    ) : props.rowData.dataType === "1" ? (
                        <input
                            className="form-control"
                            type="number"
                            value={props.value ?? 0}
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setValue(e.target.value);
                            }}
                        ></input>
                    ) : (
                        <input
                            className="form-control"
                            type="text"
                            value={props.value ?? ""}
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setValue(e.target.value);
                            }}
                        />
                    );
                },
            },
        ]);
    }, [dataTypeData]);

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
            //Obj Create
            let payrollParameter = {
                code: newRow.code,
                name: newRow.name,
                //payrollDefinitionId: payrollParameters.id,
                dataType: dataType,
                value: newRow.value ?? "",
                payrollDefinitionId: payrollParameters.id,
            };

            payrollParameterService()
                .create(payrollParameter)
                .then((response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    fetchPayrollParameterDataFunc();
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                        NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
                    } else {
                        NotificationManager.error(
                            "An existing record already found",
                            "Error"
                        );
                    }
                    reject();
                });
        });

    //Update Row
    const updateRow = (editedRow) =>
        new Promise((resolve, reject) => {
            //Obj update
            let payrollParameter = {
                code: editedRow.code,
                name: editedRow.name,
                payrollDefinitionId: payrollParameters.id,
                dataType: dataType,
                value: editedRow.value ?? "",
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            payrollParameterService()
                .update(payrollParameter, editedRow.id)
                .then((response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );
                    //Reload list
                    fetchPayrollParameterDataFunc();
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                        NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
                    } else {
                        NotificationManager.error(
                            "An existing record already found",
                            "Error"
                        );
                    }
                });
        });

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create
            let payrollParameter = {
                id: deletedRow.id,
            };

            await payrollParameterService()
                .deletePayrollParameter(payrollParameter)
                .then((response) => {
                    //Reload list
                    fetchPayrollParameterDataFunc();
                    resolve();
                    NotificationManager.success(
                        "A record was successfully deleted.",
                        "Success"
                    );
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                        NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
                    } else {
                        NotificationManager.error(
                            "An existing record already found",
                            "Error"
                        );
                    }
                });
        });

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={columns}
                data={payrollParameterList}
                editable={{
                    onRowAdd: (newRow) => addRow(newRow),
                    onRowUpdate: (editedRow) => updateRow(editedRow),
                    onRowDelete: (deletedRow) => deleteRow(deletedRow),
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
                isLoading={isLoading}
            />
        </>
    );
};

export default PayrollParameterList;
