import React, {forwardRef, useEffect} from "react";

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
import MaterialTable from "@material-table/core";
import {NotificationManager} from "react-notifications";
import {Search} from "@material-ui/icons";

import payItemPeriodService from "../../api/payItemPeriodServices/payItemPeriodService";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import handlePageSize from "../../common/tablePageSize";

const PayItemPeriodList = ({
                               fetchPayItemPeriodDataFunc,
                               payItemPeriodList,
                               isLoading
                           }) => {

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
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

    //Table Columns
    const columnsDataTable = [
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
            title: "Code",
            field: "code",
            editable: "onAdd",
            validate: (rowData) =>
                rowData.code === undefined
                    ? {isValid: false, helperText: "Pay item period code is required"}
                    : rowData.code === ""
                        ? {isValid: false, helperText: "Pay item period code is required"}
                        : true,
        },
        {
            title: "Name",
            field: "name",
            validate: (rowData) =>
                rowData.name === undefined
                    ? {isValid: false, helperText: "Pay item period name is required"}
                    : rowData.name === ""
                        ? {isValid: false, helperText: "Pay item period name is required"}
                        : true,
        },
        {
            title: "Description",
            field: "description",
            validate: (rowData) =>
                rowData.description === undefined
                    ? {
                        isValid: false,
                        helperText: "Pay item period description is required.",
                    }
                    : rowData.description === ""
                        ? {
                            isValid: false,
                            helperText: "Pay item period description is required.",
                        }
                        : true,
        },
    ];

    //Add Row
    const addRow = async (newRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create
            let payItemPeriod = {
                code: newRow.code,
                name: newRow.name,
                description: newRow.description,
                IsDelete: false,
                createdDateTime: new Date(),
                createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            };

            await payItemPeriodService()
                .create(payItemPeriod)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    fetchPayItemPeriodDataFunc();
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
            //Obj Create
            let payItemPeriod = {
                id: editedRow.id,
                code: editedRow.code,
                name: editedRow.name,
                description: editedRow.description,
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            await payItemPeriodService()
                .update(payItemPeriod)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );
                    //Reload list
                    fetchPayItemPeriodDataFunc();
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
            let payItemPeriod = {
                id: deletedRow.id,
            };
            await payItemPeriodService()
                .deletePayItemPeriod(payItemPeriod)
                .then(async (response) => {
                    //Reload list
                    fetchPayItemPeriodDataFunc();
                    resolve();
                    NotificationManager.success(
                        "A record was successfully deleted.",
                        "Success"
                    );
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

    const fetchTableData = (query) => {
        const tableData = payItemPeriodService()
            .getAllByPagination(
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var mappedData = data.payItemPeriod.map(item => ({
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    description: item.description,
                }));
                return ({
                    data: mappedData,
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
                columns={columnsDataTable}
                // data={payItemPeriodList}
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

export default PayItemPeriodList;
