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
import payrollDeductionsService from "../../api/payrollDeductionsServices/payrollDeductionsService";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import handlePageSize from "../../common/tablePageSize";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";

const PayrollDeductionsList = ({
                                fetchPayrollDeductionFunc,
                                payrollDeductionList,
                                payItemData,
                                payrollPayItemData,
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
        const selectedPayItem = payrollPayItemData.find(p => p.value === payItem) ?? {}
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
          //   {
          //     title: "Pay Item Code",
          //     field: "payItem",
          //     editComponent: (props) => {
          //       let x = payrollPayItemData.find((b) => b.label === props.value)?.value;
          //       x && setPayItem(x);
          //       return (
          //         <FormSelect
          //           onChange={(e) => {
          //             props.onChange(e.target.value);
          //             setPayItem(e.target.value);
          //           }}
          //           value={x ?? props.value}
          //         >
          //           <option>Select</option>
          //           {payrollPayItemData.map((role) => (
          //             <option key={role.value} value={role.value}>
          //               {role.label}
          //             </option>
          //           ))}
          //         </FormSelect>
          //       );
          //     },
          //   },
          {
            title: "Pay Item Code",
            field: "payItem",
            editComponent: (props) => {
              let x = payrollPayItemData.find((b) => b.label === props.value);
              x && setPayItem(x.value);

              return (
                <AutoCompleteDropDown
                  dropDownData={payrollPayItemData}
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
            title: "Pay Item Name",
            field: "payItemName",
            editable: "never",
            emptyValue: selectedPayItem?.payItemName ?? "",
          },
          {
            title: "Sequence",
            field: "sequence",
            validate: (rowData) =>
              rowData.sequence === undefined
                ? { isValid: false, helperText: "Sequence is required" }
                : rowData.sequence === ""
                ? { isValid: false, helperText: "Sequence is required" }
                : isNaN(rowData.sequence)
                ? { isValid: false, helperText: "Sequence must be an number" }
                : payrollDeductionList.find((c) =>c.sequence === parseInt(rowData.sequence) &&c.id !== rowData.id)
                ? { isValid: false, helperText: "Sequence was already used" }
                : true,
          },
        ]);
    }, [payrollPayItemData, payItem,payrollDeductionList]);

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
            let payrollDeduction = {
              PayItemId: payItem,
              payrollDefinitionId: payroll.id, 
              sequence: newRow.sequence, 
            };

            if (isExists(newRow)) {
                reject();
                return;
            }

            payrollDeductionsService().create(payrollDeduction)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    ); 
                    fetchPayrollDeductionFunc();
                    resolve();
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

    //Update Row
    const updateRow = (editedRow, prevRow) =>
        new Promise((resolve, reject) => {
            //Obj update
            let payrollDeduction = {
              id: editedRow.id,
              PayItemId: payrollPayItemData.find((b) => b.label === editedRow.payItem)?.value,
              payrollDefinitionId: payroll.id,
              sequence: editedRow.sequence, 
            };

            // if (payroll.isProcessed) {
            //     NotificationManager.error("This record was already used", "Error");
            //     reject();
            //     return;
            // }

            payrollDeductionsService().update(payrollDeduction, editedRow.id)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );
 
                    fetchPayrollDeductionFunc();
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
            let payrollDeduction = {
                id: deletedRow.id,
            };

            // if (payroll.isProcessed) {
            //     NotificationManager.error("This record was already used", "Error");
            //     reject();
            //     return;
            // }

            await payrollDeductionsService()
                .deletePayrollDeductions(payrollDeduction)
                .then((response) => {
                    //Reload list
                    fetchPayrollDeductionFunc();
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
        const x = payrollPayItemData.find((b) => b.value === row.payItem)?.label; 
        const existPayItems = payrollDeductionList.find((detail) => detail.payItem === x);
        const existSequnces = payrollDeductionList.find((detail) => detail.sequence === parseInt(row.sequence));

        if (existPayItems) {
            NotificationManager.error("This pay item was already used", "Error");
            return true;
        }
        if (existSequnces) {
          NotificationManager.error("This order number was already used.", "Error");
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
                data={payrollDeductionList}
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
})(PayrollDeductionsList);
