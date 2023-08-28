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
import history from "../../../@history";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import moment from "moment";

import employeesToPayItemsService from "../../api/employeesToPayItemsServices/employeesToPayItemsServices";
import employeesToPayItemsServices from "../../api/employeesToPayItemsServices/employeesToPayItemsServices";
import localStorageService from "../../services/localStorageService";
import handlePageSize from "../../common/tablePageSize";
import {payrollPeriodProcess} from "./constant";

const EmployeesToPayItemsList = ({
                                     fetchEmployeesToPayItemsFunc,
                                     setEmployeesToPayItemsList,
                                     employeesToPayItemsList,
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
                                     sPeriods,
                                     ePeriods,
                                     closePeriodsData,
                                     employee,
                                     setEmployee,
                                     employeeInDropdown,
                                     setEmployeeInDropdown,
                                 }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    //Table Columns
    const [columns, setColumns] = useState([]);
    const [deleteData, setDeleteData] = useState([]);

    //const payroll = useSelector((state) => state.payrollTaxDetails);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
    }, []);

    //Table Columns
    useEffect(() => {
        const selectedEmployee = employeeData.find((p) => p.value === employee) ?? {};
        let x = startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.startDate;


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
                    let x = employeeData.find((b) => b.label === props.value)?.value;
                    x && setEmployee(x);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={employeeData}
                            onChange={(e, selected) => {
                                props.onChange(selected?.value);
                                setEmployee(selected?.value);
                                setEmployeeInDropdown(selected);
                            }}
                            label="Select"
                            defaultValue={employeeInDropdown}
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
                    const filteredEDate = endDateData.filter((p) => moment(new Date(p.label)).format("YYYY-MM-DD") >= moment(new Date(props.rowData.startDate ? props.rowData.startDate : sPeriods ? sPeriods : x)).format("YYYY-MM-DD"));
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
        employeesToPayItemsList,
        employeeData,
        employee,
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

    //Add Row
    const addRow = (newRow) =>
        new Promise((resolve, reject) => {
            let x = startDateData?.find((v) => v.periodNo !== (payrollPeriodProcess.CLOSE))?.startDate;
            let y = startDateData?.find((v) => v.periodNo !== (payrollPeriodProcess.CLOSE))?.endDate;

            //Obj Create
            let employeesToPayItems = {
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

            setEmployeeInDropdown("");
            setEmployee("");
            employeesToPayItemsService()
                .create([employeesToPayItems])
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );

                    //Reload list
                    fetchEmployeesToPayItemsFunc(payroll);
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
        });

    const onSave = () =>
        new Promise((resolve, reject) => {
            history.push("/payroll-assign-pay-items");
        });

    const isExists = (row) => {
        const x = employeeData.find((b) => b.value === row.employee)?.label;
        const existEmployees = employeesToPayItemsList.find((detail) => detail.employee === x);

        if (existEmployees) {
            NotificationManager.error("This Employee was already assigned", "Error");
            return true;
        }
        return false;
    };

    //Update Row
    const updateRow = (editedRow, prevRow) =>
        new Promise((resolve, reject) => {
            let updateEmployee = employeeData?.find((v) => v.label === editedRow.employee)?.value;

            //Obj update
            let employeesToPayItems = {
                id: editedRow.id,
                employeeId: updateEmployee,
                payrollPayItemId: payItem,
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

            setEmployeeInDropdown("");
            setEmployee("");
            employeesToPayItemsService()
                .update(employeesToPayItems, editedRow.id)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );

                    //Reload list
                    fetchEmployeesToPayItemsFunc(payroll);
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
        });

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create
            const employeesToPayItemsList = deletedRow.map((deletelist) => deletelist.id);

            if (employeesToPayItemsList?.length == 0) {
                reject();
                return;
            }

            setEmployeeInDropdown("");
            setEmployee("");
            await employeesToPayItemsService()
                .deleteEmployeesToPayItems(employeesToPayItemsList)
                .then((response) => {
                    //Reload list
                    fetchEmployeesToPayItemsFunc(payroll);
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

    const fetchTableData = (query) => {
        const tableData = employeesToPayItemsServices()
            .getAllByPagination(
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var mappedData = data.employeesToPayItem.map(item => ({
                    id: item.id,
                    employee: item.employee.empNo,
                    empName: item.employee.employeeName,
                    amount: item.amount,
                    units: item.units,
                    startDate: item.startDate,
                    endDate: item.endDate,
                }));
                return ({
                    data: mappedData,
                    page: query.page,
                    totalCount: data.dbSize
                })
            });
        return tableData;
    }

    return (
        <>
            {moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods?.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods?.split(" ")[0]).format("YYYY-MM-DD") ? (
                <>
                    <MaterialTable
                        icons={tableIcons}
                        title=""
                        columns={columns}
                        data={employeesToPayItemsList}
                        // data={(query) => fetchTableData(query)}
                        editable={
                            {
                                // onRowAdd: (newRow) => addRow(newRow),
                                // onRowUpdate: (editedRow) => updateRow(editedRow),
                                // onRowDelete: (deletedRow) => deleteRow([deletedRow]),
                            }
                        }
                        options={{
                            toolbar: payItem === "" || moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods?.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods?.split(" ")[0]).format("YYYY-MM-DD") ? false : true,
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
                </>
            ) : (
                <>
                    <MaterialTable
                        icons={tableIcons}
                        title=""
                        columns={columns}
                        data={employeesToPayItemsList}
                        // data={(query) => fetchTableData(query)}
                        editable={{
                            onRowAdd: (newRow) => addRow(newRow),
                            onRowUpdate: (editedRow) => updateRow(editedRow),
                            onRowDelete: (deletedRow) => deleteRow([deletedRow]),
                        }}
                        options={{
                            toolbar: payItem === "" || moment(closePeriodsData?.find((v) => v.dateFrom === moment(prossPeriods?.split(" ")[0]).format("YYYY-MM-DD"))?.dateFrom).format("YYYY-MM-DD") === moment(prossPeriods?.split(" ")[0]).format("YYYY-MM-DD") ? false : true,
                            addRowPosition: "first",
                            actionsColumnIndex: -1,
                            filtering: true,
                            pageSizeOptions: [5, 10, 20, 50, 100],
                            pageSize:
                                JSON.parse(
                                    localStorageService.getItem("auth_user")?.tablePageCount
                                )?.[window.location.pathname] ?? 5,
                            //emptyRowsWhenPaging: false,
                            selection: true,
                            selectionProps: (rowData) => ({
                                color: "primary",
                            }),
                            rowStyle: (rowData, index) => ({
                                background: newlyAddedEmployeeList.includes(rowData.employee)
                                    ? "rgba(199,185,213,0.9)"
                                    : "#FFF",
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
})(EmployeesToPayItemsList);
