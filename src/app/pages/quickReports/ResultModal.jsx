import React, {forwardRef, Fragment} from "react";
import {Modal} from "react-bootstrap";
import {Search} from "@material-ui/icons";
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
import * as xlsx from "xlsx";

const ResultModal = ({show, setShow, data, columns, row, ...props}) => {
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

    const handleClose = () => {
        setShow(false);
    };

    const exportExcel = () => {
        const excelColumns = columns.map(c => c.field);
        const workbook = xlsx.utils.book_new();
        const exportData = data.map(d => Object.values(d));
        const workSheetData = [excelColumns, ...exportData];
        const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
        xlsx.utils.book_append_sheet(workbook, workSheet, row.code);
        xlsx.writeFile(workbook, `${row.code}.xlsx`)
    }

    return (
        <Fragment>
            <Modal size="xl" show={show} onHide={handleClose} {...props} scrollable={true}>
                <MaterialTable
                    title={row.code}
                    icons={tableIcons}
                    columns={columns}
                    data={data}
                    options={{
                        addRowPosition: "first",
                        actionsColumnIndex: -1,
                        filtering: true,
                        pageSizeOptions: [5, 10, 20, 50, 100],
                        headerStyle: {
                            position: "sticky",
                            top: "0"
                        },
                        maxBodyHeight: "500px"
                    }}
                    actions={[
                        {
                            icon: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
                            tooltip: 'Download',
                            isFreeAction: true,
                            onClick: (event, rowData) => exportExcel()
                        }
                    ]}
                />
            </Modal>
        </Fragment>
    );
};

export default ResultModal;
