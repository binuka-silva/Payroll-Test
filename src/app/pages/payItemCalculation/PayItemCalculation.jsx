import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import PayItemCalculationList from "./PayItemCalculationList";
import payItemCalculationService from "../../api/payItemCalculationServices/payItemCalculationService";
import payItemParameterService from "../../api/payItemParameterServices/payItemParameterService";
import payItemGroupService from "../../api/payItemGroupServices/payItemGroupService";
import payItemService from "../../api/payItemServices/payItemService";
import {Button, FormLabel} from "react-bootstrap";
import {FUNCTION_CODES, PARAMETER_NAMES} from "./constant";
import payItemAdvanceParameterService from "../../api/PayItemAdvanceParameterServeces/payItemAdvanceParameterService";
import {NotificationManager} from "react-notifications";
import {connect, useSelector} from "react-redux";
import {setPayItemCalculationsDetails} from "../../redux/actions/PayItemCalculationsActions";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import history from "../../../@history";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import employeeParameterService from "../../api/payrollProcessServices/EmployeeParameterService";
import payrollParameterService from "../../api/payrollParameterServices/payrollParameterService";
import loanTypeService from "../../api/LoanTypeServices/loanTypeService";


const PayItemCalculation = ({setPayItemCalculationsDetails}) => {
    const [tableData, setTableData] = useState([]);
    const [payItemParameterList, setPayItemParameterList] = useState([]);
    const [employeeParameterList, setEmployeeParameterList] = useState([]);
    const [advanceParameterList, setAdvanceParameterList] = useState([]);
    const [employeesFilterDetailList, setEmployeesFilterDetailList] = useState([]);
    const [loanTypeList, setLoanTypeList] = useState([]);
    const [payItemGroupList, setPayItemGroupList] = useState([]);
    const [payItemList, setPayItemList] = useState([]);
    const [payrollParameterList, setPayrollParameterList] = useState([]);
    const [functionData, setFunctionData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [payItem, setPayItem] = useState("");

    const payItemCalculation = useSelector((state) => state.payItemCalculation);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        // Clear all notifications
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        fetchFunctionData();
        fetchModalData();

        return () => {
            setPayItemCalculationsDetails({
                formula: null,
                id: "",
            });
        };
    }, []);

    useEffect(() => {
        if (payItemCalculation.formulaFunctions) {
            const formulaFunc = payItemCalculation.formulaFunctions.map(func => {
                let index = 0;
                const parameters = func.parameterList.split(";");
                const data = functionData.find(f => f.id === parseInt(func.functionCode));

                if (data && data.parameters) {
                    data.parameters.forEach(para => {
                        switch (para.name) {
                            case PARAMETER_NAMES.PAY_ITEM: {
                                const payItem = payItemList.find(item => item.id === parameters[index]);
                                parameters[index] = payItem?.code;
                            }
                                break;
                            case PARAMETER_NAMES.GROUP: {
                                const group = payItemGroupList.find(item => item.id === parameters[index]);
                                parameters[index] = group?.code;
                            }
                                break;
                            case PARAMETER_NAMES.PARAMETER: {
                                let parameter = {};
                                switch (func.functionCode) {
                                    case FUNCTION_CODES.payItemParameter:
                                        parameter = payItemParameterList.find(item => item.id === parameters[index]);
                                        break;
                                    case FUNCTION_CODES.employeeParameter:
                                        parameter = employeeParameterList.find(item => item.id === parameters[index]);
                                        break;
                                    case FUNCTION_CODES.payrollParameter:
                                        parameter = payrollParameterList.find(item => item.id === parameters[index]);
                                        break;
                                }
                                parameters[index] = parameter?.code;
                            }
                                break;
                            case PARAMETER_NAMES.ADVANCE_PARAMETER: {
                                const parameter = advanceParameterList.find(item => item.id === parameters[index]);
                                parameters[index] = parameter?.code;
                            }
                                break;
                            case PARAMETER_NAMES.LOAN_TYPE: {
                                const parameter = loanTypeList.find(item => item.id === parameters[index]);
                                parameters[index] = parameter?.code;
                            }
                        }
                        index++;
                    })
                }

                return {
                    updateId: func.id,
                    code: func.functionCode,
                    parameterCount: parameters.length,
                    parameterList: parameters.length <= 1 ? parameters[0] : parameters.filter(n => n).join(";"),
                    sequence: func.sequence,
                    name: func.name,
                }
            });
            formulaFunc.sort((a, b) => a.sequence - b.sequence);

            setTableData(formulaFunc);
        }
        setPayItem(payItemCalculation?.id);
    }, [functionData, payItemParameterList, payItemList, payItemGroupList, advanceParameterList, employeeParameterList, loanTypeList]);

    const fetchModalData = () => {
        payItemParameterService().getAll().then(({data}) => {
            setPayItemParameterList(data);
        }).catch(e => {
            console.error(e);
        });

        payrollParameterService().getAll().then(({data}) => {
            setPayrollParameterList(data);
        }).catch(e => {
            console.error(e);
        });

        payItemAdvanceParameterService().getAll().then(({data}) => {
            setAdvanceParameterList(data);
        }).catch(e => {
            console.error(e);
        });

        payItemGroupService().getAll().then(({data}) => {
            setPayItemGroupList(data);
        }).catch(e => {
            console.error(e);
        });

        payItemService().getAll().then(({data}) => {
            setPayItemList(data);
        }).catch(e => {
            console.error(e);
        });

        employeeParameterService().getAll().then(({data}) => {
            setEmployeeParameterList(data)
        }).catch(e => {
            console.error(e);
        });

        payItemCalculationService().getEmployeesFilterDetails().then(({data}) => {
            setEmployeesFilterDetailList(data)
        }).catch(e => {
            console.error(e);
        });

        loanTypeService().getAll().then(({data}) => {
            setLoanTypeList(data);
        }).catch(e => {
            console.error(e);
        });
    }

    const fetchFunctionData = () => {
        payItemCalculationService().getAllFunctions().then(({data}) => {
            setFunctionData(data.filter(func => func.id < 26 || func.id > 32));
        }).catch(e => {
            console.error(e);
        });
    };

    const setCalculationList = (e) => {
        e.sequence = e.tableData ? e.tableData.index + 1 : tableData.length + 1;
        if (e.tableData) {
            const temp = [...tableData.filter(data => data.sequence !== e.sequence), e];
            temp.sort((a, b) => a.sequence - b.sequence);
            setTableData(temp);
        } else {
            setTableData([...tableData, e]);
        }
    }

    const setTableDataList = (e) => {
        let index = 1;
        const tempArray = e.map(item => {
            return ({...item, sequence: index++})
        });
        tempArray.sort((a, b) => a.sequence - b.sequence);
        setTableData(tempArray);
    }

    const reqFunctions = (isCreate) => {
        const funcData = [];
        tableData.forEach(data => {
            const func = functionData.find(item => item.id === parseInt(data.code));
            const parameters = data.parameterList.split(";");
            let index = 0;
            func.parameters.forEach(para => {
                switch (para.name) {
                    case PARAMETER_NAMES.PAY_ITEM: {
                        const payItem = payItemList.find(item => item.code === parameters[index]);
                        parameters[index] = payItem.id;
                    }
                        break;
                    case PARAMETER_NAMES.GROUP: {
                        const group = payItemGroupList.find(item => item.code === parameters[index]);
                        parameters[index] = group.id;
                    }
                        break;
                    case PARAMETER_NAMES.PARAMETER: {
                        let parameter = {};
                        switch (func.id) {
                            case parseInt(FUNCTION_CODES.payItemParameter):
                                parameter = payItemParameterList.find(item => item.code === parameters[index]);
                                break;
                            case parseInt(FUNCTION_CODES.employeeParameter):
                                parameter = employeeParameterList.find(item => item.code === parameters[index]);
                                break;
                            case parseInt(FUNCTION_CODES.payrollParameter):
                                parameter = payrollParameterList.find(item => item.code === parameters[index]);
                                break;
                        }
                        parameters[index] = parameter.id;
                    }
                        break;
                    case PARAMETER_NAMES.ADVANCE_PARAMETER: {
                        const parameter = advanceParameterList.find(item => item.code === parameters[index]);
                        parameters[index] = parameter.id;
                    }
                        break;
                    case PARAMETER_NAMES.LOAN_TYPE: {
                        const parameter = loanTypeList.find(item => item.code === parameters[index]);
                        parameters[index] = parameter.id;
                    }
                }
                index++;
            })

            isCreate ? funcData.push({
                payItemId: payItem,
                functionCode: func.id,
                name: data.name,
                sequence: data.sequence,
                parameterList: parameters.length <= 1 ? parameters[0] : parameters.join(";")
            }) : funcData.push({
                id: data.updateId,
                payItemId: payItem,
                functionCode: func.id,
                name: data.name,
                sequence: data.sequence,
                parameterList: parameters.length <= 1 ? parameters[0] : parameters.join(";")
            });
        });
        return funcData;
    }

    const onSubmit = async () => {
        try {
            if (payItem.length === 0) return NotificationManager.error(
                "Add PayItem",
                "Error"
            );

            const formulaData = {
                payItemId: payItem, formulaFunctions: reqFunctions(true)
            }

            await payItemCalculationService().update(payItemCalculation.id, formulaData);

            history.push("/pay-items")
            NotificationManager.success(
                "PayItem successfully updated",
                "Success"
            );
        } catch (e) {
            console.error(e);
            if (e.status === RESP_STATUS_CODES.FORBIDDEN || e.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, e.statusText);
            } else {
                NotificationManager.error(
                    "Save Failed",
                    "Error"
                );
            }
        }
    }

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    {name: "Dashboard", path: "/dashboard/v1/"},
                    {name: "Pay Item", path: "/pay-items"},
                    {name: "Pay Items Calculation Details"},
                ]}
            ></Breadcrumb>
            {isLoading ? (<GullLoadable/>) : <>
                <div className="row row-xs mb-3">
                    <div className="col-md-2">
                        <FormLabel>Code</FormLabel>
                        <input
                            type="text"
                            className="form-control"
                            value={payItemList.find(item => item.id === payItem)?.code ?? ""}
                            readOnly={true}
                        />
                    </div>
                    <div className="col-md-2 mt-3 mt-md-0">
                        <FormLabel>Name</FormLabel>
                        <input
                            type="text"
                            className="form-control"
                            value={payItemList.find(item => item.id === payItem)?.name ?? ""}
                            readOnly={true}
                        />
                    </div>
                    <div className="col" style={{marginTop: "29px"}}>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={onSubmit}
                        >
                            Save
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <PayItemCalculationList
                        tableData={tableData}
                        setTableData={setTableDataList}
                        functionData={functionData}
                        setCalculationList={setCalculationList}
                        payItemGroupList={payItemGroupList}
                        payItemList={payItemList}
                        loanTypeList={loanTypeList}
                        payItemParameterList={payItemParameterList}
                        employeesFilterDetailList={employeesFilterDetailList}
                        employeeParameterList={employeeParameterList}
                        payrollParameterList={payrollParameterList}
                        advanceParameterList={advanceParameterList}
                        rowCount={tableData.length}
                    />
                </div>
                <NotificationContainer/>
            </>}
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayItemCalculationsDetails: state.setPayItemCalculationsDetails,
});

export default connect(mapStateToProps, {
    setPayItemCalculationsDetails,
})(PayItemCalculation);

