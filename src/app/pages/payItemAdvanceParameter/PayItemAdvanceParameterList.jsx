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
import {Search} from "@material-ui/icons";
import {NotificationManager} from "react-notifications";

import history from "../../../@history";
import {connect} from "react-redux";

import {setPayItemAdvanceParameterDetails} from "../../redux/actions/PayItemAdvancedParameterActions";
import {omit} from "lodash";
import ParameterDateRangePicker from "./ParameterDateRangePicker";

import payItemAdvanceParameterService from "app/api/PayItemAdvanceParameterServeces/payItemAdvanceParameterService";
import localStorageService from "../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import handlePageSize from "../../common/tablePageSize";
import AddBoxIcon from "@mui/icons-material/AddBox";

const PayItemAdvanceParameterList = ({
                                         setPayItemAdvanceParameterDetails,
                                         payItemAdvanceParameterList,
                                         fetchPayItemAdvanceParameterDataFunc,
                                     }) => {

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
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

    //Table Columns
    const columnsDataTable = [
        {
            title: "Id",
            field: "id",
            hidden: true,
        },
        {
            title: "Created By",
            field: "createdBy",
            hidden: true,
        },
        {
            title: "Parameter Code",
            field: "code",
        },
        {
            title: "Parameter Name",
            field: "name",
        },
        {
            title: "Validity Period",
            field: "validityPeriod",
            editComponent: (props) => (
                <ParameterDateRangePicker dateRangeFunc={handleValidityPeriod}/>
            ),
        },
        // {
        //   title: "Valid From",
        //   field: "validFrom",
        //   type: "date",
        // },
        // {
        //   title: "Valid To",
        //   field: "validTo",
        //   type: "date",
        // },
        {
            title: "Description",
            field: "description",
        },
    ];

    //Add Row
    const addRow = async (newRow) =>
        new Promise(async (resolve, reject) => {
            //Obj Create
            let payItemParameter = {
                code: newRow.code,
                name: newRow.name,
                validFrom: newRow.validFrom,
                validTo: newRow.validTo,
                description: newRow.description,
                IsDelete: false,
                createdDateTime: new Date(),
                createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            };

            payItemAdvanceParameterService()
                .create(payItemParameter)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    // fetchPayItemAdvanceParameterDataFunc();
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
            let payItemParameter = {
                id: editedRow.id,
                code: editedRow.code,
                name: editedRow.name,
                validFrom: editedRow.validFrom,
                validTo: editedRow.validTo,
                description: editedRow.description,
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            await payItemAdvanceParameterService()
                .update(payItemParameter)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );
                    //Reload list
                    // fetchPayItemAdvanceParameterDataFunc();
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
            await payItemAdvanceParameterService()
                .remove(deletedRow.id)
                .then((r) => {
                    // fetchPayItemAdvanceParameterDataFunc();
                    resolve();
                    NotificationManager.success(
                        "A record was successfully deleted.",
                        "Success"
                    );
                })
                .catch((e) => {
                    console.error(e);
                    reject();
                    NotificationManager.error("This record was already used", "Error");
                });
        });

    const clickRow = (e, rowData) =>
        new Promise(async (resolve, reject) => {
            const {data} = await payItemAdvanceParameterService().findOne(
                rowData.id
            );
            setPayItemAdvanceParameterDetails(omit(data, ["tableData"]));
            history.push("/pay-item-advance-parameter-details");
        });

    let validFrom = "";
    let validTo = "";

    const handleValidityPeriod = (props) => {
        validFrom = props[0];
        validTo = props[1];
    };

    const fetchTableData = (query) => {
        const tableData = payItemAdvanceParameterService()
            .getAllByPagination(
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var mappedData = data.payItemAdvanceParameter.map(item => ({
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    validityPeriod: `${item.validFrom.split("T")[0]} - ${item.validTo.split("T")[0]}`,
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
                title=" "
                columns={columnsDataTable}
                // data={payItemAdvanceParameterList}
                data={(query) => fetchTableData(query)}
                editable={{
                    // onRowAdd: (newRow) => addRow(newRow),
                    // onRowUpdate: (editedRow) => updateRow(editedRow),
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
                onRowClick={(e, rowData) => clickRow(e, rowData)}
                actions={[
                    {
                        icon: forwardRef((props, ref) => (<AddBoxIcon {...props} ref={ref}/>)),
                        tooltip: "Add",
                        isFreeAction: true,
                        onClick: (event, rowData) => history.push("/pay-item-advance-parameter-details"),
                    },
                ]}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayItemAdvanceParameterDetails: state.setPayItemAdvanceParameterDetails,
});
export default connect(mapStateToProps, {
    setPayItemAdvanceParameterDetails,
})(PayItemAdvanceParameterList);
