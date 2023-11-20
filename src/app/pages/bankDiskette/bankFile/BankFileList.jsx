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
import history from "../../../../@history";
import {connect} from "react-redux";
import {omit} from "lodash";
import {setBankFile} from "../../../redux/actions/BankFileAction";

import bankService from "app/api/bankServices/bankService";
import bankDisketteLineTypeService from "app/api/bankDisketteLineTypeService/bankDisketteLineTypeService";
import bankFileService from "../../../api/bankDisketteServices/bankFileService";
import localStorageService from "../../../services/localStorageService";
import handlePageSize from "../../../common/tablePageSize";
import AutoCompleteDropDown from "../../../components/AutoCompleteDropDown";

import { tableIconColor, editButtonColor, deleteButtonColor, tableBackgroundColor, tableHeaderBackgroundColor, tableHeaderFontColor, tableHeaderFontFamily, tableHeaderFontSize, tableHeaderFontWeight, tableRowBackgroundColor, tableRowFontColor, tableRowFontFamily, tableRowFontSize, tableRowFontWeight } from "styles/globalStyles/globalStyles";

import "./bankFileList.scss";


const BankFileList = ({
                          fetchBankFileDataFunc,
                          bankFileList,
                          setBankFile,
                          isLoading,
                          setLoading,
                      }) => {
    const [bankData, setBankData] = useState([]);
    const [LineData, setLineData] = useState([]);
    const [bank, setBank] = useState("");
    const [Line, setLine] = useState("");

    const [rowData, setRowData] = useState({});
    const [editModal, setEditModal] = useState(false);

    //Table Columns
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
        fetchBankData();
        fetchLineData();
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
                title: "Bank File ID",
                field: "code",
                editable: "onAdd",
                validate: (rowData) =>
                    rowData.code === undefined
                        ? {
                            isValid: false,
                            helperText: "Bank File ID is required",
                        }
                        : rowData.code === ""
                            ? {
                                isValid: false,
                                helperText: "Bank File ID is required",
                            }
                            : true,
            },
            {
                title: "File Name",
                field: "name",
                validate: (rowData) =>
                    rowData.name === undefined
                        ? {
                            isValid: false,
                            helperText: "File Name  is required",
                        }
                        : rowData.name === ""
                            ? {
                                isValid: false,
                                helperText: "File Name  is required",
                            }
                            : true,
            },
            // {
            //   title: "File Type",
            //   field: "type",
            //   editComponent: (props) => {
            //     let x = LineData.find((b) => b.label === props.value);
            //     x && setLine(x);
            //     return (
            //       <AutoCompleteDropDown
            //         dropDownData={LineData}
            //         onChange={(e, selected) => {
            //           setLine(selected?.value);
            //           props.onChange(selected);
            //         }}
            //         label="Select"
            //         defaultValue={x ?? props.value}
            //       />
            //     );
            //   },
            // },
            {
                title: "Bank Name",
                field: "bank",
                editComponent: (props) => {
                    let x = bankData.find((b) => b.label === props.value);
                    x && setBank(x.value);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={bankData}
                            onChange={(e, selected) => {
                                setBank(selected?.value);
                                props.onChange(selected);
                            }}
                            label="Select"
                            defaultValue={x ?? props.value}
                        />
                    );
                },
            }
        ]);
    }, [bankData, LineData]);

    //Load Bank data
    async function fetchBankData() {
        bankService()
            .getAll()
            .then(async (response) => {
                let bankDataArray = [];
                response.data.forEach((item) => {
                    bankDataArray.push({value: item.id, label: item.name});
                });
                setBankData(bankDataArray);
            });
    }

    //Load Line data
    async function fetchLineData() {
        bankDisketteLineTypeService()
            .getAll()
            .then(async (response) => {
                let lineDataArray = [];
                response.data.forEach((item) => {
                    lineDataArray.push({value: item.id, label: item.lineName});
                });
                setLineData(lineDataArray);
            });
    }

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

    //Add Row
    const addRow = (newRow) =>
        new Promise((resolve, reject) => {
            //Obj Create
            let bankFiles = {
                code: newRow.code,
                name: newRow.name,
                bankId: bank,
            };

            bankFileService()
                .create(bankFiles)
                .then((response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    // fetchBankFileDataFunc();
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    NotificationManager.error(
                        "An existing record already found",
                        "Error"
                    );
                });
        });

    //Update Row
    const updateRow = (editedRow) =>
        new Promise((resolve, reject) => {
            //Obj update
            let bankFiles = {
                id: editedRow.id,
                bankId: bank,
                code: editedRow.code,
                name: editedRow.name,
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            bankFileService()
                .update(bankFiles, editedRow.id)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );

                    //Reload list
                    // fetchBankFileDataFunc();
                    resolve();

                    //onSave();
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    NotificationManager.error(
                        "An existing record already found",
                        "Error"
                    );
                });
        });

    //Delete Row
    const deleteRow = (deletedRow) =>
        new Promise((resolve, reject) => {
            //Obj Create
            let bankFiles = {
                id: deletedRow.id,
            };
            bankFileService()
                .deleteBankFile(bankFiles)
                .then((response) => {
                    //Reload list
                    // fetchBankFileDataFunc();
                    resolve();
                    NotificationManager.success(
                        "A record was successfully deleted.",
                        "Success"
                    );
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                    NotificationManager.error("This record was already used", "Error");
                });
        });

    const clickRow = (e, rowData) =>
        new Promise(async (resolve, reject) => {
            const {data} = await bankFileService().findOne(rowData.id);
            setBankFile({
                ...omit(data, ["tableData"]),
            });
            history.push("/bank-file-configurator");
        });

    const onLineTypeClick = async (e) => {
        history.push("/bank-line-types");
    };

    const fetchTableData = (query) => {
        const tableData = bankFileService()
            .getAllByPagination(
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var mappedData = data.bankFile.map((item) => ({
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    effectiveDate: item.effectiveDate,
                    bank: item.bank.name,
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
                title=""
                columns={columns}
                // data={bankFileList}
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
                    pageSize:
                        JSON.parse(
                            localStorageService.getItem("auth_user")?.tablePageCount
                        )?.[window.location.pathname] ?? 5,
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
                onRowsPerPageChange={(pageSize) =>
                    handlePageSize(pageSize, window.location.pathname)
                }
                actions={
                    [
                        // {
                        //   icon: forwardRef((props, ref) => (
                        //     <Dropdown>
                        //       <Dropdown.Toggle className="toggle-hidden border-0 bg-white d-flex flex-column">
                        //         <span className="_dot _inline-dot bg-black mb-1"></span>
                        //         <span className="_dot _inline-dot bg-black mb-1"></span>
                        //         <span className="_dot _inline-dot bg-black"></span>
                        //       </Dropdown.Toggle>
                        //       <Dropdown.Menu>
                        //         <Dropdown.Item onClick={onLineTypeClick}>
                        //           Line Types
                        //         </Dropdown.Item>
                        //       </Dropdown.Menu>
                        //     </Dropdown>
                        //   )),
                        //   tooltip: "Details",
                        //   onClick: (e, row) => setRowData(row),
                        // },
                    ]
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

export default connect(mapStateToProps, {setBankFile})(BankFileList);
