import React, {forwardRef, useEffect, useState} from "react";

import MaterialTable, {MTableToolbar} from "@material-table/core";

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
import * as XLSX from 'xlsx/xlsx.mjs';
import {Button} from "react-bootstrap";
import LoanExcelModal from "./LoanExcelModal";
import {NotificationManager} from "react-notifications";
import loansToEmployeesService from "../../api/loansToEmployeesServices/loansToEmployeesService";

import {UploadFile} from "@mui/icons-material";
import {API_CONFIGURATIONS} from "../../api/constants/apiConfigurations";
import handlePageSize from "../../common/tablePageSize";
import {calculationLogic, payrollPeriodProcess,} from "./constant";
import moment from "moment";
import "moment-precise-range-plugin";
import {fixedInterestLoan, reducingBalanceLoan, reducingBalanceLoanPmt} from "../../common/loanCalculations";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import { requestPath } from "./constant";

const LoanExcelList = ({
                           employeeData,
                           loanTypeData,
                           payrollLoanTypeData,
                           loansToEmployeesData,
                           startDateData,
                           processPeriod,
                           payroll,
                           dateFromPeriod,
                           dateToPeriod,
                           tableData,
                           setTableData,
                           payrollProcessEmployeeStatusData,
                           setLoansToEmployeesData,
                           isLoading,
                           setLoading,
                           payrollOnChange,
                           setPayrollDetails
                       }) => {
    const [selectedFileData, setSelectedFileData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [invalidData, setInvalidData] = useState([]);
    const [savedData, setSavedData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [invalidBtnStyle, setInvalidBtnStyle] = useState("secondary");
    const [hasDuplicateRecord, setDuplicateRecord] = useState(false);

    let filteredLoans = [];

    useEffect(() => {
        window.scrollTo(0, 0);
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    useEffect(() => {
        if (payroll) {
            setTableData([]);
            fetchInvalidData(); 
        }
    }, [payroll]);

    useEffect(() => {
        hasDuplicateRecord && NotificationManager.warning("Duplicate Data will be Override", "Duplicate");
    }, [hasDuplicateRecord]);

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
            title: "Employee Id",
            field: "employee",
        },
        {
            title: "Employee Name",
            field: "empName",
        },
        {
            title: "Loan Type Id",
            field: "loanType",
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
            title: "Monthly Capital Amount",
            field: "capitalAmount",
            type: "numeric",
            editable: "never",
        },
        {
            title: "Monthly Interest Amount",
            field: "interestAmount",
            type: "numeric",
            editable: "never",
        },
        {
            title: "Monthly Installment Amount",
            field: "instalmentAmount",
            type: "numeric",
        },
        {
            title: "Effective Date",
            field: "effectiveDate",
            type: "date",
            dateSetting: {
                locale: "pa-LK",
            },
        },
        {
            title: "Apply Date",
            field: "applyDate",
            type: "date",
            dateSetting: {
                locale: "pa-LK",
            },
        },
        {
            title: "Status",
            field: "active",
            type: "boolean",
        },
        {
            title: "Sequence",
            field: "sequence",
        },
    ]

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

    const EXTENSIONS = ["xlsx", "xls"];

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const parts = file.name.split(".");
            setSelectedFile(file);
            const extension = parts[parts.length - 1];
            if (EXTENSIONS.includes(extension)) {
                const reader = new FileReader();
                reader.readAsBinaryString(file);

                reader.onload = (event) => {
                    const selected = event.target.result;
                    const workbook = XLSX.read(selected, {
                        type: "binary",
                        cellDates: true,
                        cellNF: false,
                        cellText: false,
                    });
                    const workSheetName = workbook.SheetNames[0];
                    const workSheet = workbook.Sheets[workSheetName];

                    const fileData = XLSX.utils.sheet_to_json(workSheet, {header: 1});
                    fileData.splice(0, 1);
                    setSelectedFileData(fileData);
                };
            } else {
                NotificationManager.error("Invalid File Format", "Error");
            }
        }
        e.target.value = "";
    };

    const convertToJson = (fileData) => {
        setInvalidBtnStyle("secondary");
        let rows = [];
        const inValidRecords = [];
        const headers = [
            "employee",
            "empName",
            "loanType",
            "amount",
            "instalments",
            "effectiveDate",
        ];
        const timezoneOffset = new Date();
        fileData.forEach((row, rowIndex) => {
            const rowData = {};
            rowData.record = rowIndex + 2;
            row.forEach((element, index) => {

                if (index === 5) {
                    const parsedDate = new Date(element);
                    parsedDate.setHours(
                        parsedDate.getHours() + timezoneOffset.getHours()
                    );
                    rowData[headers[index]] = new Date(parsedDate);
                } else {
                    rowData[headers[index]] = element;
                }
            });

            if (isNaN(rowData.amount) && isNaN(parseFloat(rowData.amount))) {
                rowData.reason = "Invalid Amount";
                inValidRecords.push(rowData);
            } else if (rowData.effectiveDate.getTime() !== rowData.effectiveDate.getTime()) {
                rowData.reason = "Invalid Effective Date";
                inValidRecords.push(rowData);
            } else if (isNaN(rowData.instalments) && isNaN(parseFloat(rowData.instalments))) {
                rowData.reason = "Invalid Instalments";
                inValidRecords.push(rowData);
            } else if (rowData.employee === "" || rowData.employee === " " || !rowData.employee) {
                rowData.reason = "The employee number field is blank.";
                inValidRecords.push(rowData);
            } else if (rowData.loanType === "" || rowData.loanType === " " || !rowData.loanType) {
                rowData.reason = "The loan type field is blank.";
                inValidRecords.push(rowData);
            } else if (rowData.amount === "" || rowData.amount === " " || !rowData.amount) {
                rowData.reason = "The amount field is blank";
                inValidRecords.push(rowData);
            } else if (rowData.instalments === "" || rowData.instalments === " " || !rowData.instalments) {
                rowData.reason = "The instalments field is blank";
                inValidRecords.push(rowData);
            } else if (rowData.effectiveDate === "" || rowData.effectiveDate === " " || !rowData.effectiveDate) {
                rowData.reason = "The effective date field is blank";
                inValidRecords.push(rowData);
            } else {

                const emp = employeeData?.find((emp) => emp.empNo === (rowData.employee).toString());
                const loanType = payrollLoanTypeData?.find((item) => item.loanTypeCode === (rowData.loanType).toString());

                const y = startDateData?.find((v) => v.periodNo !== payrollPeriodProcess.CLOSE)?.endDate;
                const effDateCheck = new Date(rowData.effectiveDate) < new Date(y);
 
                const z = startDateData?.filter((v) => v.periodNo !== payrollPeriodProcess.CLOSE);
                const effDate = z?.find((v) => (moment(v.startDate).format("YYYY-MM-DD")) === (moment(rowData.effectiveDate).format("YYYY-MM-DD"))); 

                const maxAmount = payrollLoanTypeData.find((v) => v.label === rowData.loanType)?.maxAmount;
                const maxA = rowData.amount > maxAmount;

                const maxInstalments = payrollLoanTypeData.find((v) => v.label === rowData.loanType)?.maxInstalments;
                const maxI = rowData.instalments > maxInstalments;

                //const loanTypeStatus = payrollLoanTypeData.find((v) => v.label === rowData.loanType)?.active;

                const multiple  = loansToEmployeesData.filter((v) => v.employee === (rowData.employee).toString());
                const loanTypes = payrollLoanTypeData.find(l => l.loanTypeCode === rowData.loanType);
                const allowMultiple = payrollLoanTypeData.find((v) => v.id === loanTypes?.id)?.allowMultiple;
                const multipleLoans = multiple.filter((v) => v.payrollLoanTypeCode === rowData.loanType);

                if (!emp) {
                    rowData.reason = "Invalid Employee";
                    inValidRecords.push(rowData);
                } else if (!loanType) {
                    rowData.reason = "Invalid Loan Type";
                    inValidRecords.push(rowData);
                } else if (effDate === undefined) {
                    rowData.reason = "Invalid effective date";
                    inValidRecords.push(rowData);
                } else if (maxA) {
                    rowData.reason = "This loan exceeds its loan type maximum amount.";
                    inValidRecords.push(rowData);
                } else if (maxI) {
                    rowData.reason = "This loan exceeds its loan type maximum instalments.";
                    inValidRecords.push(rowData);
                } else if (allowMultiple === false && multipleLoans.length !== 0) {
                    rowData.reason = "This loan type does not allow multiple loans to be added.";
                    inValidRecords.push(rowData);
                } else {
                    const loanType = loanTypeData.find(l => l.code === rowData.loanType);
                    let result;
                    //Todo: Remove Additional Loop -> MonthlyEmis Need only first
                    switch (loanType?.calculationLogic) {
                        case calculationLogic.SIMPLE_LOAN:
                            result = fixedInterestLoan(rowData.amount, loanType.interestRate, rowData.instalments);
                            break;
                        case calculationLogic.REDUCING_BALANCE:
                            result = reducingBalanceLoan(rowData.amount, loanType.interestRate, rowData.instalments);
                            break;
                        case calculationLogic.REDUCING_BALANCE_PMT:
                            result = reducingBalanceLoanPmt(rowData.amount, loanType.interestRate, rowData.instalments);
                            break;
                        default:
                            result = {};
                    }

                    const principal = result.monthlyEmi[0].principal;
                    const interest = result.monthlyEmi[0].interest;

                    rowData.capitalAmount = principal;
                    rowData.interestAmount = interest;
                    rowData.instalmentAmount = principal + interest;

                    rows = rows.filter((value, index, self) => index === self.findIndex((t) => t.employee === value.employee && t.loanType === value.loanType));

                    if (payroll.loansToEmployees?.find((p) => p.employeeId === emp.id && p.payrollLoanTypeId === loanType.id))
                        setDuplicateRecord(true);

                    rows.push(rowData);
                }
            }
        });

        inValidRecords?.length > 0 && setInvalidBtnStyle("warning");
        setInvalidData(inValidRecords);
        //setTableData(rows);

        setTableData(
            rows.map((row) => { 
            
                const multiple  = loansToEmployeesData.filter((v) => v.employee === (row.employee).toString());
                const loanType = payrollLoanTypeData.find(l => l.loanTypeCode === row.loanType);
                const allowMultiple = payrollLoanTypeData.find((v) => v.id === loanType.id)?.allowMultiple;
                const multipleLoans = multiple.filter((v) => v.payrollLoanTypeCode === row.loanType);

                const monthlyEmis = multipleLoans.map((d) => ({monthlyEmis: d.monthlyEmis }))
                let item = []
                const x = monthlyEmis.forEach(v=>{v.monthlyEmis.forEach(p=>{item.push(p.isProcessed)})})
                let processedSchedules = item.find(m=>m === false)

                if ((multipleLoans.length === 0) || (processedSchedules === undefined)) {
                    return {
                      ...row,
                      active: true,
                      applyDate: new Date(),
                      sequence: 1,
                    };
                }
                if (allowMultiple === true && multipleLoans.length >= 1) {    
                    return {
                      ...row,
                      active: true,
                      applyDate: new Date(),
                      sequence: multipleLoans.length + 1,
                    };
                } 
            })
        );
    };

    const onReadFile = () => {
        if (selectedFileData) {
            setTableData([]);
            convertToJson(selectedFileData);
        } else {
            NotificationManager.error("Please Select a File", "Error");
        }
    };

    const fetchInvalidData = () => {
        setInvalidBtnStyle("secondary");
        setInvalidData([]);
        loansToEmployeesService().getAllInvalidLoans(payroll.id)
            .then(({data}) => {
                setInvalidData(
                    data.map((d) => ({
                        record: d.record,
                        id: d.id,
                        employee: d.employeeId,
                        loanType: d.payrollLoanTypeId,
                        reason: d.reason,
                    }))
                );
                if (data?.length > 0) setInvalidBtnStyle("warning");
            })
            .catch((e) => {
                console.error(e);
            });
    };

    function saveDetails() {
        if (selectedFile) {
            setLoading(true);

            const loansToEmployeesList = filteredLoans.map((data) => ({
                employeeId: employeeData?.find(emp => emp.empNo === data.employee.toString())?.id,
                payrollLoanTypeId: payrollLoanTypeData?.find(item => item.loanTypeCode === data.loanType.toString())?.id,
                payrollDefinitionId: payroll.id,
                amount: parseInt(data.amount) ?? null,
                instalments: data.instalments ?? null,
                isExcelUpload: true,
                effectiveDate: data.effectiveDate,
                applyDate: new Date(),
                active: true,
                sequence: data.sequence,
            }));

            const invalidLoansToEmployeesList = invalidData.map((data) => ({
                employeeId: data.employee,
                payrollLoanTypeId: data.loanType,
                payrollDefinitionId: payroll.id,
                reason: data.reason,
                record: data.record
            }));

            const excel = new FormData();
            excel.append('file', selectedFile);
            excel.append('loansToEmployeesList', JSON.stringify(loansToEmployeesList));
            excel.append("invalidLoansToEmployeesList", JSON.stringify(invalidLoansToEmployeesList));

            if (tableData.length === 0) return;

            loansToEmployeesService()
                .createExcel(excel)
                .then(async({data}) => {
                    NotificationManager.success(
                        tableData.length +
                        " records was successfully created",
                        "Success"
                    );
                    
                    setSavedData(data.result);

                    const tempData = tableData.map(t => {
                        const exists = filteredLoans.find(f => t.employee === f.employee && t.loanType === f.loanType && t.sequence === f.sequence);
                        return exists ? {...t, isSaved: true} : t
                    });
                    setTableData(tempData);
                    let payrolData = await payrollProcessService().findOne(payroll.id,requestPath);
                    setPayrollDetails(payrolData.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.error(error);
                    if (error.statusCode === 409) {
                        NotificationManager.error(error.message, "Error");
                    } else {
                        NotificationManager.error("Failed to save", "Error");
                    }
                });
        }
    }

    function selectedRows(rows) {
        filteredLoans = rows;
    }

    return (
      <>
        {showModal && (
          <LoanExcelModal
            show={showModal}
            setShow={setShowModal}
            invalidDataList={invalidData}
          />
        )}
        <div className="row mb-2 gap-5">
          <div className="col">
            <span>
              <strong>Process Period: </strong>
              {processPeriod}
            </span>
            &nbsp;&nbsp;
            {tableData?.length > 0 && (
              <span>
                <strong>Valid Count: </strong>
                {tableData?.length}
              </span>
            )}
            &nbsp;&nbsp;
            {invalidData?.length > 0 && (
              <span>
                <strong style={{ color: "red" }}>Invalid Count: </strong>
                {invalidData?.length}
              </span>
            )}
            &nbsp;&nbsp;
            <span>
              <strong>Saved Count: </strong>
              {savedData?.length}
            </span>
          </div>
        </div>
        <MaterialTable
          icons={tableIcons}
          title={""}
          columns={columns}
          data={tableData}
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
            selection: true,
              selectionProps: rowData => ({
                  disabled: rowData.isSaved
              }),
          }}
          onSelectionChange={selectedRows}
          onRowsPerPageChange={(pageSize) =>
            handlePageSize(pageSize, window.location.pathname)
          }
          actions={[
            {
              icon: forwardRef((props, ref) => (
                <UploadFile {...props} ref={ref} />
              )),
              tooltip: "Upload",
              onClick: (event, rowData) => saveDetails(),
            },
          ]}
          components={{
            Toolbar: (props) => (
              <div>
                <MTableToolbar {...props} />
                <div className="d-flex gap-2">
                  <a
                    href={`${API_CONFIGURATIONS.STATIC_FILES}/Loans Upload Format.xlsx`}
                    download
                  >
                    Download Format
                  </a>
                  <div className="col-md-1">
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
                      onChange={handleFileSelect}
                      id="upload-single-file"
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      type="file"
                    />
                  </div>
                  {selectedFile && <div>{selectedFile.name}</div>}
                  <div className="col-md-1">
                    <Button
                      variant="secondary"
                      className="btn-sm"
                      onClick={onReadFile}
                    >
                      Read & Verify
                    </Button>
                  </div>
                  <div className="col-md-1">
                    <Button
                      variant={invalidBtnStyle}
                      className="btn-sm"
                      onClick={() => setShowModal(true)}
                    >
                      Invalid Records
                    </Button>
                  </div>
                </div>
              </div>
            ),
          }}
        />
      </>
    );
};

export default LoanExcelList;
