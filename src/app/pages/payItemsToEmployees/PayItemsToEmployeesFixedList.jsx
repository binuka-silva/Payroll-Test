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
import moment from "moment";

import employeesToPayItemsService from "../../api/employeesToPayItemsServices/employeesToPayItemsServices";
import localStorageService from "../../services/localStorageService";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import handlePageSize from "../../common/tablePageSize";
import {payrollPeriodProcess} from "./constant";

const PayItemsToEmployeesFixedList = ({
                                          fetchPayItemsToEmployeesFunc,
                                          payItemsData,
                                          employee,
                                          employees,
                                          isLoading,
                                          setLoading,
                                          setPayrollTaxDetails,
                                          payroll,
                                          fixed,
                                          variable,
                                          startDateData,
                                          endDateData,
                                          prossPeriods,
                                          sPeriods,
                                          ePeriods,
                                          closePeriodsData
                                      }) => {
    const [payItem, setPayItem] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    //Table Columns
    const [fixedColumns, setFixedColumns] = useState([]);
    const [variableColumns, setVariableColumns] = useState([]);
    const [deleteData, setDeleteData] = useState([]);
    const [filteredEndDateData, setFilteredEndDateData] = useState([]);

    //const payroll = useSelector((state) => state.payrollTaxDetails);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
    }, []);

    //Table Columns
    useEffect(() => {

        const selectedPayItem = payItemsData.find((p) => p.value === payItem) ?? {};
        let x = startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate;

        setFixedColumns([
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
                title: "PayItem Id",
                field: "payItem",
                //editable: "onAdd",
                editComponent: (props) => {

                    let fixedItems = payItemsData.filter((v) => (v.payItemPeriod === "Fixed"));
                    let filteredItems = fixedItems?.filter((v) => v.label !== (fixed?.find((p) => (p.payItem === v.label))?.payItem))

                    let x = payItemsData.find((b) => b.label === props.value);
                    x && setPayItem(x.value);

                    return (
                        <AutoCompleteDropDown
                            dropDownData={filteredItems}
                            label="Search"
                            defaultValue={x ?? props.value}
                            onChange={(e, selected) => {
                                props.onChange(selected);
                                setPayItem(selected?.value);
                            }}
                            sx={{
                                // width: 200,
                                "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
                                    top: "calc(50% - 17px)",
                                },
                                "& .MuiButtonBase-root, & .MuiIconButton-root": {
                                    padding: "4px",
                                },
                                "& .MuiAutocomplete-input, & .MuiInputLabel-root": {
                                    fontSize: 15,
                                },
                            }}
                            size={"small"}
                        />
                    );
                },
            },
            {
                title: "PayItem Name",
                field: "payItemName",
                editable: "never",
                emptyValue: selectedPayItem?.name ?? "",
            },
            {
                title: "Amount",
                field: "amount",
                type: "numeric",
            },
            {
                title: "Units",
                field: "units",
                type: "numeric",
            },
            {
                title: "Start Date",
                field: "startDate",
                type: "date",
                editComponent: (props) => {
                    let y = startDateData?.find((v) => v.periodNo !== (payrollPeriodProcess.CLOSE))?.startDate;

                    return (
                        <AutoCompleteDropDown
                            dropDownData={startDateData}
                            label="Search"
                            defaultValue={props.value ? props.value : sPeriods ? sPeriods : y}
                            onChange={(e, selected) => {
                                props.onChange(selected?.label);
                            }}
                            sx={{
                                // width: 200,
                                "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
                                    top: "calc(50% - 17px)",
                                },
                                "& .MuiButtonBase-root, & .MuiIconButton-root": {
                                    padding: "4px",
                                },
                                "& .MuiAutocomplete-input, & .MuiInputLabel-root": {
                                    fontSize: 15,
                                },
                            }}
                            size={"small"}
                        />
                    );
                },
            },
            {
                title: "End Date",
                field: "endDate",
                type: "date",
                editComponent: (props) => {
                    const filteredEDate = endDateData.filter((p) => moment(new Date(p.label)).format("YYYY-MM-DD") >= moment(new Date(props.rowData.startDate ? props.rowData.startDate : (sPeriods ? sPeriods : x))).format("YYYY-MM-DD"));

                    let y = startDateData?.find((v) => v.periodNo !== (payrollPeriodProcess.CLOSE))?.endDate;

                    return (
                        <AutoCompleteDropDown
                            dropDownData={filteredEDate}
                            label="Search"
                            defaultValue={props.value ? props.value : ePeriods ? ePeriods : y}
                            onChange={(e, selected) => {
                                props.onChange(selected?.label);
                            }}
                            sx={{
                                // width: 200,
                                "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
                                    top: "calc(50% - 17px)",
                                },
                                "& .MuiButtonBase-root, & .MuiIconButton-root": {
                                    padding: "4px",
                                },
                                "& .MuiAutocomplete-input, & .MuiInputLabel-root": {
                                    fontSize: 15,
                                },
                            }}
                            size={"small"}
                        />
                    );
                },
            },
        ]);
    }, [
        payItemsData,
        payItem,
        fixed,
        variable,
        startDateData,
        endDateData,
    ]);

    //Table Columns
    useEffect(() => {

        const selectedPayItem = payItemsData.find((p) => p.value === payItem) ?? {};
        let x = startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate;

        setVariableColumns([
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
                title: "PayItem Id",
                field: "payItem",
                editable: "onAdd",
                editComponent: (props) => {
                    let variableItems = payItemsData.filter((v) => v.payItemPeriod === "Variable");
                    let filteredItems = variableItems?.filter((v) => v.label !== (variable?.find((p) => (p.payItem === v.label))?.payItem))

                    let x = payItemsData.find((b) => b.label === props.value);
                    x && setPayItem(x.value);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={filteredItems}
                            label="Search"
                            defaultValue={x ?? props.value}
                            onChange={(e, selected) => {
                                props.onChange(selected);
                                setPayItem(selected?.value);
                            }}
                            sx={{
                                // width: 200,
                                "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
                                    top: "calc(50% - 17px)",
                                },
                                "& .MuiButtonBase-root, & .MuiIconButton-root": {
                                    padding: "4px",
                                },
                                "& .MuiAutocomplete-input, & .MuiInputLabel-root": {
                                    fontSize: 15,
                                },
                            }}
                            size={"small"}
                        />
                    );
                },
            },
            {
                title: "PayItem Name",
                field: "payItemName",
                editable: "never",
                emptyValue: selectedPayItem?.name ?? "",
            },
            {
                title: "Amount",
                field: "amount",
                type: "numeric",
            },
            {
                title: "Units",
                field: "units",
                type: "numeric",
            },
            {
                title: "Start Date",
                field: "startDate",
                type: "date",
                editComponent: (props) => {
                    let y = startDateData?.find((v) => v.periodNo !== (payrollPeriodProcess.CLOSE))?.startDate;

                    return (
                        <AutoCompleteDropDown
                            dropDownData={startDateData}
                            label="Search"
                            defaultValue={props.value ? props.value : sPeriods ? sPeriods : y}
                            onChange={(e, selected) => {
                                props.onChange(selected?.label);
                            }}
                            sx={{
                                // width: 200,
                                "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
                                    top: "calc(50% - 17px)",
                                },
                                "& .MuiButtonBase-root, & .MuiIconButton-root": {
                                    padding: "4px",
                                },
                                "& .MuiAutocomplete-input, & .MuiInputLabel-root": {
                                    fontSize: 15,
                                },
                            }}
                            size={"small"}
                        />
                    );
                },
            },
            {
                title: "End Date",
                field: "endDate",
                type: "date",
                editComponent: (props) => {
                    const filteredEDate = endDateData.filter((p) => moment(new Date(p.label)).format("YYYY-MM-DD") >= moment(new Date(props.rowData.startDate ? props.rowData.startDate : (sPeriods ? sPeriods : x))).format("YYYY-MM-DD"));

                    let y = startDateData?.find((v) => v.periodNo !== (payrollPeriodProcess.CLOSE))?.endDate;

                    return (
                        <AutoCompleteDropDown
                            dropDownData={filteredEDate}
                            label="Search"
                            defaultValue={props.value ? props.value : ePeriods ? ePeriods : y}
                            onChange={(e, selected) => {
                                props.onChange(selected?.label);
                            }}
                            sx={{
                                // width: 200,
                                "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
                                    top: "calc(50% - 17px)",
                                },
                                "& .MuiButtonBase-root, & .MuiIconButton-root": {
                                    padding: "4px",
                                },
                                "& .MuiAutocomplete-input, & .MuiInputLabel-root": {
                                    fontSize: 15,
                                },
                            }}
                            size={"small"}
                        />
                    );
                },
            },
        ]);
    }, [
        payItemsData,
        payItem,
        fixed,
        variable,
        startDateData,
        endDateData,
    ]);

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

    //Add Fixed Row
    const addRow = (newRow) =>
        new Promise((resolve, reject) => {
            let x = startDateData?.find((v) => v.periodNo !== (payrollPeriodProcess.CLOSE))?.startDate;
            let y = startDateData?.find((v) => v.periodNo !== (payrollPeriodProcess.CLOSE))?.endDate;

            //Obj Create
            let payItemsToEmployees = {
                employeeId: employee,
                payrollPayItemId: payItem,
                payrollDefinitionId: payroll.id,
                amount: newRow.amount ?? null,
                units: newRow.units ?? null,
                employerAmount: newRow.employerAmount ?? null,
                startDate: newRow.startDate ? newRow.startDate : sPeriods ? sPeriods : x,
                endDate: newRow.endDate ? newRow.endDate : ePeriods ? ePeriods : y,
            };

            if (isExists(newRow)) {
                reject();
                return;
            }

            employeesToPayItemsService()
                .create([payItemsToEmployees])
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );

                    //Reload list
                    fetchPayItemsToEmployeesFunc(payroll);
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
        });

    const isExists = (row) => {
        const x = payItemsData.find((b) => b.value === row.payItem.value)?.code;
        const existFixedPayItems = fixed.find((detail) => detail.payItem === x);
        const existVariablePayItems = variable.find((detail) => detail.payItem === x);

        if (existFixedPayItems) {
            NotificationManager.error("This Pay Item was already assigned", "Error");
            return true;
        }
        if (existVariablePayItems) {
            NotificationManager.error("This Pay Item was already assigned", "Error");
            return true;
        }
        return false;
    };

    //Update Row
    const updateRow = (editedRow, prevRow) =>
        new Promise((resolve, reject) => {

            let updatePayItem = payItemsData?.find((v) => v.code === editedRow.payItem)?.value;

            //Obj update
            let payItemsToEmployees = {
                id: editedRow.id,
                employeeId: employee,
                payrollPayItemId: updatePayItem,
                payrollDefinitionId: payroll.id,
                amount: editedRow.amount ?? null,
                units: editedRow.units ?? null,
                employerAmount: editedRow.employerAmount ?? null,
                startDate: editedRow.startDate,
                endDate: editedRow.endDate,
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            employeesToPayItemsService()
                .update(payItemsToEmployees, editedRow.id)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );

                    //Reload list
                    fetchPayItemsToEmployeesFunc(payroll);
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    NotificationManager.error(
                        "An existing record already found",
                        "Error"
                    );
                });
        });

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create

            const payItemsToEmloyeesList = deletedRow.map(
                (deletelist) => deletelist.id
            );

            if (payItemsToEmloyeesList?.length == 0) {
                reject();
                return;
            }

            await employeesToPayItemsService()
                .deleteEmployeesToPayItems(payItemsToEmloyeesList)
                .then((response) => {
                    //Reload list
                    fetchPayItemsToEmployeesFunc(payroll);
                    resolve();
                    NotificationManager.success(
                        "A record was successfully deleted.",
                        "Success"
                    );
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    NotificationManager.error("This record was already used", "Error");
                });
        });

    return (
        <>
            {moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods?.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods?.split(" ")[0]).format("YYYY-MM-DD") ? (
                <>
                    <div className="row">
                        <MaterialTable
                            icons={tableIcons}
                            title="Constant Items"
                            columns={fixedColumns}
                            data={fixed}
                            editable={
                                {
                                    // onRowAdd: (newRow) => addRow(newRow),
                                    // onRowUpdate: (editedRow) => updateRow(editedRow),
                                    // onRowDelete: (deletedRow) => deleteRow([deletedRow]),
                                }
                            }
                            options={{
                                toolbar: employees === "" || moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD") ? false : true,
                                addRowPosition: "first",
                                actionsColumnIndex: -1,
                                filtering: true,
                                pageSizeOptions: [5, 10, 20, 50, 100],
                                pageSize:
                                    JSON.parse(
                                        localStorageService.getItem("auth_user")?.tablePageCount
                                    )?.[window.location.pathname] ?? 5,
                                emptyRowsWhenPaging: false,
                                //selection: true,
                                selectionProps: (rowData) => ({
                                    color: "primary",
                                }),
                            }}
                            onRowsPerPageChange={(pageSize) =>
                                handlePageSize(pageSize, window.location.pathname)
                            }
                            actions={[
                                // {
                                //   icon: forwardRef((props, ref) => (
                                //     <Delete {...props} ref={ref} />
                                //   )),
                                //   tooltip: "Delete all selected rows",
                                //   onClick: (evt, data) => deleteRow(data),
                                // },
                            ]}
                            isLoading={isLoading}
                        />
                    </div>
                    <br></br>
                    <br></br>
                    <div className="row mt-4">
                        <MaterialTable
                            icons={tableIcons}
                            title="Variable Items"
                            columns={variableColumns}
                            data={variable}
                            editable={
                                {
                                    // onRowAdd: (newRow) => addRow(newRow),
                                    // onRowUpdate: (editedRow) => updateRow(editedRow),
                                    // onRowDelete: (deletedRow) => deleteRow([deletedRow]),
                                }
                            }
                            options={{
                                toolbar: employees === "" || moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD") ? false : true,
                                addRowPosition: "first",
                                actionsColumnIndex: -1,
                                filtering: true,
                                pageSizeOptions: [5, 10, 20, 50, 100],
                                pageSize:
                                    JSON.parse(
                                        localStorageService.getItem("auth_user")?.tablePageCount
                                    )?.[window.location.pathname] ?? 5,
                                emptyRowsWhenPaging: false,
                                //selection: true,
                                selectionProps: (rowData) => ({
                                    color: "primary",
                                }),
                            }}
                            onRowsPerPageChange={(pageSize) =>
                                handlePageSize(pageSize, window.location.pathname)
                            }
                            actions={[
                                // {
                                //   icon: forwardRef((props, ref) => (
                                //     <Delete {...props} ref={ref} />
                                //   )),
                                //   tooltip: "Delete all selected rows",
                                //   onClick: (evt, data) => deleteRow(data),
                                // },
                            ]}
                            isLoading={isLoading}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className="row">
                        <MaterialTable
                            icons={tableIcons}
                            title="Constant Items"
                            columns={fixedColumns}
                            data={fixed}
                            editable={{
                                onRowAdd: (newRow) => addRow(newRow),
                                onRowUpdate: (editedRow) => updateRow(editedRow),
                                onRowDelete: (deletedRow) => deleteRow([deletedRow]),
                            }}
                            options={{
                                toolbar: employees === "" || moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD") ? false : true,
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
                            }}
                            onRowsPerPageChange={(pageSize) =>
                                handlePageSize(pageSize, window.location.pathname)
                            }
                            actions={[
                                {
                                    icon: forwardRef((props, ref) => (
                                        <Delete {...props} ref={ref}/>
                                    )),
                                    tooltip: "Delete all selected rows",
                                    onClick: (evt, data) => deleteRow(data),
                                },
                            ]}
                            isLoading={isLoading}
                        />
                    </div>
                    <br></br>
                    <br></br>
                    <div className="row mt-4">
                        <MaterialTable
                            icons={tableIcons}
                            title="Variable Items"
                            columns={variableColumns}
                            data={variable}
                            editable={{
                                onRowAdd: (newRow) => addRow(newRow),
                                onRowUpdate: (editedRow) => updateRow(editedRow),
                                onRowDelete: (deletedRow) => deleteRow([deletedRow]),
                            }}
                            options={{
                                toolbar: employees === "" || moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods.split(" ")[0]).format("YYYY-MM-DD") ? false : true,
                                addRowPosition: "first",
                                actionsColumnIndex: -1,
                                filtering: true,
                                pageSizeOptions: [5, 10, 20, 50, 100],
                                pageSize:
                                    JSON.parse(
                                        localStorageService.getItem("auth_user")?.tablePageCount
                                    )?.[`${window.location.pathname}#1`] ?? 5,
                                emptyRowsWhenPaging: false,
                                selection: true,
                                selectionProps: (rowData) => ({
                                    color: "primary",
                                }),
                            }}
                            onRowsPerPageChange={(pageSize) =>
                                handlePageSize(pageSize, `${window.location.pathname}#1`)
                            }
                            actions={[
                                {
                                    icon: forwardRef((props, ref) => (
                                        <Delete {...props} ref={ref}/>
                                    )),
                                    tooltip: "Delete all selected rows",
                                    onClick: (evt, data) => deleteRow(data),
                                },
                            ]}
                            isLoading={isLoading}
                        />
                    </div>
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
})(PayItemsToEmployeesFixedList);
