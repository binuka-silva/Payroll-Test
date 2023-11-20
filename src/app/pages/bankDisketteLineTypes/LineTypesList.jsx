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
import {NotificationManager} from "react-notifications";
import bankDisketteLineTypeService from "../../api/bankDisketteLineTypeService/bankDisketteLineTypeService";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import handlePageSize from "../../common/tablePageSize";
import { tableIconColor, editButtonColor, deleteButtonColor, tableBackgroundColor, tableHeaderBackgroundColor, tableHeaderFontColor, tableHeaderFontFamily, tableHeaderFontSize, tableHeaderFontWeight, tableRowBackgroundColor, tableRowFontColor, tableRowFontFamily, tableRowFontSize, tableRowFontWeight } from "styles/globalStyles/globalStyles";

const LineTypesList = ({
                           fetchLineTypesFunc,
                           lineTypeList,
                           isLoading,
                       }) => {

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

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
    //Table Columns
    const columns = [
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
                rowData.code === undefined || rowData.code === ""
                    ? {
                        isValid: false,
                        helperText: "Code is required",
                    }
                    : true,
        },
        {
            title: "Line Name",
            field: "lineName",
            validate: (rowData) =>
                rowData.lineName === undefined || rowData.lineName === ""
                    ? {
                        isValid: false,
                        helperText: "Line name is required",
                    }
                    : true,
        },
        {
            title: "Multiple Lines",
            field: "multiLines",
            type: "boolean",
        },
        {
            title: "Description",
            field: "description",
            validate: (rowData) =>
                rowData.description === undefined || rowData.description === ""
                    ? {
                        isValid: false,
                        helperText: "Description is required",
                    }
                    : true,
        },
    ];

    //Add Row
    const addRow = async (newRow) => {
        // Remnove this validation after optimized pagination
        if (lineTypeList.map((lineType) => lineType.code).includes(newRow.code)) {
            NotificationManager.error(
                "Existing record already found for code \"" + newRow.code + "\"",
                "Error"
            );
            return;
        }

        //Obj Create
        let lineType = {
            code: newRow.code,
            lineName: newRow.lineName,
            multiLines: newRow.multiLines,
            description: newRow.description,
            IsDelete: false,
            createdDateTime: new Date(),
            createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        };

        await bankDisketteLineTypeService()
            .create(lineType)
            .then((response) => {
                NotificationManager.success(
                    "Line name \"" + response.data.lineName + "\" was successfully created",
                    "Success"
                );
                //Reload list
                // fetchLineTypesFunc();
            })
            .catch((error) => {
                if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                    NotificationManager.error(
                        NOTIFICATION_ERROR.AUTH_FAILED,
                        error.statusText
                    );
                } else {
                    NotificationManager.error(
                        "Error occured " + error.response.statusText,
                        "Error"
                    );
                }
            });
    };

    //Update Row
    const updateRow = async (editedRow) => {
        //Obj Create
        let lineType = {
            id: editedRow.id,
            code: editedRow.code,
            lineName: editedRow.lineName,
            multiLines: editedRow.multiLines,
            description: editedRow.description,
            IsDelete: false,
            createdDateTime: editedRow.createdDateTime,
            createdBy: editedRow.createdBy,
            modifiedDateTime: new Date(),
            modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
        };

        await bankDisketteLineTypeService()
            .update(lineType)
            .then((response) => {
                NotificationManager.success(
                    "Line name \"" + editedRow.lineName + "\" was successfully updated",
                    "Success"
                );
                //Reload list
                // fetchLineTypesFunc();
            })
            .catch((error) => {
                if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                    NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
                } else {
                    NotificationManager.error(
                        "Existing record already found for code \"" + editedRow.code + "\"",
                        "Error"
                    );
                }
            });
    };

    //Delete Row
    const deleteRow = async (deletedRow) => {
        //Obj Create
        let lineType = {
            id: deletedRow.id,
        };
        await bankDisketteLineTypeService()
            .remove(lineType)
            .then((response) => {
                NotificationManager.success(
                    "Line name \"" + deletedRow.lineName + "\" was successfully deleted",
                    "Success"
                );
                //Reload list
                // fetchLineTypesFunc();
            })
            .catch((error) => {
                if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                    NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
                } else {
                    NotificationManager.error(
                        "Error occured " + error.response.statusText,
                        "Error"
                    );
                }
            });
    };

    const fetchTableData = (query) => {
        const tableData = bankDisketteLineTypeService()
            .getAllByPagination(
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var mappedData = data.lineType.map(item => ({
                    id: item.id,
                    code: item.code,
                    lineName: item.lineName,
                    multiLines: item.multiLines,
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
                title=""
                columns={columns}
                // data={lineTypeList}
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
                    pageSize:
                        JSON.parse(
                            localStorageService.getItem("auth_user")?.tablePageCount
                        )?.[window.location.pathname] ?? 5,
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

export default LineTypesList;
