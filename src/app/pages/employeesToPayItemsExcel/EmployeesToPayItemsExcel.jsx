import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {connect} from "react-redux";
import EmployeesToPayItemsExcelList from "./EmployeesToPayItemsExcelList";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import {payrollPeriodProcess, requestPath} from "./constant";
import localStorageService from "../../services/localStorageService";
import payItemService from "../../api/payItemServices/payItemService";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import {setPayrollDetailsData} from "../../common/payrollDetails";
import PayrollDropDown from "../../components/PayrollDropDown";

const EmployeesToPayItemsExcel = () => {
    const [isLoading, setLoading] = useState(false);
    const [employeesToPayItemsList, setEmployeesToPayItemsList] = useState([]);
    const [dateFromPeriod, setDateFromPeriod] = useState("");
    const [dateToPeriod, setDateToPeriod] = useState("");

    const [payItemsData, setPayItemsData] = useState([]);
    const [payrollPayItemsData, setPayrollPayItemsData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [payrollProcessList, setPayrollProcessList] = useState([]);

    const [payroll, setPayroll] = useState(null);

    useEffect(() => {
        fetchPayItem();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!payroll && payItemsData.length !== 0) {
            setLoading(true);
            fetchPayrollProcessData().then(({data: payrollList}) => {
                payrollList = payrollList.map((payrollProcess) => ({
                    value: payrollProcess.id,
                    label: `${payrollProcess.code} - ${payrollProcess.name}`,
                }));
                setPayrollProcessList(payrollList);
                payrollProcessService().findOne(localStorageService.getItem("selected_payroll")?.value
                    ?? payrollList.find(p => p.value === localStorageService.getItem("auth_user")?.payrollDefinitionId)?.value ??
                    payrollList[0], requestPath).then(({data: details}) => {
                    setPayroll(details);
                    setPayrollDetails(details);
                });
            })
        }
    }, [payroll, payItemsData]);

    const setPayrollDetails = (details) => {
        setLoading(true);

        const {empData, payrollPayItems, employeesPayItems} = setPayrollDetailsData(details, payItemsData);

        setEmployeeData(empData);
        setPayrollPayItemsData(payrollPayItems);
        setEmployeesToPayItemsList(employeesPayItems);

        setDateFromPeriod(
            details?.payRollPeriod?.payRollPeriodDetails
                ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                ?.dateFrom.split(" ")[0]
        );
        setDateToPeriod(
            details?.payRollPeriod?.payRollPeriodDetails
                ?.find((v) => v.periodProcess !== payrollPeriodProcess.CLOSE)
                ?.dateTo.split(" ")[0]
        );

        setLoading(false);
    }

    const fetchPayrollProcessData = async () => {
        return await payrollProcessService().getAll();
    };

    //Fetch table data
    const fetchPayItem = () => {
        setLoading(true);
        payItemService()
            .getAll()
            .then(({data}) => {
                data = data.filter((v) => v.active === true).map((payItem) => ({
                    id: payItem.id,
                    code: payItem.code,
                    name: payItem.name
                }));
                setPayItemsData(data);
            });
    };

    const payrollOnChange = async (e, selected) => {
        if (!selected) return;
        setLoading(true);
        const {data} = await payrollProcessService().findOne(selected.value, requestPath);
        localStorageService.setItem("selected_payroll", selected);
        setPayrollDetails(data);
        setPayroll(data);
    }

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
                            {name: "Assign Employees to Pay Items Excel"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-3">
                    <div className="mt-1 d-flex justify-content-end">
                        {/*<PayrollButton toList={"/payroll-assign-pay-items"} />*/}
                        <PayrollDropDown payrollOnChange={payrollOnChange} payrollProcessList={payrollProcessList}/>
                    </div>
                </div>
            </div>
            <div className="row">
                <EmployeesToPayItemsExcelList
                    employeeData={employeeData}
                    payItemsData={payItemsData}
                    payrollPayItemsData={payrollPayItemsData}
                    processPeriod={`${dateFromPeriod} - ${dateToPeriod}`}
                    payroll={payroll}
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
})(EmployeesToPayItemsExcel);
