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
import {FormSelect} from "react-bootstrap";
import {arithmeticalSignCons} from "../constant";

import payItemGroupDetailsService from "../../../api/payItemGroupServices/payItemGroupDetailsService";
import localStorageService from "../../../services/localStorageService";
import handlePageSize from "../../../common/tablePageSize";

const PayItemGroupDetailsList = ({
                                     setPayItemGroupDetailsList,
                                     payItemGroupDetailsList,
                                     fetchPayItemPeriodDetailsDataFunc,
                                     payItemData,
                                     arithmeticSigns,
                                     setPayItemData,
                                     setArithmeticSigns,
                                     payItemGroupId,
                                     payItemGroup,
                                 }) => {
    const [payItem, setPayItem] = useState("");
    const [payItemName, setPayItemName] = useState("");
    const [payItemPeriod, setPayItemPeriod] = useState("");
    const [sign, setSign] = useState("");

    //Table Columns
    const [columns, setColumns] = useState([]);

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

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
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
                title: "Arithmetical Sign",
                field: "arithmeticalSign",
                editComponent: (props) => {
                    let x = arithmeticSigns.find((b) => b.label === props.value)?.value;
                    x && setSign(x);
                    return (
                        <FormSelect
                            onChange={(e) => {
                                const index = e.target.options.selectedIndex;
                                props.onChange(e.target.options[index].label);
                                setSign(e.target.value);
                            }}
                            value={x ?? props.value}
                        >
                            <option>Select</option>
                            {arithmeticSigns.map((sign) => (
                                <option key={sign.value} value={sign.value}>
                                    {sign.label}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
            {
                title: "Pay Item",
                field: "payItem",
                editComponent: (props) => {
                    let x = payItemData.find((b) => b.label === props.value)?.value;
                    x && setPayItem(x);
                    return (
                        <FormSelect
                            onChange={(e) => {
                                const index = e.target.options.selectedIndex;
                                props.onChange(e.target.options[index].label);
                                setPayItem(e.target.value);
                            }}
                            value={x ?? props.value}
                        >
                            <option>Select</option>
                            {payItemData.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </FormSelect>
                    );
                },
            },
            {
                title: "Pay Item Name",
                field: "payItemName",
                editable: "never"
            },
            {
                title: "Description",
                field: "description",
            }
        ]);
    }, [arithmeticSigns, payItemData]);

    //Add Row
    const addRow = (newRow) =>
        new Promise((resolve, reject) => {
            if (!(newRow.arithmeticalSign && newRow.payItem)) return reject();

            if (isExists(newRow)) return reject();

            const payItem = payItemData.find(item => item.label === newRow.payItem);

            newRow.payItemName = payItem.name;
            setPayItemGroupDetailsList([...payItemGroupDetailsList, newRow]);
            resolve();
        });

    //Update Row
    const updateRow = (editedRow, oldData) =>
        new Promise((resolve, reject) => {
            if (!(editedRow.arithmeticalSign && editedRow.payItem)) return reject();

            if (isExists(editedRow)) return reject();

            const payItem = payItemData.find(item => item.label === editedRow.payItem);
            editedRow.payItemName = payItem.name;

            const dataUpdate = [...payItemGroupDetailsList];
            const index = oldData.id ?? oldData.tableData.id;

            dataUpdate[index] = editedRow;

            oldData.id
                ? setPayItemGroupDetailsList([
                    ...payItemGroupDetailsList.filter(
                        (c) => c.id !== editedRow.id
                    ),
                    editedRow,
                ])
                : setPayItemGroupDetailsList([...dataUpdate])
            resolve();
        });

    //Delete Row
    const deleteRow = (oldData) =>
        new Promise((resolve, reject) => {
            let dataDelete = [...payItemGroupDetailsList];
            const index = oldData.tableData.id;
            if (typeof index === "string") {
                dataDelete = dataDelete.filter(data => data.id !== index);
            } else {
                dataDelete.splice(index, 1);
            }
            setPayItemGroupDetailsList(dataDelete);
            resolve();
        });

    const isExists = (row) => {
        const exists = payItemGroupDetailsList.filter(detail => detail.arithmeticalSign === row.arithmeticalSign && detail.payItem === row.payItem && detail.id !== row.id);

        if (exists?.length > 0) {
            NotificationManager.error(
                "Duplicate data added",
                "Error"
            );

            return true;
        }

        return false;
    }

    const fetchTableData = (query) => {
        const tableData = payItemGroupDetailsService()
            .findAllByGroupIdWithPagination(
                payItemGroupId,
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var mappedData = data.payItemGroupDetail.map(item => ({
                    id: item.id,
                    arithmeticalSign: Object.keys(arithmeticalSignCons).find(key => arithmeticalSignCons[key] === item.arithmaticSign),
                    payItem: item.payItem.code,
                    payItemName: item.payItem.name,
                    description: item.description,
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
            <MaterialTable
                icons={tableIcons}
                title={""}
                columns={columns}
                data={payItemGroupDetailsList}
                // data={(query) => fetchTableData(query)}
                editable={{
                    onRowAdd: (newRow) => addRow(newRow),
                    onRowUpdate: (editedRow, oldData) => updateRow(editedRow, oldData),
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
            />
        </>
    );
};

export default PayItemGroupDetailsList;
