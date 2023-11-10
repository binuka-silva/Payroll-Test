import React, {forwardRef, useEffect} from "react";

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
import {FormatAlignJustify, Search} from "@material-ui/icons";
import {NotificationManager} from "react-notifications";
import history from "../../../@history";
import {connect} from "react-redux";

import bankService from "../../api/bankServices/bankService";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";

import {setBankDetails} from "../../redux/actions/BankDetailsAction";
import handlePageSize from "../../common/tablePageSize";
import {omit} from "lodash";

import "./bankList.scss";
import { Padding } from "@mui/icons-material";

import { editButtonColor, tableHeaderBackgroundColor, tableHeaderFontColor, tableHeaderFontSize } from "styles/globalStyles/globalStyles";
import { deleteButtonColor } from "styles/globalStyles/globalStyles";
import { tableIconColor } from "styles/globalStyles/globalStyles";
import { tableBackgroundColor } from "styles/globalStyles/globalStyles";

const BankList = ({fetchBankDataFunc, bankList, setBankDetails, isLoading}) => {

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    const  tableIcons = {
        Add: forwardRef((props, ref) => <AddBox style={{color:tableIconColor}}  {...props} ref={ref}/>),
        Check: forwardRef((props, ref) => <Check style={{color:tableIconColor}} {...props} ref={ref}/>),
        Clear: forwardRef((props, ref) => <Clear style={{color:tableIconColor}} {...props} ref={ref}/>),
        Delete: forwardRef((props, ref) => <DeleteOutline style={{backgroundColor:deleteButtonColor}} className="iconButton"  {...props} ref={ref}/>),
        DetailPanel: forwardRef((props, ref) => (
            <ChevronRight style={{color:tableIconColor}} {...props} ref={ref}/>
        )),
        Edit: forwardRef((props, ref) => <Edit className="iconButton" style={{backgroundColor:editButtonColor}}  {...props} ref={ref}/>),
        Export: forwardRef((props, ref) => <SaveAlt style={{color:tableIconColor}} {...props} ref={ref}/>),
        Filter: forwardRef((props, ref) => <FilterList style={{color:tableIconColor}} {...props} ref={ref}/>),
        FirstPage: forwardRef((props, ref) => <FirstPage style={{color:tableIconColor}} {...props} ref={ref}/>),
        LastPage: forwardRef((props, ref) => <LastPage style={{color:tableIconColor}} {...props} ref={ref}/>),
        NextPage: forwardRef((props, ref) => <ChevronRight style={{color:tableIconColor}} {...props} ref={ref}/>),
        PreviousPage: forwardRef((props, ref) => (
            <ChevronLeft style={{color:tableIconColor}} {...props} ref={ref}/>
        )),
        ResetSearch: forwardRef((props, ref) => <Clear style={{color:tableIconColor}} {...props} ref={ref}/>),
        Search: forwardRef((props, ref) => <Search style={{color:tableIconColor}} {...props} ref={ref}/>),
        SortArrow: forwardRef((props, ref) => (
            <ArrowDownward style={{color:tableIconColor}} {...props} ref={ref}/>
        )),
        ThirdStateCheck: forwardRef((props, ref) => (
            <Remove  style={{color:tableIconColor}} {...props} ref={ref}/>
        )),
        ViewColumn: forwardRef((props, ref) => <ViewColumn style={{color:tableIconColor}} {...props} ref={ref}/>),
    };

    //Table Columns
    const columnsDataTable = [
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
            title: "Code",
            field: "code",
            validate: (rowData) =>
                rowData.code === undefined
                    ? {
                        isValid: false,
                        helperText: "EmployeeTemplateDetails code is required",
                    }
                    : rowData.code === ""
                        ? {
                            isValid: false,
                            helperText: "EmployeeTemplateDetails code is required",
                        }
                        : true,
            editable: "onAdd",
        },
        // {
        //     title: "Name",
        //     field: "name",
        //     validate: (rowData) =>
        //         rowData.name === undefined
        //             ? {
        //                 isValid: false,
        //                 helperText: "EmployeeTemplateDetails name is required",
        //             }
        //             : rowData.name === ""
        //                 ? {
        //                     isValid: false,
        //                     helperText: "EmployeeTemplateDetails name is required",
        //                 }
        //                 : true,
        // },
        {
            title: "Address",
            field: "address",
            validate: (rowData) =>
                rowData.address === undefined
                    ? {
                        isValid: false,
                        helperText: "EmployeeTemplateDetails address is required.",
                    }
                    : rowData.address === ""
                        ? {
                            isValid: false,
                            helperText: "EmployeeTemplateDetails address is required.",
                        }
                        : true,
        },
    ];

    //Add Row
    const addRow = async (newRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create
            let bank = {
                code: newRow.code,
                name: newRow.name,
                address: newRow.address,
                IsDelete: false,
                createdDateTime: new Date(),
                createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            };

            bankService()
                .create(bank)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    fetchBankDataFunc();
                    resolve();
                })
                .catch((error) => {
                    if (error.statusCode === 409) {
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
            let bank = {
                id: editedRow.id,
                code: editedRow.code,
                name: editedRow.name,
                address: editedRow.address,
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            await bankService()
                .update(bank)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );
                    //Reload list
                    fetchBankDataFunc();
                    resolve();
                })
                .catch((error) => {
                    console.log(error);
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
            let bank = {
                id: deletedRow.id,
            };
            await bankService()
                .deleteBank(bank)
                .then(async (response) => {
                    //Reload list
                    fetchBankDataFunc();
                    resolve();
                    NotificationManager.success(
                        "A record was successfully deleted.",
                        "Success"
                    );
                })
                .catch((error) => {
                    console.log(error);
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

    const fetchTableData = (query) => {
        const tableData = bankService()
            .getAllByPagination(
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                // query.filters
            )
            .then(({data}) => {
                var bankData = data.banks.map(bank => ({
                    id: bank.id,
                    code: bank.code,
                    name: bank.name,
                    address: bank.address,
                    createdBy: bank.createdBy,
                }));
                return ({
                    data: bankData,
                    page: query.page,
                    totalCount: data.dbSize
                })
            });
        return tableData;
    }

    const clickRow = async (e, rowData) => {
        setBankDetails(omit(rowData, ["tableData"]));
        history.push("/branch");
    }

    const tableStyle = {
        borderRadius:'2rem',
        textAlign:"center",
        padding:'3rem',
        backgroundColor:tableBackgroundColor
      };

      

      

    return (
        <>
                <div className="outer-div">

            <MaterialTable
                style={tableStyle}
                icons={tableIcons}
                title=" "
                columns={columnsDataTable}
                // data={bankList}
                data={(query) => fetchTableData(query)}
                editable={{
                    onRowAdd: (newRow) => addRow(newRow),
                    onRowUpdate: (editedRow) => updateRow(editedRow),
                    onRowDelete: (deletedRow) => deleteRow(deletedRow),
                }}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    // filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false,

                    headerStyle: {
                        fontSize: tableHeaderFontSize,
                        textAlign: "center",
                        justifyContent: "flex-end",
                        backgroundColor: tableHeaderBackgroundColor,
                        color: tableHeaderFontColor,
                        fontWeight: "bold",

                    },
                    rowStyle: {
                        // backgroundColor: "#F2F2F2",
                        // textAlign: "center"
                        fontFamily: "Montserrat, sans-serif",
                        textAlign: "center",
                        justifyContent: "flex-end",
                        color:"#F2F2F2",
                        fontWeight: "bold",

                    },
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                onRowClick={(e, rowData) => clickRow(e, rowData)}
                isLoading={isLoading}
            />
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({setBankDetails: state.setBankDetails,});

export default connect(mapStateToProps, {setBankDetails,})(BankList);
