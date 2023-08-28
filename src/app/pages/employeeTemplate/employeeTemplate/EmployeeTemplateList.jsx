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
import history from "../../../../@history";
import {connect} from "react-redux";
import {setEmployeeTemplateDetails} from "../../../redux/actions/EmployeeTemplateActions";
import {omit} from "lodash";
import employeeTemplateService from "../../../api/employeeTemplateServices/employeeTemplateService";
import localStorageService from "../../../services/localStorageService";
import {NOTIFICATION_ERROR} from "../../../common/notifications";
import {RESP_STATUS_CODES} from "../../../common/response";
import handlePageSize from "../../../common/tablePageSize";
import AddBoxIcon from "@mui/icons-material/AddBox";


const EmployeeTemplateList = ({
                                  setEmployeeTemplateDetails,
                                  employeeDetails,
                                  templateList,
                                  fetchTemplateDataFunc,
                                  isLoading
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
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
    };

    //Table Columns
    const columnsDataTable = [
        {
            title: "Id",
            field: "id",
            hidden: true
        },
        {
            title: "Created By",
            field: "createdBy",
            hidden: true
        },
        {
            title: "Code",
            field: "code",
        },
        {
            title: "Name",
            field: "name",
        },
        {
            title: "Created Date",
            field: "createdDate",
            dateSetting: {
                locale: "pa-LK",
            },
            type: "date"
        }
    ];

    const clickRow = (e, rowData) => new Promise(async (resolve, reject) => {
        const {data} = await employeeTemplateService().getEmployeeTemplateDetails(rowData.id);
        setEmployeeTemplateDetails(omit(data, ["tableData"]));
        history.push("/employee-template-details")
    });

    //Delete Row
    const deleteRow = (deletedRow) => new Promise(async (resolve, reject) => {
        await employeeTemplateService().removeEmployeeTemplate(deletedRow.id).then(r => {
            // fetchTemplateDataFunc();
            resolve();
            NotificationManager.success("A record was successfully deleted.", "Success");
        }).catch(e => {
            console.error(e);
            reject();
            if (e.status === RESP_STATUS_CODES.FORBIDDEN || e.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, e.statusText);
            } else {
                NotificationManager.error(
                    "An error occurred when attempting to delete a record",
                    "Error"
                );
            }
        });
    })

    const fetchTableData = (query) => {
        const tableData = employeeTemplateService()
            .getAllByPagination(
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var mappedData = data.employeeTemplate.map(item => ({
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    createdDate: item.createdDateTime.split("T")[0],
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
                title=""
                columns={columnsDataTable}
                //   data={templateList}
                data={(query) => fetchTableData(query)}
                editable={{
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
                onRowClick={(e, rowData) => clickRow(e, rowData)}
                onRowsPerPageChange={(pageSize) =>
                    handlePageSize(pageSize, window.location.pathname)
                }
                isLoading={isLoading}
                actions={[
                    {
                        icon: forwardRef((props, ref) => (<AddBoxIcon {...props} ref={ref}/>)),
                        tooltip: "Add",
                        isFreeAction: true,
                        onClick: (event, rowData) => history.push("/employee-template-details"),
                    },
                ]}
            />
        </>
    );
}

const mapStateToProps = state => ({
    setEmployeeTemplateDetails: state.setEmployeeTemplateDetails
});

export default connect(mapStateToProps, {
    setEmployeeTemplateDetails
})(EmployeeTemplateList);
