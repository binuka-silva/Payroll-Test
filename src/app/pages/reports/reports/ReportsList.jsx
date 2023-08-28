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
import localStorageService from "../../../services/localStorageService";
import handlePageSize from "../../../common/tablePageSize";
import {NotificationManager} from "react-notifications";
import {RESP_STATUS_CODES} from "../../../common/response";
import {NOTIFICATION_ERROR} from "../../../common/notifications";
import {Button} from "react-bootstrap";
import reportsService from "../../../api/reportsServices/reportsService";
import {reportExtension} from "./constant";

const ReportsList = ({
                         tableData,
                         fetchReportDataFunc,
                         isLoading,
                     }) => {
    //Table Columns
    const [columns, setColumns] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    //Table Columns
    useEffect(() => {
        NotificationManager.listNotify.forEach((n) =>
            NotificationManager.remove({id: n.id})
        );
        window.scrollTo(0, 0);
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
                title: "Report Code",
                field: "code",
            },
            {
                title: "Name",
                field: "name",
            },
            {
                title: "Description",
                field: "description",
            },
            {
                title: "Report",
                field: "report",
                editComponent: (props) => {
                    let fileName = "";
                    return (
                        <>
                            <span className="col-md-1">
                 <label htmlFor="upload-single-file">
                     <Button className="btn-secondary btn-sm" as="span">
                         <div className="flex flex-middle">
                             <i className="i-Share-on-Cloud"> </i>
                             <span>Browse</span>
                         </div>
                     </Button>
                 </label>
                <input
                    className="d-none"
                    onChange={(e) => {
                        e.target.files[0] && props.onChange(e.target.files[0].name);
                        handleFileSelect(e);
                    }}
                    id="upload-single-file"
                    accept=".rpt"
                    type="file"
                />
            </span>
                            &nbsp;&nbsp;
                            {(fileName || props.value) && <span>{fileName?.name || props.value}</span>}
                        </>
                    );
                },
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

    const addRow = (row) => new Promise((resolve, reject) => {
        const data = new FormData();
        data.append("code", row.code);
        data.append("name", row.name);
        data.append("description", row.description);
        data.append("file", selectedFile);

        reportsService().create(data).then((response) => {
            NotificationManager.success(
                "A record was successfully created",
                "Success"
            );
            //Reload list
            fetchReportDataFunc();
            resolve();
        })
            .catch((error) => {
                handleError(error);
                reject();
            });
    });

    const updateRow = (row) => new Promise((resolve, reject) => {
        const data = new FormData();
        data.append("code", row.code);
        data.append("name", row.name);
        data.append("description", row.description);
        data.append("file", selectedFile);

        reportsService().update(row.id, data).then((response) => {
            NotificationManager.success(
                "A record was successfully created",
                "Success"
            );

            fetchReportDataFunc();
            resolve();
        })
            .catch((error) => {
                handleError(error);
                reject();
            });
    });

    const deleteRow = (row) => new Promise((resolve, reject) => {
        reportsService().deleteReport(row.id)
            .then((response) => {
                NotificationManager.success(
                    "A record was successfully created",
                    "Success"
                );

                fetchReportDataFunc();
                resolve();
            })
            .catch((error) => {
                handleError(error);
                reject();
            });
    });

    const handleError = (error) => {
        if (error.statusCode === 409) {
            NotificationManager.error(error.message, "Error");
        }
        if (
            error.status === RESP_STATUS_CODES.FORBIDDEN ||
            error.status === RESP_STATUS_CODES.UNAUTHORIZED
        ) {
            NotificationManager.error(
                NOTIFICATION_ERROR.AUTH_FAILED,
                error.statusText
            );
        } else {
            NotificationManager.error("Failed to Save", "Error");
        }
    };

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.name.split(".")[1] !== reportExtension) {
                NotificationManager.error(
                    "Select Valid File",
                    "Invalid File Type"
                );
            } else {
                setSelectedFile(file);
            }
        }
    }

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title={""}
                columns={columns}
                data={tableData}
                isLoading={isLoading}
                editable={{
                    onRowAdd: (row) => addRow(row),
                    onRowUpdate: (row) => updateRow(row),
                    onRowDelete: (row) => deleteRow(row),
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
                }}
                onRowsPerPageChange={(pageSize) =>
                    handlePageSize(pageSize, window.location.pathname)
                }
            />
        </>
    );
};

export default ReportsList;
