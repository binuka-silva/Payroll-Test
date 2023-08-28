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
import {Dropdown} from "react-bootstrap";

import payItemTypeService from "app/api/payItemTypeServices/payItemTypeService";
import paymentTypeService from "app/api/paymentTypeServices/paymentTypeService";
import payItemPeriodService from "app/api/payItemPeriodServices/payItemPeriodService";
import payItemService from "../../api/payItemServices/payItemService";
import history from "../../../@history";
import {connect} from "react-redux";
import {setPayItemCalculationsDetails} from "../../redux/actions/PayItemCalculationsActions";
import PayItemModal from "./PayItemModal";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import handlePageSize from "../../common/tablePageSize";

const PayItemList = ({fetchPayItemDataFunc, payItemList, setPayItemCalculationsDetails, isLoading}) => {
    const [payItemTypeData, setPayItemTypeData] = useState([]);
    const [payItemPeriodData, setPayItemPeriodData] = useState([]);
    const [paymentTypeData, setPaymentTypeData] = useState([]);

    const [payItemType, setPayItemType] = useState("");
    const [payItemPeriod, setPayItemPeriod] = useState("");
    const [paymentType, setPaymentType] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [glCode, setGlCode] = useState("");
    const [rowData, setRowData] = useState({});

    //Table Columns
    const [columns, setColumns] = useState([]);

    useEffect(async () => {
        window.scrollTo(0, 0);
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        await fetchPayItemTypeData();
        await fetchPayItemPeriodData();
        await fetchPaymentTypeData();
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
                title: "Pay Item Code",
                field: "code",
                validate: (rowData) =>
                    rowData.code === undefined
                        ? {isValid: false, helperText: "Code is required"}
                        : rowData.code === ""
                            ? {isValid: false, helperText: "Code is required"}
                            : true,
                editable: "onAdd",
            },
            {
                title: "Pay Item Name",
                field: "name",
                validate: (rowData) =>
                    rowData.name === undefined
                        ? {isValid: false, helperText: "Name is required"}
                        : rowData.name === ""
                            ? {isValid: false, helperText: "Name is required"}
                            : true,
            },
            {
                title: "Pay Item Type",
                field: "payItemType",
                editComponent: (props) => {

                    let x = payItemTypeData.find((b) => b.label === props.value);
                    x && setPayItemType(x.value);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={payItemTypeData}
                            onChange={(e, selected) => {
                                setPayItemType(selected?.value);
                                props.onChange(selected);
                            }}
                            label="Select"
                            defaultValue={x ?? props.value}
                        />
                    );
                },
            },
            {
                title: "Pay Item Period",
                field: "payItemPeriod",
                editComponent: (props) => {
                    let x = payItemPeriodData.find((b) => b.label === props.value);
                    x && setPayItemPeriod(x.value);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={payItemPeriodData}
                            onChange={(e, selected) => {
                                setPayItemPeriod(selected?.value);
                                props.onChange(selected);
                            }}
                            label="Select"
                            defaultValue={x ?? props.value}
                        />
                    );
                },
            },
            {
                title: "Active Status",
                field: "active",
                type: "boolean",
                color: "primary",
            },
            {
                title: "Process Order",
                field: "order",
                type: "numeric",
                validate: (rowData) =>
                    rowData.order === undefined
                        ? {isValid: false, helperText: "Order is required."}
                        : rowData.order === ""
                            ? {isValid: false, helperText: "Order is required."}
                            : true,
            },
            {
                title: "Payment Type",
                field: "paymentType",
                editComponent: (props) => {
                    let x = paymentTypeData.find((b) => b.label === props.value);
                    x && setPaymentType(x.value);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={paymentTypeData}
                            onChange={(e, selected) => {
                                setPaymentType(selected?.value);
                                props.onChange(selected);
                            }}
                            label="Select"
                            defaultValue={x ?? props.value}
                        />
                    );
                },
            },
        ]);
    }, [payItemTypeData, payItemPeriodData, paymentTypeData]);

    //Load data
    async function fetchPayItemTypeData() {
        payItemTypeService()
            .getAll()
            .then(async (response) => {
                let payItemTypeDataArray = [];
                response.data.forEach((item) => {
                    payItemTypeDataArray.push({value: item.id, label: item.type});
                });
                setPayItemTypeData(payItemTypeDataArray);
            });
    }

    //Load data
    async function fetchPayItemPeriodData() {
        payItemPeriodService()
            .getAll()
            .then(async (response) => {
                let payItemPeriodDataArray = [];
                response.data.forEach((item) => {
                    payItemPeriodDataArray.push({value: item.id, label: item.name});
                });
                setPayItemPeriodData(payItemPeriodDataArray);
            });
    }

    //Load data
    async function fetchPaymentTypeData() {
        paymentTypeService()
            .getAll()
            .then(async (response) => {
                let paymentTypeDataArray = [];
                response.data.forEach((item) => {
                    paymentTypeDataArray.push({value: item.id, label: item.type});
                });
                setPaymentTypeData(paymentTypeDataArray);
            });
    }

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
    const addRow = async (newRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create
            let payItem = {
                code: newRow.code,
                name: newRow.name,
                payItemTypeId: payItemType,
                payItemPeriodId: payItemPeriod,
                active: newRow.active ?? false,
                order: parseInt(newRow.order),
                paymentTypeId: paymentType,
                createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            };

            payItemService()
                .create(payItem)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    fetchPayItemDataFunc();
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.status === 409) {
                        NotificationManager.error(error.message, "Error");
                    }
                    if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                        NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
                    }
                    reject();
                    // throw new Error("An error occurred when attempting to add a record !");
                });
        });

    //Update Row
    const updateRow = (editedRow) =>
        new Promise(async (resolve, reject) => {
            //Obj update
            let payItem = {
                code: editedRow.code,
                name: editedRow.name,
                payItemTypeId: payItemType,
                payItemPeriodId: payItemPeriod,
                active: editedRow.active ?? false,
                order: parseInt(editedRow.order),
                paymentTypeId: paymentType,
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            await payItemService()
                .update(payItem, editedRow.id)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );
                    //Reload list
                    fetchPayItemDataFunc();
                    resolve();
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

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create
            let payItem = {
                id: deletedRow.id,
            };
            await payItemService()
                .deletePayItem(payItem)
                .then(async (response) => {
                    //Reload list
                    fetchPayItemDataFunc();
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

    const onCalculationClick = async (e) => {
        const {data} = await payItemService().getFormula(rowData.id);
        data?.formula?.payItem && delete data.formula.payItem;
        setPayItemCalculationsDetails(data);
        history.push("/pay-items-calculations");
    }

    const onOtherDetailsClick = async (e) => {
        const {data} = await payItemService().findOne(rowData.id);
        setGlCode(data.glCode);
        setShowModal(true);
    }

    const handleGlCodeSet = async (e) => {
        try {
            const res = await payItemService().setGlCode(rowData.id, e);

            setShowModal(false);
            NotificationManager.success(
                "A record was successfully updated",
                "Success"
            );
        } catch (e) {
            console.error(e);
            NotificationManager.error(
                "Saving Failed",
                "Error"
            );
        }
    }

    const fetchTableData = (query) => {
        const tableData = payItemService()
            .getAllByPagination(
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var mappedData = data.payItem.map(item => ({
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    payItemType: item.payItemType.type,
                    payItemPeriod: item.payItemPeriod.name,
                    active: item.active,
                    order: item.order,
                    paymentType: item.paymentType.type,
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
            {showModal && (
                <PayItemModal
                    show={showModal}
                    setShow={setShowModal}
                    glCode={glCode}
                    setGlCode={handleGlCodeSet}
                />
            )}
            <MaterialTable
                icons={tableIcons}
                title=""
                columns={columns}
                //   data={payItemList}
                data={(query) => fetchTableData(query)}
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
                    emptyRowsWhenPaging: false
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                actions={[{
                    icon: forwardRef((props, ref) => (
                        <Dropdown>
                            <Dropdown.Toggle className="toggle-hidden border-0 bg-white d-flex flex-column">
                                <span className="_dot _inline-dot bg-black mb-1"></span>
                                <span className="_dot _inline-dot bg-black mb-1"></span>
                                <span className="_dot _inline-dot bg-black"></span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={onCalculationClick}>
                                    Calculations
                                </Dropdown.Item>
                                <Dropdown.Item onClick={onOtherDetailsClick}>
                                    Other Details
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )),
                    tooltip: "Details",
                    onClick: (e, row) => setRowData(row),
                },
                ]}
                isLoading={isLoading}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayItemCalculationsDetails: state.setPayItemCalculationsDetails,
});

export default connect(mapStateToProps, {
    setPayItemCalculationsDetails,
})(PayItemList);
