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
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import {connect} from "react-redux";
import localStorageService from "../../services/localStorageService";
import GenerateBankDisketteModal from "./GenerateBankDisketteModal";
import {NotificationManager} from "react-notifications";
import handlePageSize from "../../common/tablePageSize";
import {
    emptyGuid,
    FIELD_TYPES,
    FILL_DIRECTIONS,
    FUNCTION_CODES,
    functionCodesArray,
    payrollPeriodProcess,
    TRIM_TYPES,
} from "./constant";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import payItemCalculationService from "../../api/payItemCalculationServices/payItemCalculationService";
import generateBankDisketteService from "../../api/generateBankDisketteServices/generateBankDisketteService";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import payItemGroupService from "../../api/payItemGroupServices/payItemGroupService";
import {RESP_STATUS_CODES} from "../../common/response";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import payrollParameterService from "../../api/payrollParameterServices/payrollParameterService";
import {setPayrollDetailsData} from "../../common/payrollDetails";
import WorkerBuilder from "../../common/workerBuilder";
import TableWorker from "./table-worker";

const worker = new WorkerBuilder(TableWorker);

const GenerateBankDisketteList = ({
                                      processPeriodList,
                                      bankDisketteList,
                                      tableData,
                                      isLoading,
                                      isConfirm,
                                      setConfirm,
                                      setLoading,
                                      lineTypeList,
                                      processData,
                                      setTableData,
                                      bankDiskette,
                                      setBankDiskette,
                                      dropDownPeriod,
                                      setDropDownPeriod,
                                      effectiveDate,
                                      setEffectiveDate,
                                      fetchProcessingDetails,
                                      payroll,
                                  }) => {
    const [columns, setColumns] = useState([]);
    const [initialColumns, setInitialColumns] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [payrollBankFile, setPayrollBankFile] = useState();
    const [disketteValue, setDisketteValue] = useState(0);

    const [diskette, setDiskette] = useState([]);
    const [dropDownPeriodList, setDropDownPeriodList] = useState([]);
    const [payItemGroupList, setPayItemGroupList] = useState([]);
    const [payrollParameterList, setPayrollParameterList] = useState([]);
    const [functionData, setFunctionData] = useState([]);
    const [bankFile, setBankFile] = useState(null);

    const [lastGeneratedDate, setLastGeneratedDate] = useState(new Date());

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchFunctionData();
        fetchPayItemGroupData();
        fetchPayrollParameterData();
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
    }, []);

    const fetchPayItemGroupData = async () => {
        try {
            const {data} = await payItemGroupService().getAll();
            setPayItemGroupList(
                data.map((groupData) => ({
                    id: groupData.id,
                    createdBy: groupData.createdBy,
                    code: groupData.code,
                    name: groupData.name,
                    description: groupData.description,
                }))
            );
        } catch (e) {
            console.error(e);
        }
    };

    const fetchPayrollParameterData = async () => {
        try {
            const {data} = await payrollParameterService().getAll();
            setPayrollParameterList(
                data.map((parameter) => ({
                    id: parameter.id,
                    code: parameter.code,
                    name: parameter.name,
                }))
            );
        } catch (e) {
            console.error(e);
        }
    };

    const fetchFunctionData = () => {
        payItemCalculationService()
            .getAllFunctions()
            .then(({data}) => {
                setFunctionData(
                    data
                        .filter(
                            (func) =>
                                func.id >= 25 ||
                                func.id === FUNCTION_CODES.FGETEMPVAL ||
                                func.id === FUNCTION_CODES.FPARAEMP ||
                                func.id === FUNCTION_CODES.FPAYPARA ||
                                func.id === FUNCTION_CODES.FITEMGRP
                        )
                        .map((func) => ({
                            value: func.id,
                            label: func.name,
                        }))
                );
            })
            .catch((e) => {
                console.error(e);
            });
    };

    useEffect(() => {
        if (processPeriodList.length > 0) {
            const tempList = processPeriodList.map((period) => ({
                label: `${period.dateFrom.split(" ")[0]} - ${
                    period.dateTo.split(" ")[0]
                }`,
                value: period.id,
                status: period.periodProcess,
            }));
            tempList.sort((a, b) => a.label.split("-")[0] - b.label.split("-")[0]);
            setDropDownPeriodList(tempList);
            setDropDownPeriod(
                tempList.find((period) => period.status === payrollPeriodProcess.FINALIZED || period.status === payrollPeriodProcess.PROCESSED)
            );
        }
    }, [processPeriodList]);

    useEffect(() => {
        if (!bankDiskette && bankDisketteList && bankDisketteList.length > 0) {
            setLoading(true);
            setBankDisketteTableData(
                bankDisketteList[0]?.value,
                null,
                false,
                bankDisketteList[0]?.payroll
            );
        }
    }, [bankDiskette, bankDisketteList]);

    //Table Columns
    useEffect(() => {
        worker.onmessage = (e) => {
            const {tableData, resData, lineTypeList} = e.data;

            const diskette = generate(
                resData.bankFile,
                tableData,
                resData.formulaResults?.filter((r) => r.employeeId === emptyGuid),
                lineTypeList
            );
            const sumOfDiskette = tableData
                .map((row) => row[FIELD_TYPES.amount.value])
                .reduce(
                    (previousValue, currentValue) =>
                        parseFloat(previousValue ?? "0") +
                        parseFloat(currentValue ?? "0"),
                    0
                );

            setDisketteValue(sumOfDiskette);
            setDiskette(diskette);
            setTableData(tableData);
            setLoading(false);
        };

        const columnSet = [
            {
                title: "Id",
                field: "id",
                hidden: true,
            },
            {
                title: "employeeId",
                field: "employeeId",
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
                title: "Organization",
                field: "organization",
                hidden: true,
            },
            {
                title: "Designation",
                field: "designation",
                hidden: true,
            },
            {
                title: "employeeType",
                field: "employeeType",
                hidden: true,
            },
            {
                title: "employeeCategory",
                field: "employeeCategory",
                hidden: true,
            },
            {
                title: "hasEmployeeBank",
                field: "hasEmployeeBank",
                hidden: true,
            },
            {
                title: "processCount",
                field: "processCount",
                hidden: true,
            },
            {
                title: "successCount",
                field: "successCount",
                hidden: true,
            },
            {
                title: "failedCount",
                field: "failedCount",
                hidden: true,
            },
            {
                title: "employeeBankDetails",
                field: "employeeBankDetails",
                hidden: true,
            },
            {
                title: "payrollProcessEmployee",
                field: "payrollProcessEmployee",
                hidden: true,
            },
            {
                title: "payrollProcessEmployeeResults",
                field: "payrollProcessEmployeeResults",
                hidden: true,
            },
            {
                title: "Employee Id",
                field: "empNo",
            },
            {
                title: "Name",
                field: "empName",
            },
        ];
        setColumns(columnSet);
        setInitialColumns(columnSet);
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

    const generate = (bankFileData, tData, singles, lineTypeList) => {
        const rows = [];
        bankFileData.bankFileConfigurator.sort((a, b) => a.sequence - b.sequence);
        bankFileData.bankFileConfigurator.forEach((row) => {
            const formats = row.bankFileLineFormats;
            formats.sort((a, b) => a.sequence - b.sequence);
            if (lineTypeList.find((l) => l.id === row.lineTypeId)?.multiLines) {
                tData.forEach((emp) => {
                    generateRows(formats, rows, row, emp);
                });
            } else {
                const singleRow = singles.find(
                    (s) => s.bankFileConfiguratorId === row.id
                );
                const results = singleRow?.formulaResults;
                generateRows(formats, rows, row, results);
            }
        });
        return rows;
    }

    const generateRows = (formats, rows, row, emp) => {
        let singleRowSeq = 0;
        let tempData = "";
        const formattedRow = [];
        formats.forEach((format, index) => {
            tempData = "";
            if (emp) {
                if (format?.lineFormat && emp[format?.lineFormat]) {
                    tempData = emp[format?.lineFormat] ?? "";
                } else {
                    tempData =
                        format.functionCode === FUNCTION_CODES.FFREETEXT
                            ? format?.lineFormat
                            : format.functionCode === FUNCTION_CODES.FEFFECTIVEDATE
                                ? emp[`${FIELD_TYPES.effectiveDate.value}#${format.lineFormat}`] ?? emp.find(e => parseInt(e.functionCode) === FUNCTION_CODES.FEFFECTIVEDATE)?.result
                                : format.functionCode === FUNCTION_CODES.FGETCOM
                                    ? emp[FUNCTION_CODES.FGETCOM] ||
                                    emp.find((f) => f.parameterList === format?.lineFormat)?.result
                                    : emp[index]?.result ?? "";
                    singleRowSeq++;
                }
            }
            if (tempData?.length < format?.length) {
                const tempCount = tempData.length;
                switch (format.fillDirection) {
                    case FILL_DIRECTIONS.RIGHT: {
                        for (let i = 0; i < format.length - tempCount; i++)
                            tempData += format.fillWith;
                        break;
                    }
                    case FILL_DIRECTIONS.LEFT: {
                        for (let i = 0; i < format.length - tempCount; i++)
                            tempData = format.fillWith + tempData;
                        break;
                    }
                }
            } else if (tempData?.length > format?.length) {
                switch (format.trim) {
                    case TRIM_TYPES.RIGHT_TRIM: {
                        tempData = tempData.substring(0, format.length);
                        break;
                    }
                    case TRIM_TYPES.LEFT_TRIM: {
                        tempData = tempData.substring(tempData.length - format.length);
                        break;
                    }
                }
            }
            formattedRow.push(tempData);
        });
        rows.push(
            row.commaSeparated ? formattedRow.join(",") : formattedRow.join("")
        );
    };

    const setBankDisketteTableData = (
        bankDiskette,
        payrollPeriodDetail = null,
        isPeriodChange,
        selectedPayroll = null,
        selectedEffectiveDate = effectiveDate
    ) => {
        setLoading(true);
        const {empData} = setPayrollDetailsData(selectedPayroll ?? payroll);
        generateBankDisketteService()
            .getAllBankDisketteValues(
                {
                    payrollBankDiskette: bankDiskette,
                    employeeIds: empData.map((emp) => emp.id),
                    payroll: selectedPayroll?.id ?? payroll.id,
                    payrollPeriodDetail:
                        payrollPeriodDetail ??
                        dropDownPeriod?.value ??
                        dropDownPeriodList.findLast(
                            (p) => p.periodProcess === payrollPeriodProcess.CLOSE
                        )?.value ??
                        dropDownPeriodList[0].value,
                    effectiveDate: selectedEffectiveDate,
                },
                isPeriodChange
            )
            .then(({data}) => {
                setBankFile(data.bankFile);
                setConfirm(data?.bankDisketteCreation?.bankDisketteConfirmed ?? false);
                setLastGeneratedDate(
                    data?.bankDisketteCreation?.lastGeneratedDate
                        ? new Date(data?.bankDisketteCreation?.lastGeneratedDate)
                        : null
                );

                const combineObjectArray = (objectArray) => {
                    const tempArray = [];
                    const emptyProps = [];
                    const allProps = [];
                    objectArray.forEach((obj) => {
                        const empty = Object.values(obj).filter((o) => o === "");
                        empty.length > 0 && emptyProps.push(empty);
                        allProps.push(obj);
                    });
                    if (emptyProps.length !== allProps.length) {
                        objectArray.forEach((obj, index) => {
                            const value = obj[Object.keys(obj)[0]].split("#");
                            const newArray = objectArray.filter(
                                (_, innerIndex) => index !== innerIndex
                            );
                            const values = newArray.map(
                                (prop) => Object.values(prop)[0].split("#")[0]
                            );
                            const duplicate = values.filter(
                                (item, index) => values.indexOf(item) !== index
                            )[0];
                            const formatArray = newArray
                                .map((prop) => {
                                    const el = prop[Object.keys(prop)[0]].split("#");
                                    const value =
                                        el[0] === duplicate || (!duplicate && el.length === 2)
                                            ? el[1]
                                            : el.length < 2
                                                ? el[0]
                                                : "";
                                    return {[Object.keys(prop)[0]]: value};
                                })
                                .filter((elem) => elem[Object.keys(elem)[0]] !== "");
                            const newObj = Object.assign(
                                {},
                                value.length > 1
                                    ? {[Object.keys(obj)[0]]: value[1]}
                                    : {[Object.keys(obj)[0]]: value[0]},
                                ...formatArray
                            );
                            tempArray.push(newObj);
                        });
                    }

                    return [...new Set(tempArray)];
                };

                let tempColumnSet = []
                data.bankFile.bankFileConfigurator.forEach((bankFileConfig) => {
                    if (
                        lineTypeList.find((l) => l.id === bankFileConfig.lineTypeId)
                            ?.multiLines
                    ) {
                        bankFileConfig.bankFileLineFormats.forEach((format) => {
                            const lineFormat =
                                format.lineFormat === FIELD_TYPES.bankSequence.value
                                    ? FIELD_TYPES.bankSequence
                                    : format.lineFormat === FIELD_TYPES.bank.value
                                        ? FIELD_TYPES.bank
                                        : format.lineFormat === FIELD_TYPES.branch.value
                                            ? FIELD_TYPES.branch
                                            : format.lineFormat === FIELD_TYPES.nic.value
                                                ? FIELD_TYPES.nic
                                                : format.lineFormat === FIELD_TYPES.amount.value
                                                    ? FIELD_TYPES.amount
                                                    : format.lineFormat === FIELD_TYPES.accountNumber.value
                                                        ? FIELD_TYPES.accountNumber
                                                        : format.lineFormat === FIELD_TYPES.fullName.value
                                                            ? FIELD_TYPES.fullName
                                                            : format.lineFormat === FIELD_TYPES.employeeName.value
                                                                ? FIELD_TYPES.employeeName
                                                                : format.lineFormat === FIELD_TYPES.initials.value
                                                                    ? FIELD_TYPES.initials
                                                                    : format.lineFormat === FIELD_TYPES.empNo.value
                                                                        ? FIELD_TYPES.empNo
                                                                        : format.functionCode === FUNCTION_CODES.FITEMGRP
                                                                            ? payItemGroupList.find(
                                                                                (group) => group.id === format.lineFormat
                                                                            )
                                                                            : format.functionCode === FUNCTION_CODES.FPAYPARA
                                                                                ? payrollParameterList.find(
                                                                                    (group) => group.id === format.lineFormat
                                                                                )
                                                                                : format.functionCode === FUNCTION_CODES.FFREETEXT
                                                                                    ? {
                                                                                        label: `${FIELD_TYPES.freeText.label}/${format.sequence}`,
                                                                                        value: `${FIELD_TYPES.freeText.value}/${
                                                                                            format.sequence - 1
                                                                                        }`,
                                                                                    }
                                                                                    : format.functionCode === FUNCTION_CODES.FEFFECTIVEDATE
                                                                                        ? {
                                                                                            label: `${FIELD_TYPES.effectiveDate.label} (${format.lineFormat})`,
                                                                                            value: `${FIELD_TYPES.effectiveDate.value}#${format.lineFormat}`,
                                                                                        }
                                                                                        : functionData.find(
                                                                                        (func) => func.value === format.functionCode
                                                                                    ) ?? "";
                            tempColumnSet.push({
                                title: lineFormat?.label ?? lineFormat?.code,
                                field: lineFormat?.value?.toString() ?? lineFormat?.id,
                            });
                        });
                    }
                });
                const tempArray = [...initialColumns, ...tempColumnSet];
                tempColumnSet = tempArray.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.field === value.field) &&
                        value.field
                );

                let tempData = [];
                const tempEmpData = empData.map((e) => {
                    const id = e.id;
                    delete e.id;
                    return {...e, employeeId: id};
                });
                tempEmpData.forEach((tData) => {
                    const tempResult = data.formulaResults?.find(
                        (result) => result.employeeId === tData.employeeId
                    );
                    const resultSet = [];
                    if (tempResult?.formulaResults) {
                        tempResult.formulaResults.forEach((empResult) => {
                            try {
                                const parse = JSON.parse(empResult.result);
                                if (parse.length > 0) {
                                    parse.forEach((p) => {
                                        resultSet.push({
                                            key:
                                                empResult.parameterList === ""
                                                    ? functionData
                                                        .find(
                                                            (f) =>
                                                                f.value === parseInt(empResult.functionCode)
                                                        )
                                                        ?.value.toString()
                                                    : parseInt(empResult.functionCode) ===
                                                    FUNCTION_CODES.FITEMGRP ||
                                                    parseInt(empResult.functionCode) ===
                                                    FUNCTION_CODES.FPAYPARA
                                                        ? empResult.parameterList.split(";")[0]
                                                        : parseInt(empResult.functionCode) ===
                                                        FUNCTION_CODES.FFREETEXT
                                                            ? `${FIELD_TYPES.freeText.value}/${empResult.sequence}`
                                                            : empResult.parameterList,
                                            value: p.toString(),
                                        });
                                    });
                                } else {
                                    resultSet.push({
                                        key:
                                            empResult.parameterList === ""
                                                ? functionData
                                                    .find(
                                                        (f) =>
                                                            f.value === parseInt(empResult.functionCode)
                                                    )
                                                    ?.value.toString()
                                                : parseInt(empResult.functionCode) ===
                                                FUNCTION_CODES.FFREETEXT
                                                    ? `${FIELD_TYPES.freeText.value}/${empResult.sequence}`
                                                    : parseInt(empResult.functionCode) ===
                                                    FUNCTION_CODES.FEFFECTIVEDATE
                                                        ? `${FIELD_TYPES.effectiveDate.value}#${empResult.parameterList}`
                                                        : parseInt(empResult.functionCode) ===
                                                        FUNCTION_CODES.FGETCOM
                                                            ? FUNCTION_CODES.FGETCOM.toString()
                                                            : parseInt(empResult.functionCode) ===
                                                            FUNCTION_CODES.FITEMGRP ||
                                                            parseInt(empResult.functionCode) ===
                                                            FUNCTION_CODES.FPAYPARA
                                                                ? empResult.parameterList.split(";")[0]
                                                                : empResult.parameterList,
                                        value: parse.toString(),
                                    });
                                }
                            } catch (e) {
                                resultSet.push({
                                    key:
                                        empResult.parameterList === ""
                                            ? functionData
                                                .find(
                                                    (f) => f.value === parseInt(empResult.functionCode)
                                                )
                                                ?.value.toString()
                                            : parseInt(empResult.functionCode) ===
                                            FUNCTION_CODES.FFREETEXT
                                                ? `${FIELD_TYPES.freeText.value}/${empResult.sequence}`
                                                : parseInt(empResult.functionCode) ===
                                                FUNCTION_CODES.FEFFECTIVEDATE
                                                    ? `${FIELD_TYPES.effectiveDate.value}#${empResult.parameterList}`
                                                    : parseInt(empResult.functionCode) ===
                                                    FUNCTION_CODES.FITEMGRP ||
                                                    parseInt(empResult.functionCode) ===
                                                    FUNCTION_CODES.FPAYPARA
                                                        ? empResult.parameterList.split(";")[0]
                                                        : empResult.parameterList,
                                    value: empResult.result.toString(),
                                });
                            }
                        });
                    }
                    //Group key values
                    const group_to_values = resultSet.reduce(function (obj, item) {
                        obj[item.key] = obj[item.key] || [];
                        obj[item.key].push(item.value);
                        return obj;
                    }, {});

                    const groups = Object.keys(group_to_values).map(function (key) {
                        return {key, value: group_to_values[key]};
                    });

                    const objectList = [];
                    groups.forEach((group) => {
                        const x = [];
                        group.value.forEach((groupValue) => {
                            x.push({[group.key]: groupValue});
                        });
                        objectList.push(...x);
                    });
                    const objectArray = combineObjectArray(objectList);
                    const mappedArray = objectArray.map((obj) => ({...tData, ...obj}));
                    const x = mappedArray.map(m => ({...m}));
                    const uniq = new Set(x.map((e) => JSON.stringify(e)));
                    let res = Array.from(uniq ?? {}).map((e) => JSON.parse(e));

                    if (Object.keys(res[0] ?? {}).includes(functionCodesArray[0])) {
                        res = res.filter((r) => {
                            let sum = 0;
                            let ac = r[FIELD_TYPES.accountNumber.value];
                            while (ac) {
                                sum += ac % 10;
                                ac = Math.floor(ac / 10);
                            }
                            return sum.toString() === r[functionCodesArray[0]];
                        });
                    }
                    resultSet ? tempData.push(...res) : tempData.push(tData);
                });
                setColumns(tempColumnSet);

                tempData = tempData.map((d) => {
                    const keys = Object.keys(d);
                    keys.forEach((key) => {
                        if (d[key] === "") delete d[key];
                    });
                    return {...d};
                });

                worker.postMessage({data, tempData, lineTypeList});
            })
            .catch((e) => {
                console.error(e);
            });
    };

    const bankDisketteOnChange = (e, selected) => {
        if (selected) {
            setBankDisketteTableData(selected.value);
            setBankDiskette(selected);
        }
    };

    const payrollPeriodOnChange = (e, selected) => {
        if (selected) {
            setDropDownPeriod(selected);
            setBankDisketteTableData(
                bankDiskette?.value ?? bankDisketteList[0]?.value,
                selected.value,
                true
            );
        }
    };

    const effectiveDateOnChange = (e) => {
        const effectiveDate = e.target.value;
        setEffectiveDate(effectiveDate);
        setBankDisketteTableData(
            bankDiskette?.value ?? bankDisketteList[0]?.value,
            null,
            false,
            null,
            effectiveDate
        );
    };

    const generateDiskette = () => {
        if (dropDownPeriod?.status === payrollPeriodProcess.FINALIZED || dropDownPeriod?.status === payrollPeriodProcess.CLOSE) {
            setLoading(true);
            generateBankDisketteService()
                .generateBankDiskette({
                    payrollDefinitionId: payroll.id,
                    payRollPeriodDetailId: dropDownPeriod?.value,
                    payrollBankDisketteId: bankDiskette?.value ?? bankDisketteList[0].value,
                })
                .then(({data}) => {
                    download(bankFile?.name ?? "name", diskette.join("\n"));
                    setLastGeneratedDate(new Date(data.lastGeneratedDate));
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                    if (
                        error.status === RESP_STATUS_CODES.FORBIDDEN ||
                        error.status === RESP_STATUS_CODES.UNAUTHORIZED
                    ) {
                        NotificationManager.error(
                            NOTIFICATION_ERROR.AUTH_FAILED,
                            error.statusText
                        );
                    } else {
                        NotificationManager.error("Failed to Generate Diskette", "Error");
                    }
                });
        } else {
            NotificationManager.error("Approval of Completed Payroll is Required", "Error");
        }
    };

    function download(filename, text) {
        const element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(text)
        );
        element.setAttribute("download", filename.trim());

        element.style.display = "none";
        document.body.appendChild(element);
        element.click();

        document.body.removeChild(element);
    }

    return (
        <>
            {showModal && (
                <GenerateBankDisketteModal
                    show={showModal}
                    setShow={setShowModal}
                    payrollBankFile={payrollBankFile}
                    processData={processData}
                />
            )}
            <div>
                <div className="d-flex mb-3">
                    <dev className="col-md-3">
                        <AutoCompleteDropDown
                            dropDownData={bankDisketteList}
                            onChange={bankDisketteOnChange}
                            size={"small"}
                            label="Bank File"
                            defaultValue={bankDiskette ?? bankDisketteList[0]}
                        />
                    </dev>
                    &nbsp;&nbsp;
                    <dev className="col-md-2">
                        <AutoCompleteDropDown
                            dropDownData={dropDownPeriodList}
                            onChange={payrollPeriodOnChange}
                            size={"small"}
                            label="Period"
                            defaultValue={
                                dropDownPeriod ??
                                dropDownPeriodList.findLast(
                                    (p) => p.periodProcess === payrollPeriodProcess.FINALIZED || p.periodProcess === payrollPeriodProcess.PROCESSED
                                ) ??
                                dropDownPeriodList[0]
                            }
                        />
                    </dev>
                    &nbsp;&nbsp;
                    <dev className="col-md-2">
                        <input
                            className="form-control col mb-3"
                            style={{minWidth: 200}}
                            type="date"
                            value={effectiveDate ?? ""}
                            onChange={effectiveDateOnChange}
                        ></input>
                    </dev>
                </div>
            </div>
            <MaterialTable
                icons={tableIcons}
                title={
                    <>
            <span className="mt-2">
              <strong>Generated Date: </strong>
                {lastGeneratedDate?.toLocaleDateString() ?? ""}
            </span>
                        &nbsp;&nbsp;
                        <span className="mt-2">
              <strong>Diskette Value: </strong>
                            {disketteValue}
            </span>
                        &nbsp;&nbsp;
                        <span className="mt-2">
              <strong>Diskette Rows: </strong>
                            {tableData?.length ?? 0}
            </span>
                    </>
                }
                columns={columns}
                data={tableData}
                // isLoading={isLoading}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: true,
                    // selection: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize:
                        JSON.parse(
                            localStorageService.getItem("auth_user")?.tablePageCount ?? null
                        )?.[window.location.pathname] ?? 5,
                    emptyRowsWhenPaging: false,
                    selectionProps: (rowData) => ({
                        color: "primary",
                    }),
                }}
                onRowsPerPageChange={(pageSize) =>
                    handlePageSize(pageSize, window.location.pathname)
                }
                // onRowClick={(e, rowData) => clickRow(e, rowData)}
                actions={[
                    {
                        icon: forwardRef((props, ref) => (
                            <SaveAltIcon {...props} ref={ref}/>
                        )),
                        tooltip: "Generate Diskette",
                        isFreeAction: true,
                        disabled: isConfirm,
                        onClick: (event, rowData) => generateDiskette(),
                    },
                ]}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(GenerateBankDisketteList);
