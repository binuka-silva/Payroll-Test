import React, {forwardRef, useEffect} from "react";
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
import employeeGroupService from "../../api/employeeGroupServices/employeeGroupService";
import {NotificationManager} from "react-notifications";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import handlePageSize from "../../common/tablePageSize";
import { tableIconColor, editButtonColor, deleteButtonColor, tableBackgroundColor, tableHeaderBackgroundColor, tableHeaderFontColor, tableHeaderFontFamily, tableHeaderFontSize, tableHeaderFontWeight, tableRowBackgroundColor, tableRowFontColor, tableRowFontFamily, tableRowFontSize, tableRowFontWeight } from "styles/globalStyles/globalStyles";

const EmployeeGroupList = ({
                               fetchEmployeeGroupDataFunc,
                               employeeGroupList,
                               isLoading
                           }) => {
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

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

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
            validate: (rowData) =>
                rowData.code === undefined
                    ? {isValid: false, helperText: "Employee group code is required"}
                    : rowData.code === ""
                        ? {isValid: false, helperText: "Employee group code is required"}
                        : true,
        },
        {
            title: "Name",
            field: "name",
            validate: (rowData) =>
                rowData.name === undefined
                    ? {isValid: false, helperText: "Employee group name is required"}
                    : rowData.name === ""
                        ? {isValid: false, helperText: "Employee group name is required"}
                        : true,
        },
        {
            title: "Description",
            field: "description",
            validate: (rowData) =>
                rowData.description === undefined
                    ? {
                        isValid: false,
                        helperText: "Employee group description is required.",
                    }
                    : rowData.description === ""
                        ? {
                            isValid: false,
                            helperText: "Employee group description is required.",
                        }
                        : true,
        },
    ];

    //Add Row
    const addRow = async (newRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create
            let employeeGroup = {
                code: newRow.code,
                name: newRow.name,
                description: newRow.description,
                IsDelete: false,
                createdDateTime: new Date(),
                createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            };

            await employeeGroupService()
                .create(employeeGroup)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    // fetchEmployeeGroupDataFunc();
                    resolve();
                })
                .catch((error) => {
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
            let employeeGroup = {
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
            await employeeGroupService()
                .update(employeeGroup)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );
                    //Reload list
                    // fetchEmployeeGroupDataFunc();
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
            let employeeGroup = {
                id: deletedRow.id,
            };
            await employeeGroupService()
                .deleteEmployeeGroup(employeeGroup)
                .then(async (response) => {
                    //Reload list
                    // fetchEmployeeGroupDataFunc();
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
        const tableData = employeeGroupService()
            .getAllByPagination(
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var mappedData = data.employeeGroup.map(item => ({
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
                title="Employee Groups"
                columns={columnsDataTable}
                // data={employeeGroupList}
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

export default EmployeeGroupList;
