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
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import {connect, useSelector} from "react-redux";
import payrollLoanTypeService from "../../api/payrollLoanTypeServices/payrollLoanTypeService";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import handlePageSize from "../../common/tablePageSize";

const PayrollLoanTypeList = ({
                                 fetchPayrollLoanTypeFunc,
                                 payrollLoanTypeList,
                                 loanTypeData,
                                 isLoading,
                             }) => {
    const [loanType, setLoanType] = useState("");

    //Table Columns
    const [columns, setColumns] = useState([]);

    const payroll = useSelector((state) => state.payrollTaxDetails);

    useEffect(() => {
        NotificationManager.listNotify.forEach((n) => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
    }, []);

    //Table Columns
    useEffect(() => {
        const selectedLoanType = loanTypeData.find((p) => p.value === loanType) ?? {};
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
                title: "Loan Type Code",
                field: "loanType",
                editable: "onAdd",
                editComponent: (props) => {
                    let x = loanTypeData.find((b) => b.label === props.value)?.value;
                    x && setLoanType(x);
                    return (
                        <FormSelect
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setLoanType(e.target.value);
                            }}
                            value={x ?? props.value}
                        >
                            <option>Select</option>
                            {loanTypeData.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
            {
                title: "Loan Name",
                field: "loanName",
                editable: "never",
                emptyValue: selectedLoanType?.loanName ?? "",
            },
            {
                title: "Active Status",
                field: "activeStatus",
                type: "boolean",
                editable: "never",
                emptyValue: selectedLoanType?.activeStatus === undefined ? "" : selectedLoanType?.activeStatus ? "Active" : "Inactive",
            },
            {
                title: "Assign for Payroll",
                field: "active",
                type: "boolean",
                editable: "onUpdate",
            },
            {
                title: "Assigned Date",
                field: "assignedDate",
                //type: "date",
                editable: "never",
            },
        ]);
    }, [loanTypeData, loanType]);

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
            let payrollLoanType = {
                loanTypeId: loanType,
                payrollDefinitionId: payroll.id,
                active: true,
                assignedDate: new Date(),
            };

            if (isExists(newRow)) {
                reject();
                return;
            }

            payrollLoanTypeService().create(payrollLoanType)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );

                    //Reload list
                    fetchPayrollLoanTypeFunc();
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.statusCode === 409) {
                        NotificationManager.error(error.message, "Error");
                    }

                    if (
                        error.status === RESP_STATUS_CODES.FORBIDDEN ||
                        error.status === RESP_STATUS_CODES.UNAUTHORIZED
                    ) {
                        NotificationManager.error(
                            NOTIFICATION_ERROR.AUTH_FAILED,
                            error.statusText
                        );
                    }

                    reject();
                });
        });

    //Update Row
    const updateRow = (editedRow, prevRow) =>
        new Promise((resolve, reject) => {
            //Obj update
            let payrollLoanType = {
                id: editedRow.id,
                loanTypeId: loanTypeData.find((b) => b.label === editedRow.loanType)?.value,
                payrollDefinitionId: payroll.id,
                active: editedRow.active,
                assignedDate: new Date(),
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            // if (prevRow.active && !editedRow.active && payroll.isProcessed) {
            //   NotificationManager.error("This record was already used", "Error");
            //   reject();
            //   return;
            // }

            payrollLoanTypeService().update(payrollLoanType, editedRow.id)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );

                    //Reload list
                    fetchPayrollLoanTypeFunc();
                    resolve();

                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    if (
                        error.status === RESP_STATUS_CODES.FORBIDDEN ||
                        error.status === RESP_STATUS_CODES.UNAUTHORIZED
                    ) {
                        NotificationManager.error(
                            NOTIFICATION_ERROR.AUTH_FAILED,
                            error.statusText
                        );
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
            let payrollLoanType = {
                id: deletedRow.id,
            };

            // if (payroll.isProcessed) {
            //   NotificationManager.error("This record was already used", "Error");
            //   reject();
            //   return;
            // }

            await payrollLoanTypeService().deletePayrollLoanType(payrollLoanType)
                .then((response) => {
                    //Reload list
                    fetchPayrollLoanTypeFunc();
                    resolve();
                    NotificationManager.success(
                        "A record was successfully deleted.",
                        "Success"
                    );
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    if (
                        error.status === RESP_STATUS_CODES.FORBIDDEN ||
                        error.status === RESP_STATUS_CODES.UNAUTHORIZED
                    ) {
                        NotificationManager.error(
                            NOTIFICATION_ERROR.AUTH_FAILED,
                            error.statusText
                        );
                    } else {
                        NotificationManager.error(
                            "An existing record already found",
                            "Error"
                        );
                    }
                });
        });

    const isExists = (row) => {
        const x = loanTypeData.find((b) => b.value === row.loanType)?.label;

        const existLoanTypes = payrollLoanTypeList.find((detail) => detail.loanType === x);

        if (existLoanTypes) {
            NotificationManager.error("This Loan Type was already used", "Error");
            return true;
        }

        return false;
    };

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title={""}
                columns={columns}
                data={payrollLoanTypeList}
                editable={{
                    onRowAdd: (newRow) => addRow(newRow),
                    onRowUpdate: (editedRow, prevRow) => updateRow(editedRow, prevRow),
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
                onRowsPerPageChange={(pageSize) =>
                    handlePageSize(pageSize, window.location.pathname)
                }
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
})(PayrollLoanTypeList);
