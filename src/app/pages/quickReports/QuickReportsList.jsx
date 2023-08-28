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
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import {connect} from "react-redux";
import localStorageService from "../../services/localStorageService";
import handlePageSize from "../../common/tablePageSize";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import {NotificationManager} from "react-notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import quickReportsService from "../../api/quickReportsServices/quickReportsService.js";
import {payrollPeriodProcess} from "../payrollProcessing/constant";
import QuickReportsModal from "./QuickReportsModal";
import QuickReportMainModal from "./QuickReportMainModal";
import {modalParams} from "./constant";
import ResultModal from "./ResultModal";
import AddBoxIcon from "@mui/icons-material/AddBox";

const QuickReportsList = ({
                              tableData,
                              setTableData,
                              payroll,
                              fetchReportDataFunc,
                              isLoading,
                              setLoading,
                          }) => {
    //Table Columns
    const [columns, setColumns] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isModalLoading, setModalLoading] = useState(false);
    const [params, setParams] = useState([]);
    const [defaultParams, setDefaultParams] = useState([]);
    const [paramsValue, setParamsValue] = useState([]);

    const [showResultModal, setShowResultModal] = useState(false);
    const [resultColumns, setResultColumns] = useState([]);
    const [resultData, setResultData] = useState([]);

    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [isRowClick, setRowClick] = useState(false);
    const [editData, setEditData] = useState({});

    const [selectedRowData, setSelectedRowData] = useState({});

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
                title: "Query Code",
                field: "code",
            },
            {
                title: "Name",
                field: "name",
            },
            {
                title: "Header",
                field: "header",
            },
            {
                title: "Query",
                field: "showQuery",
            },
            {
                title: "Query",
                field: "query",
                hidden: true,
            },
            {
                title: "Description",
                field: "description",
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

    const addRow = (newRow) =>
        new Promise(async (resolve, reject) => {
            setLoading(true);
            const data = {
                code: newRow.code,
                name: newRow.name,
                header: newRow.header,
                query: newRow.query,
                description: newRow.description,
            };

            quickReportsService()
                .create(data)
                .then((response) => {
                    setLoading(false);
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
                    setLoading(false);
                    reject();
                });
        });

    //Update Row
    const updateRow = (editedRow, prevRow) =>
        new Promise((resolve, reject) => {
            setLoading(true);
            const data = {
                code: editedRow.code,
                name: editedRow.name,
                header: editedRow.header,
                query: editedRow.query,
                description: editedRow.description,
            };

            quickReportsService()
                .update(editedRow.id, data)
                .then((response) => {
                    setLoading(false);
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    fetchReportDataFunc();
                    resolve();
                })
                .catch((error) => {
                    setLoading(false);
                    handleError(error);
                    reject();
                });
        });

    const deleteRow = (row) =>
        new Promise((resolve, reject) => {
            setLoading(true);
            quickReportsService()
                .deleteReport(row.id)
                .then((response) => {
                    setLoading(false);
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    fetchReportDataFunc();
                    resolve();
                })
                .catch((error) => {
                    setLoading(false);
                    handleError(error);
                    reject();
                });
        });

    function execute(row) {
        setSelectedRow(row);
        const params =
            row.query.match(/@\w+/g)?.filter((para) => !modalParams.includes(para)) ??
            [];
        const defaultParams =
            row.query.match(/@\w+/g)?.filter((para) => modalParams.includes(para)) ??
            [];
        setParams(params);
        setDefaultParams(defaultParams);

        params.length > 0
            ? setShowModal(true)
            : runQuery(row, params, defaultParams);
    }

    const runQuery = (row, params, defaultParams) => {
        showModal ? setModalLoading(true) : setLoading(true);
        const period = payroll?.payRollPeriod?.payRollPeriodDetails?.find(
            (v) => v.periodProcess !== payrollPeriodProcess.CLOSE
        );
        const defaults = defaultParams.map((p) => ({
            param: p,
            value:
                p === "@payrollId"
                    ? payroll.code
                    : p === "@dateFrom"
                        ? period?.dateFrom.split(" ")[0]
                        : p === "@dateTo"
                            ? period?.dateTo.split(" ")[0]
                            : "",
        }));
        quickReportsService()
            .execute(row.id, [...paramsValue, ...defaults])
            .then(({data}) => {
                showModal ? setModalLoading(false) : setLoading(false);
                let columns = [];
                data.forEach((d) => columns.push(...Object.keys(d)));
                columns = [...new Set(columns)];
                data = data.map((d) => {
                    let row = {};
                    columns.forEach((c) => {
                        row[c] = d[c] ?? "";
                    });
                    return row;
                });

                setResultColumns(
                    columns.map((column) => ({
                        title: column,
                        field: column,
                    }))
                );
                setResultData(data);
                setShowResultModal(true);
            })
            .catch((error) => {
                showModal ? setModalLoading(false) : setLoading(false);
                console.error(error);
                NotificationManager.error(
                    error?.response?.data?.detail ?? "An error occurred",
                    "Error"
                );
            });
    };

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

    return (
        <>
            {editModal && (
                <QuickReportMainModal
                    fetchReportDataFunc={fetchReportDataFunc}
                    payroll={payroll}
                    QuickReportTableData={tableData}
                    editData={editData}
                    setShow={setEditModal}
                    show={editModal}
                    editModal={editModal}
                    setLoading={setLoading}
                    isRowClick={isRowClick}
                    handleError={handleError}
                />
            )}
            <QuickReportMainModal
                fetchReportDataFunc={fetchReportDataFunc}
                payroll={payroll}
                QuickReportTableData={tableData}
                show={addModal}
                setShow={setAddModal}
                setLoading={setLoading}
                handleError={handleError}
            />
            {showModal && (
                <QuickReportsModal
                    show={showModal}
                    setShow={setShowModal}
                    paramsValue={paramsValue}
                    setParamsValue={setParamsValue}
                    params={params}
                    defaultParams={defaultParams}
                    payroll={payroll}
                    row={selectedRow}
                    isLoading={isModalLoading}
                    setLoading={setModalLoading}
                    runQuery={runQuery}
                />
            )}
            {showResultModal && (
                <ResultModal
                    show={showResultModal}
                    setShow={setShowResultModal}
                    columns={resultColumns}
                    data={resultData}
                    row={selectedRow}
                />
            )}
            <MaterialTable
                icons={tableIcons}
                title={
                    <span>
            <strong>
              {
                  payroll?.payRollPeriod?.payRollPeriodDetails
                      ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                      ?.dateFrom.split(" ")[0]
              }{" "}
                -{" "}
                {
                    payroll?.payRollPeriod?.payRollPeriodDetails
                        ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                        ?.dateTo.split(" ")[0]
                }
            </strong>
          </span>
                }
                columns={columns}
                data={tableData}
                editable={{
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
                    emptyRowsWhenPaging: false,
                }}
                onRowsPerPageChange={(pageSize) =>
                    handlePageSize(pageSize, window.location.pathname)
                }
                onRowClick={(e, rowData) => {
                    setEditModal(true);
                    setRowClick(true);
                    setEditData(rowData);
                }}
                actions={[
                    {
                        icon: forwardRef((props, ref) => (
                            <PlayCircleIcon {...props} ref={ref}/>
                        )),
                        tooltip: "Execute",
                        onClick: (e, row) => execute(row),
                    },
                    {
                        icon: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
                        tooltip: "Update",
                        onClick: (event, rowData) => {
                            setEditModal(true);
                            setRowClick(false);
                            setEditData(rowData);
                        },
                    },
                    {
                        icon: forwardRef((props, ref) => (
                            <AddBoxIcon {...props} ref={ref}/>
                        )),
                        tooltip: "Add",
                        isFreeAction: true,
                        onClick: (event, rowData) => setAddModal(true),
                    },
                ]}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(QuickReportsList);
