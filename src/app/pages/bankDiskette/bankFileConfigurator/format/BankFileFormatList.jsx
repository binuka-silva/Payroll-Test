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
import handlePageSize from "../../../../common/tablePageSize";
import localStorageService from "../../../../services/localStorageService";
import bankFileFormatService from "../../../../api/bankDisketteServices/bankFileFormatService";
import {useSelector} from "react-redux";
import {FIELD_TYPES, FILL_DIRECTIONS, FUNCTION_CODES, TRIM_TYPES} from "./constant";
import AddBoxIcon from "@mui/icons-material/AddBox";
import BankFileFormatModal from "./BankFileFormatModal";
import payItemCalculationService from "../../../../api/payItemCalculationServices/payItemCalculationService";
import payrollParameterService from "../../../../api/payrollParameterServices/payrollParameterService";
import payItemGroupService from "../../../../api/payItemGroupServices/payItemGroupService";
import employeeParameterService from "../../../../api/payrollProcessServices/EmployeeParameterService";
import companyAccountService from "../../../../api/companyAccountServices/companyAccountService";

const BankFileFormatList = () => {

    const [tableData, setTableData] = useState([]);
    const [bankFileFormatDetails, setBankFileFormatDetails] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [functionData, setFunctionData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [employeeParameterList, setEmployeeParameterList] = useState(null);
    const [payItemGroupList, setPayItemGroupList] = useState(null);
    const [payrollParameterList, setPayrollParameterList] = useState(null);
    const [companyCategoryList, setCompanyCategoryList] = useState(null);

    const bankFileConfig = useSelector((state) => state.bankFileConfig);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));

        fetchFunctionData();
        fetchModalData();
        fetchBankFileFormatData();
    }, []);

    useEffect(() => {
        if (payItemGroupList && payrollParameterList && employeeParameterList && bankFileFormatDetails && companyCategoryList && functionData) setTableDetails(bankFileFormatDetails);
    }, [payItemGroupList, employeeParameterList, payrollParameterList, bankFileFormatDetails, companyCategoryList, functionData]);

    useEffect(() => {
        setColumns([
            {
                title: "Id",
                field: "id",
                hidden: true,
            },
            {
                title: "formatId",
                field: "formatId",
                hidden: true,
            },
            {
                title: "updateId",
                field: "updateId",
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
                title: "functionCode",
                field: "functionCode",
                hidden: true,
            },
            {
                title: "Sequence",
                field: "sequence",
                type: "numeric",
            },
            {
                title: "Format",
                field: "format",
            },
            {
                title: "Length",
                field: "length",
            },
            {
                title: "Trim",
                field: "trim",
            },
            {
                title: "Fill With",
                field: "fillWith",
            },
            {
                title: "Fill Direction",
                field: "fillDirection",
            }
        ])
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

    const fetchFunctionData = () => {
        payItemCalculationService().getAllFunctions().then(({data}) => {
            setFunctionData(data
                .filter(func => func.id >= 25 || (func.id === FUNCTION_CODES.FGETEMPVAL || func.id === FUNCTION_CODES.FPARAEMP
                    || func.id === FUNCTION_CODES.FPAYPARA || func.id === FUNCTION_CODES.FITEMGRP)).map(func => ({
                    value: func.id,
                    label: func.name,
                    description: func.description
                })));
        }).catch(e => {
            console.error(e);
        });

    };

    const fetchModalData = () => {
        payrollParameterService().getAll().then(({data}) => {
            setPayrollParameterList(data.map(para => ({value: para.id, code: para.code, label: para.name})));
        }).catch(e => {
            console.error(e);

        });
        payItemGroupService().getAll().then(({data}) => {
            setPayItemGroupList(data.map(para => ({value: para.id, code: para.code, label: para.name})));
        }).catch(e => {
            console.error(e);

        });
        employeeParameterService().getAll().then(({data}) => {
            setEmployeeParameterList(data.map(para => ({value: para.id, code: para.code, label: para.name})))
        }).catch(e => {
            console.error(e);
        });
        companyAccountService().getAllCompanyAccountsCategories().then(({data}) => {
            setCompanyCategoryList(data.map(para => ({value: para.id, code: para.code, label: para.name})))
        }).catch(e => {
            console.error(e);
        });
    }

    const fetchBankFileFormatData = async () => {
        if (bankFileConfig) {
            setLoading(true);
            const {data} = await bankFileFormatService().getAll(bankFileConfig.id);
            setBankFileFormatDetails(data);
            data && setLoading(false);
        }
    }

    const setTableDetails = (data) => {
        const table = data.map(format => {
            let formatValue = "";
            switch (format.functionCode) {
                case FUNCTION_CODES.FITEMGRP: {
                    formatValue = payItemGroupList?.find(grp => grp.value === format.lineFormat)?.code;
                }
                    break;
                case FUNCTION_CODES.FPAYPARA: {
                    formatValue = payrollParameterList?.find(grp => grp.value === format.lineFormat)?.code;
                }
                    break;
                case FUNCTION_CODES.FPARAEMP: {
                    formatValue = employeeParameterList?.find(grp => grp.value === format.lineFormat)?.code;
                }
                    break;
                case FUNCTION_CODES.FGETEMPVAL: {
                    switch (format.lineFormat) {
                        case FIELD_TYPES.empNo.value:
                            formatValue = FIELD_TYPES.empNo.label;
                            break;
                        case FIELD_TYPES.employeeName.value:
                            formatValue = FIELD_TYPES.employeeName.label;
                            break;
                        case FIELD_TYPES.initials.value:
                            formatValue = FIELD_TYPES.initials.label;
                            break;
                        case FIELD_TYPES.fullName.value:
                            formatValue = FIELD_TYPES.fullName.label;
                            break;
                        case FIELD_TYPES.nic.value:
                            formatValue = FIELD_TYPES.nic.label;
                            break;
                    }
                }
                    break;
                case FUNCTION_CODES.FGETBANKEMPVAL: {
                    switch (format.lineFormat) {
                        case FIELD_TYPES.bank.value:
                            formatValue = FIELD_TYPES.bank.label;
                            break;
                        case FIELD_TYPES.branch.value:
                            formatValue = FIELD_TYPES.branch.label;
                            break;
                        case FIELD_TYPES.accountNumber.value:
                            formatValue = FIELD_TYPES.accountNumber.label;
                            break;
                        case FIELD_TYPES.amount.value:
                            formatValue = FIELD_TYPES.amount.label;
                            break;
                        case FIELD_TYPES.bankSequence.value:
                            formatValue = FIELD_TYPES.bankSequence.label;
                            break;
                    }
                }
                    break;
                case FUNCTION_CODES.FGETCOM: {
                    formatValue = `${companyCategoryList?.find(grp => grp.value === parseInt(format.lineFormat.split(";")[0]))?.value};`;
                    switch (format.lineFormat.split(";")[1]) {
                        case FIELD_TYPES.bank.value:
                            formatValue += FIELD_TYPES.bank.label;
                            break;
                        case FIELD_TYPES.branch.value:
                            formatValue += FIELD_TYPES.branch.label;
                            break;
                        case FIELD_TYPES.accountNumber.value:
                            formatValue += FIELD_TYPES.accountNumber.label;
                            break;
                    }
                }
                    break;
                case FUNCTION_CODES.FFREETEXT:
                case FUNCTION_CODES.FEFFECTIVEDATE: {
                    formatValue = format.lineFormat;
                }
            }
            return {
                id: format.id,
                length: format.length,
                sequence: format.sequence,
                trim: format.trim === TRIM_TYPES.LEFT_TRIM ? Object.keys(TRIM_TYPES)[0] : format.trim === TRIM_TYPES.RIGHT_TRIM ? Object.keys(TRIM_TYPES)[1] : Object.keys(TRIM_TYPES)[2],
                functionCode: format.functionCode,
                fillWith: format.fillWith,
                fillDirection: format.fillDirection === FILL_DIRECTIONS.LEFT ? Object.keys(FILL_DIRECTIONS)[0] : format.fillDirection === FILL_DIRECTIONS.RIGHT ? Object.keys(FILL_DIRECTIONS)[1] : "",
                format: `(${functionData?.find(f => f.value === format.functionCode)?.label}) ${formatValue}`
            }
        });
        setTableData(table);
    }
    //Delete Row
    const deleteRow = (deletedRow) => new Promise((resolve, reject) => {
        bankFileFormatService().remove(deletedRow.id).then(({data}) => {
            fetchBankFileFormatData();
            resolve();
            NotificationManager.success(
                "Format successfully Removed",
                "Success"
            );
        }).catch(err => {
            console.error(err);
            reject();
            NotificationManager.error(
                "Removing Failed",
                "Error"
            );
        })
    });

    return (
        <>
            {editModal && <BankFileFormatModal
                employeeParameterList={employeeParameterList}
                payrollParameterList={payrollParameterList}
                payItemGroupList={payItemGroupList}
                fetchBankFileFormatData={fetchBankFileFormatData}
                companyCategoryList={companyCategoryList}
                tableData={tableData}
                editData={editData}
                setShow={setEditModal}
                functionData={functionData}
                show={editModal}/>}
            <BankFileFormatModal
                employeeParameterList={employeeParameterList}
                payrollParameterList={payrollParameterList}
                companyCategoryList={companyCategoryList}
                fetchBankFileFormatData={fetchBankFileFormatData}
                payItemGroupList={payItemGroupList}
                functionData={functionData} tableData={tableData}
                show={addModal} setShow={setAddModal}/>
            <MaterialTable
                icons={tableIcons}
                title={<span><strong>Sequence: </strong>{bankFileConfig.sequence}</span>}
                columns={columns}
                data={tableData}
                editable={{
                    onRowDelete: (row) => deleteRow(row)
                }}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                actions={[
                    {
                        icon: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
                        tooltip: 'Update',
                        onClick: (event, rowData) => {
                            setEditModal(true)
                            setEditData(rowData);
                        }
                    },
                    {
                        icon: forwardRef((props, ref) => <AddBoxIcon {...props} ref={ref}/>),
                        tooltip: 'Add',
                        isFreeAction: true,
                        onClick: (event, rowData) => {
                            setAddModal(true)
                        }
                    }
                ]}
                isLoading={isLoading}
            />
        </>
    );
};

export default BankFileFormatList;
