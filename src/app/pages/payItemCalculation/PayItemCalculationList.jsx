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
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import MTableBody from "../../components/draggableRows/MTableBody";
import MTableBodyRow from "../../components/draggableRows/MTableBodyRow";
import PayItemsCalculationModal from "./PayItemsCalculationModal";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {NotificationManager} from "react-notifications";
import localStorageService from "../../services/localStorageService";
import handlePageSize from "../../common/tablePageSize";

const PayItemCalculationList = ({
                                    tableData,
                                    setTableData,
                                    fetchPayItemCalculationData,
                                    functionData,
                                    setCalculationList,
                                    payItemGroupList,
                                    payItemList,
                                    payItemParameterList,
                                    employeeParameterList,
                                    payrollParameterList,
                                    employeesFilterDetailList,
                                    advanceParameterList,
                                    loanTypeList,
                                    rowCount
                                }) => {

    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    //Table Columns
    //Change id column name
    const columns = [
        {
            title: "Id",
            field: "id",
            hidden: true,
        },
        {
            title: "updateId",
            field: "updateId",
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
            title: "Sequence",
            field: "sequence",
        },
        {
            title: "Function Code",
            field: "code",
        },
        {
            title: "Function Name",
            field: "name",
        },
        {
            title: "Number of Parameters",
            field: "parameterCount",
        },
        {
            title: "Parameter List",
            field: "parameterList",
        },
    ];

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

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise(async (resolve, reject) => {
            let exists = false
            tableData.filter(table => table.sequence !== deletedRow.sequence).forEach(data => {
                const params = data.parameterList.split(";");
                const existsSeq = params.filter(param => param.startsWith("#")).map(seq => parseInt(seq.replace("#", ""))).find(seq => seq === deletedRow.sequence);
                if (existsSeq) {
                    reject();
                    NotificationManager.error(
                        "Existing Data Found",
                        "Failed"
                    );
                    exists = true;
                }
            })

            if (!exists) {
                setTableData(tableData.filter(data => data.sequence !== deletedRow.sequence))
                resolve();
            }
        });

    const onDragEnd = (result) => {
        const {destination, source} = result;
        if (!destination) return;
        if (source.index !== destination.index) {
            let copyArray = [...tableData.map(data => {
                delete data.tableData;
                return data;
            })];
            let temp = tableData[source.index];

            const newArray = temp?.parameterList.split(";").filter(v => v.startsWith("#")).map(v => v.slice(1)).sort();
            if (newArray[newArray.length - 1] > destination.index) {
                NotificationManager.error(
                    "Saving Failed",
                    "Sequence does not match"
                );
                return;
            }

            copyArray.splice(source.index, 1);
            copyArray.splice(destination.index, 0, temp);
            setTableData(copyArray);
        }
    };

    return (
        <>
            {editModal && <PayItemsCalculationModal fetchPayItemCalculationDataFunc={fetchPayItemCalculationData}
                                                    functionData={functionData}
                                                    employeesFilterDetailList={employeesFilterDetailList}
                                                    setCalculation={setCalculationList}
                                                    payItemGroupList={payItemGroupList}
                                                    payItemList={payItemList}
                                                    payItemParameterList={payItemParameterList}
                                                    employeeParameterList={employeeParameterList}
                                                    payrollParameterList={payrollParameterList}
                                                    advanceParameterList={advanceParameterList}
                                                    loanTypeList={loanTypeList}
                                                    calculationTableData={tableData}
                                                    rowCount={rowCount}
                                                    editData={editData}
                                                    setShow={setEditModal}
                                                    show={editModal}/>}
            <PayItemsCalculationModal fetchPayItemCalculationDataFunc={fetchPayItemCalculationData}
                                      functionData={functionData} employeesFilterDetailList={employeesFilterDetailList}
                                      setCalculation={setCalculationList}
                                      payItemGroupList={payItemGroupList}
                                      calculationTableData={tableData}
                                      payItemList={payItemList} payItemParameterList={payItemParameterList}
                                      employeeParameterList={employeeParameterList}
                                      payrollParameterList={payrollParameterList} loanTypeList={loanTypeList}
                                      advanceParameterList={advanceParameterList} rowCount={rowCount} show={addModal}
                                      setShow={setAddModal}/>
            <MaterialTable
                icons={tableIcons}
                title={""}
                columns={columns}
                data={tableData}
                editable={{
                    onRowDelete: (row) => deleteRow(row)
                }}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: JSON.parse(localStorageService.getItem("auth_user")?.tablePageCount ?? null)?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false
                }}
                onRowsPerPageChange={(pageSize) => handlePageSize(pageSize, window.location.pathname)}
                actions={[
                    {
                        icon: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
                        tooltip: 'Update',
                        onClick: (event, rowData) => {
                            setEditModal(true)
                            setEditData(rowData);
                        }
                    },
                    {
                        icon: forwardRef((props, ref) => <AddBoxIcon {...props} ref={ref}/>),
                        tooltip: 'Add',
                        isFreeAction: true,
                        onClick: (event, rowData) => setAddModal(true)
                    }
                ]}
                components={{
                    Body: (props) => (
                        // <div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable
                                droppableId={"singleColumnDroppableAreaThusStaticInput"}
                            >
                                {(provided) => (
                                    <>
                                        <MTableBody {...props} forwardedRef={provided.innerRef}/>
                                        {provided.placeholder}
                                    </>
                                )}
                            </Droppable>
                        </DragDropContext>
                        // </div>
                    ),
                    Row: (props) => (
                        <Draggable
                            draggableId={props.data.tableData.id.toString()}
                            index={props.data.tableData.id}
                        >
                            {(provided) => {
                                return (
                                    <MTableBodyRow
                                        {...props}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        forwardedRef={provided.innerRef}
                                    />
                                );
                            }}
                        </Draggable>
                    ),
                }}
            />
        </>
    );
};

export default PayItemCalculationList;
