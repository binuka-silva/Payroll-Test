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
import {FormLabel, FormSelect} from "react-bootstrap";
import {connect, useSelector} from "react-redux";
import {omit} from "lodash";
import history from "../../../@history";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import {setBankFile} from "../../redux/actions/BankFileAction";
import PayrollBankDisketteModal from "./payrollBankDisketteModal";

import bankFileService from "../../api/bankDisketteServices/bankFileService";
import payrollBankDisketteService from "../../api/payrollBankDisketteServices/payrollBankDisketteService";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import handlePageSize from "../../common/tablePageSize";
import swal from "sweetalert2";

const PayrollBankDisketteList = ({
                                     fetchPayrollBankDisketteFunc,
                                     payrollBankDisketteList,
                                     payrollBankDiskettes,
                                     bankFileData,
                                     isLoading,
                                     setBankFile,
                                     setPayrollTaxDetails,
                                     fetchPayrollPayItemFunc,
                                     payrollPayItemData,
                                 }) => {
    const [bankFile, setBankFiles] = useState("");
    const [payItem, setPayItem] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [payrollProcessData, setPayrollProcessData] = useState([]);

    //Table Columns
    const [columns, setColumns] = useState([]);

    const payroll = useSelector((state) => state.payrollTaxDetails);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
        fetchPayrollPayItemFunc();
        fetchPayrollProcessData();
    }, []);

    //Table Columns
    useEffect(() => {
        const selectedBankFile =
            bankFileData.find((p) => p.value === bankFile) ?? {};
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
                title: "Bank File Code",
                field: "bankFile",
                editable: "onAdd",
                editComponent: (props) => {
                    let x = bankFileData.find((b) => b.label === props.value)?.value;
                    x && setBankFiles(x);
                    return (
                        <FormSelect
                            onChange={(e) => {
                                props.onChange(e.target.value);
                                setBankFiles(e.target.value);
                            }}
                            value={x ?? props.value}
                        >
                            <option>Select</option>
                            {bankFileData.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
            {
                title: "Bank File Name",
                field: "bankFileName",
                editable: "never",
                emptyValue: selectedBankFile?.bankFileName ?? "",
            },
            {
                title: "Bank Name",
                field: "bank",
                editable: "never",
                emptyValue: selectedBankFile?.bank ?? "",
            },
            {
                title: "Assign for Payroll",
                field: "active",
                type: "boolean",
                editable: "onUpdate",
            },
            {
                title: "Assigned Date",
                field: "assignedDate",
                type: "date",
                editable: "never",
            },
        ]);
    }, [bankFileData, bankFile]);

    //Fetch table data
    const fetchPayrollProcessData = () => {
        payrollProcessService()
            .getAll()
            .then(({data}) => {
                data = data.map((payrollProcess) => {
                    return {
                        id: payrollProcess.id,
                        code: payrollProcess.code,
                        name: payrollProcess.name,
                        payrollPayItemForNetSalaryId: payrollProcess.payrollPayItemForNetSalaryId,
                    };
                });
                setPayrollProcessData(data);
            });
    };

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
            let payrollBankDiskette = {
                bankFileId: bankFile,
                payrollDefinitionId: payroll.id,
                active: true,
                assignedDate: new Date(),
            };

            if (isExists(newRow)) {
                reject();
                return;
            }

            payrollBankDisketteService()
                .create(payrollBankDiskette)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );

                    //Reload list
                    fetchPayrollBankDisketteFunc();
                    resolve();

                    // onSave();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.statusCode === 409) {
                        NotificationManager.error(error.message, "Error");
                    }

                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                        NotificationManager.error(
                            NOTIFICATION_ERROR.AUTH_FAILED,
                            error.statusText
                        );
                    }

                    reject();
                });
        });

    const onSave = () =>
        new Promise((resolve, reject) => {
            history.push("/payroll");
        });

    //Update Row
    const updateRow = (editedRow, prevRow) =>
        new Promise((resolve, reject) => {
            //Obj update
            let payrollBankDiskette = {
                id: editedRow.id,
                bankFileId: bankFileData.find((b) => b.label === editedRow.bankFile)
                    ?.value,
                payrollDefinitionId: payroll.id,
                active: editedRow.active,
                assignedDate: new Date(),
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            if (prevRow.active && !editedRow.active && payroll.isProcessed) {
                NotificationManager.error("This record was already used", "Error");
                reject();
                return;
            }

            payrollBankDisketteService()
                .update(payrollBankDiskette, editedRow.id)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );

                    //Reload list
                    fetchPayrollBankDisketteFunc();
                    resolve();

                    //onSave();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
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

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise((resolve, reject) => {
            //Obj Create
            let payrollBankDiskette = {
                id: deletedRow.id,
            };

            if (payroll.isProcessed) {
                NotificationManager.error("This record was already used", "Error");
                reject();
                return;
            }

            payrollBankDisketteService()
                .deletePayrollBankDiskette(payrollBankDiskette)
                .then((response) => {
                    //Reload list
                    fetchPayrollBankDisketteFunc();
                    resolve();
                    NotificationManager.success(
                        "A record was successfully deleted.",
                        "Success"
                    );
                    //onSave();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
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

    const isExists = (row) => {
        const x = bankFileData.find((b) => b.value === row.bankFile)?.label;

        const existBankFiles = payrollBankDisketteList.find(
            (detail) => detail.bankFile === x
        );

        if (existBankFiles) {
            NotificationManager.error("This bank File was already used", "Error");
            return true;
        }

        return false;
    };

    let fixedpayrollPayItemData = payrollPayItemData.filter((v) => v.payItemPeriod === "Fixed");

    const clickRow = (e, rowData) =>
        new Promise(async (resolve, reject) => {

            const fileId = bankFileData.find((b) => b.label === rowData.bankFile)?.value;

            const {data} = await bankFileService().findOne(fileId);

            // let bankFileLineTypeDataArray = [];
            // let confLineTypeDataArray = [];

            //   bankFileLineTypeDataArray = data.bankFileConfigurator.filter((v) => v.lineType.multiLines === true);
            //   confLineTypeDataArray = bankFileLineTypeDataArray.map((lType) => ({
            //     confId: lType.id,
            //     lineTypeId: lType.lineType.id,
            //     label: lType.lineType.lineName,
            //   }));


            setBankFile({
                ...omit(data, ["tableData"]),
                // lineTypeDataList: confLineTypeDataArray,
            });
            setShowModal(true);
        });

    // const clickRow = async (e, rowData) => {
    //   setBankFile(omit(rowData, ["tableData"]));
    //   setShowModal(true);
    // };

    const addPayrollPayItem = (payItem) => {
        new Promise((resolve, reject) => {
            swal
                .fire({
                    title: "Are you sure??",
                    text: "This pay item will be used as a base salary transfer item.",
                    type: "question",
                    showCancelButton: true,
                    width: 500,
                    icon: "question",
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        let payrollId = payroll.id;

                        //Obj Create
                        const payItemId = {
                            id: payrollId,
                            PayrollPayItemForNetSalaryId: payItem,
                        };

                        payrollProcessService()
                            .updatePayrollPayItem(payItemId, payrollId)
                            .then((response) => {
                                NotificationManager.success(
                                    "A record was successfully created.",
                                    "Success"
                                );
                                //Reload list
                                resolve();
                            })
                            .catch((error) => {
                                console.error(error);
                                NotificationManager.error(
                                    "An existing record already found",
                                    "Error"
                                );
                                reject();
                            });
                    }
                });
        });
    };

    return (
        <>
            {showModal && (
                <PayrollBankDisketteModal
                    show={showModal}
                    setShow={setShowModal}
                    fixedpayrollPayItemData={fixedpayrollPayItemData}
                    payrollProcessData={payrollProcessData}
                />
            )}
            {/* <div className="col-md-6">
        <Button
          aria-label="add"
          size="medium"
          onClick={() => history.push("/bank-file")}
        >
          <ArrowBackIcon fontSize="medium" />
          Bank Files
        </Button>
      </div> */}
            <br/>
            <br/>
            <br/>
            <MaterialTable
                icons={tableIcons}
                title={
                    <>
                        <div>
                            <FormLabel>Salary Transfer Item</FormLabel>
                            <AutoCompleteDropDown
                                isFreeDropDown={true}
                                dropDownData={fixedpayrollPayItemData}
                                onChange={(e, selected) => {
                                    setPayItem(selected?.value);
                                    addPayrollPayItem(selected?.value);
                                }}
                                sx={{
                                    width: 200,
                                    "& .css-1q60rmi-MuiAutocomplete-endAdornment": {
                                        top: "calc(50% - 17px)",
                                    },
                                    "& .MuiButtonBase-root, & .MuiIconButton-root": {
                                        padding: "4px",
                                    },
                                }}
                                size={"small"}
                                label="Search"
                                defaultValue={
                                    payItem
                                        ? fixedpayrollPayItemData?.find((v) => v.value === payItem)
                                            ?.label
                                        : fixedpayrollPayItemData.find(
                                            (v) =>
                                                v.value ===
                                                payrollProcessData.find(
                                                    (p) => p.payrollPayItemForNetSalaryId === v.value
                                                )?.payrollPayItemForNetSalaryId
                                        )?.label
                                }
                            />
                        </div>
                    </>
                }
                columns={columns}
                data={payrollBankDisketteList}
                editable={{
                    onRowAdd: (newRow) => addRow(newRow),
                    onRowUpdate: (editedRow, prevRow) => updateRow(editedRow, prevRow),
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
    );
};

const mapStateToProps = (state) => ({
    setBankFile: state.setBankFile,
});

export default connect(mapStateToProps, {setBankFile})(
    PayrollBankDisketteList
);
