import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {connect} from "react-redux";
import GenerateBankDisketteList from "./GenerateBankDisketteList";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import {requestPath} from "./constant";
import AutoCompleteDropDown from "../../components/AutoCompleteDropDown";
import localStorageService from "../../services/localStorageService";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import {setPayrollDetailsData} from "../../common/payrollDetails";
import bankDisketteLineTypeService from "../../api/bankDisketteLineTypeService/bankDisketteLineTypeService";
import generateBankDisketteService from "../../api/generateBankDisketteServices/generateBankDisketteService";
import {NotificationManager} from "react-notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import PayrollDropDown from "../../components/PayrollDropDown";

const GenerateBankDiskette = () => {
    const [isLoading, setLoading] = useState(false);

    const [payItemsData, setPayItemsData] = useState([]);
    const [payrollPayItemsData, setPayrollPayItemsData] = useState([]);
    const [bankDisketteList, setBankDisketteList] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [processPeriodList, setProcessPeriodList] = useState([]);
    const [lineTypeList, setLineTypeList] = useState([]);

    const [payroll, setPayroll] = useState(null);
    const [dropDownPeriod, setDropDownPeriod] = useState(null);
    const [effectiveDate, setEffectiveDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [bankDiskette, setBankDiskette] = useState(null);

    const [isConfirm, setConfirm] = useState(false);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        fetchLineTypes();
    }, []);

    const fetchLineTypes = () => {
        bankDisketteLineTypeService()
            .getAll()
            .then(({data}) => {
                setLineTypeList(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!payroll) {
            setLoading(true);
            fetchPayrollProcessData().then(({data: payrollList}) => {
                payrollList = payrollList.map((payrollProcess) => ({
                    value: payrollProcess.id,
                    label: `${payrollProcess.code} - ${payrollProcess.name}`,
                }));
                setPayrollProcessList(payrollList);

                payrollProcessService()
                    .findOne(
                        localStorageService.getItem("selected_payroll")?.value ??
                        payrollList.find(
                            (p) =>
                                p.value ===
                                localStorageService.getItem("auth_user")?.payrollDefinitionId
                        )?.value ??
                        payrollList[0].value,
                        requestPath
                    )
                    .then(({data: details}) => {
                        setPayroll(details);
                        setInitialTableData(details);
                    });
            });
        }
    }, [payroll]);

    const setInitialTableData = (payroll) => {
        setLoading(true);
        const {empData} =
            setPayrollDetailsData(payroll);
        const empDataList = empData.map((e) => {
            const id = e.id;
            delete e.id;
            return {...e, employeeId: id};
        });
        setEmployeeData(empDataList);
        setProcessPeriodList(payroll?.payRollPeriod?.payRollPeriodDetails);

        setBankDisketteList(
            payroll.payrollBankDiskette.map((d) => ({
                value: d.id,
                label: `${d.bankFile.code} - ${d.bankFile.name}`,
                payroll,
                bankFile: d.bankFileId,
            }))
        );
    };

    const fetchPayrollProcessData = async () => {
        return await payrollProcessService().getAll();
    };

    const payrollOnChange = async (e, selected) => {
        setLoading(true);
        setBankDiskette(null);
        const {data} = await payrollProcessService().findOne(
            selected.value,
            requestPath
        );
        localStorageService.setItem("selected_payroll", selected);
        setInitialTableData(data);
        setPayroll(data);
    };

    const onConfirmClick = (e, selected) => {
        if (selected && selected.value === "confirm") {
            generateBankDisketteService()
                .confirmBankDiskette({
                    payrollDefinitionId: payroll.id,
                    payRollPeriodDetailId: dropDownPeriod?.value,
                    payrollBankDisketteId:
                        bankDiskette?.value ?? bankDisketteList[0].value,
                })
                .then(({data}) => {
                    setConfirm(true);
                    NotificationManager.success("Confirmed Successfully", "Success");
                })
                .catch((error) => {
                    console.error(error);
                    if (
                        error.status === RESP_STATUS_CODES.FORBIDDEN ||
                        error.status === RESP_STATUS_CODES.UNAUTHORIZED
                    ) {
                        NotificationManager.error(
                            NOTIFICATION_ERROR.AUTH_FAILED,
                            error.statusText
                        );
                    } else {
                        NotificationManager.error("Error Confirming", "Error");
                    }
                });
        }
    };

    return (
        <>
            <div className="row">
                {isLoading && (
                    <div className="overlay">
                        <GullLoadable/>
                    </div>
                )}
                <div className="col-md-8 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Generate Bank Diskette"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-4 row">
                    <div className="col-md-5 mt-1 ">
                        <AutoCompleteDropDown
                            dropDownData={[
                                {value: "confirm", label: "CONFIRM"},
                            ]}
                            onChange={onConfirmClick}
                            variant="filled"
                            isFreeDropDown={true}
                            isLabelVisible={true}
                            size="small"
                            label="Status"
                            sx={{width: 170, backgroundColor: "#edd5ff"}}
                            defaultValue={
                                isConfirm
                                    ? {value: "confirm", label: "CONFIRM"}
                                    : {value: "open", label: "OPEN"}
                            }
                        />
                    </div>
                    <div className="col-md-7 mt-1 d-flex justify-content-end">
                        <PayrollDropDown
                            payrollOnChange={payrollOnChange}
                            payrollProcessList={payrollProcessList}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <GenerateBankDisketteList
                    lineTypeList={lineTypeList}
                    bankDisketteList={bankDisketteList}
                    tableData={employeeData}
                    setTableData={setEmployeeData}
                    payItemsData={payItemsData}
                    payrollPayItemsData={payrollPayItemsData}
                    setConfirm={setConfirm}
                    isConfirm={isConfirm}
                    processPeriodList={processPeriodList}
                    payroll={payroll}
                    bankDiskette={bankDiskette}
                    setBankDiskette={setBankDiskette}
                    dropDownPeriod={dropDownPeriod}
                    setDropDownPeriod={setDropDownPeriod}
                    effectiveDate={effectiveDate}
                    setEffectiveDate={setEffectiveDate}
                    isLoading={isLoading}
                    setLoading={setLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(GenerateBankDiskette);
