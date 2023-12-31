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
import {useSelector} from "react-redux";

import bankService from "../../api/bankServices/bankService";
import branchService from "../../api/branchServices/branchService";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import handlePageSize from "../../common/tablePageSize";

const BranchList = ({fetchBranchDataFunc, branchList, isLoading}) => {
    const [bankData, setBankData] = useState([]);
    const [bank, setBank] = useState("");

    //Table Columns
    const [columns, setColumns] = useState([]);

    const bankDetails = useSelector((state) => state.bankDetails);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        fetchBankData();
    }, []);

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
                title: "Bank Name",
                field: "bankId",
                editComponent: (props) => {
                    let x;
                    if (bankDetails.id) {
                        x = bankData.find((b) => b.label === bankDetails.name);
                    } else {
                        x = bankData.find((b) => b.label === props.value);
                    }
                    x && setBank(x.value);
                    return (
                        <AutoCompleteDropDown
                            disabled={bankDetails.id != null}
                            dropDownData={bankData}
                            onChange={(e, selected) => {
                                setBank(selected?.value);
                                props.onChange(selected);
                            }}
                            label="Select Bank"
                            defaultValue={x ?? props.value}
                        />
                    );
                },
            },
            {
                title: "Branch Code",
                field: "code",
                validate: (rowData) =>
                    rowData.code === undefined
                        ? {isValid: false, helperText: "Branch code is required"}
                        : rowData.code === ""
                            ? {isValid: false, helperText: "Branch code is required"}
                            : true,
                editable: "onAdd",
            },
            {
                title: "Branch Name",
                field: "name",
                validate: (rowData) =>
                    rowData.name === undefined
                        ? {isValid: false, helperText: "Branch name is required"}
                        : rowData.name === ""
                            ? {isValid: false, helperText: "Branch name is required"}
                            : true,
            },
            {
                title: "Reference Code",
                field: "referenceCode",
            },
            {
                title: "Address",
                field: "address",
                validate: (rowData) =>
                    rowData.address === undefined
                        ? {isValid: false, helperText: "Branch address is required."}
                        : rowData.address === ""
                            ? {isValid: false, helperText: "Branch address is required."}
                            : true,
            },
        ]);
    }, [bankData]);

    //Load data
    function fetchBankData() {
        bankService()
            .getAll()
            .then(async (response) => {
                let bankDataArray = [];
                response.data.forEach((item) => {
                    bankDataArray.push({value: item.id, label: item.name});
                });
                setBankData(bankDataArray);
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
    const addRow = async (newRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create
            let branch = {
                bankId: bank,
                code: newRow.code,
                name: newRow.name,
                referenceCode: newRow.referenceCode,
                address: newRow.address,
                IsDelete: false,
                createdDateTime: new Date(),
                createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            };

            branchService()
                .create(branch)
                .then((response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    fetchBranchDataFunc();
                    resolve();
                })
                .catch((error) => {
                    console.log(error);
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

    //Update Row
    const updateRow = (editedRow) =>
        new Promise(async (resolve, reject) => {
            //Obj update
            let branch = {
                bankId: bank,
                code: editedRow.code,
                name: editedRow.name,
                referenceCode: editedRow.referenceCode,
                address: editedRow.address,
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            await branchService()
                .update(branch, editedRow.id)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );
                    //Reload list
                    fetchBranchDataFunc();
                    resolve();
                })
                .catch((error) => {
                    console.log(error);
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
            let branch = {
                id: deletedRow.id,
            };
            await branchService()
                .deleteBranch(branch)
                .then(async (response) => {
                    //Reload list
                    fetchBranchDataFunc();
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

    const fetchTableData = (query) => {
        const tableData = branchService()
            .getAllByPagination(
                bankDetails.id,
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var branchData = data.branches.map(branch => ({
                    id: branch.id,
                    bankId: branch.bank?.name,
                    code: branch.code,
                    name: branch.name,
                    referenceCode: branch.referenceCode,
                    address: branch.address,
                    createdBy: branch.createdBy,
                }));
                return ({
                    data: branchData,
                    page: query.page,
                    totalCount: data.dbSize
                })
            });
        return tableData;
    }

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={columns}
                // data={branchList}
                data={(query) => fetchTableData(query)}
                editable={{
                    onRowAdd: (newRow) => addRow(newRow),
                    onRowUpdate: (editedRow) => updateRow(editedRow),
                    onRowDelete: (deletedRow) => deleteRow(deletedRow),
                }}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                isLoading={isLoading}
            />
        </>
    );
};

export default BranchList;
