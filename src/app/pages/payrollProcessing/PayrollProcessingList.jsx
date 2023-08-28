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
import localStorageService from "../../services/localStorageService";
import handlePageSize from "../../common/tablePageSize";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import PayrollProcessingFailedModal from "./PayrollProcessingFailedModal";
import PayrollProcessingEmployeeModal from "./PayrollProcessingEmployeeModal";
import PayrollNegativeSalaryModal from "./PayrollNegativeSalaryModal";
import {payrollPeriodProcess, payrollProcessStatus} from "./constant";
import PayrollTakeHomeModal from "./PayrollTakeHomeModal";

const PayrollProcessingList = ({
                                   processPeriod, 
                                   periodStatus,
                                   tableData,
                                   isLoading,
                                   saveDetails, 
                                   rollbackDetails,
                                   processData,
                                   empDataList,
                                   failedProcess, negativeSalaryProcess,
                                   showProcessingModal, takeHomeProcess,
                                   setShowProcessingModal,
                                   disableRollback,
                                   disableProcess, 
                                   setDisableProcess,
                                   setShowNegativeSalaryModal, setShowTakeHomeModal,
                                   showNegativeSalaryModal, showTakeHomeModal
                               }) => {
    const [columns, setColumns] = useState([]);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [employee, setEmployee] = useState();

    useEffect(() => {
        window.scrollTo(0, 0);
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
                title: "Organization",
                field: "organization",
                hidden: true,
            },
            {
                title: "Designation",
                field: "designation",
                hidden: true,
            },
            {
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
                title: "processCount",
                field: "processCount",
                hidden: true,
            },
            {
                title: "successCount",
                field: "successCount",
                hidden: true,
            },
            {
                title: "failedCount",
                field: "failedCount",
                hidden: true,
            },
            {
                title: "payrollProcessEmployee",
                field: "payrollProcessEmployee",
                hidden: true,
            },
            {
                title: "payrollProcessEmployeeResults",
                field: "payrollProcessEmployeeResults",
                hidden: true,
            },
            {
                title: "isActive",
                field: "isActive",
                hidden: true,
            },
            {
                title: "isProcessedInactive",
                field: "isProcessedInactive",
                hidden: true,
            },
            {
                title: "Employee Id",
                field: "empNo",
            },
            {
                title: "Name",
                field: "empName",
            },
            {
                title: "Status",
                field: "status",
            },
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

    function clickRow(e, rowData) {
        setEmployee(rowData);
        setShowEmployeeModal(true);
    }

    function handleSelection(rowData) {
        if (rowData.find(emp => emp.isProcessedInactive) || periodStatus.value === payrollPeriodProcess.FINALIZED) {
            setDisableProcess(true);
        } else {
            setDisableProcess(false);
        }
    }

    return (
        <>
            {showEmployeeModal && (
                <PayrollProcessingEmployeeModal
                    show={showEmployeeModal}
                    setShow={setShowEmployeeModal}
                    employee={employee}
                    processData={processData}
                    periodProcess={processPeriod}
                />
            )}
            {showProcessingModal && (
                <PayrollProcessingFailedModal
                    show={showProcessingModal}
                    setShow={setShowProcessingModal}
                    failedProcess={failedProcess}
                    empDataList={empDataList}
                />
            )}
            {showNegativeSalaryModal && (
                <PayrollNegativeSalaryModal
                    show={showNegativeSalaryModal}
                    negativeSalaryProcess={negativeSalaryProcess}
                    setShow={setShowNegativeSalaryModal} 
                />
            )}
            {showTakeHomeModal && (
                <PayrollTakeHomeModal
                    show={showTakeHomeModal}
                    takeHomeProcess={takeHomeProcess}
                    setShow={setShowTakeHomeModal}
                />
            )}
            <div className="row mb-2 gap-5">
                <div className="col">
                    <span><strong>Total Employees: </strong>{tableData.length}</span>
                    &nbsp;&nbsp;
                    {tableData.length > 0 && <span><strong>Process Count: </strong>{tableData[0]?.processCount}</span>}
                    &nbsp;&nbsp;
                    {tableData.length > 0 &&
                        <span><strong>Success Count: </strong>{tableData[0]?.successCount}</span>}
                    &nbsp;&nbsp;
                    <span><strong style={{color: "red"}}>Errors and Warnings Count: </strong>{failedProcess?.length}</span>
                </div>
            </div>
            <MaterialTable
                icons={tableIcons}
                title={""}
                columns={columns}
                data={tableData}
                isLoading={isLoading}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    selection: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false,
                    rowStyle: rowData => ({
                        backgroundColor: rowData.isProcessedInactive ? "#ffbdbd" : (rowData.payrollProcessEmployee?.deductionExceedsId || rowData.status === Object.keys(payrollProcessStatus)[3]) && "#fce9c4"
                    }),
                    selectionProps: (rowData) => ({
                        color: "primary",
                    }),
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                onRowClick={(e, rowData) => clickRow(e, rowData)}
                onSelectionChange={(rowData) => handleSelection(rowData)}
                actions={[
                    {
                        icon: forwardRef((props, ref) => <SettingsBackupRestoreIcon {...props} ref={ref}/>),
                        tooltip: 'Rollback',
                        disabled: disableRollback,
                        onClick: (event, rowData) => rollbackDetails(rowData)
                    },
                    {
                        icon: forwardRef((props, ref) => <PlayCircleIcon {...props} ref={ref}/>),
                        tooltip: 'Process',
                        disabled: disableProcess,
                        onClick: (event, rowData) => saveDetails(rowData)
                    },
                ]}
            />
        </>
    );
};

export default PayrollProcessingList;
