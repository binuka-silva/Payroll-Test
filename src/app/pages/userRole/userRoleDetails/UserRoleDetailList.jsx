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
import localStorageService from "../../../services/localStorageService";
import AutoCompleteDropDown from "../../../components/AutoCompleteDropDown";
import handlePageSize from "../../../common/tablePageSize";

const UserRoleDetailList = ({setTableDataList, tableDataList, permissionDataList, navList}) => {
    const [columns, setColumns] = useState([]);

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
    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        setColumns([
            {
                title: "Id",
                field: "id",
                hidden: true,
            },
            {
                title: "PageId",
                field: "pageId",
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
                title: "Page Category",
                field: "category",
                editable: "never",
                defaultGroupOrder: 0,
            },
            {
                title: "Permissions",
                field: "permission",
                editComponent: (props) => {
                    let x = permissionDataList.find((b) => b.label === props.value);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={permissionDataList}
                            label="Permissions"
                            defaultValue={x ?? props.value}
                            onChange={(e, selected) => {
                                props.onChange(selected);
                            }}
                            isGroup={true}
                        />
                    );
                },
            },
            {
                title: "Read",
                field: "read",
                type: "boolean",
                initialEditValue: true
            },
            {
                title: "Write",
                field: "write",
                type: "boolean",
                initialEditValue: true
            },
            {
                title: "Update",
                field: "update",
                type: "boolean",
                initialEditValue: true
            },
            {
                title: "Delete",
                field: "delete",
                type: "boolean",
                initialEditValue: true
            }
        ])
    }, [permissionDataList]);

    //Add Row
    const addRow = (newRow) =>
        new Promise((resolve, reject) => {
            const permission = permissionDataList.find(permission => permission.value === newRow.permission.value);
            if (tableDataList.find(data => data.pageId === permission.value)) {
                reject();
                return NotificationManager.error(
                    "Duplicate Permission Entered",
                    "Error"
                );
            }
            if (permission) {
                newRow.category = permission.title;
                newRow.permission = permission.label;
                newRow.pageId = permission.value;
                newRow.navId = 0
            }
            setTableDataList([...tableDataList, newRow]);
            resolve();
        });

    //Update Row
    const updateRow = (editedRow, oldRow) =>
        new Promise(async (resolve, reject) => {
            let permission;
            editedRow.permission.value
                ? (permission = permissionDataList.find(permission => permission.value === editedRow.permission.value))
                : (permission = permissionDataList.find(permission => permission.label === editedRow.permission));
            permission && (editedRow.permission = permission.label);

            /*if (permission && tableDataList.find(data => data.pageId === permission.value)) {
                reject();
                return NotificationManager.error(
                    "Duplicate Permission Entered",
                    "Error"
                );
            }*/
            editedRow.category = permission?.title;
            const dataUpdate = [...tableDataList];
            const index = oldRow.tableData.id;

            dataUpdate[index] = editedRow;
            setTableDataList([...dataUpdate]);

            resolve();
        });

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise(async (resolve, reject) => {
            const dataDelete = [...tableDataList];
            const index = deletedRow.tableData.id;
            dataDelete.splice(index, 1);
            setTableDataList([...dataDelete]);

            resolve()
        });

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={columns}
                data={tableDataList}
                editable={{
                    onRowAdd: (addedRow) => addRow(addedRow),
                    onRowUpdate: (editedRow, oldRow) => updateRow(editedRow, oldRow),
                    onRowDelete: (deletedRow) => deleteRow(deletedRow)
                }}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false,
                    grouping: true,
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
            />
        </>
    );
};

export default UserRoleDetailList;
