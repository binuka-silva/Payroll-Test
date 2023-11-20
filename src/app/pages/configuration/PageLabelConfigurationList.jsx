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
import localStorageService from "../../services/localStorageService";
import userRolesService from "../../api/userRolesServices/userRoleService";
import labelConfigurationService from "../../api/configurationServices/labelConfigurationService";
import handlePageSize from "../../common/tablePageSize";
import {FormLabel, FormSelect} from "react-bootstrap";
import { tableIconColor, editButtonColor, deleteButtonColor, tableBackgroundColor, tableHeaderBackgroundColor, tableHeaderFontColor, tableHeaderFontFamily, tableHeaderFontSize, tableHeaderFontWeight, tableRowBackgroundColor, tableRowFontColor, tableRowFontFamily, tableRowFontSize, tableRowFontWeight } from "styles/globalStyles/globalStyles";

const PageLabelConfigurationList = ({
                                        fetchLabelConfigurationDataFunc,
                                        labelConfigurationList,
                                        tableData,
                                        loading
                                    }) => {
    const [permissionPageData, setPermissionPageData] = useState([]);

    const [columns, setColumns] = useState([]);

    useEffect(async () => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
        // Clear all notifications
        fetchPermissionData();
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
                title: "Pages",
                field: "permissionPage",
                editable: "never",
                defaultGroupOrder: 1,
            },
            {
                title: "Page Label",
                field: "label",
                editable: "never"
            },
            {
                title: "Modified Label",
                field: "modifiedLabel",
            },
        ]);
    }, [labelConfigurationList]);

    //Load data
    async function fetchPermissionData() {
        userRolesService()
            .getAllPages()
            .then((response) => {
                let pagesDataArray = [];
                response.data.forEach((item) => {
                    pagesDataArray.push({value: item.id, label: item.name});
                });
                setPermissionPageData(pagesDataArray);
            });
    }

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

    //Update Row
    const updateRow = (editedRow) =>
        new Promise((resolve, reject) => {
            //Obj update
            const labelConfig = {
                id: editedRow.id,
                permissionPageId: editedRow.pageId,
                labelName: editedRow.modifiedLabel,
            };

            labelConfigurationService()
                .update(labelConfig)
                .then((response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );

                    const user = localStorageService.getItem("auth_user");
                    const existLabel = user.labels.find(label => label.labelId === labelConfig.id);
                    if (existLabel) {
                        user.labels = user.labels.map(
                            (label) =>
                                (label.labelId === labelConfig.id && {
                                    editedLabel: (labelConfig.labelName === "" || !labelConfig.labelName) ? null : labelConfig.labelName,
                                    labelId: labelConfig.id,
                                }) ||
                                label
                        );
                    } else {
                        user.labels.push({
                            editedLabel: labelConfig.labelName,
                            labelId: labelConfig.id,
                        });
                    }
                    localStorageService.setItem("auth_user", user);

                    //Reload list
                    fetchLabelConfigurationDataFunc();
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    NotificationManager.error(
                        "Failed to Save",
                        "Error"
                    );
                });
        });
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
                title={
                    <div className="mt-2 mb-3 ">
                        <FormLabel>Label Language</FormLabel>
                        <FormSelect>
                            <option>Select</option>
                            <option>English</option>
                            <option>Sinhala (සිංහල)</option>
                            <option>Tamil (தமிழ்)</option>
                            <option>Bangladesh (বাংলাদেশ)</option>
                            <option>Spanish (española)</option>
                        </FormSelect>
                    </div>
                }
                columns={columns}
                data={tableData}
                editable={{
                    onRowUpdate: (editedRow) => updateRow(editedRow),
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
                    grouping: true,

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
                onRowsPerPageChange={(pageSize) =>
                    handlePageSize(pageSize, window.location.pathname)
                }
                isLoading={loading}
            />
        </>
    );
};

export default PageLabelConfigurationList;
