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
import userService from "../../api/userServices/userService";
import localStorageService from "../../services/localStorageService";
import userRolesService from "../../api/userRolesServices/userRoleService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import handlePageSize from "../../common/tablePageSize";
import swal from "sweetalert2";

const UsersList = ({fetchUserList, userList, isLoading}) => {
    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    const [roleList, setRoleList] = useState([]);
    const [columns, setColumns] = useState([]);
    const [userRole, setUserRoles] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
    };

    useEffect(() => {
        getAllRoles();
    }, []);

    useEffect(() => {
        const columnsDataTable = [
            {
                title: "Id",
                field: "id",
                hidden: true
            },
            {
                title: "Created Date Time",
                field: "createdDateTime",
                hidden: true
            },
            {
                title: "Created By",
                field: "createdBy",
                hidden: true
            },
            {
                title: "User Email",
                field: "userEmail",
                validate: (rowData) =>
                    rowData.userEmail === undefined
                        ? {isValid: false, helperText: 'User Email is required'}
                        : rowData.userEmail === ''
                            ? {isValid: false, helperText: 'User Email is required'}
                            : true,
            },
            {
                title: "Name",
                field: "name",
                validate: (rowData) =>
                    rowData.name === undefined
                        ? {isValid: false, helperText: 'Name is required'}
                        : rowData.name === ''
                            ? {isValid: false, helperText: 'Name is required'}
                            : true
            },
            {
                title: "Designation",
                field: "designation",
                validate: (rowData) =>
                    rowData.designation === undefined
                        ? {isValid: false, helperText: 'Designation is required'}
                        : rowData.designation === ''
                            ? {isValid: false, helperText: 'Designation is required'}
                            : true
            },
            {
                title: "Department",
                field: "department",
                validate: (rowData) =>
                    rowData.department === undefined
                        ? {isValid: false, helperText: 'Department is required'}
                        : rowData.department === ''
                            ? {isValid: false, helperText: 'Department is required'}
                            : true
            },
            {
                title: "User Role",
                field: "userRole",
                editComponent: (props) => {
                    let x = roleList.find((b) => b.label === (props?.value?.label ? props?.value?.label?.toUpperCase() : props?.value?.toUpperCase()));
                    x && setUserRoles(x.value);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={roleList}
                            onChange={(e, selected) => {
                                setUserRoles(selected?.value);
                                props.onChange(selected);
                            }}
                            label="Select"
                            defaultValue={x ?? props.value}
                        />
                    );
                }
            },
            {
                title: "Valid From",
                field: "validFrom",
                type: "date"
            },
            {
                title: "Valid To",
                field: "validTo",
                type: "date"
            },
            /*{
                title: "Validity Period",
                field: "validityPeriod",
                editComponent: (props) => {
                    props.value &&
                    handleValidityPeriod([
                        props.value.split("-")[0],
                        props.value.split("-")[1],
                    ]);
                    return props.value ? (
                        <UserDateRangePicker
                            dateRangeFunc={handleValidityPeriod}
                            startDate={new Date(props.value.split("-")[0])}
                            endDate={new Date(props.value.split("-")[1])}
                        />
                    ) : (
                        <UserDateRangePicker
                            dateRangeFunc={handleValidityPeriod}
                        />
                    )
                },
            },*/
            {
                title: "Active",
                field: "activeStatus",
                type: "boolean"
            },
            {
                title: "Password",
                field: "password",
                editable: "never",
                hidden: true
            },
        ];
        setColumns(columnsDataTable);
    }, [roleList]);

    const getAllRoles = () => {
        userRolesService().getAllRoles().then(({data}) => {
            data = data.map(role => ({
                value: role.id,
                label: role.normalizedName,
            }));
            setRoleList(data);
        }).catch(e => console.error(e));
    }

    const handleValidityPeriod = (props) => {
        setStartDate(props[0]);
        setEndDate(props[1]);
    }

    //Add Row
    const addRow = async (newRow) => new Promise(async (resolve, reject) => {
        //Obj Create
        if (userRole === "") {
            NotificationManager.error("User Role must be specify", "Error");
            return reject("User Role must be specify");
        }
        if (new Date(newRow.validFrom) > new Date(newRow.validTo)) {
            NotificationManager.error(
                "Invalid Date Range",
                "Error"
            );
            return reject("Invalid Date Range");
        }

        const user = {
            email: newRow.userEmail,
            name: newRow.name,
            designation: newRow.designation,
            department: newRow.department,
            userRole,
            "isActive": newRow.activeStatus ?? false,
            startDate: newRow.validFrom,
            endDate: newRow.validTo,
        }

        await userService().addUser(user).then(({data}) => {
            NotificationManager.success("A record was successfully created", "Success");
            //Reload list
            fetchUserList(userRole);
            resolve();

            swal.fire({
                icon: "info",
                title: "Generated Password",
                confirmButtonText: "Show Password",
                text: "User's Password will be showed",
                toast: true,
                preConfirm: () => {
                    return data.tempPassword
                }
            }).then(({value: password}) => {
                swal.fire({
                    toast: true,
                    text: password
                });
            });

        }).catch((error) => {
            console.error(error);
            if (error.status === 409) {
                NotificationManager.error(error.message, "Error");
            }

            if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
            }
            reject();
        });
    })

    //Update Row
    const updateRow = (editedRow) => new Promise(async (resolve, reject) => {
        if (userRole === "") {
            NotificationManager.error("User Role must be specify", "Error");
            return reject("User Role must be specify");
        }

        if (new Date(editedRow.validFrom) > new Date(editedRow.validTo)) {
            NotificationManager.error(
                "Invalid Date Range",
                "Error"
            );
            return reject("Invalid Date Range");
        }

        const user = {
            email: editedRow.userEmail,
            name: editedRow.name,
            designation: editedRow.designation,
            department: editedRow.department,
            userRole,
            "isActive": editedRow.activeStatus ?? false,
            startDate: editedRow.validFrom,
            endDate: editedRow.validTo,
        }

        await userService().updateUser(editedRow.id, user).then(async (response) => {
            NotificationManager.success("A record was successfully updated", "Success");
            //Reload list
            fetchUserList();
            resolve();
        }).catch((error) => {
            console.error(error);
            reject();

            if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
            }
        });
    })

    //Delete Row
    const deleteRow = (deletedRow) => new Promise(async (resolve, reject) => {
        await userService().deleteUser(deletedRow.id).then(async (response) => {
            //Reload list
            fetchUserList();
            resolve();
            NotificationManager.success("A record was successfully deleted.", "Success");
        }).catch((error) => {
            console.log(error);
            reject();
            if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
            } else {
                NotificationManager.error("An error occurred when attempting to delete a record", "Error");
            }
        });
    })

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={columns}
                data={userList}
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
                isLoading={isLoading}
            />
        </>
    );
}

export default UsersList;