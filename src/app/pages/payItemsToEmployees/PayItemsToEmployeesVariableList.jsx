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
import {FormSelect} from "react-bootstrap";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import {connect} from "react-redux";
import PayItemsToEmployeesService from "../../api/PayItemsToEmployeesServices/PayItemsToEmployeesService";
import localStorageService from "../../services/localStorageService";
import handlePageSize from "../../common/tablePageSize";

const PayItemsToEmployeesVariableList = ({
                                             fetchPayItemsToEmployeesDataFunc,
                                             fetchPayItemsToEmployeesFunc,
                                             payItemsToEmployees,
                                             setPayItemsToEmployeesList,
                                             payItemsToEmployeesList,
                                             employeeData,
                                             payItemsData,
                                             employee,
                                             dateFromPeriod,
                                             dateToPeriod,
                                             isLoading,
                                             setLoading,
                                             setPayrollTaxDetails,
                                             payroll,
                                             newlyAddedEmployeeList,
                                         }) => {
    const [payItem, setPayItem] = useState("");

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
        const selectedPayItem = payItemsData.find((p) => p.value === payItem) ?? {};
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
                title: "PayItem Id",
                field: "payItem",
                editable: "onAdd",
                editComponent: (props) => {
                    let x = payItemsData.find((b) => b.label === props.value)?.value;
                    x && setPayItem(x);
                    return (
                        <FormSelect
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setPayItem(e.target.value);
                            }}
                            value={x ?? props.value}
                        >
                            <option>Select</option>
                            {payItemsData.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.code}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
            {
                title: "PayItem Name",
                field: "payItemName",
                editable: "never",
                emptyValue: selectedPayItem?.label ?? "",
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
                //editable: "onUpdate",
            },
            {
                title: "End Date",
                field: "endDate",
                type: "date",
                // editable: "onUpdate",
            },
        ]);
    }, [payItemsToEmployeesList, payItemsData, payItem]);

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
            let payItemsToEmployees = {
                employeeId: employee,
                payrollPayItemId: payItem,
                payrollDefinitionId: payroll.id,
                amount: newRow.amount ?? null,
                units: newRow.units ?? null,
                startDate: newRow.startDate ? newRow.startDate : dateFromPeriod,
                endDate: newRow.endDate ? newRow.endDate : dateToPeriod,
            };

            // if (isExists(newRow)) {
            //   reject();
            //   return;
            // }

            PayItemsToEmployeesService()
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

    // const isExists = (row) => {
    //   const x = employeeData.find((b) => b.value === row.employee)?.label;
    //   const existEmployees = employeesToPayItemsList.find(
    //     (detail) => detail.employee === x
    //   );

    //   if (existEmployees) {
    //     NotificationManager.error("This Employee was already assigned", "Error");
    //     return true;
    //   }
    //   return false;
    // };

    //Update Row
    const updateRow = (editedRow, prevRow) =>
        new Promise((resolve, reject) => {
            // let updateEmployee = employeeData?.find(
            //   (v) => v.label === editedRow.employee
            // )?.value;

            //Obj update
            let payItemsToEmployees = {
                id: editedRow.id,
                employeeId: employee,
                payrollPayItemId: payItem,
                payrollDefinitionId: payroll.id,
                amount: editedRow.amount ?? null,
                units: editedRow.units ?? null,
                startDate: editedRow.startDate,
                endDate: editedRow.endDate,
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            PayItemsToEmployeesService()
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

            await PayItemsToEmployeesService()
                .deletePayItemsToEmployees(payItemsToEmloyeesList)
                .then((response) => {
                    //Reload list
                    fetchPayItemsToEmployeesFunc(payroll);
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

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={columns}
                data={payItemsToEmployeesList}
                editable={{
                    onRowAdd: (newRow) => addRow(newRow),
                    onRowUpdate: (editedRow) => updateRow(editedRow),
                    onRowDelete: (deletedRow) => deleteRow([deletedRow]),
                }}
                options={{
                    toolbar: employee === "" ? false : true,
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[`${window.location.pathname}#2`] ?? 5,
                    emptyRowsWhenPaging: false,
                    selection: true,
                    selectionProps: (rowData) => ({
                        color: "primary",
                    }),
                    // rowStyle: (rowData, index) => ({
                    //   background: newlyAddedEmployeeList.includes(rowData.employee)
                    //     ? "rgba(199,185,213,0.9)"
                    //     : "#FFF",
                    // }),
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, `${window.location.pathname}#2`)}
                actions={[
                    {
                        icon: forwardRef((props, ref) => <Delete {...props} ref={ref}/>),
                        tooltip: "Delete all selected rows",
                        onClick: (evt, data) => deleteRow(data),
                    },
                ]}
                isLoading={isLoading}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(PayItemsToEmployeesVariableList);
