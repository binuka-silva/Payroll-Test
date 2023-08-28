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
import userRolesService from "../../../api/userRolesServices/userRoleService";
import {NotificationManager} from "react-notifications";
import {setUserRoleDetails} from "../../../redux/actions/UserRoleActions";
import {connect} from "react-redux";
import {omit} from "lodash";
import history from "../../../../@history";
import localStorageService from "../../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../../common/notifications";
import {RESP_STATUS_CODES} from "../../../common/response";
import handlePageSize from "../../../common/tablePageSize";

const UserRoleList = ({fetchRoleList, roleList, pageList, setUserRoleDetails, isLoading}) => {
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
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));

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
                title: "Modified Date",
                field: "modifiedDateTime",
                type: "date",
                dateSetting: {
                    locale: "pa-LK",
                },
                editable: "never",
            },
            {
                title: "Created By",
                field: "createdBy",
                hidden: true,
            },
            {
                title: "Modified By",
                field: "modifiedBy",
                editable: "never",
            },
            {
                title: "Role Type",
                field: "role",
                validate: (rowData) =>
                    rowData.role === undefined
                        ? {isValid: false, helperText: "Role Name is required"}
                        : rowData.role === ""
                            ? {isValid: false, helperText: "Role Name is required"}
                            : true,
            },
            {
                title: "Description",
                field: "description",
            },
            {
                title: "Pages",
                field: "hiddenPages",
                hidden: true,
            },
            {
                title: "Payrolls",
                field: "payrolls",
                editable: "never",
            },
            {
                title: "Payrolls",
                field: "hiddenPayrolls",
                hidden: true,
            },
            {
                title: "Reports",
                field: "hiddenReports",
                hidden: true,
            },
        ])
    }, []);

    //Add Row
    const addRow = async (newRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create
            let role = {
                role: newRow.role,
                description: newRow.description,
            };

            await userRolesService()
                .addRole(role)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    fetchRoleList();
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject();

                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                        NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
                    }
                });
        });

    //Update Row
    const updateRow = (editedRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create
            let role = {
                role: editedRow.role,
                description: editedRow.description,
            };

            await userRolesService()
                .updateRole(editedRow.id, role)
                .then((response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );
                    //Reload list
                    fetchRoleList();
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject();

                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                        NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
                    }
                });
        });

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise(async (resolve, reject) => {
            await userRolesService()
                .deleteRole(deletedRow.id)
                .then(async (response) => {
                    //Reload list
                    fetchRoleList();
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
                            "An error occurred when attempting to delete a record",
                            "Error"
                        );
                    }
                });
        });

    const onRowClick = (e, rowData) => {
        const tempRowdata = rowData;
        tempRowdata.pages = rowData.hiddenPages;
        tempRowdata.payrolls = rowData.hiddenPayrolls;
        setUserRoleDetails(omit(tempRowdata, ["hiddenPages", "hiddenPayrolls", "tableData"]));
        history.push("/user-roles/details");
    }

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={columns}
                data={roleList}
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
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                onRowClick={(e, rowData) => onRowClick(e, rowData)}
                isLoading={isLoading}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    setUserRoleDetails: state.setUserRoleDetails,
});

export default connect(mapStateToProps, {
    setUserRoleDetails,
})(UserRoleList);
