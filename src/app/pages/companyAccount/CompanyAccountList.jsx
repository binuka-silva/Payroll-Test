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

import bankService from "app/api/bankServices/bankService";
import branchService from "app/api/branchServices/branchService";
import companyAccountService from "../../api/companyAccountServices/companyAccountService";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import handlePageSize from "../../common/tablePageSize";
import { tableIconColor, editButtonColor, deleteButtonColor, tableBackgroundColor, tableHeaderBackgroundColor, tableHeaderFontColor, tableHeaderFontFamily, tableHeaderFontSize, tableHeaderFontWeight, tableRowBackgroundColor, tableRowFontColor, tableRowFontFamily, tableRowFontSize, tableRowFontWeight } from "styles/globalStyles/globalStyles";

const CompanyAccountList = ({
                                fetchCompanyAccountDataFunc,
                                fetchCompanyAccountFunc,
                                companyAccountList,
                                categoryData,
                                isLoading,
                                setCategoryData,
                                //payrollCompanyAccounts,
                                setPayrollTaxDetails,
                            }) => {
    const [bankData, setBankData] = useState([]);
    const [branchData, setBranchData] = useState([]);

    const [bank, setBank] = useState("");
    const [branch, setBranch] = useState("");
    const [category, setCategory] = useState("");

    //Table Columns
    const [columns, setColumns] = useState([]);

    const payrollCompanyAccounts = useSelector(
        (state) => state.payrollTaxDetails
    );

    useEffect(() => {
        window.scrollTo(0, 0);
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        fetchBankData();
        fetchBranchData();
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
                title: "Company Acc Code",
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
                title: "Bank",
                field: "bank",
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
                field: "branch",
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
                title: "Account Number",
                field: "accountNumber",
                validate: (rowData) =>
                    rowData.accountNumber === undefined
                        ? {isValid: false, helperText: "Account Number is required"}
                        : rowData.accountNumber === ""
                            ? {isValid: false, helperText: "Account Number is required"}
                            : true,
            },
            {
                title: "Category",
                field: "category",
                editComponent: (props) => {
                    let x = categoryData.find((b) => b.label === props.value)?.value;
                    x && setCategory(x);
                    return (
                        <FormSelect
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setCategory(e.target.value);
                            }}
                            value={x ?? props.value}
                        >
                            <option>Select</option>
                            {categoryData.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
            {
                title: "Active Status",
                field: "active",
                type: "boolean",
                color: "primary",
            },
            {
                title: "Last Edided Date",
                field: "lastEditDate",
                type: "date",
                editable: "never",
            },
        ]);
    }, [bankData, branchData, categoryData, bank]);

    //Load data
    function fetchBankData() {
        bankService()
            .getAll()
            .then((response) => {
                let bankDataArray = [];
                response.data.forEach((item) => {
                    bankDataArray.push({value: item.id, label: item.name});
                });
                setBankData(bankDataArray);
            });
    }

    //Load data
    function fetchBranchData() {
        branchService()
            .getAll()
            .then((response) => {
                let branchDataArray = [];
                response.data.forEach((item) => {
                    branchDataArray.push({
                        value: item.id,
                        label: item.name,
                        bank: item.bank.id,
                    });
                });
                setBranchData(branchDataArray);
            });
    }

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox style={{color:tableIconColor}}  {...props} ref={ref}/>),
        Check: forwardRef((props, ref) => <Check style={{color:tableIconColor}} {...props} ref={ref}/>),
        Clear: forwardRef((props, ref) => <Clear style={{color:tableIconColor}} {...props} ref={ref}/>),
        Delete: forwardRef((props, ref) => <DeleteOutline style={{backgroundColor:deleteButtonColor}} className="iconButton"  {...props} ref={ref}/>),
        DetailPanel: forwardRef((props, ref) => (
            <ChevronRight style={{color:tableIconColor}} {...props} ref={ref}/>
        )),
        Edit: forwardRef((props, ref) => <Edit className="iconButton" style={{backgroundColor:editButtonColor}}  {...props} ref={ref}/>),
        Export: forwardRef((props, ref) => <SaveAlt style={{color:tableIconColor}} {...props} ref={ref}/>),
        Filter: forwardRef((props, ref) => <FilterList style={{color:tableIconColor}} {...props} ref={ref}/>),
        FirstPage: forwardRef((props, ref) => <FirstPage style={{color:tableIconColor}} {...props} ref={ref}/>),
        LastPage: forwardRef((props, ref) => <LastPage style={{color:tableIconColor}} {...props} ref={ref}/>),
        NextPage: forwardRef((props, ref) => <ChevronRight style={{color:tableIconColor}} {...props} ref={ref}/>),
        PreviousPage: forwardRef((props, ref) => (
            <ChevronLeft style={{color:tableIconColor}} {...props} ref={ref}/>
        )),
        ResetSearch: forwardRef((props, ref) => <Clear style={{color:tableIconColor}} {...props} ref={ref}/>),
        Search: forwardRef((props, ref) => <Search style={{color:tableIconColor}} {...props} ref={ref}/>),
        SortArrow: forwardRef((props, ref) => (
            <ArrowDownward style={{color:tableIconColor}} {...props} ref={ref}/>
        )),
        ThirdStateCheck: forwardRef((props, ref) => (
            <Remove  style={{color:tableIconColor}} {...props} ref={ref}/>
        )),
        ViewColumn: forwardRef((props, ref) => <ViewColumn style={{color:tableIconColor}} {...props} ref={ref}/>),
    };

    //Add Row
    const addRow = (newRow) =>
        new Promise((resolve, reject) => {
            //Obj Create
            let companyAccount = {
                code: newRow.code,
                bankId: bank,
                branchId: branch,
                payrollDefinitionId: payrollCompanyAccounts.id,
                accountNumber: newRow.accountNumber,
                category: category,
                active: newRow.active ?? false,
                lastEditDate: new Date(),
            };

            if (isExists(newRow)) {
                reject();
                return;
            }

            companyAccountService()
                .create(companyAccount)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );

                    //Reload list
                    // const res = await payrollProcessService().findOne(
                    //   payrollCompanyAccounts.id
                    // );
                    // setPayrollTaxDetails(res.data);
                    // res && fetchCompanyAccountDataFunc();
                    fetchCompanyAccountFunc();
                    resolve();

                    //onSave();
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
        let x = [];
        if (row.category.length === 1) {
            x = categoryData.find((v) => v.value === parseInt(row.category));
        } else {
            x = categoryData.find((v) => v.label === row.category);
        }
        const exists = companyAccountList
            .filter((v) => v.code !== row.code)
            .find(
                (v) =>
                    v.category === x?.label && v.active === true && row.active === true
            );

        if (exists) {
            NotificationManager.error(
                "Already exist active company account",
                "Error"
            );
            return true;
        }
        return false;
    };

    const onSave = () =>
        new Promise((resolve, reject) => {
            history.push("/payroll");
        });

    //Update Row
    const updateRow = (editedRow) =>
        new Promise((resolve, reject) => {
            //Obj update
            let companyAccount = {
                code: editedRow.code,
                bankId: bank,
                branchId: branch,
                payrollDefinitionId: payrollCompanyAccounts.id,
                accountNumber: editedRow.accountNumber,
                category: category,
                active: editedRow.active ?? false,
                lastEditDate: new Date(),
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            if (isExists(editedRow)) {
                reject();
                return;
            }

            companyAccountService()
                .update(companyAccount, editedRow.id)
                .then((response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );

                    //Reload list
                    // const res = await payrollProcessService().findOne(
                    //   payrollCompanyAccounts.id
                    // );
                    // setPayrollTaxDetails(res.data);
                    // res && fetchCompanyAccountDataFunc();
                    fetchCompanyAccountFunc();
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
            let companyAccount = {
                id: deletedRow.id,
            };
            await companyAccountService()
                .deleteCompanyAccount(companyAccount)
                .then(async (response) => {
                    //Reload list
                    fetchCompanyAccountFunc();
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
        const tableStyle = {
            borderRadius:'2rem',
            textAlign:"center",
            padding:'3rem',
            backgroundColor:tableBackgroundColor
          };
    
    return (
        <>
            <MaterialTable
                            style={tableStyle}

                icons={tableIcons}
                title=""
                columns={columns}
                data={companyAccountList}
                editable={{
                    onRowAdd: (newRow) => addRow(newRow),
                    onRowUpdate: (editedRow) => updateRow(editedRow),
                    //onRowDelete: (deletedRow) => deleteRow(deletedRow),
                }}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false,

                    headerStyle: {
                        fontSize: tableHeaderFontSize,
                        textAlign: "center",
                        justifyContent: "flex-end",
                        backgroundColor: tableHeaderBackgroundColor,
                        color: tableHeaderFontColor,
                        fontWeight: tableHeaderFontWeight,
                        fontFamily:tableHeaderFontFamily,
                    },
                    rowStyle: {

                        fontFamily:tableRowFontFamily,
                        textAlign: "center",
                        justifyContent: "flex-end",
                        color:tableRowFontColor,
                        fontWeight: tableRowFontWeight,
                        fontSize: tableRowFontSize,
                        backgroundColor: tableRowBackgroundColor,
                      
                    },
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
})(CompanyAccountList);
