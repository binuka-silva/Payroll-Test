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
import history from "../../../@history";
import payrollPayItemService from "../../api/payrollPayItemServices/payrollPayItemService";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import handlePageSize from "../../common/tablePageSize";

const PayrollPayItemList = ({
                                fetchPayrollPayItemDataFunc,
                                fetchPayrollPayItemFunc,
                                payrollPayItemList,
                                payItemData,
                                isLoading,
                                setPayrollTaxDetails,
                            }) => {
    const [payItem, setPayItem] = useState("");

    //Table Columns
    const [columns, setColumns] = useState([]);

    const payroll = useSelector((state) => state.payrollTaxDetails);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
    }, []);

    //Table Columns
    useEffect(() => {
        const selectedPayItem = payItemData.find(p => p.value === payItem) ?? {}
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
                title: "Pay Item Code",
                field: "payItem",
                editable: "onAdd",
                editComponent: (props) => {
                    let x = payItemData.find((b) => b.label === props.value)?.value;
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
                            {payItemData.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
            {
                title: "Pay Item Name",
                field: "payItemName",
                editable: "never",
                emptyValue: selectedPayItem?.payItemName ?? ""
            },
            {
                title: "Pay Item Type",
                field: "payItemType",
                editable: "never",
                emptyValue: selectedPayItem?.payItemType ?? ""
            },
            {
                title: "Pay Item Period",
                field: "payItemPeriod",
                editable: "never",
                emptyValue: selectedPayItem?.payItemPeriod ?? ""
            },
            {
                title: "Payment Type",
                field: "paymentType",
                editable: "never",
                emptyValue: selectedPayItem?.paymentType ?? ""
            },
            {
                title: "Active Status",
                field: "activeStatus",
                type: "boolean",
                editable: "never",
                emptyValue: selectedPayItem?.activeStatus === undefined ? "" : selectedPayItem?.activeStatus ? "Active" : "Inactive"
            },
            {
                title: "Assign for Payroll",
                field: "active",
                type: "boolean",
                editable: "onUpdate",
            },
            {
                title: "Default PayItem",
                field: "isDefaultPayItem",
                type: "boolean",
            },
            {
                title: "Assigned Date",
                field: "assignedDate",
                //type: "date",
                editable: "never",
            },
        ]);
    }, [payItemData, payItem]);

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
            let payrollPayItem = {
                PayItemId: payItem,
                payrollDefinitionId: payroll.id,
                active: true,
                isDefaultPayItem: newRow.isDefaultPayItem,
                assignedDate: new Date(),
            };

            if (isExists(newRow)) {
                reject();
                return;
            }

            payrollPayItemService()
                .create(payrollPayItem)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );

                    //Reload list
                    // const res = await payrollProcessService().findOne(payroll.id);
                    // setPayrollTaxDetails(res.data);
                    // res && fetchPayrollPayItemDataFunc();
                    fetchPayrollPayItemFunc();
                    resolve();

                    // onSave();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.statusCode === 409) {
                        NotificationManager.error(error.message, "Error");
                    }

                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                        NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
                    }

                    reject();
                });
        });

    const onSave = () =>
        new Promise((resolve, reject) => {
            history.push("/payroll");
        });

    //Update Row
    const updateRow = (editedRow, prevRow) =>
        new Promise((resolve, reject) => {
            //Obj update
            let payrollPayItem = {
                id: editedRow.id,
                PayItemId: payItemData.find((b) => b.label === editedRow.payItem)
                    ?.value,
                payrollDefinitionId: payroll.id,
                active: editedRow.active,
                isDefaultPayItem: editedRow.isDefaultPayItem,
                assignedDate: new Date(),
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            if (prevRow.active && !editedRow.active && payroll.isProcessed) {
                NotificationManager.error("This record was already used", "Error");
                reject();
                return;
            }

            payrollPayItemService()
                .update(payrollPayItem, editedRow.id)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );

                    //Reload list
                    // const res = await payrollProcessService().findOne(payroll.id);
                    // setPayrollTaxDetails(res.data);
                    // res && fetchPayrollPayItemDataFunc();
                    fetchPayrollPayItemFunc();
                    resolve();

                    //onSave();
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
            let payrollPayItem = {
                id: deletedRow.id,
            };

            if (payroll.isProcessed) {
                NotificationManager.error("This record was already used", "Error");
                reject();
                return;
            }

            await payrollPayItemService()
                .deletePayrollPayItem(payrollPayItem)
                .then((response) => {
                    //Reload list
                    fetchPayrollPayItemFunc();
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

    const isExists = (row) => {
        const x = payItemData.find((b) => b.value === row.payItem)?.label;

        const existPayItems = payrollPayItemList.find(
            (detail) => detail.payItem === x
        );

        if (existPayItems) {
            NotificationManager.error("This pay item was already used", "Error");
            return true;
        }

        return false;
    };

    const isProcessed = (row) => {
        // const x = payroll.payrollPayItems.find((b) => b.id === row.id)?.id;
        // const y = payroll.payrollProcessList.find((detail) => detail.id === x)?.id;
        // const z = payroll.payrollProcessList.find((detail) => detail.id === y)?.isProcessed;
        // if (z !== false) {
        //   NotificationManager.error("This pay item was already used", "Error");
        //   return true;
        // }
        // return false;
    };

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title={""
                    // <Button
                    //   aria-label="add"
                    //   size="medium"
                    //   onClick={() => history.push("/pay-items")}
                    // >
                    //   <ArrowBackIcon fontSize="medium" />
                    //   Pay Items
                    // </Button>
                }
                columns={columns}
                data={payrollPayItemList}
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
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
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
})(PayrollPayItemList);
