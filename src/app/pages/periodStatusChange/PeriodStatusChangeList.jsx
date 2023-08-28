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
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import {payrollPeriodProcess} from "./constant";
import payRollPeriodStatusChangeService from "../../api/payRollPeriodServices/payRollPeriodStatusChangeService";
import {NotificationManager} from "react-notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import {NOTIFICATION_ERROR} from "../../common/notifications";

const PeriodStatusChangeList = ({
                                    tableData,
                                    setTableData,
                                    isLoading, fetchData
                                }) => {
    //Table Columns
    const [columns, setColumns] = useState([]);
    const [statusList, setStatusList] = useState([]);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        setStatusList([
            {label: Object.keys(payrollPeriodProcess)[0], value: payrollPeriodProcess.OPEN},
            {label: Object.keys(payrollPeriodProcess)[1], value: payrollPeriodProcess.PROCESSED},
            {label: Object.keys(payrollPeriodProcess)[2], value: payrollPeriodProcess.CLOSE},
            {label: Object.keys(payrollPeriodProcess)[3], value: payrollPeriodProcess.APPROVED},
        ]);
        window.scrollTo(0, 0);
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
                title: "period",
                field: "period",
                hidden: true,
            },
            {
                title: "periodYear",
                field: "periodYear",
                hidden: true,
            },
            {
                title: "Period No",
                field: "periodNo",
                editable: "never",
            },
            {
                title: "Date From",
                field: "dateFrom",
                type: "date",
                dateSetting: {
                    locale: "pa-LK",
                },
                editable: "never",
            },
            {
                title: "Date To",
                field: "dateTo",
                type: "date",
                dateSetting: {
                    locale: "pa-LK",
                },
                editable: "never",
            },
            {
                title: "Status",
                field: "status",
                editComponent: (props) => {
                    let x;
                    x = statusList.find((b) => b.label === props.value);
                    x && props.onChange(x);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={statusList}
                            onChange={(e, selected) => {
                                props.onChange(selected);
                            }}
                            label="Select Status"
                            defaultValue={x ?? props.value}
                        />
                    );
                }
            },
        ]);
    }, [statusList]);

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

    //Update Row
    const updateRow = (editedRow, prevRow) => new Promise((resolve, reject) => {
        try {
            const periodIndex = tableData.findIndex(t => t.id === editedRow.id);
            const nextPeriod = tableData[periodIndex + 1];
            if (nextPeriod && ((editedRow.status.label === Object.keys(payrollPeriodProcess)[0] && !(nextPeriod.status === Object.keys(payrollPeriodProcess)[0]))
                || (editedRow.status.label === Object.keys(payrollPeriodProcess)[1] && !(nextPeriod.status === Object.keys(payrollPeriodProcess)[0] || nextPeriod.status === Object.keys(payrollPeriodProcess)[1]))
                || (editedRow.status.label === Object.keys(payrollPeriodProcess)[3] && !(nextPeriod.status === Object.keys(payrollPeriodProcess)[0] || nextPeriod.status === Object.keys(payrollPeriodProcess)[1] || nextPeriod.status === Object.keys(payrollPeriodProcess)[3]))
                || (editedRow.status.label === Object.keys(payrollPeriodProcess)[2] && !(nextPeriod.status === Object.keys(payrollPeriodProcess)[0] || nextPeriod.status === Object.keys(payrollPeriodProcess)[1] || nextPeriod.status === Object.keys(payrollPeriodProcess)[2] || nextPeriod.status === Object.keys(payrollPeriodProcess)[3])))
            ) {
                reject();
                return NotificationManager.error("Invalid Changing", "Error");
            }

            let isExtend = false;
            //Todo: Extend
            /*if (editedRow) {
                swal.fire({
                    title: "Wish to Proceed to Next Schedule?",
                    text: `There will be start schedule from the beginning`,
                    type: "question",
                    showCancelButton: true,
                    width: 500,
                    icon: "question",
                    toast: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                })
                    .then(async (result) => {
                        let details = [];
                        if (result.isConfirmed) {
                            details = generatePeriod(editedRow.period, editedRow.payDay, editedRow.tax, editedRow.periodYear, moment(editedRow.periodYear).add(1, "years").format("DD.MM.YYYY"))
                            isExtend = true;
                        }
                    });
            }*/
            payRollPeriodStatusChangeService().changeStatus({
                id: editedRow.id,
                value: editedRow.status.value
            }).then(() => {
                editedRow.status = editedRow.status.label;
                const dataUpdate = [...tableData];
                dataUpdate[periodIndex] = editedRow;
                setTableData([...dataUpdate]);
                resolve();

                fetchData();
                NotificationManager.success("Status Changed", "Success");
            })
        } catch (error) {
            if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
            } else {
                NotificationManager.error("Failed to Change Status", "Error");
            }
            console.error(error);
            reject();
        }
    });

    return (
        <>
            <MaterialTable
                icons={tableIcons}
                title={""}
                columns={columns}
                data={tableData}
                editable={{
                    onRowUpdate: (editedRow, prevRow) => updateRow(editedRow, prevRow),
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
                isLoading={isLoading}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(PeriodStatusChangeList);
