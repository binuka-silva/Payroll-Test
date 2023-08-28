import React, {Fragment, useEffect, useState} from "react";
import {Button, FormCheck, FormSelect, Modal} from "react-bootstrap";
import {classList} from "@utils";
import {
    ADV_PARA_VALUES,
    CALCULATION_METHOD,
    DAY_TYPES,
    EMP_FIELD_TYPES,
    FUNCTION_CODES,
    LOAN_DETAILS,
    PARAMETER_NAMES,
    PARAMETER_TYPES, PAY_ITEM_FIELD_TYPES,
    PERIOD_TYPES,
    ROUNDING_TYPE
} from "./constant";
import {NotificationManager} from "react-notifications";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";

const PaymentTypeModal = ({
                              fetchPayItemCalculationDataFunc,
                              setCalculation,
                              payItemParameterList,
                              employeeParameterList,
                              payItemGroupList,
                              payItemList,
                              advanceParameterList,
                              payrollParameterList,
                              loanTypeList,
                              employeesFilterDetailList,
                              rowCount,
                              functionData,
                              editData,
                              calculationTableData,
                              show,
                              setShow,
                              ...props
                          }) => {
    const [parameterCount, setParameterCount] = useState(0);
    const [functionDesc, setFunctionDesc] = useState("");
    const [functionSelectors, setFunctionSelectors] = useState([]);
    const [subSelection, setSubSelection] = useState({});
    const [selectedFunc, setSelectedFunc] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [date1, setDate1] = useState("");
    const [date2, setDate2] = useState("");
    const [textFieldValue, setTextFieldValue] = useState("");
    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("");
    const [value3, setValue3] = useState("");
    const [value4, setValue4] = useState("");
    const [value5, setValue5] = useState("");
    const [selectedValues, setSelectedValues] = useState([]);
    const [textFieldValues, setTextFieldValues] = useState([]);
    const [isDefaultText, setDefaultText] = useState(false);

    const [showCheckbox, setCheckbox] = useState(false);
    const [showLoanCheckbox, setLoanCheckbox] = useState(false);
    const [isCheckValue1, setCheckValue1] = useState(false);
    const [isCheckValue2, setCheckValue2] = useState(false);
    const [isCheckValue3, setCheckValue3] = useState(false);
    const [isCheckValue4, setCheckValue4] = useState(false);
    const [isCheckValue5, setCheckValue5] = useState(false);

    const handleClose = () => {
        setFunctionDesc("");
        setParameterCount(0);
        setFunctionSelectors([]);
        setStartDate("");
        setEndDate("");
        setDate1("");
        setDate2("");
        setSelectedFunc("");
        setTextFieldValue("");
        setValue1("");
        setValue2("");
        setValue3("");
        setValue4("");
        setCheckbox(false);
        setLoanCheckbox(false);
        setCheckValue1(false);
        setCheckValue2(false);
        setCheckValue3(false);
        setCheckValue4(false);
        setShow(false);
    };

    useEffect(() => {
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        if (editData) {
            setDefaultText(true);
            const selectedFunction = functionData.find(func => func.id === parseInt(editData.code));
            if (selectedFunction) {
                setSelectedFunc(selectedFunction);

                if (selectedFunction.id === 1 || selectedFunction.id === 2 || selectedFunction.id === 3 || selectedFunction.id === 4 || selectedFunction.id === 7) {
                    setCheckbox(true);
                    if (editData.parameterList.split(";")[0]?.startsWith("#")) setCheckValue1(true);
                    if (editData.parameterList.split(";")[1]?.startsWith("#")) setCheckValue2(true);
                    if (editData.parameterList.split(";")[2]?.startsWith("#")) setCheckValue3(true);
                    if (editData.parameterList.split(";")[3]?.startsWith("#")) setCheckValue4(true);
                    if (editData.parameterList.split(";")[4]?.startsWith("#")) setCheckValue5(true);
                } else if (selectedFunction.id === 12) {
                    setLoanCheckbox(true);
                    if (editData.parameterList.split(";")[3] === "true") setCheckValue1(true);
                }

                setFunctionData(selectedFunction);
            }
        }
    }, []);

    useEffect(() => {
        const selectedFunction = functionData.find(func => func.id === parseInt(selectedFunc.id));
        if (selectedFunction) setFunctionData(selectedFunction);
    }, [isCheckValue1, isCheckValue2, isCheckValue3, isCheckValue4, isCheckValue5]);

    const onSelectedFunc = (e, selected) => {
        if (selected) {
            setCheckbox(false);
            setLoanCheckbox(false);
            const selectedFunction = functionData.find(func => func.id === parseInt(selected.value));
            if (selectedFunction.id === 1 || selectedFunction.id === 2 || selectedFunction.id === 3 || selectedFunction.id === 4 || selectedFunction.id === 7) {
                setSelectedFunc(selectedFunction);
                setCheckbox(true);
                setFunctionData(selectedFunction);
            } else if (selectedFunction) {
                setSelectedFunc(selectedFunction);
                setFunctionData(selectedFunction);
                if (selectedFunction.id === 12) setLoanCheckbox(true);
            }
        }
    }

    const setFunctionData = (selectedFunc) => {
        setParameterCount(selectedFunc.parameters.length)
        setFunctionDesc(selectedFunc.description);
        const preSelectedValues = [];
        const preTextFieldValues = [];
        const selectedList = [];
        selectedFunc.parameters.forEach(para => {
            const paraList = editData?.parameterList?.split(";");
            let parameter;
            if (paraList) parameter = paraList[para.order - 1];
            switch (para.name) {
                case PARAMETER_NAMES.PERIOD_TYPE: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.PERIOD_TYPE,
                        value: [PERIOD_TYPES.default, PERIOD_TYPES.accounting, PERIOD_TYPES.tax],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.DAY_TYPES: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.DAY_TYPES,
                        value: [DAY_TYPES.calendar, DAY_TYPES.working],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.CALCULATION_METHOD: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.CALCULATION_METHOD,
                        value: [CALCULATION_METHOD.days, CALCULATION_METHOD.months, CALCULATION_METHOD.years],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.ROUNDING_TYPE: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.ROUNDING_TYPE,
                        value: [ROUNDING_TYPE.roundUp, ROUNDING_TYPE.roundDown, ROUNDING_TYPE.noRounding],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.ROUNDING_VALUE: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    const temp = [];
                    const to = editData ? editData.sequence - 1 : rowCount;
                    for (let i = 1; i <= to; i++) {
                        temp.push({
                            value: `#${i}`,
                            label: `#${i}`
                        })
                    }
                    selectedList.push({
                        name: PARAMETER_NAMES.ROUNDING_VALUE,
                        value: temp,
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.ROUNDING_TO: {
                    parameter && preTextFieldValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.ROUNDING_TO,
                        value: [],
                        isText: false,
                        type: PARAMETER_TYPES.VALUE,
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.PARAMETER: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    switch (selectedFunc.id) {
                        case parseInt(FUNCTION_CODES.payItemParameter): {
                            selectedList.push({
                                name: PARAMETER_NAMES.PARAMETER,
                                value: payItemParameterList.map(value => ({value: value.code, label: value.name})),
                                selected: parameter
                            });
                        }
                            break;
                        case parseInt(FUNCTION_CODES.employeeParameter): {
                            selectedList.push({
                                name: PARAMETER_NAMES.PARAMETER,
                                value: employeeParameterList.map(value => ({value: value.code, label: value.name})),
                                selected: parameter
                            });
                        }
                            break;
                        case parseInt(FUNCTION_CODES.payrollParameter): {
                            console.log(payrollParameterList);
                            selectedList.push({
                                name: PARAMETER_NAMES.PARAMETER,
                                value: payrollParameterList.map(value => ({value: value.code, label: value.name})),
                                selected: parameter
                            });
                        }
                    }
                }
                    break;
                case PARAMETER_NAMES.ADVANCE_PARAMETER: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.ADVANCE_PARAMETER,
                        value: advanceParameterList.map(value => ({value: value.code, label: value.name})),
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.GROUP: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.GROUP,
                        value: payItemGroupList.map(value => ({value: value.code, label: value.name})),
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.PAY_ITEM: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.PAY_ITEM,
                        value: payItemList.map(value => ({value: value.code, label: value.name})),
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.LOAN_TYPE: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.LOAN_TYPE,
                        value: loanTypeList.map(value => ({value: value.code, label: value.name})),
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.LOAN_DETAIL: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.LOAN_DETAIL,
                        value: [LOAN_DETAILS.monthlyLoanCapital, LOAN_DETAILS.monthlyLoanInterest, LOAN_DETAILS.capitalBal, LOAN_DETAILS.interestBal, LOAN_DETAILS.balanceInstallments],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.LOAN_SEQ: {
                    parameter && preTextFieldValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.LOAN_SEQ,
                        type: PARAMETER_TYPES.VALUE,
                        isText: false,
                        value: [],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.VALUE1: {
                    if (parameter) {
                        if (parameter.startsWith("#")) {
                            preSelectedValues.push({id: para.name, value: parameter});
                        } else {
                            setValue1(parameter);
                        }
                    }

                    if (isCheckValue1) {
                        const temp = [];
                        const to = editData ? editData.sequence - 1 : rowCount;
                        for (let i = 1; i <= to; i++) {
                            temp.push({
                                value: `#${i}`,
                                label: `#${i}`,
                            })
                        }
                        selectedList.push({
                            name: PARAMETER_NAMES.VALUE1,
                            value: temp,
                            selected: parameter,
                        });
                    } else {
                        selectedList.push({
                            name: PARAMETER_NAMES.VALUE1,
                            type: PARAMETER_TYPES.VALUE,
                            isText: false,
                            value: [],
                            selected: parameter
                        });
                    }
                }
                    break;
                case PARAMETER_NAMES.VALUE2: {
                    if (parameter) {
                        if (parameter.startsWith("#")) {
                            preSelectedValues.push({id: para.name, value: parameter});
                        } else {
                            setValue2(parameter);
                        }
                    }

                    if (isCheckValue2) {
                        const temp = [];
                        const to = editData ? editData.sequence - 1 : rowCount;
                        for (let i = 1; i <= to; i++) {
                            temp.push({
                                value: `#${i}`,
                                label: `#${i}`,
                            })
                        }
                        selectedList.push({
                            name: PARAMETER_NAMES.VALUE2,
                            value: temp,
                            selected: parameter,
                        });
                    } else {
                        selectedList.push({
                            name: PARAMETER_NAMES.VALUE2,
                            type: PARAMETER_TYPES.VALUE,
                            isText: false,
                            value: [],
                            selected: parameter
                        });
                    }
                }
                    break;
                case PARAMETER_NAMES.VALUE3: {
                    if (parameter) {
                        if (parameter.startsWith("#")) {
                            preSelectedValues.push({id: para.name, value: parameter});
                        } else {
                            setValue3(parameter);
                        }
                    }

                    if (isCheckValue3) {
                        const temp = [];
                        const to = editData ? editData.sequence - 1 : rowCount;
                        for (let i = 1; i <= to; i++) {
                            temp.push({
                                value: `#${i}`,
                                label: `#${i}`,
                            })
                        }
                        selectedList.push({
                            name: PARAMETER_NAMES.VALUE3,
                            value: temp,
                            selected: parameter,
                        });
                    } else {
                        selectedList.push({
                            name: PARAMETER_NAMES.VALUE3,
                            type: PARAMETER_TYPES.VALUE,
                            isText: false,
                            value: [],
                            selected: parameter
                        });
                    }
                }
                    break;
                case PARAMETER_NAMES.VALUE4: {
                    if (parameter) {
                        if (parameter.startsWith("#")) {
                            preSelectedValues.push({id: para.name, value: parameter});
                        } else {
                            setValue4(parameter);
                        }
                    }

                    if (isCheckValue4) {
                        const temp = [];
                        const to = editData ? editData.sequence - 1 : rowCount;
                        for (let i = 1; i <= to; i++) {
                            temp.push({
                                value: `#${i}`,
                                label: `#${i}`,
                            })
                        }
                        selectedList.push({
                            name: PARAMETER_NAMES.VALUE4,
                            value: temp,
                            selected: parameter,
                        });
                    } else {
                        selectedList.push({
                            name: PARAMETER_NAMES.VALUE4,
                            type: PARAMETER_TYPES.VALUE,
                            isText: false,
                            value: [],
                            selected: parameter
                        });
                    }
                }
                    break;
                case PARAMETER_NAMES.COVER: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    const temp = [];
                    const to = editData ? editData.sequence - 1 : rowCount;
                    for (let i = 1; i <= to; i++) {
                        temp.push({
                            value: `#${i}`,
                            label: `#${i}`
                        })
                    }
                    selectedList.push({
                        name: PARAMETER_NAMES.COVER,
                        value: temp,
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.ARGUMENT1: {
                    if (parameter) {
                        if (parameter.startsWith("#")) {
                            preSelectedValues.push({id: para.name, value: parameter});
                        } else {
                            setValue1(parameter);
                        }
                    }

                    if (isCheckValue1) {
                        const temp = [];
                        const to = editData ? editData.sequence - 1 : rowCount;
                        for (let i = 1; i <= to; i++) {
                            temp.push({
                                value: `#${i}`,
                                label: `#${i}`,
                            })
                        }
                        selectedList.push({
                            name: PARAMETER_NAMES.ARGUMENT1,
                            value: temp,
                            selected: parameter,
                        });
                    } else {
                        selectedList.push({
                            name: PARAMETER_NAMES.ARGUMENT1,
                            type: PARAMETER_TYPES.VALUE,
                            isText: true,
                            value: [],
                            selected: parameter
                        });
                    }
                }
                    break;
                case PARAMETER_NAMES.ARGUMENT2: {
                    if (parameter) {
                        if (parameter.startsWith("#")) {
                            preSelectedValues.push({id: para.name, value: parameter});
                        } else {
                            setValue2(parameter);
                        }
                    }

                    if (isCheckValue2) {
                        const temp = [];
                        const to = editData ? editData.sequence - 1 : rowCount;
                        for (let i = 1; i <= to; i++) {
                            temp.push({
                                value: `#${i}`,
                                label: `#${i}`,
                            })
                        }
                        selectedList.push({
                            name: PARAMETER_NAMES.ARGUMENT2,
                            value: temp,
                            selected: parameter,
                        });
                    } else {
                        selectedList.push({
                            name: PARAMETER_NAMES.ARGUMENT2,
                            type: PARAMETER_TYPES.VALUE,
                            isText: true,
                            value: [],
                            selected: parameter
                        });
                    }
                }
                    break;
                case PARAMETER_NAMES.ARGUMENT3: {
                    if (parameter) {
                        if (parameter.startsWith("#")) {
                            preSelectedValues.push({id: para.name, value: parameter});
                        } else {
                            setValue3(parameter);
                        }
                    }

                    if (isCheckValue3) {
                        const temp = [];
                        const to = editData ? editData.sequence - 1 : rowCount;
                        for (let i = 1; i <= to; i++) {
                            temp.push({
                                value: `#${i}`,
                                label: `#${i}`,
                            })
                        }
                        selectedList.push({
                            name: PARAMETER_NAMES.ARGUMENT3,
                            value: temp,
                            selected: parameter,
                        });
                    } else {
                        selectedList.push({
                            name: PARAMETER_NAMES.ARGUMENT3,
                            type: PARAMETER_TYPES.VALUE,
                            isText: true,
                            value: [],
                            selected: parameter
                        });
                    }
                }
                    break;
                case PARAMETER_NAMES.ARGUMENT4: {
                    if (parameter) {
                        if (parameter.startsWith("#")) {
                            preSelectedValues.push({id: para.name, value: parameter});
                        } else {
                            setValue4(parameter);
                        }
                    }

                    if (isCheckValue4) {
                        const temp = [];
                        const to = editData ? editData.sequence - 1 : rowCount;
                        for (let i = 1; i <= to; i++) {
                            temp.push({
                                value: `#${i}`,
                                label: `#${i}`,
                            })
                        }
                        selectedList.push({
                            name: PARAMETER_NAMES.ARGUMENT4,
                            value: temp,
                            selected: parameter,
                        });
                    } else {
                        selectedList.push({
                            name: PARAMETER_NAMES.ARGUMENT4,
                            type: PARAMETER_TYPES.VALUE,
                            isText: true,
                            value: [],
                            selected: parameter
                        });
                    }
                }
                    break;
                case PARAMETER_NAMES.ARGUMENT5: {
                    if (parameter) {
                        if (parameter.startsWith("#")) {
                            preSelectedValues.push({id: para.name, value: parameter});
                        } else {
                            setValue5(parameter);
                        }
                    }

                    if (isCheckValue5) {
                        const temp = [];
                        const to = editData ? editData.sequence - 1 : rowCount;
                        for (let i = 1; i <= to; i++) {
                            temp.push({
                                value: `#${i}`,
                                label: `#${i}`,
                            })
                        }
                        selectedList.push({
                            name: PARAMETER_NAMES.ARGUMENT5,
                            value: temp,
                            selected: parameter,
                        });
                    } else {
                        selectedList.push({
                            name: PARAMETER_NAMES.ARGUMENT5,
                            type: PARAMETER_TYPES.VALUE,
                            isText: true,
                            value: [],
                            selected: parameter
                        });
                    }
                }
                    break;
                case PARAMETER_NAMES.FIELD_NAME: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    parameter && setSubSelection(parameter);
                    selectedList.push({
                        name: PARAMETER_NAMES.FIELD_NAME,
                        value:  selectedFunc.name === "FGETPAYITEM" ? [PAY_ITEM_FIELD_TYPES.amount, PAY_ITEM_FIELD_TYPES.units] : [EMP_FIELD_TYPES.employeeType, EMP_FIELD_TYPES.category, EMP_FIELD_TYPES.position, EMP_FIELD_TYPES.gender],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.START_DATE: {
                    parameter && setStartDate(parameter);
                    selectedList.push({
                        name: PARAMETER_NAMES.START_DATE,
                        type: PARAMETER_TYPES.DATE,
                        value: [],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.END_DATE: {
                    parameter && setEndDate(parameter);
                    selectedList.push({
                        name: PARAMETER_NAMES.END_DATE,
                        type: PARAMETER_TYPES.DATE,
                        value: [],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.DATE1: {
                    parameter && setDate1(parameter);
                    selectedList.push({
                        name: PARAMETER_NAMES.DATE1,
                        type: PARAMETER_TYPES.DATE,
                        value: [],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.DATE2: {
                    parameter && setDate2(parameter);
                    selectedList.push({
                        name: PARAMETER_NAMES.DATE2,
                        type: PARAMETER_TYPES.DATE,
                        value: [],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.NUMBER_OF_PERIODS: {
                    parameter && preTextFieldValues.push(parameter);
                    selectedList.push({
                        name: PARAMETER_NAMES.NUMBER_OF_PERIODS,
                        type: PARAMETER_TYPES.VALUE,
                        isText: false,
                        value: [],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.ROUND_BY: {
                    parameter && preTextFieldValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.ROUND_BY,
                        type: PARAMETER_TYPES.VALUE,
                        isText: true,
                        value: [],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.SQL: {
                    parameter && preTextFieldValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.SQL,
                        type: PARAMETER_TYPES.VALUE,
                        isText: true,
                        value: [],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.VALUE: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.VALUE,
                        value: [{
                            employeeTypeList: employeesFilterDetailList.employeeTypes.map(value => ({
                                value: value.id,
                                label: value.name
                            })),
                            employeeCategoryList: employeesFilterDetailList.employeeCategories.map(value => ({
                                value: value.id,
                                label: value.name
                            })),
                            employeeDesignationList: employeesFilterDetailList.designations.map(value => ({
                                value: value.id,
                                label: value.name
                            })),
                            employeeGenderList: employeesFilterDetailList.genderList.map(value => ({
                                value: value.id,
                                label: value.name
                            }))
                        }],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.ADV_PARA_VALUE: {
                    parameter && preSelectedValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.ADV_PARA_VALUE,
                        value: [ADV_PARA_VALUES.value1, ADV_PARA_VALUES.value2],
                        selected: parameter
                    });
                }
                    break;
                case PARAMETER_NAMES.QUERY: {
                    parameter && preTextFieldValues.push({id: para.name, value: parameter});
                    selectedList.push({
                        name: PARAMETER_NAMES.QUERY,
                        type: PARAMETER_TYPES.VALUE,
                        isText: true,
                        value: [],
                        selected: parameter
                    });
                }
            }
        });
        setSelectedValues([...selectedValues, ...preSelectedValues]);
        setTextFieldValues(preTextFieldValues);
        setFunctionSelectors(selectedList);
    }

    const onSelectedParameter = (e) => {
        const exists = selectedValues.find(v => v.id === e.target.id);
        if (exists) {
            exists.value = e.target.value
            setSelectedValues([...selectedValues.filter(v => v.id !== exists.id), exists]);
        } else {
            setSelectedValues([...selectedValues, {id: e.target.id, value: e.target.value}]);
        }

        if (e.target.id === PARAMETER_NAMES.FIELD_NAME) {
            setSubSelection(e.target.value);
        }
    }

    const onTextChanged = (e) => {
        const exists = textFieldValues.find(v => v.id === e.target.id);
        setDefaultText(false);
        if (exists) {
            exists.value = e.target.value
            setTextFieldValues([...textFieldValues.filter(v => v.id !== exists.id), exists]);
        } else {
            setTextFieldValues([...textFieldValues, {id: e.target.id, value: e.target.value}]);
        }
        setTextFieldValue(e.target.value);
    }

    const handleSubmit = () => {
        if (selectedFunc.length === 0) return NotificationManager.error(
            "Add Compulsory Data",
            "Error"
        );

        if (selectedFunc.id === parseInt(FUNCTION_CODES.roundCfDf)) {
            const roundCfDf = calculationTableData.find(table => table.code === FUNCTION_CODES.roundCfDf);
            if (roundCfDf) {
                return NotificationManager.error(
                    "Can't Duplicate (Round CF/BF)",
                    "Error"
                );
            }
        }

        const item = {
            code: selectedFunc.id,
            name: selectedFunc.name,
            parameterCount: selectedFunc.parameters.length,
            parameterList: setParameterListBody()
        }

        if (!(selectedFunc.id === 1 || selectedFunc.id === 2 || selectedFunc.id === 3 || selectedFunc.id === 4 || selectedFunc.id === 7)) {
            if (item.code.length === 0 || (item.parameterCount !== 0 && item.parameterCount !== item.parameterList.split(";").length)) return NotificationManager.error(
                "Add Compulsory Data",
                "Error"
            );
        }

        setCalculation(item);
        handleClose();
    };

    const handleUpdate = () => {
        if (selectedFunc.id === parseInt(FUNCTION_CODES.roundCfDf)) {
            const roundCfDf = calculationTableData.find(table => table.code === FUNCTION_CODES.roundCfDf);
            if (roundCfDf) {
                return NotificationManager.error(
                    "Can't Duplicate (Round CF/BF)",
                    "Error"
                );
            }
        }

        const item = {
            updateId: editData.updateId,
            tableData: editData.tableData,
            code: selectedFunc.id,
            name: selectedFunc.name,
            parameterCount: selectedFunc.parameters.length,
            parameterList: setParameterListBody()
        }
        setCalculation(item);
        handleClose();
    };

    const setParameterListBody = () => {
        const tempArray = [];
        selectedFunc.parameters.forEach(para => {
            const selected = selectedValues.find(value => value.id === para.name);
            const textField = textFieldValues.find(value => value.id === para.name);
            if (selected) {
                tempArray[para.order] = selected.value;
            } else if (textField) {
                tempArray[para.order] = textField.value;
            }

            if (startDate && para.name === PARAMETER_NAMES.START_DATE) tempArray[para.order] = startDate;
            if (endDate && para.name === PARAMETER_NAMES.END_DATE) tempArray[para.order] = endDate;
            if (date1 && para.name === PARAMETER_NAMES.DATE1) tempArray[para.order] = date1;
            if (date2 && para.name === PARAMETER_NAMES.DATE2) tempArray[para.order] = date2;
            if (para.name === PARAMETER_NAMES.LOAN_DED) tempArray[para.order] = isCheckValue1;

            if (!isCheckValue1 && value1 && (para.name === PARAMETER_NAMES.VALUE1 || para.name === PARAMETER_NAMES.ARGUMENT1)) tempArray[para.order] = value1;
            if (!isCheckValue2 && value2 && (para.name === PARAMETER_NAMES.VALUE2 || para.name === PARAMETER_NAMES.ARGUMENT2)) tempArray[para.order] = value2;
            if (!isCheckValue3 && value3 && (para.name === PARAMETER_NAMES.VALUE3 || para.name === PARAMETER_NAMES.ARGUMENT3)) tempArray[para.order] = value3;
            if (!isCheckValue4 && value4 && (para.name === PARAMETER_NAMES.VALUE4 || para.name === PARAMETER_NAMES.ARGUMENT4)) tempArray[para.order] = value4;
            if (!isCheckValue5 && value5 && (para.name === PARAMETER_NAMES.ARGUMENT5)) tempArray[para.order] = value5;
        });
        const joinedArray = tempArray.join(";");
        return joinedArray.startsWith(";;") ? joinedArray.slice(2) : joinedArray.startsWith(";") ? joinedArray.slice(1) : joinedArray
    }

    return (
        <Fragment>
            <Modal show={show} onHide={handleClose} {...props}>
                <Modal.Header closeButton>
                    {editData ? <Modal.Title>Update</Modal.Title> : <Modal.Title>Add</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div
                            className={classList({
                                "col-md-12 mb-3": true,
                            })}
                        >
                            <label htmlFor="validationCustom202">
                                Function
                            </label>
                            <AutoCompleteDropDown
                                dropDownData={functionData.map(func => ({
                                    value: func.id,
                                    label: `${func.name} - ${func.description.substring(0, 35)}`
                                }))}
                                onChange={onSelectedFunc}
                                isFreeDropDown={true}
                                defaultValue={functionData.filter(func => func.id === selectedFunc.id)?.map(func => ({
                                    value: func.id,
                                    label: `${func.name} - ${func.description.substring(0, 50)}`
                                }))[0]}
                                label="Function"
                            />
                        </div>
                        {showLoanCheckbox && <div
                            className={classList({
                                "col-md-12 mb-1": true,
                            })}>
                            <FormCheck
                                onChange={(e) => setCheckValue1(e.target.checked)
                                }
                                checked={isCheckValue1}
                                type="switch"
                                label="Loan Deduction"
                            />
                        </div>}
                        <div
                            className={classList({
                                "col-md-12 mb-3": true,
                            })}
                        >
                            <label htmlFor="validationCustom222">Number of Parameters</label>
                            <input
                                type="number"
                                className="form-control"
                                id="validationCustom222"
                                placeholder="Number of Parameters"
                                value={parameterCount}
                                onChange={(e) => setParameterCount(parseInt(e.target.value))}
                                readOnly={true}
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div
                            className={classList({
                                "col-md-12 mb-3": true
                            })}
                        >
                            <label htmlFor="validationCustom03">Function Description</label>
                            <input
                                type="text"
                                className="form-control"
                                id="validationCustom03"
                                placeholder="Description"
                                value={functionDesc}
                                onChange={(e) => setFunctionDesc(e.target.value)}
                                readOnly={true}
                                required
                            />
                        </div>
                    </div>
                    {selectedFunc && <div className="row">
                        {functionSelectors.map(selected => <div
                            key={selected.name}
                            className={classList({
                                "col-md-12 mb-3": true,
                            })}
                        >
                            {selected.value.length > 0 && <>
                                <label htmlFor="validationCustom202">
                                    {selected.name}
                                </label>
                                <FormSelect
                                    onChange={onSelectedParameter}
                                    id={selected.name}
                                    value={selectedValues.find(v => v.id === selected.name)?.value ?? selected.selected}
                                >
                                    <option value={0}>Select</option>
                                    {selected.name === PARAMETER_NAMES.VALUE ?
                                        (subSelection === EMP_FIELD_TYPES.employeeType.value ? selected.value[0].employeeTypeList.map(para =>
                                                    <option
                                                        key={para.value} value={para.value}>{para.label}</option>) :
                                                subSelection === EMP_FIELD_TYPES.category.value ? selected.value[0].employeeCategoryList.map(para =>
                                                        <option key={para.value}
                                                                value={para.value}>{para.label}</option>) :
                                                    subSelection === EMP_FIELD_TYPES.position.value ? selected.value[0].employeeDesignationList.map(para =>
                                                            <option key={para.value}
                                                                    value={para.value}>{para.label}</option>) :
                                                        subSelection === EMP_FIELD_TYPES.gender.value ? selected.value[0].employeeGenderList.map(para =>
                                                            <option key={para.value}
                                                                    value={para.value}>{para.label}</option>) : ""
                                        ) :
                                        (selected.value.map(para => <option key={para.value}
                                                                            value={para.value}>{para.label}</option>))}
                                </FormSelect></>}
                            {selected.type && selected.type === PARAMETER_TYPES.VALUE && (<div
                                className={classList({
                                    "col-md-12 mb-3": true
                                })}
                            >
                                <label htmlFor="validationCustom03">{selected.name}</label>
                                <input
                                    type={selected.isText ? "text" : "number"}
                                    className="form-control"
                                    id={selected.name}
                                    placeholder={selected.name}
                                    value={(selected.name === PARAMETER_NAMES.VALUE1 || selected.name === PARAMETER_NAMES.ARGUMENT1) ? (value1.length === 0 ? selected.selected : value1)
                                        : (selected.name === PARAMETER_NAMES.VALUE2 || selected.name === PARAMETER_NAMES.ARGUMENT2) ? (value2.length === 0 ? selected.selected : value2)
                                            : (selected.name === PARAMETER_NAMES.VALUE3 || selected.name === PARAMETER_NAMES.ARGUMENT3) ? (value3.length === 0 ? selected.selected : value3)
                                                : (selected.name === PARAMETER_NAMES.VALUE4 || selected.name === PARAMETER_NAMES.ARGUMENT4) ? (value4.length === 0 ? selected.selected : value4)
                                                    : selected.name === PARAMETER_NAMES.ARGUMENT5 ? (value5.length === 0 ? selected.selected : value5)
                                                        : (isDefaultText ? selected.selected : textFieldValue ?? "")}
                                    onChange={(e) => (selected.name === PARAMETER_NAMES.VALUE1 || selected.name === PARAMETER_NAMES.ARGUMENT1) ? setValue1(e.target.value)
                                        : (selected.name === PARAMETER_NAMES.VALUE2 || selected.name === PARAMETER_NAMES.ARGUMENT2) ? setValue2(e.target.value)
                                            : (selected.name === PARAMETER_NAMES.VALUE3 || selected.name === PARAMETER_NAMES.ARGUMENT3) ? setValue3(e.target.value)
                                                : (selected.name === PARAMETER_NAMES.VALUE4 || selected.name === PARAMETER_NAMES.ARGUMENT4) ? setValue4(e.target.value)
                                                    : (selected.name === PARAMETER_NAMES.ARGUMENT5) ? setValue5(e.target.value)
                                                        : onTextChanged(e)}
                                    required
                                />
                            </div>)}
                            {showCheckbox && <FormCheck
                                className="mt-2"
                                onChange={(e) => (selected.name === PARAMETER_NAMES.VALUE1 || selected.name === PARAMETER_NAMES.ARGUMENT1) ? setCheckValue1(e.target.checked)
                                    : (selected.name === PARAMETER_NAMES.VALUE2 || selected.name === PARAMETER_NAMES.ARGUMENT2) ? setCheckValue2(e.target.checked)
                                        : (selected.name === PARAMETER_NAMES.VALUE3 || selected.name === PARAMETER_NAMES.ARGUMENT3) ? setCheckValue3(e.target.checked)
                                            : (selected.name === PARAMETER_NAMES.VALUE4 || selected.name === PARAMETER_NAMES.ARGUMENT4) ? setCheckValue4(e.target.checked)
                                                : setCheckValue5(e.target.checked)
                                }
                                checked={(selected.name === PARAMETER_NAMES.VALUE1 || selected.name === PARAMETER_NAMES.ARGUMENT1) ? isCheckValue1
                                    : (selected.name === PARAMETER_NAMES.VALUE2 || selected.name === PARAMETER_NAMES.ARGUMENT2) ? isCheckValue2
                                        : (selected.name === PARAMETER_NAMES.VALUE3 || selected.name === PARAMETER_NAMES.ARGUMENT3) ? isCheckValue3
                                            : (selected.name === PARAMETER_NAMES.VALUE4 || selected.name === PARAMETER_NAMES.ARGUMENT4) ? isCheckValue4
                                                : isCheckValue5}
                                type="switch"
                                label="Use Sequence"
                            />}
                            {selected.type && selected.type === PARAMETER_TYPES.DATE && <div
                                className={classList({
                                    "col-md-12 mb-3": true
                                })}
                            >
                                <label htmlFor="validationCustom03">{selected.name}</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="validationCustom03"
                                    placeholder="Description"
                                    value={selected.name === PARAMETER_NAMES.START_DATE ? (startDate.length === 0 ? selected.selected : startDate)
                                        : selected.name === PARAMETER_NAMES.END_DATE ? (endDate.length === 0 ? selected.selected : endDate)
                                            : selected.name === PARAMETER_NAMES.DATE1 ? (date1.length === 0 ? selected.selected : date1)
                                                : (date2.length === 0 ? selected.selected : date2)}
                                    onChange={(e) => selected.name === PARAMETER_NAMES.START_DATE ? setStartDate(e.target.value)
                                        : selected.name === PARAMETER_NAMES.END_DATE ? setEndDate(e.target.value)
                                            : selected.name === PARAMETER_NAMES.DATE1 ? setDate1(e.target.value)
                                                : setDate2(e.target.value)}
                                    required
                                />
                            </div>}
                        </div>)}
                    </div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {editData ? <Button variant="primary" type="submit" onClick={handleUpdate}>
                        Update
                    </Button> : <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Save Changes
                    </Button>}
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default PaymentTypeModal;
