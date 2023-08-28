import React, {forwardRef, useEffect, useRef, useState} from "react";
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
import history from "../../../../@history";
import {connect} from "react-redux";
import {omit} from "lodash";
import {setPayrollTaxDetails} from "../../../redux/actions/PayrollTaxDetailsActions";
import payrollProcessService from "../../../api/payrollProcessServices/payrollProcessService";
import {periodType} from "../../payrollPeriod/constant";
import localStorageService from "../../../services/localStorageService";
import PayrollProcessModal from "./PayrollProcessModal";
import {NOTIFICATION_ERROR} from "../../../common/notifications";
import {RESP_STATUS_CODES} from "../../../common/response";
import AutoCompleteDropDown from "../../../components/AutoCompleteDropDown";
import handlePageSize from "../../../common/tablePageSize";
import {requestPath} from "../constant";
import MaterialTable, {MTableAction} from "@material-table/core";

const PayrollProcessList = ({
                                fetchEmployeeTemplateDataFunc,
                                fetchPayrollPeriodDataFuync,
                                fetchPayrollProcessDataFunc,
                                payrollProcessList,
                                setPayrollTaxDetails,
                                payrollPeriodData,
                                employeeTemplateData,
                                cutoffDateList,
                                setPayrollCompanyAccountsDetails,
                                isLoading,
                                setLoading,
                                isDataLoaded,
                                setDataLoaded,
                            }) => {
    const [payRollPeriod, setPayRollPeriod] = useState("");
    const [employeeTemplate, setEmployeeTemplate] = useState("");
    const [cutoffDate, setCutoffDate] = useState("");
    const [payItemData, setPayItemData] = useState([]);

    const [selectedRowData, setSelectedRowData] = useState({});
    const [editModal, setEditModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    //Table Columns
    const [columns, setColumns] = useState([]);

    const addActionRef = useRef();
    const tableRef = React.createRef()

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));

        window.scrollTo(0, 0);
        // fetchPayItemData();

        // return () => {
        //   setPayrollTaxDetails({
        //     code: "",
        //     accountNumber: "",
        //     category: "",
        //     active: "",
        //     lastEditDate: "",
        //     bank: "",
        //     branch: "",
        //     id: "",
        //   });
        // };
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
                title: "Payroll Code",
                field: "code",
                validate: (rowData) =>
                    rowData.code === undefined
                        ? {
                            isValid: false,
                            helperText: "Code is required",
                        }
                        : rowData.code === ""
                            ? {
                                isValid: false,
                                helperText: "Code is required",
                            }
                            : true,
            },
            {
                title: "Payroll Name",
                field: "name",
                validate: (rowData) =>
                    rowData.name === undefined
                        ? {
                            isValid: false,
                            helperText: "Name is required",
                        }
                        : rowData.name === ""
                            ? {
                                isValid: false,
                                helperText: "Name is required",
                            }
                            : true,
            },
            {
                title: "Employee Template",
                field: "employeeTemplate",
                editComponent: (props) => {
                    let x = employeeTemplateData.find(
                        (b) => b.label === props.value
                    );
                    x && setEmployeeTemplate(x);

                    return (
                        <AutoCompleteDropDown
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            dropDownData={employeeTemplateData}
                            onChange={(e, selected) => {
                                setEmployeeTemplate(selected?.value);
                                props.onChange(selected);
                            }}
                            label="Select"
                            defaultValue={x ?? props.value}
                        />
                    );
                },
            },
            {
                title: "Payroll Period",
                field: "payRollPeriod",
                editComponent: (props) => {
                    let x = payrollPeriodData.find((b) => b.label === props.value)?.value;
                    x && setPayRollPeriod(x);

                    return (
                        <AutoCompleteDropDown
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            dropDownData={payrollPeriodData}
                            onChange={(e, selected) => {
                                setPayRollPeriod(selected?.value);
                                props.onChange(selected);
                            }}
                            label="Select"
                            defaultValue={x ?? props.value}
                        />
                    );
                },
            },
            {
                title: "Cut-off Date",
                field: "cutOffDate",
                validate: (rowData) =>
                    rowData.cutOffDate === undefined
                        ? {
                            isValid: false,
                            helperText: "Date is required",
                        }
                        : rowData.cutOffDate === ""
                            ? {
                                isValid: false,
                                helperText: "Date is required",
                            }
                            : payrollPeriodData.find((period) => period.value === payRollPeriod)
                                ?.period === periodType.MONTH && rowData.cutOffDate.match(/[^\d]/)
                                ? {
                                    isValid: false,
                                    helperText: "Enter numbers only",
                                }
                                : payrollPeriodData.find((period) => period.value === payRollPeriod)
                                    ?.period === periodType.MONTH && rowData.cutOffDate > 31
                                    ? {
                                        isValid: false,
                                        helperText: "Date must be less than or equal 31",
                                    }
                                    : payrollPeriodData.find((period) => period.value === payRollPeriod)
                                        ?.period === periodType.DAY && rowData.cutOffDate > 366
                                        ? {
                                            isValid: false,
                                            helperText: "Date must be less than or equal 366",
                                        }
                                        : true,
                ...(payrollPeriodData.find((period) => period.value === payRollPeriod)
                    ?.period === periodType.WEEK
                    ? {
                        editComponent: (props) => {
                            let x = cutoffDateList.find(
                                (b) => b.label === props.value
                            )?.value;
                            x && setCutoffDate(x);

                            return (
                                <AutoCompleteDropDown
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    dropDownData={cutoffDateList}
                                    onChange={(e, selected) => {
                                        setCutoffDate(selected?.value);
                                        props.onChange(selected);
                                    }}
                                    label="Select"
                                    defaultValue={x ?? props.value}
                                />
                            );
                        },
                    }
                    : {type: "string"}),
            },
            {
                title: "Process Year",
                field: "processYear",
                editable: "never",
            },
            {
                title: "Process Date",
                field: "processDate",
                editable: "never",
            },
        ]);
    }, [payrollPeriodData, employeeTemplateData, payRollPeriod]);

    //Load data
    /*function fetchPayItemData() {
      payItemService()
        .getAll()
        .then((response) => {
          let payItemDataArray = [];
          response.data.forEach((item) => {
            payItemDataArray.push({
              value: item.id,
              label: item.code,
              payItemName: item.name,
              payItemType: item.payItemType.type,
              payItemPeriod: item.payItemPeriod.name,
              paymentType: item.paymentType.type,
              activeStatus: item.active,
            });
          });
          setPayItemData(payItemDataArray);
        });
    }*/

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

    //Add Row
    const addRow = (newRow) =>
        new Promise((resolve, reject) => {
            //Obj Create
            let payrollProcess = {
                code: newRow.code,
                name: newRow.name,
                cutOffDate: newRow.cutOffDate?.value ?? newRow.cutOffDate,
                employeeTemplateId: employeeTemplate,
                payRollPeriodId: payRollPeriod,
                isProcessed: false,
            };

            payrollProcessService()
                .create(payrollProcess)
                .then((response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    // fetchPayrollProcessDataFunc();
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.status === 409) {
                        NotificationManager.error(error.message, "Error");
                    }

                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                        NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
                    } else {
                        NotificationManager.error(
                            "An existing record already found",
                            "Error"
                        );
                    }

                    reject();
                });
        });

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise((resolve, reject) => {
            //Obj Create
            let payrollProcess = {
                id: deletedRow.id,
            };
            payrollProcessService()
                .deletePayrollProcess(payrollProcess)
                .then((response) => {
                    //Reload list
                    // fetchPayrollProcessDataFunc();
                    resolve();
                    NotificationManager.success(
                        "A record was successfully deleted.",
                        "Success"
                    );
                })
                .catch((error) => {
                    console.error(error);
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

    const onTaxDetailsClick = (e) => {
        payrollProcessService()
            .findOne(selectedRowData.id)
            .then(({data}) => {
                setPayrollTaxDetails(data);
                history.push("/payroll-details");
            });
    };

    const clickRow = (e, rowData) =>
        new Promise(async (resolve, reject) => {
            setLoading(true);
            try {
                const {data} = await payrollProcessService().findOne(rowData.id, requestPath);
                setPayrollTaxDetails({
                    ...omit(data, ["tableData"]),
                    employeeTemplateList: employeeTemplateData,
                    payrollPeriodList: payrollPeriodData,
                    payrollProcessList: payrollProcessList,
                    payItemData,
                });
                setLoading(false);
                history.push("/payroll-details/tax");
            } catch (e) {
                console.error(e);
                setLoading(false);
            }
        });

    const fetchTableData = (query) => {
        setCurrentPage(query.page);
        const tableData = payrollProcessService()
            .getAllByPagination(
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var mappedData = data.payrollDefinition.map(item => ({
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    employeeTemplate: item.employeeTemplate.name,
                    employeeTemplateObj: item.employeeTemplate,
                    payRollPeriod: item.payRollPeriod.periodName,
                    cutOffDate: item.cutOffDate,
                    processYear: item.payRollPeriod.periodYear.substring(0, 4),
                    processDate: item.payRollPeriod.period == "week" ? item.cutOffDate : item.payRollPeriod.payDay,
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
            {editModal && <PayrollProcessModal setShow={setEditModal} show={editModal}
                                               payroll={selectedRowData} empTemplateList={employeeTemplateData}
                                               payrollPeriodList={payrollPeriodData}
                                               isLoading={isLoading}
                                               fetchEmpDataFunc={fetchPayrollProcessDataFunc}
                                               tableRef={tableRef}
                                               currentPage={currentPage}
            />}
            <MaterialTable
                tableRef={tableRef}
                icons={tableIcons}
                title=""
                columns={columns}
                // data={payrollProcessList}
                data={fetchTableData}
                editable={{
                    onRowAdd: (newRow) => addRow(newRow),
                    // onRowUpdate: (editedRow) => updateRow(editedRow),
                    onRowDelete: (deletedRow) => deleteRow(deletedRow),
                }}
                actions={[
                    {
                        icon: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
                        tooltip: 'Update',
                        onClick: (event, rowData) => {
                            if (!isDataLoaded) {
                                fetchPayrollPeriodDataFuync();
                                fetchEmployeeTemplateDataFunc();
                            }
                            setDataLoaded(true);

                            setEditModal(true)
                            setSelectedRowData(omit(rowData, ["tableData"]));
                        }
                    },
                    {
                        icon: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
                        tooltip: "Add Payroll",
                        isFreeAction: true,
                        onClick: () => {
                            addActionRef.current.click();
                            if (!isDataLoaded) {
                                fetchPayrollPeriodDataFuync();
                                fetchEmployeeTemplateDataFunc();
                            }
                            setDataLoaded(true);
                        }
                    }
                ]}
                components={{
                    Action: props => {
                        //If isn't the add action
                        if (typeof props.action === typeof Function || props.action.tooltip !== 'Add') {
                            return <MTableAction {...props} />
                        } else {
                            return <div ref={addActionRef} onClick={props.action.onClick}/>;
                        }
                    }
                }}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false,
                }}
                onRowClick={(e, rowData) => clickRow(e, rowData)}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                isLoading={isLoading}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
    //setPayrollCompanyAccountsDetails: state.setPayrollCompanyAccountsDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
    // setPayrollCompanyAccountsDetails,
})(PayrollProcessList);
