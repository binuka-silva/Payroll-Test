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


const EmployeeTemplateDetailsList = ({fetchTemplateDataFunc, templateList}) => {

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
            hidden: true,
        },
        {
            title: "Created By",
            field: "createdBy",
            hidden: true,
        },
        {
            title: "Criteria",
            field: "criteria",
            editable: "never",
        },
        /*{
          title: "No of Items in Use",
          field: "itemCount",
          type: "numeric",
          filtering: false,
        },*/
    ];


    return (
        <MaterialTable
            icons={tableIcons}
            title="Criteria"
            columns={columnsDataTable}
            data={templateList}
            options={{
                addRowPosition: "first",
                actionsColumnIndex: -1,
                selection: true,
                showSelectAllCheckbox: false,
                pageSize: 6,
                selectionProps: rowData => ({
                    disabled: rowData.tableData.checked
                }),
                paging: false
            }}
            onSelectionChange={(row) => fetchTemplateDataFunc(row)}
        />
    );
}

export default EmployeeTemplateDetailsList;