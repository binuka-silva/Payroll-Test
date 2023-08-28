import React, {forwardRef, useEffect, useState} from "react";

import MaterialTable, {MTableToolbar} from "@material-table/core";

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
import {Save, Search} from "@material-ui/icons";
import {connect, useSelector} from "react-redux";
import localStorageService from "../../../../services/localStorageService";
import {FormCheck, FormSelect} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import {omit} from "lodash";
import employeeService from "../../../../api/payrollProcessServices/employeeService";
import handlePageSize from "../../../../common/tablePageSize";

const BankDetailList = ({
                            fetchEmpDataFunc,
                            employeeList,
                            setEmployeeBankDetails,
                            bankData,
                            branchData,
                            employeeId,
                        }) => {
    //Table Columns
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [bank, setBank] = useState("");
    const [isPercentage, setPercentage] = useState(false);
    const [branch, setBranch] = useState("");
    const [employeeBankId, setEmployeeBankId] = useState("");
    const [isLoading, setLoading] = useState(false);

    const payrollDetail = useSelector((state) => state.payrollTaxDetails);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
        fetchTableData();
    }, []);

    const fetchTableData = () => {
        setLoading(true);
        employeeService().getBankDetails(payrollDetail.id, employeeId).then(({data: resData}) => {
            setPercentage(resData.isPercentage);
            setEmployeeBankId(resData.id);
            const employeeBankDetails = resData.employeeBankDetails?.map(detail => {
                detail.bankDetailId = detail.id;
                delete detail.id;
                return {
                    ...detail,
                    bankId: bankData.find(b => b.value === detail.bankId)?.label,
                    branchId: branchData.find(b => b.value === detail.branchId)?.label
                }
            });
            setData(employeeBankDetails);
            setEmployeeBankDetails(employeeBankDetails ?? []);
            setLoading(false);
        }).catch((e) => console.error(e));
    }

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
                title: "bankDetailId",
                field: "bankDetailId",
                hidden: true,
            },
            {
                title: "Sequence",
                field: "sequence",
                type: "numeric",
                validate: (rowData) =>
                    rowData.sequence === undefined
                        ? {isValid: false, helperText: "Sequence is required"}
                        : rowData.sequence === ""
                            ? {isValid: false, helperText: "Sequence is required"}
                            : rowData.sequence <= 0
                                ? {isValid: false, helperText: "Sequence must be greater than 0"}
                                : true,
            },
            {
                title: "Bank",
                field: "bankId",
                editComponent: (props) => {
                    let x = bankData.find((b) => b.label === props.value)?.value;
                    x && setBank(x);
                    return (
                        <FormSelect
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setBank(e.target.value);
                            }}
                            value={x ?? props.value}
                        >
                            <option>Select</option>
                            {bankData.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
            {
                title: "Branch",
                field: "branchId",
                editComponent: (props) => {
                    let x = branchData.find((b) => b.label === props.value)?.value;
                    const branchBank = branchData.filter(
                        (branch) => branch.bank === bank
                    );
                    x && setBranch(x);
                    return (
                        <FormSelect
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setBranch(e.target.value);
                            }}
                            value={x ?? props.value}
                        >
                            <option>Select</option>
                            {branchBank.map((branch) => (
                                <option key={branch.value} value={branch.value}>
                                    {branch.label}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
            {
                title: "Active",
                field: "isActive",
                type: "boolean",
            },
            {
                title: "Account Number",
                field: "accountNumber",
                type: "numeric",
                validate: (rowData) =>
                    rowData.accountNumber === undefined
                        ? {isValid: false, helperText: "Account Number is required"}
                        : rowData.accountNumber === ""
                            ? {isValid: false, helperText: "Account Number is required"}
                            : rowData.accountNumber <= 0
                                ? {isValid: false, helperText: "Account Number must be greater than 0"}
                                : true,
            },
            {
                title: "Value",
                field: "value",
                validate: (rowData) =>
                    rowData.value === undefined
                        ? {isValid: false, helperText: "Value is required"}
                        : rowData.value === ""
                            ? {isValid: false, helperText: "Value is required"}
                            : rowData.value < 0
                                ? {isValid: false, helperText: "Value must be greater than 0"}
                                : isPercentage && rowData.value > 100
                                    ? {isValid: false, helperText: "Value must be less than than 100"}
                                    : true,
            },
            {
                title: "Valid From",
                field: "validFrom",
                type: "date",
                dateSetting: {
                    locale: "pa-LK",
                },
                validate: (rowData) =>
                    rowData.validFrom === undefined
                        ? {isValid: false, helperText: "Date is required"}
                        : rowData.validFrom === ""
                            ? {isValid: false, helperText: "Date is required"}
                            : true,
            },
            {
                title: "Valid To",
                field: "validTo",
                dateSetting: {
                    locale: "pa-LK",
                },
                type: "date",
                validate: (rowData) =>
                    rowData.validTo === undefined
                        ? {isValid: false, helperText: "Date is required"}
                        : rowData.validTo === ""
                            ? {isValid: false, helperText: "Date is required"}
                            : true,
            },
            {
                title: "Modified Date",
                field: "modifiedDateTime",
                type: "date",
                dateSetting: {
                    locale: "pa-LK",
                },
                editable: "never"
            },
        ]);
    }, [bankData, branchData, bank, isPercentage]);

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

    const addRow = (addedRow) => new Promise((resolve, reject) => {
        try {
            if (new Date(addedRow.validFrom) > new Date(addedRow.validTo)) {
                NotificationManager.error(
                    "Invalid Date Range",
                    "Error"
                );
                return reject();
            }
            const seq = data?.find(d => d.sequence === addedRow.sequence);

            if (seq) {
                NotificationManager.error(
                    "Duplicate Sequence",
                    "Error"
                );
                return reject();
            }

            addedRow.bankId = bankData.find(b => b.value === addedRow.bankId)?.label;
            addedRow.branchId = branchData.find(b => b.value === addedRow.branchId)?.label;
            isPercentage && (addedRow.percentage = true);
            data ? setData([...data, addedRow]) : setData([addedRow]);
            resolve();
        } catch (e) {
            console.error(e);
        }
    });

    const updateRow = (editedRow, prevData) => new Promise((resolve, reject) => {
        const seq = data.filter(d => d.id !== editedRow.id).find(d => d.sequence === editedRow.sequence);
        if (seq) {
            NotificationManager.error(
                "Duplicate Sequence",
                "Error"
            );
            return reject();
        }

        editedRow.bankId = bankData.find(b => b.value === bank)?.label;
        editedRow.branchId = branchData.find(b => b.value === branch)?.label;
        isPercentage && (editedRow.percentage = true);
        const dataUpdate = [...data];
        const index = prevData.tableData.id;
        dataUpdate[index] = editedRow;
        setData([...dataUpdate]);
        resolve();
    });

    const deleteRow = (deletedRow) => new Promise((resolve, reject) => {
        const dataDelete = [...data];
        const index = deletedRow.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
    });

    const saveDetails = async () => {
        try {
            if (isPercentage) {
                const valueCount = data.map(d => d.value).reduce((previousValue, currentValue) => parseInt(previousValue) + parseInt(currentValue), 0);
                if (valueCount !== 100) {
                    return NotificationManager.error(
                        "Invalid Percentage Values",
                        "Error"
                    );
                }
            }

            const employeeBank = {
                id: employeeBankId,
                isPercentage,
                employeeBankDetails: data.map(d => omit(d, ["tableData"])).map(em => {
                    em.id = em.bankDetailId;
                    delete em.bankDetailId;
                    return {
                        ...em,
                        bankId: bankData.find(b => b.label === em.bankId)?.value,
                        branchId: branchData.find(b => b.label === em.branchId)?.value
                    }
                })
            }

            await employeeService().updateBankDetails(payrollDetail.id, employeeId, employeeBank);
            setEmployeeBankDetails(employeeBank.employeeBankDetails);
            return NotificationManager.success(
                "Bank Details Successfully Updated",
                "Updated"
            );
        } catch (e) {
            console.error(e);
            return NotificationManager.error(
                "Error Saving Bank Account",
                "Error"
            );
        }
    }

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title="Bank Details"
                columns={columns}
                data={data}
                editable={{
                    onRowAdd: (addedRow) => addRow(addedRow),
                    onRowUpdate: (editedRow, prevData) => updateRow(editedRow, prevData),
                    onRowDelete: (deletedRow) => deleteRow(deletedRow)
                }}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[`${window.location.pathname}#M1`] ?? 5,
                    emptyRowsWhenPaging: false,
                }}
                isLoading={isLoading}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, `${window.location.pathname}#M1`)}
                actions={[
                    {
                        icon: forwardRef((props, ref) => <Save {...props} ref={ref}/>),
                        tooltip: 'Save',
                        isFreeAction: true,
                        onClick: (event, rowData) => saveDetails()
                    }
                ]}
                components={{
                    Toolbar: props => (
                        <div>
                            <MTableToolbar {...props} />
                            <div className="d-flex flex-row">
                                <FormCheck
                                    style={{marginLeft: "15px"}}
                                    onChange={(e) => setPercentage(e.target.checked)}
                                    label="Is Percentage"
                                    defaultChecked={isPercentage}
                                    type="switch"
                                />
                            </div>
                        </div>
                    )
                }}
            />
        </>
    );
};


const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    // setPayrollTaxDetails,
})(BankDetailList);