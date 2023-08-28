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
import {connect, useSelector} from "react-redux";
import EmployeeModal from "./modal/EmployeeModal";
import {omit} from "lodash";
import employeeService from "../../../api/payrollProcessServices/employeeService";
import localStorageService from "../../../services/localStorageService";
import swal from "sweetalert2";
import {NotificationManager} from "react-notifications";
import bankService from "../../../api/bankServices/bankService";
import branchService from "../../../api/branchServices/branchService";
import handlePageSize from "../../../common/tablePageSize";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import CheckIcon from '@mui/icons-material/Check';

const EmployeeList = ({
                          fetchEmpDataFunc,
                          employeeList,
                          isLoading, setLoading
                      }) => {
    //Table Columns
    const [columns, setColumns] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [employee, setEmployee] = useState({});

    const [bankData, setBankData] = useState([]);
    const [branchData, setBranchData] = useState([]);

    const [activeChangeRows, setActiveChangeRows] = useState([]);

    const payrollDetail = useSelector((state) => state.payrollTaxDetails);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
        fetchBanks();
        fetchBranches();
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
                title: "Payroll Active Change",
                field: "payrollActiveChangeDate",
                hidden: true,
            },
            {
                title: "Organization",
                field: "organization",
                hidden: true,
            }, {
                title: "employeeType",
                field: "employeeType",
                hidden: true,
            },
            {
                title: "employeeCategory",
                field: "employeeCategory",
                hidden: true,
            },
            {
                title: "hasEmployeeBank",
                field: "hasEmployeeBank",
                hidden: true,
            },
            {
                title: "Employee Id",
                field: "empId",
                editable: "never"
            },
            {
                title: "Name",
                field: "name",
                editable: "never"
            },
            {
                title: "Designation",
                field: "designation",
                editable: "never"
            },
            {
                title: "Active",
                field: "isActive",
                editable: "never"
            },
            {
                title: "Bank Payment",
                field: "isBankPayment",
                type: "boolean"
            },
            {
                title: "Payroll Active",
                field: "isPayrollActive",
                type: "boolean"
            },
            {
                title: "Profile Completed",
                field: "isProfileCompleted",
                editable: "never",
                type: "boolean",
            }
        ]);
    }, []);


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

    const updateEmployee = async (row) => {
        try {
            const employeeReq = {
                payrollDefinitionId: payrollDetail.id,
                IsBankPayment: row.isBankPayment ?? false,
                IsPayrollActive: row.isPayrollActive ?? false,
                employeeId: row.id
            }

            await employeeService().update([employeeReq]);
            fetchEmpDataFunc();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
    //Update Row
    const updateRow = (editedRow, prevData) =>
        new Promise(async (resolve, reject) => {
            if (!editedRow.hasEmployeeBank) {
                if ((editedRow.isBankPayment && !prevData.isBankPayment) && (!editedRow.isPayrollActive && prevData.isPayrollActive)) {
                    swal.fire({
                        title: "Are you sure?",
                        text: "Processed Employee will be Change",
                        type: "question",
                        showCancelButton: true,
                        icon: "warning",
                        toast: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                    })
                        .then(async (result) => {
                            if (result.value) {
                                //Obj update
                                const isUpdated = await updateEmployee([editedRow])
                                isUpdated ? resolve() : reject();
                            } else {
                                reject();
                            }
                        });
                } else {
                    if (editedRow.isBankPayment && !prevData.isBankPayment) {
                        swal.fire({
                            title: "Are you sure?",
                            text: "Bank Details is not provided",
                            type: "question",
                            showCancelButton: true,
                            icon: "warning",
                            toast: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes",
                            cancelButtonText: "No",
                        })
                            .then(async (result) => {
                                if (result.value) {
                                    //Obj update
                                    const isUpdated = await updateEmployee(editedRow)
                                    isUpdated ? resolve() : reject();
                                } else {
                                    reject();
                                }
                            });
                    } else {
                        if (!editedRow.isPayrollActive && prevData.isPayrollActive) {
                            swal.fire({
                                title: "Are you sure?",
                                text: "Processed Employee will be change",
                                type: "question",
                                icon: "warning",
                                showCancelButton: true,
                                toast: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes",
                                cancelButtonText: "No",
                            })
                                .then(async (result) => {
                                    if (result.value) {
                                        const isUpdated = await updateEmployee(editedRow)
                                        isUpdated ? resolve() : reject();
                                    } else {
                                        reject();
                                    }
                                });
                        } else {
                            const isUpdated = await updateEmployee(editedRow)
                            isUpdated ? resolve() : reject();
                        }
                    }
                }
            } else {
                const isUpdated = await updateEmployee(editedRow)
                isUpdated ? resolve() : reject();
            }
        });

    const rowClick = (e, row) => {
        setShowModal(true);
        setEmployee(omit(row, ["tableData"]));
    }

    const fetchBanks = () => {
        bankService().getAll().then((response) => {
            let bankDataArray = [];
            response.data.forEach((item) => {
                bankDataArray.push({value: item.id, label: item.name});
            });
            setBankData(bankDataArray);
        });
    }

    const fetchBranches = () => {
        branchService().getAll().then((response) => {
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

    async function payrollActiveChange(rowData, isPayrollActive) {
        try {
            setLoading(true);
            const selectedEmp = rowData.map(row => ({
                payrollDefinitionId: payrollDetail.id,
                isPayrollActive,
                isBankPayment: row.isBankPayment ?? false,
                employeeId: row.id
            }));
            const data = await employeeService().update(selectedEmp);
            data && NotificationManager.success("Update Successful", "Success");
            setActiveChangeRows(rowData);
            fetchEmpDataFunc();
        } catch (e) {
            NotificationManager.error("Update Failed", "Error");
            console.error(e);
        }
    }

    return (
        <>
            <EmployeeModal
                show={showModal}
                setShow={setShowModal}
                employee={employee}
                fetchEmpDataFunc={fetchEmpDataFunc}
                bankData={bankData}
                branchData={branchData}
            />
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={columns}
                data={employeeList}
                editable={{
                    onRowUpdate: (editedRow, prevData) => updateRow(editedRow, prevData),
                }}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    selection: true,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false,
                    rowStyle: (rowData, index) => ({
                        background: activeChangeRows.map(a => a.id).includes(rowData.id) ? "rgba(199,185,213,0.9)" : "#FFF",
                    }),
                    selectionProps: (rowData) => ({
                        color: "primary",
                        disabled: rowData.isProcessedInactive
                    }),
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                onRowClick={(e, row) => rowClick(e, row)}
                isLoading={isLoading}
                actions={[
                    {
                        icon: forwardRef((props, ref) => <SettingsBackupRestoreIcon {...props} ref={ref}/>),
                        tooltip: 'Payroll Inactive',
                        onClick: (event, rowData) => payrollActiveChange(rowData, false)
                    },
                    {
                        icon: forwardRef((props, ref) => <CheckIcon {...props} ref={ref}/>),
                        tooltip: 'Payroll Active',
                        onClick: (event, rowData) => payrollActiveChange(rowData, true)
                    },
                ]}
            />
        </>
    );
};


const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    // setPayrollTaxDetails,
})(EmployeeList);