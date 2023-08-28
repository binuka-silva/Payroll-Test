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
import {connect} from "react-redux";
import history from "../../../../@history";
import {omit} from "lodash";
import {NOTIFICATION_ERROR} from "../../../common/notifications";
import {RESP_STATUS_CODES} from "../../../common/response";

import loansToEmployeesService from "../../../api/loansToEmployeesServices/loansToEmployeesService";
import localStorageService from "../../../services/localStorageService";
import AutoCompleteDropDown from "../../../components/AutoCompleteDropDown";
import handlePageSize from "../../../common/tablePageSize";
import {payrollPeriodProcess} from "../constant";
import {setLoansToEmployeesrDetails} from "../../../redux/actions/LoansToEmployeesAction";
import swal from "sweetalert2";

const LoansToEmployeesList = ({
                                  setLoansToEmployeesrDetails,
                                  fetchLoansToEmployeesFunc,
                                  loanTypesData,
                                  employee,
                                  employees,
                                  isLoading,
                                  setLoading,
                                  setPayrollTaxDetails,
                                  payroll,
                                  fixed,
                                  variable,
                                  startDateData,
                                  endDateData,
                                  prossPeriods,
                                  sPeriods,
                                  ePeriods,
                                  closePeriodsData,
                                  loansToEmployeesList,
                                  setLoansToEmployeesList,
                                  fetchLoansToEmployeeFunc,
                                  processPeriodData,
                              }) => {
    const [loanType, setLoanType] = useState("");
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        NotificationManager.listNotify.forEach((n) => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
    }, []);

    //Table Columns
    useEffect(() => {
        const effectiveDates = startDateData.filter((v) => v.periodNo !== payrollPeriodProcess.CLOSE);
        const selectedLoanType = loanTypesData.find((p) => p.value === loanType) ?? {};

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
                title: "Loan Type Id",
                field: "loanType",
                editComponent: (props) => {
                    let x = loanTypesData.find((b) => b.label === props.value);
                    x && setLoanType(x.value);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={loanTypesData}
                            label="Search"
                            defaultValue={x ?? props.value}
                            onChange={(e, selected) => {
                                props.onChange(selected);
                                setLoanType(selected?.value);
                            }}
                            sx={{
                                "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
                                    top: "calc(50% - 17px)",
                                },
                                "& .MuiButtonBase-root, & .MuiIconButton-root": {
                                    padding: "4px",
                                },
                                "& .MuiAutocomplete-input, & .MuiInputLabel-root": {
                                    fontSize: 15,
                                },
                            }}
                            size={"small"}
                        />
                    );
                },
            },
            {
                title: "Loan Type Name",
                field: "loanTypeName",
                editable: "never",
                emptyValue: selectedLoanType?.name ?? "",
            },
            {
                title: "Amount",
                field: "amount",
                type: "numeric",
            },
            {
                title: "Installments",
                field: "instalments",
                type: "numeric",
            },
            {
                title: "Monthly Installment Amount",
                field: "instalmentAmount",
                type: "numeric",
                editable: "never",
            },
            {
                title: "Effective Date",
                field: "effectiveDate",
                type: "date",
                editComponent: (props) => {
                    let x = effectiveDates.find((b) => b.label === props.value);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={effectiveDates}
                            label="Search"
                            defaultValue={x ?? props.value}
                            onChange={(e, selected) => {
                                props.onChange(selected);
                            }}
                            sx={{
                                "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
                                    top: "calc(50% - 17px)",
                                },
                                "& .MuiButtonBase-root, & .MuiIconButton-root": {
                                    padding: "4px",
                                },
                                "& .MuiAutocomplete-input, & .MuiInputLabel-root": {
                                    fontSize: 15,
                                },
                            }}
                            size={"small"}
                        />
                    );
                },
            },
            {
                title: "Apply Date",
                field: "applyDate",
                editable: "never",
            },
            {
                title: "Status",
                field: "active",
                type: "boolean",
                editable: "onUpdate",
            },
            {
                title: "Sequence",
                field: "sequence",
                type: "numeric",
                editable: "never",
            },
        ]);
    }, [loanTypesData, startDateData, loanType]);

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

    //Add Fixed Row
    const addRow = (newRow) => new Promise((resolve, reject) => {
 
            const allowMultiple = loanTypesData.find((v) => v.value === newRow.loanType.value)?.allowMultiple;
            const multipleLoans = loansToEmployeesList.filter((v) => v.loanType === newRow.loanType.label);

            const monthlyEmis = multipleLoans.map((d) => ({monthlyEmis: d.monthlyEmis}))
            let item = []
            const x = monthlyEmis.forEach(v=>{v.monthlyEmis.forEach(p=>{item.push(p.isProcessed)})})
            let processedSchedules = item.find(m=>m === false)

            if ((multipleLoans.length === 0) || (processedSchedules === undefined)) {
                const data = {
                    amount: newRow.amount,
                    instalments: newRow.instalments,
                    effectiveDate: newRow.effectiveDate.startDate,
                    payrollDefinitionId: payroll.id,
                    payrollLoanTypeId: newRow.loanType.value,
                    employeeId: employee,
                    applyDate: new Date(),
                    active: true,
                    sequence: 1,
                };

                if (isExists(newRow)) {
                    reject();
                    return;
                }

                loansToEmployeesService()
                    .create(data)
                    .then(() => {
                        NotificationManager.success(
                            "A record was successfully created",
                            "Success"
                        );
                        //Reload list
                        fetchLoansToEmployeeFunc(payroll, employee);
                        resolve();
                    })
                    .catch((error) => {
                        console.error(error);
                        reject();
                    });
            }

            if (allowMultiple === true && multipleLoans.length >= 1) {
                swal
                    .fire({
                        title: "Are you sure?",
                        text: "Wish to add multiple loans to this loan type?",
                        type: "question",
                        showCancelButton: true,
                        icon: "question",
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        toast: true,
                    })
                    .then(async (result) => {
                        if (result.isConfirmed) {
                            const data = {
                                amount: newRow.amount,
                                instalments: newRow.instalments,
                                effectiveDate: newRow.effectiveDate.startDate,
                                payrollDefinitionId: payroll.id,
                                payrollLoanTypeId: newRow.loanType.value,
                                employeeId: employee,
                                applyDate: new Date(),
                                active: true,
                                sequence: multipleLoans.length + 1,
                            };

                            if (isExists(newRow)) {
                                reject();
                                return;
                            }

                            loansToEmployeesService()
                                .create(data)
                                .then(() => {
                                    NotificationManager.success(
                                        "A record was successfully created",
                                        "Success"
                                    );
                                    //Reload list
                                    fetchLoansToEmployeeFunc(payroll, employee);
                                    resolve();
                                })
                                .catch((error) => {
                                    console.error(error);
                                    reject();
                                });
                        } else {
                            reject();
                        }
                    });
            }

            if (allowMultiple === false && multipleLoans.length !== 0) {
                NotificationManager.warning(
                    "This loan type does not allow multiple loans to be added.",
                    "Warning"
                );
                reject();
            }
        });

    const isExists = (row) => {
        const multipleLoans = loansToEmployeesList.filter(
            (v) => v.loanType === row.loanType.label
        );
        const maxAmount = loanTypesData.find(
            (v) => v.label === row.loanType.label
        )?.maxAmount;
        const maxA = row.amount > maxAmount;

        const maxInstalments = loanTypesData.find(
            (v) => v.label === row.loanType.label
        )?.maxInstalments;
        const maxI = row.instalments > maxInstalments;

        if (maxA) {
            NotificationManager.error(
                "This loan exceeds its loan type maximum amount.",
                "Error"
            );
            return true;
        }
        if (maxI) {
            NotificationManager.error(
                "This loan exceeds its loan type maximum instalments.",
                "Error"
            );
            return true;
        }
        return false;
    };

    //Update Row
    const updateRow = (editedRow, prevRow) => new Promise((resolve, reject) => {
            const data = {
                amount: editedRow.amount,
                instalments: editedRow.instalments,
                effectiveDate:
                    editedRow.effectiveDate.startDate ?? editedRow.effectiveDate,
                payrollDefinitionId: payroll.id,
                payrollLoanTypeId:
                    editedRow.loanType.value ??
                    loanTypesData.find((p) => p.code === editedRow.loanType)?.value,
                employeeId: employee,
                applyDate: editedRow.applyDate,
                active: editedRow.active,
                sequence: editedRow.sequence,
            };
            loansToEmployeesService().update(data, editedRow.id)
                .then(() => {
                    fetchLoansToEmployeeFunc(payroll, employee);
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                });
        });

    //Delete Row
    const deleteRow = (deletedRow) => new Promise(async (resolve, reject) => {
            //Obj Create
            let loansToEmployees = {
                id: deletedRow.id,
            };
 
            if (payroll.isProcessed) {
                NotificationManager.error("This record was already used", "Error");
                reject();
                return;
            }

            await loansToEmployeesService()
                .deleteLoansToEmployees(loansToEmployees)
                .then(async (response) => {
                    //Reload list
                    fetchLoansToEmployeeFunc(payroll, employee);
                    resolve();
                    NotificationManager.success(
                        "A record was successfully deleted.",
                        "Success"
                    );
                })
                .catch((error) => {
                    console.log(error);
                    reject();
                    if (
                        error.status === RESP_STATUS_CODES.FORBIDDEN ||
                        error.status === RESP_STATUS_CODES.UNAUTHORIZED
                    ) {
                        NotificationManager.error(
                            NOTIFICATION_ERROR.AUTH_FAILED,
                            error.statusText
                        );
                    } else {
                        NotificationManager.error(
                            "An existing record already found",
                            "Error"
                        );
                    }
                });
        });

    const clickRow = (e, rowData) =>
        new Promise(async (resolve, reject) => {
          
            const {data} = await loansToEmployeesService().findOne(rowData.id);
            let scheduleData = data.monthlyEmis.map((loan) => {
                return {
                    no: loan.no,
                    principal: loan.principal,
                    interest: loan.interest,
                    processPeriod: processPeriodData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.label,
                };
            });
            //setScheduleData(pp);
            setLoansToEmployeesrDetails({
                ...omit(data, ["tableData"]),
                loanrowData: rowData,
                payroll: payroll,
                scheduleData: scheduleData,
                processPeriodData: processPeriodData,
            });
            history.push("/payroll-apply-loan-details");
        });

    return (
        <>
            <>
                <MaterialTable
                    icons={tableIcons}
                    title=""
                    columns={columns}
                    data={loansToEmployeesList}
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
                    }}
                    onRowsPerPageChange={(pageSize) =>
                        handlePageSize(pageSize, window.location.pathname)
                    }
                    onRowClick={(e, rowData) => clickRow(e, rowData)}
                    isLoading={isLoading}
                />
            </>
        </>
    );
};

const mapStateToProps = (state) => ({
    setLoansToEmployeesrDetails: state.setLoansToEmployeesrDetails,
});

export default connect(mapStateToProps, {
    setLoansToEmployeesrDetails,
})(LoansToEmployeesList);
