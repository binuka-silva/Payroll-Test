import React, {forwardRef} from "react";
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
import SyncIcon from '@mui/icons-material/Sync';
import localStorageService from "../../services/localStorageService";
import handlePageSize from "../../common/tablePageSize";
import employeeService from "app/api/employeeServices/employeeService";
import {syncStatus} from "./constant";
import { tableIconColor, editButtonColor, deleteButtonColor, tableBackgroundColor, tableHeaderBackgroundColor, tableHeaderFontColor, tableHeaderFontFamily, tableHeaderFontSize, tableHeaderFontWeight, tableRowBackgroundColor, tableRowFontColor, tableRowFontFamily, tableRowFontSize, tableRowFontWeight } from "styles/globalStyles/globalStyles";

const EmployeesList = ({
                           fetchEmployeeGroupDataFunc,
                           employeeList,
                           updatedCount,
                           addedCount,
                           isLoading,
                           setLoading,
                           isProcessing,
                           setProcessing,
                           setAddedCount
                       }) => {

    const tableIcons = {
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
            hidden: true
        },
        {
            title: "Created Date Time",
            field: "createdDateTime",
            hidden: true
        },
        {
            title: "Created By",
            field: "createdBy",
            hidden: true
        },
        {
            title: "isNew",
            field: "isNew",
            type: "boolean",
            hidden: true
        },
        {
            title: "Employee No",
            field: "empNo",
        },
        {
            title: "Company Id",
            field: "companyId",
        },
        {
            title: "Designation",
            field: "designation",
        },
        {
            title: "Name",
            field: "employeeName",
        },
        {
            title: "Category",
            field: "empCatId",
        },
        {
            title: "Status",
            field: "employeeStatus",
        }

    ];

    const fetchTableData = (query) => {
        const tableData = employeeService()
            .getAllByPagination(
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection !== "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                if (data.status === syncStatus.PROCESSING || data.status === syncStatus.NEW) {
                    !isProcessing && setProcessing(true);
                    setTimeout(() => {
                        fetchTableData(query);
                    }, 3000);
                    setLoading(true);
                    return ({
                        data: [],
                        page: 0,
                        totalCount: 0
                    });
                }

                setLoading(false);
                setAddedCount(data.addedCount);
                setProcessing(false);

                const addedData = JSON.parse(data.addedData) ?? [];
                let mappedData = data.employee ? data.employee.map(e => ({...e, isNew: !!addedData.find(add => add === e.id)})) : [];

                mappedData = mappedData.map(item => ({
                    id: item.id,
                    companyId: item.companyId,
                    empNo: item.empNo,
                    isNew: item.isNew,
                    designation: item.empPosCode,
                    employeeName: item.employeeName,
                    employeeStatus: item.employeeStatus,
                    empCatId: item.empCatName,
                }));
                return ({
                    data: mappedData,
                    page: query.page,
                    totalCount: data.dbSize
                })
            });
        return tableData;
    }
    const tableStyle = {
        borderRadius:'2rem',
        textAlign:"center",
        padding:'3rem',
        backgroundColor:tableBackgroundColor
      };

    return (
        <>
            <MaterialTable  
            style={tableStyle}
                icons={tableIcons}
                title={
                    addedCount || updatedCount ? (
                        <>
                <span style={{fontSize: 15}}>
                  <strong>Added: </strong> {addedCount}{" "}
                    {/*<strong>Updated: </strong>
                  {updatedCount}*/}
                </span>
                            &nbsp;
                            {isProcessing && <span style={{
                                backgroundColor: "#9890ff",
                                padding: 3,
                                borderRadius: 5,
                            }}><strong>Sync...</strong></span>}
                        </>
                    ) : (
                        <>
                            {isProcessing && <span style={{
                                backgroundColor: "#9890ff",
                                padding: 3,
                                borderRadius: 5,
                            }}><strong>Sync...</strong></span>}
                        </>
                    )
                }
                columns={columnsDataTable}
                data={employeeList?.length ? employeeList : ((query) => fetchTableData(query))}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    rowStyle: (rowData, index) => ({
                        background: rowData.isNew ? "rgba(199,185,213,0.9)" : "#FFF",
                    }),
                    emptyRowsWhenPaging: false,
                    headerStyle: {
                        fontSize: tableHeaderFontSize,
                        textAlign: "center",
                        justifyContent: "flex-end",
                        backgroundColor: tableHeaderBackgroundColor,
                        color: tableHeaderFontColor,
                        fontWeight: tableHeaderFontWeight,
                        fontFamily:tableHeaderFontFamily,
                    },
                    rowStyle: {

                        fontFamily:tableRowFontFamily,
                        textAlign: "center",
                        justifyContent: "flex-end",
                        color:tableRowFontColor,
                        fontWeight: tableRowFontWeight,
                        fontSize: tableRowFontSize,
                        backgroundColor: tableRowBackgroundColor,
                      
                    },
                }}
                actions={[
                    {
                        icon: forwardRef((props, ref) => <SyncIcon {...props} ref={ref}/>),
                        tooltip: 'Sync',
                        isFreeAction: true,
                        onClick: (event, rowData) => {
                            fetchEmployeeGroupDataFunc();
                        }
                    },
                ]}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                isLoading={isLoading}
            />
        </>
    );
}

export default EmployeesList;
