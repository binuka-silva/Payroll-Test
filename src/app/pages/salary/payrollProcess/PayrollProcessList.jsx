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
import history from "../../../../@history";
import {connect} from "react-redux";
import {omit} from "lodash";
import {setPayrollTaxDetails} from "../../../redux/actions/PayrollTaxDetailsActions";

import payRollPeriodService from "app/api/payRollPeriodServices/payRollPeriodService";
import employeeTemplateService from "app/api/employeeTemplateServices/employeeTemplateService";
import payrollProcessService from "../../../api/payrollProcessServices/payrollProcessService";
import payItemService from "app/api/payItemServices/payItemService";
import localStorageService from "../../../services/localStorageService";
import handlePageSize from "../../../common/tablePageSize";


const PayrollProcessEmployeesToPayItemsList = ({
                                                   fetchPayrollProcessDataFunc,
                                                   payrollProcessList,
                                                   setPayrollTaxDetails,
                                                   setPayrollCompanyAccountsDetails,
                                                   isLoading,
                                                   setLoading,
                                               }) => {
    const [payrollPeriodData, setPayrollPeriodData] = useState([]);
    const [employeeTemplateData, setEmployeeTemplateData] = useState([]);

    const [payRollPeriod, setPayRollPeriod] = useState("");
    const [employeeTemplate, setEmployeeTemplate] = useState("");

    const [payItemData, setPayItemData] = useState([]);

    const [rowData, setRowData] = useState({});
    const [editModal, setEditModal] = useState(false);

    //Table Columns
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        setLoading(true);
        window.scrollTo(0, 0);
        fetchPayrollPeriodData();
        fetchEmployeeTemplateData();
        fetchPayItemData();
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
                title: "Payroll Code",
                field: "code",
                validate: (rowData) =>
                    rowData.code === undefined
                        ? {
                            isValid: false,
                            helperText: "Code is required",
                        }
                        : rowData.code === ""
                            ? {
                                isValid: false,
                                helperText: "Code is required",
                            }
                            : true,
            },
            {
                title: "Payroll Name",
                field: "name",
                validate: (rowData) =>
                    rowData.name === undefined
                        ? {
                            isValid: false,
                            helperText: "Name is required",
                        }
                        : rowData.name === ""
                            ? {
                                isValid: false,
                                helperText: "Name is required",
                            }
                            : true,
            },
            {
                title: "Employee Template",
                field: "employeeTemplate",
                editComponent: (props) => {
                    let x = employeeTemplateData.find(
                        (b) => b.label === props.value
                    )?.value;
                    x && setEmployeeTemplate(x);

                    return (
                        <FormSelect
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setEmployeeTemplate(e.target.value);
                            }}
                            value={x ?? props.value}
                        >
                            <option>Select</option>
                            {employeeTemplateData.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
            {
                title: "Payroll Period",
                field: "payRollPeriod",
                editComponent: (props) => {
                    let x = payrollPeriodData.find((b) => b.label === props.value)?.value;
                    x && setPayRollPeriod(x);

                    return (
                        <FormSelect
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setPayRollPeriod(e.target.value);
                            }}
                            value={x ?? props.value}
                        >
                            <option>Select</option>
                            {payrollPeriodData.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
        ]);
    }, [payrollPeriodData, employeeTemplateData, payRollPeriod]);

    //Load data
    async function fetchPayrollPeriodData() {
        payRollPeriodService()
            .getAll()
            .then(async (response) => {
                let payrollPeriodDataArray = [];
                response.data.forEach((item) => {
                    payrollPeriodDataArray.push({
                        value: item.id,
                        label: item.periodName,
                        periodYear: item.periodYear.split(" ")[0],
                        period: item.period,
                    });
                });
                setPayrollPeriodData(payrollPeriodDataArray);
            });
    }

    //Load data
    async function fetchEmployeeTemplateData() {
        employeeTemplateService()
            .getAllEmployeeTemplates()
            .then(async (response) => {
                let employeeTemplateDataArray = [];
                response.data.forEach((item) => {
                    employeeTemplateDataArray.push({
                        value: item.id,
                        code: item.code,
                        label: item.name,
                    });
                });
                setEmployeeTemplateData(employeeTemplateDataArray);
            });
    }

    //Load data
    function fetchPayItemData() {
        payItemService()
            .getAll()
            .then((response) => {
                let payItemDataArray = [];
                response.data.forEach((item) => {
                    payItemDataArray.push({
                        value: item.id,
                        label: item.name,
                        code: item.code,
                        payItemName: item.name,
                        payItemType: item.payItemType.type,
                        payItemPeriod: item.payItemPeriod.name,
                        paymentType: item.paymentType.type,
                        activeStatus: item.active,
                    });
                });
                setPayItemData(payItemDataArray);
            });
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
        new Promise((resolve, reject) => {
            //Obj Create
            let payrollProcess = {
                code: newRow.code,
                name: newRow.name,
                cutOffDate: newRow.cutOffDate,
                employeeTemplateId: employeeTemplate,
                payRollPeriodId: payRollPeriod,
                isProcessed: false,
            };

            if (isExists(newRow)) {
                reject();
                return;
            }

            payrollProcessService()
                .create(payrollProcess)
                .then((response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    fetchPayrollProcessDataFunc();
                    resolve();
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
        const x = payrollPeriodData.find(
            (b) => b.value === row.payRollPeriod
        )?.label;
        const y = employeeTemplateData.find(
            (b) => b.value === row.employeeTemplate
        )?.label;
        const existPeriods = payrollProcessList.find(
            (detail) => detail.payRollPeriod === x
        );
        const existTemplates = payrollProcessList.find(
            (detail) => detail.employeeTemplate === y
        );

        if (existPeriods) {
            NotificationManager.error(
                "This payroll period was already used",
                "Error"
            );
            return true;
        }
        if (existTemplates) {
            NotificationManager.error(
                "This employee template was already used",
                "Error"
            );
            return true;
        }
        return false;
    };

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise((resolve, reject) => {
            //Obj Create
            let payrollProcess = {
                id: deletedRow.id,
            };
            payrollProcessService()
                .deletePayrollProcess(payrollProcess)
                .then((response) => {
                    //Reload list
                    fetchPayrollProcessDataFunc();
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

    const clickRow = (e, rowData) =>
        new Promise(async (resolve, reject) => {
            const {data} = await payrollProcessService().findOne(rowData.id);
            setPayrollTaxDetails({
                ...omit(data, ["tableData"]),
                employeeTemplateList: employeeTemplateData,
                payrollPeriodList: payrollPeriodData,
                payrollProcessList,
                payItemData,
            });
            history.push("/payroll-employees-to-pay-items");
        });

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={columns}
                data={payrollProcessList}
                editable={
                    {
                        //onRowAdd: (newRow) => addRow(newRow),
                        // onRowUpdate: (editedRow) => updateRow(editedRow),
                        //onRowDelete: (deletedRow) => deleteRow(deletedRow),
                    }
                }
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false,
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                onRowClick={(e, rowData) => clickRow(e, rowData)}
                isLoading={isLoading}
            />
        </>
    );
};

const mapStateToProps = (state) => ({setPayrollTaxDetails: state.setPayrollTaxDetails,});

export default connect(mapStateToProps, {setPayrollTaxDetails,})(PayrollProcessEmployeesToPayItemsList);
