import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {connect} from "react-redux";
import LoanExcelList from "./LoanExcelList";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import localStorageService from "../../services/localStorageService";
import loanTypeService from "../../api/LoanTypeServices/loanTypeService";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import {setPayrollDetailsData} from "../../common/payrollWithLoanDetails";
import payrollProcessingService from "../../api/payrollProcessingServices/payrollProcessService";
import {NotificationManager} from "react-notifications";
import {payrollPeriodProcess, requestPath,} from "./constant";
import PayrollDropDown from "../../components/PayrollDropDown";

const LoanExcel = () => {
    const [isLoading, setLoading] = useState(false);
    const [loansToEmployeesData, setLoansToEmployeesData] = useState([]);
    const [dateFromPeriod, setDateFromPeriod] = useState("");
    const [dateToPeriod, setDateToPeriod] = useState("");
    const [startDateData, setStartDateData] = useState([]);

    const [loanTypeData, setLoanTypeData] = useState([]);
    const [payrollLoanTypeData, setPayrollLoanTypeData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [payrollProcessEmployeeStatusData, setPayrollProcessEmployeeStatusData,] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [payroll, setPayroll] = useState(null);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        fetchLoanType();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!payroll && loanTypeData?.length !== 0) {
            setLoading(true);
            fetchPayrollProcessData().then(({data: payrollList}) => {
                payrollList = payrollList.map((payrollProcess) => ({
                    value: payrollProcess.id,
                    label: `${payrollProcess.code} - ${payrollProcess.name}`,
                }));
                setPayrollProcessList(payrollList);
                payrollProcessService().findOne(localStorageService.getItem("selected_payroll")?.value ?? payrollList
                    .find((p) => p.value === localStorageService.getItem("auth_user")?.payrollDefinitionId)?.value ?? payrollList[0]?.value, requestPath)
                    .then(({data: details}) => {
                        setPayroll(details);
                        setPayrollDetails(details);
                    });
            });
        }
    }, [payroll, loanTypeData]);

    const setPayrollDetails = (details) => {
        setLoading(true);
 
        const {empData, payrollLoanTypes, loans} = setPayrollDetailsData(details, loanTypeData);

        setEmployeeData(empData);
        setPayrollLoanTypeData(payrollLoanTypes);
        setLoansToEmployeesData(loans);

        setDateFromPeriod(details?.payRollPeriod?.payRollPeriodDetails?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)?.dateFrom.split(" ")[0]);
        setDateToPeriod(details?.payRollPeriod?.payRollPeriodDetails?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)?.dateTo.split(" ")[0]);

        let df = details.payRollPeriod.payRollPeriodDetails.map((period) => {
            return {
                value: period.periodNo,
                periodNo: period.periodProcess,
                label: period.dateFrom.split(" ")[0],
                startDate: period.dateFrom.split(" ")[0],
                endDate: period.dateTo.split(" ")[0],
            };
        });
        setStartDateData(df);

        let payrollId = details?.id;
        let payrollPeriodDetailId = details?.payRollPeriod?.payRollPeriodDetails?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)?.id;

        payrollProcessingService().getDetails(payrollId, payrollPeriodDetailId).then((response) => {
            let statusDataArray = [];
            if ((response.data.payrollProcessEmployees) !== null) {
                response.data.payrollProcessEmployees.forEach((item) => {
                    statusDataArray.push({
                        empCode: empData?.find((v) => v.value === item.employeeId)?.label,
                        status: item.status,
                    });
                });
            }
            setPayrollProcessEmployeeStatusData(statusDataArray);
        });

        setLoading(false);
    };

    const fetchPayrollProcessData = async () => {
        return await payrollProcessService().getAll();
    };

    //Load loan type data
    function fetchLoanType() {
        loanTypeService()
            .getAll()
            .then(({data: response}) => {
                response = response.filter((v) => v.active === true).map((loantype) => ({
                    value: loantype.id,
                    label: loantype.code,
                    name: loantype.name,
                    code: loantype.code,
                    maxAmount: loantype.maxAmount,
                    maxInstalments: loantype.maxInstalments,
                    calculationLogic: loantype.calculationLogic,
                    interestRate: loantype.interestRate,
                    active: loantype.active,
                    allowMultiple: loantype.allowMultiple,
                }));

                setLoanTypeData(response);
            });
    }

    const payrollOnChange = async (selected) => {
       
        if (!selected) return;
        setLoading(true);
        const {data} = await payrollProcessService().findOne(
            selected.value,
            requestPath
        );
        localStorageService.setItem("selected_payroll", selected);
        setPayrollDetails(data);
        setPayroll(data);
    };

    return (
        <>
            <div className="row">
                {isLoading && (
                    <div className="overlay">
                        <GullLoadable/>
                    </div>
                )}
                <div className="col-md-9 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Loan Excel Uploader"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-3">
                    <div className="mt-1 d-flex justify-content-end">
                        <PayrollDropDown payrollOnChange={payrollOnChange} payrollProcessList={payrollProcessList}/>
                    </div>
                </div>
            </div>
            <div className="row">
                <LoanExcelList
                    employeeData={employeeData}
                    loanTypeData={loanTypeData}
                    payrollLoanTypeData={payrollLoanTypeData}
                    loansToEmployeesData={loansToEmployeesData}
                    startDateData={startDateData}
                    processPeriod={`${dateFromPeriod} - ${dateToPeriod}`}
                    payroll={payroll}
                    dateFromPeriod={dateFromPeriod}
                    dateToPeriod={dateToPeriod}
                    tableData={tableData}
                    setTableData={setTableData}
                    payrollProcessEmployeeStatusData={payrollProcessEmployeeStatusData}
                    setLoansToEmployeesData={setLoansToEmployeesData}
                    isLoading={isLoading}
                    setLoading={setLoading}
                    payrollOnChange={payrollOnChange}
                    setPayrollDetails={setPayrollDetails}
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
})(LoanExcel);
