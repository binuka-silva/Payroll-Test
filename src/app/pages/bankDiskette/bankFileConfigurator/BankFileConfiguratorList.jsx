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
import {connect, useSelector} from "react-redux";

import bankDisketteLineTypeService from "app/api/bankDisketteLineTypeService/bankDisketteLineTypeService";
import bankFileConfiguratorService from "app/api/bankDisketteServices/bankFileConfiguratorService";
import localStorageService from "../../../services/localStorageService";
import handlePageSize from "../../../common/tablePageSize";
import AutoCompleteDropDown from "../../../components/AutoCompleteDropDown";
import {setBankFileConfig} from "../../../redux/actions/BankFileConfigAction";

const BankFileConfiguratorList = ({
                                      fetchBankFileConfiguratorDataFunc,
                                      bankFileConfiguratorList,
                                      setBankFileConfiguratorList,
                                      setBankFileConfig,
                                      isLoading,
                                      setLoading,
                                  }) => {
    const [LineData, setLineData] = useState([]);
    const [Line, setLine] = useState("");

    const [rowData, setRowData] = useState({});
    const [editModal, setEditModal] = useState(false);

    //Table Columns
    const [columns, setColumns] = useState([]);

    const bankFiles = useSelector((state) => state.bankFile);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
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
                title: "Sequence",
                field: "sequence",
                editable: "onAdd",
                validate: (rowData) =>
                    rowData.sequence === undefined
                        ? {isValid: false, helperText: "Sequence is required"}
                        : rowData.sequence === ""
                            ? {isValid: false, helperText: "Sequence is required"}
                            : isNaN(rowData.sequence)
                                ? {isValid: false, helperText: "Sequence must be an number"}
                                : true,
            },
            {
                title: "Line Name",
                field: "lineName",
                editComponent: (props) => {
                    let x = LineData.find((b) => b.label === props.value);
                    x && setLine(x.value);
                    return (
                        <AutoCompleteDropDown
                            dropDownData={LineData}
                            onChange={(e, selected) => {
                                setLine(selected?.value);
                                props.onChange(selected);
                            }}
                            label="Select"
                            defaultValue={x ?? props.value}
                        />
                    );
                },
            },
            {
                title: "Comma Separated",
                field: "commaSeparated",
                type: "boolean",
                color: "primary",
            },
        ]);
    }, [LineData]);

    //Load Line data
    function fetchLineData() {
        bankDisketteLineTypeService()
            .getAll()
            .then((response) => {
                let lineDataArray = [];
                response.data.forEach((item) => {
                    lineDataArray.push({value: item.id, label: item.lineName});
                });
                setLineData(lineDataArray);
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
    const addRow = (newRow) =>
        new Promise((resolve, reject) => {
            //Obj Create
            let bankFileConfig = {
                sequence: newRow.sequence,
                format: newRow.format ?? null,
                commaSeparated: newRow.commaSeparated ?? false,
                lineTypeId: Line,
                bankFileId: bankFiles.id,
            };

            if (isExists(newRow)) {
                reject();
                return;
            }

            bankFileConfiguratorService()
                .create(bankFileConfig)
                .then((response) => {
                    NotificationManager.success(
                        "A record was successfully created",
                        "Success"
                    );
                    //Reload list
                    // fetchBankFileConfiguratorDataFunc();
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

    const isExists = (row) => {
        const existSequence = bankFileConfiguratorList.find(
            (detail) => detail.sequence === row.sequence
        );

        if (existSequence) {
            NotificationManager.error("Duplicate Sequence Added", "Error");
            return true;
        }
        return false;
    };

    //Update Row
    const updateRow = (editedRow) =>
        new Promise((resolve, reject) => {
            //Obj update
            let bankFileConfig = {
                id: editedRow.id,
                sequence: editedRow.sequence,
                format: editedRow.format ?? null,
                commaSeparated: editedRow.commaSeparated ?? false,
                lineTypeId: Line,
                bankFileId: bankFiles.id,
                IsDelete: false,
                createdDateTime: editedRow.createdDateTime,
                createdBy: editedRow.createdBy,
                modifiedDateTime: new Date(),
                modifiedBy: "5fa85f64-5717-4562-b3fc-2c963f66a456",
            };

            bankFileConfiguratorService()
                .update(bankFileConfig, editedRow.id)
                .then(async (response) => {
                    NotificationManager.success(
                        "A record was successfully updated",
                        "Success"
                    );

                    //Reload list
                    // fetchBankFileConfiguratorDataFunc();
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
            bankFileConfiguratorService()
                .deleteBankFileConfigurator(bankFiles)
                .then((response) => {
                    //Reload list
                    // fetchBankFileConfiguratorDataFunc();
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
        new Promise((resolve, reject) => {
            bankFileConfiguratorService()
                .findOne(rowData.id)
                .then(({data}) => {
                    setBankFileConfig(
                        Object.fromEntries(
                            Object.entries(data).filter(([_, v]) => v != null)
                        )
                    );
                    history.push("/bank-file-configurator/format");
                })
                .catch((e) => {
                    console.error(e);
                });
        });

    const fetchTableData = (query) => {
        const tableData = bankFileConfiguratorService()
            .getAllByPagination(
                bankFiles.id,
                query.page + 1,
                query.pageSize,
                query.orderBy?.field,
                query.orderDirection != "desc",
                query.search,
                query.filters
            )
            .then(({data}) => {
                var mappedData = data.bankFileConfigurator.map(item => ({
                    id: item.id,
                    sequence: item.sequence,
                    lineName: item.lineType,
                    commaSeparated: item.commaSeparated,
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
                title={""
                    // <Button
                    //   aria-label="add"
                    //   size="medium"
                    //   onClick={() => history.push("/bank-line-types")}
                    // >
                    //   <ArrowBackIcon fontSize="medium" />
                    //   Line Types
                    // </Button>
                }
                columns={columns}
                // data={bankFileConfiguratorList}
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
                }}
                onRowsPerPageChange={(pageSize) =>
                    handlePageSize(pageSize, window.location.pathname)
                }
                onRowClick={(e, rowData) => clickRow(e, rowData)}
                isLoading={isLoading}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    setBankFileConfig: state.setBankFileConfig,
});

export default connect(mapStateToProps, {setBankFileConfig})(
    BankFileConfiguratorList
);
