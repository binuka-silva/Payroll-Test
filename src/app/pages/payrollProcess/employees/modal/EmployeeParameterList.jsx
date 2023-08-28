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
import {FormSelect} from "react-bootstrap";
import localStorageService from "../../../../services/localStorageService";
import employeeParameterService from "../../../../api/payrollProcessServices/EmployeeParameterService";
import {useSelector} from "react-redux";
import {NotificationManager} from "react-notifications";
import handlePageSize from "../../../../common/tablePageSize";

const EmployeeParameterList = ({
                                   employeeId
                               }) => {
    const [dataTypeData, setDataTypeData] = useState([]);
    const [dataType, setDataType] = useState("");
    const [value, setValue] = useState("");
    const [isLoading, setLoading] = useState(false);

    const [tableData, setTableData] = useState([]);
    //Table Columns
    const [columns, setColumns] = useState([]);

    const payrollDetail = useSelector((state) => state.payrollTaxDetails);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
        setLoading(true);
        fetchDataTypeData();
        fetchEmployeeParameters();
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
                title: "hasParameterValues",
                field: "hasParameterValues",
                hidden: true,
                type: "boolean"
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
                title: "Payroll Specific",
                field: "isPayrollSpecific",
                type: "boolean",
                editable: "onAdd"
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
                            disabled={props.value === "3" ? (props.rowData.value !== undefined && props.rowData.value !== "Select" && props.rowData.value !== "")
                                : props.value === undefined ? false :
                                    (props.rowData.hasParameterValues) || ((props.rowData.value !== "") && (props.rowData.value !== undefined))}
                            value={x ?? props.value}
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
                //type: type,
                editComponent: (props) => {
                    let boolean = [
                        {value: "Yes", label: "Yes"},
                        {value: "No", label: "No"},
                    ];
                    let x = boolean.find((b) => b.label === props.value)?.value;
                    x && setValue(x);
                    return props.rowData.dataType === "3" || props.rowData.dataType === "Boolean" ? (
                        <FormSelect
                            onChange={(e) => {
                                props.onChange(e.target.value === "Select" ? "" : e.target.value);
                                console.log(e.target.value, e.target.value === "Select")
                                setValue(e.target.value === "Select" ? "" : e.target.value);
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
                    ) : props.rowData.dataType === "4" || props.rowData.dataType === "Date" ? (
                        <input
                            className="form-control"
                            type="date"
                            value={props.value ?? ""}
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setValue(e.target.value);
                            }}
                        ></input>
                    ) : props.rowData.dataType === "1" || props.rowData.dataType === "Numeric" ? (
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
                }
            },
        ]);
    }, [dataTypeData]);

    useEffect(() => {
        setLoading(true);
        dataTypeData.length !== 0 && fetchEmployeeParameters();
    }, [dataTypeData]);

    function fetchDataTypeData() {
        employeeParameterService()
            .getAllEmployeeParameterDataTypes()
            .then((response) => {
                let dataTypeDataArray = [];
                response.data.forEach((item) => {
                    dataTypeDataArray.push({value: item.id, label: item.name});
                });
                setDataTypeData(dataTypeDataArray);
            });
    }

    const fetchEmployeeParameters = async () => {
        setLoading(true);
        const {data: employeeParameters} = await employeeParameterService().getAll(payrollDetail.id);
        setTableData(employeeParameters.map(para => ({
            id: para.id,
            code: para.code,
            isPayrollSpecific: para.isPayrollSpecific,
            name: para.name,
            hasParameterValues: para.employeeEmployeeParameters.length !== 0,
            dataType: dataTypeData?.find((v) => v.value === parseInt(para.dataType))?.label,
            value: para.employeeEmployeeParameters?.find(p => p.employeeId === employeeId)?.value ?? ""
        })));
        employeeParameters && setLoading(false);
    }

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
        new Promise(async (resolve, reject) => {
            try {
                const parameterObj = {
                    code: newRow.code,
                    name: newRow.name,
                    dataType: newRow.dataType,
                    value: newRow.value ?? "",
                    isPayrollSpecific: newRow.isPayrollSpecific,
                    payrollDefinitionId: payrollDetail.id,
                    employeeId
                }

                await employeeParameterService().create(parameterObj);
                resolve();
                NotificationManager.success(
                    "Record created Successfully",
                    "Created"
                );
                await fetchEmployeeParameters();
            } catch (e) {
                console.error(e);
                NotificationManager.error(
                    "Failed to create",
                    "Error"
                );
                reject();
            }
        });

    //Update Row
    const updateRow = (editedRow) =>
        new Promise(async (resolve, reject) => {
            try {
                const parameterObj = {
                    code: editedRow.code,
                    name: editedRow.name,
                    dataType,
                    value: editedRow.value ?? "",
                    isPayrollSpecific: editedRow.isPayrollSpecific,
                    payrollDefinitionId: payrollDetail.id,
                    employeeId
                }

                await employeeParameterService().update(parameterObj, editedRow.id);
                resolve();
                NotificationManager.success(
                    "Record Updated Successfully",
                    "Updated"
                );
                await fetchEmployeeParameters();
            } catch (e) {
                console.error(e);
                NotificationManager.error(
                    "Failed to update",
                    "Error"
                );
                reject();
            }
        });

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise(async (resolve, reject) => {
            try {
                await employeeParameterService().deleteEmployeeParameter(deletedRow.id);
                resolve();
                NotificationManager.success(
                    "Record Updated Successfully",
                    "Updated"
                );
                await fetchEmployeeParameters();
            } catch (e) {
                console.error(e);
                NotificationManager.error(
                    "Failed to Delete",
                    "Error"
                );
                reject();
            }
        });

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title="Parameters"
                columns={columns}
                data={tableData}
                editable={{
                    onRowAdd: (newRow) => addRow(newRow),
                    onRowUpdate: (editedRow) => updateRow(editedRow),
                    onRowDelete: (deletedRow) => deleteRow(deletedRow),
                }}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[`${window.location.pathname}#M2`] ?? 5,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    emptyRowsWhenPaging: false,
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, `${window.location.pathname}#M2`)}
                isLoading={isLoading}
            />
        </>
    );
};

export default EmployeeParameterList;
