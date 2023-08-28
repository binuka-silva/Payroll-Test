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
import EmployeesToPayItemsExcelModal from "./EmployeesToPayItemsExcelModal";
import {NotificationManager} from "react-notifications";
import employeesToPayItemsServices from "../../api/employeesToPayItemsServices/employeesToPayItemsServices";
import {UploadFile} from "@mui/icons-material";
import {API_CONFIGURATIONS} from "../../api/constants/apiConfigurations";
import handlePageSize from "../../common/tablePageSize";

const EmployeesToPayItemsExcelList = ({
                                          employeeData,
                                          processPeriod,
                                          payrollPayItemsData,
                                          isLoading,
                                          setLoading,
                                          payroll
                                      }) => {
    const [columns, setColumns] = useState([]);
    const [selectedFileData, setSelectedFileData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null)
    const [tableData, setTableData] = useState([]);
    const [invalidData, setInvalidData] = useState([]);
    const [savedData, setSavedData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [invalidBtnStyle, setInvalidBtnStyle] = useState("secondary");
    const [hasDuplicateRecord, setDuplicateRecord] = useState(false);

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
                title: "Employee Id",
                field: "employee",
            },
            {
                title: "Name",
                field: "empName",
            },
            {
                title: "Pay Item Id",
                field: "payItem",
            },
            {
                title: "Amount",
                field: "amount",
                type: "numeric",
            },
            {
                title: "Units",
                field: "units",
                type: "numeric",
            },
            // {
            //   title: "Employer Amount",
            //   field: "employerAmount",
            //   type: "numeric",
            // },
            {
                title: "Start Date",
                field: "startDate",
                type: "date",
                dateSetting: {
                    locale: "pa-LK",
                },
            },
            {
                title: "End Date",
                field: "endDate",
                type: "date",
                dateSetting: {
                    locale: "pa-LK",
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

    const EXTENSIONS = ['xlsx', 'xls'];
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
                        cellText: false
                    });
                    const workSheetName = workbook.SheetNames[0];
                    const workSheet = workbook.Sheets[workSheetName];

                    const fileData = XLSX.utils.sheet_to_json(workSheet, {header: 1});
                    fileData.splice(0, 1);
                    setSelectedFileData(fileData);
                }
            } else {
                NotificationManager.error(
                    "Invalid File Format",
                    "Error"
                );
            }
        }
        e.target.value = '';
    }

    const convertToJson = (fileData) => {
        setInvalidBtnStyle("secondary");
        let rows = [];
        const inValidRecords = [];
        const headers = ["employee", "empName", "payItem", "amount", "units", "startDate", "endDate"];
        const timezoneOffset = new Date();
        fileData.forEach((row, rowIndex) => {
            const rowData = {};
            rowData.record = rowIndex + 2;
            row.forEach((element, index) => {
                if (index === 5 || index === 6) {
                    const parsedDate = new Date(element);
                    parsedDate.setHours(parsedDate.getHours() + timezoneOffset.getHours());
                    rowData[headers[index]] = new Date(parsedDate);
                } else {
                    rowData[headers[index]] = element;
                }
            });

            if ((isNaN(rowData.amount) && isNaN(parseFloat(rowData.amount)))) {
                rowData.reason = "Invalid Amount";
                inValidRecords.push(rowData);
            } else if (isNaN(rowData.units)) {
                rowData.reason = "Invalid Units";
                inValidRecords.push(rowData);
            } else if (rowData.startDate.getTime() !== rowData.startDate.getTime()) {
                rowData.reason = "Invalid Start Date";
                inValidRecords.push(rowData);
            } else if (rowData.endDate.getTime() !== rowData.endDate.getTime()) {
                rowData.reason = "Invalid End Date";
                inValidRecords.push(rowData);
            } else {
                const emp = employeeData.find(emp => emp.empNo === rowData.employee.toString());
                const payItem = payrollPayItemsData.find(item => item.payItemCode === rowData.payItem.toString());
                if (!emp) {
                    rowData.reason = "Invalid Employee";
                    inValidRecords.push(rowData);
                } else if (!payItem) {
                    rowData.reason = "Invalid Pay Item";
                    inValidRecords.push(rowData);
                } else {
                    rows = rows.filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t.employee === value.employee && t.payItem === value.payItem
                        )));

                    if (payroll.employeesToPayItems.find(p => p.employeeId === emp.id && p.payrollPayItemId === payItem.id))
                        setDuplicateRecord(true);
                    rows.push(rowData);
                }
            }
        });
        inValidRecords.length > 0 && setInvalidBtnStyle("warning");
        setInvalidData(inValidRecords);
        setTableData(rows);
    }

    const onReadFile = () => {
        if (selectedFileData) {
            setTableData([]);
            convertToJson(selectedFileData);
        } else {
            NotificationManager.error(
                "Please Select a File",
                "Error"
            );
        }
    }

    const fetchInvalidData = () => {
        setInvalidBtnStyle("secondary");
        setInvalidData([]);
        employeesToPayItemsServices().getAllInvalidEmployeesToPayItems(payroll.id).then(({data}) => {
            setInvalidData(data.map(d => ({
                record: d.record,
                id: d.id,
                employee: d.employeeId,
                payItem: d.payrollPayItemId,
                reason: d.reason
            })));
            if (data.length > 0) setInvalidBtnStyle("warning");
        }).catch((e) => {
            console.error(e);
        });
    }

    function saveDetails() {
        if (selectedFile) {
            setLoading(true);
            const employeesToPayItemsList = tableData.map((data) => ({
                employeeId: employeeData.find(emp => emp.empNo === data.employee.toString())?.id,
                payrollPayItemId: payrollPayItemsData.find(item => item.payItemCode === data.payItem.toString())?.id,
                payrollDefinitionId: payroll.id,
                amount: data.amount ?? null,
                units: data.units ?? null,
                employerAmount: null,
                isExcelUpload: true,
                startDate: data.startDate,
                endDate: data.endDate,
            }));

            const invalidEmployeesToPayItemsList = invalidData.map((data) => ({
                employeeId: data.employee,
                payrollPayItemId: data.payItem,
                payrollDefinitionId: payroll.id,
                reason: data.reason,
                record: data.record
            }));

            const excel = new FormData();
            excel.append('file', selectedFile);
            excel.append('employeesToPayItemsList', JSON.stringify(employeesToPayItemsList));
            excel.append("invalidEmployeesToPayItemsList", JSON.stringify(invalidEmployeesToPayItemsList));

            if (tableData.length === 0) return;

            employeesToPayItemsServices()
                .createExcel(excel)
                .then(({data}) => {
                    NotificationManager.success(
                        tableData.length +
                        " records was successfully created",
                        "Success"
                    );
                    setSavedData(data.result);
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

    return (
        <>
            {showModal && (
                <EmployeesToPayItemsExcelModal
                    show={showModal}
                    setShow={setShowModal}
                    invalidDataList={invalidData}
                />
            )}
            <MaterialTable
                icons={tableIcons}
                title={<>
                    <span><strong>Process Period: </strong>{processPeriod}</span>
                    &nbsp;&nbsp;
                    {tableData.length > 0 && <span><strong>Valid Count: </strong>{tableData.length}</span>}
                    &nbsp;&nbsp;
                    {invalidData.length > 0 &&
                        <span><strong style={{color: "red"}}>Invalid Count: </strong>{invalidData.length}</span>}
                    &nbsp;&nbsp;
                    <span><strong>Saved Count: </strong>{savedData.length}</span>
                </>}
                columns={columns}
                data={tableData}
                isLoading={isLoading}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                actions={[
                    {
                        icon: forwardRef((props, ref) => <UploadFile {...props} ref={ref}/>),
                        tooltip: 'Upload',
                        isFreeAction: true,
                        onClick: (event, rowData) => saveDetails()
                    }
                ]}
                components={{
                    Toolbar: props => (
                        <div>
                            <MTableToolbar {...props} />
                            <div className="d-flex gap-2">
                                <a href={`${API_CONFIGURATIONS.STATIC_FILES}/Excel-Upload-Template.xlsx`} download>Download
                                    Format</a>
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
                                    <Button variant="secondary" className="btn-sm" onClick={onReadFile}>
                                        Read & Verify
                                    </Button>
                                </div>
                                <div className="col-md-1">
                                    <Button variant={invalidBtnStyle} className="btn-sm"
                                            onClick={() => setShowModal(true)}>
                                        Invalid Records
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                }}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(EmployeesToPayItemsExcelList);
