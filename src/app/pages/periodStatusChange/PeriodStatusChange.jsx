import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import PeriodStatusChangeList from "./PeriodStatusChangeList";
import {connect} from "react-redux";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import localStorageService from "../../services/localStorageService";
import {payrollPeriodProcess, requestPath} from "./constant";
import moment from "moment";
import {NavLink} from "react-router-dom";
import PayrollDropDown from "../../components/PayrollDropDown";


const PeriodStatusChange = () => {
    const [isLoading, setLoading] = useState(false);

    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [payroll, setPayroll] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!payroll) fetchPeriodDetails();
    }, [payroll]);

    const fetchPeriodDetails = () => {
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
                setPeriodDetails(details);
            });
        })
    }

    const fetchPayrollProcessData = async () => {
        return await payrollProcessService().getAll();
    };

    const setPeriodDetails = (details) => {
        setLoading(true);
        setTableData(details?.payRollPeriod?.payRollPeriodDetails?.map(detail => ({
            id: detail.id,
            periodNo: detail.periodNo,
            dateFrom: moment(detail.dateFrom).format("yyyy-MM-DD"),
            dateTo: moment(detail.dateTo).format("yyyy-MM-DD"),
            status: detail.periodProcess === payrollPeriodProcess.OPEN ? Object.keys(payrollPeriodProcess)[0]
                : detail.periodProcess === payrollPeriodProcess.PROCESSED ? Object.keys(payrollPeriodProcess)[1]
                    : detail.periodProcess === payrollPeriodProcess.CLOSE ? Object.keys(payrollPeriodProcess)[2]
                        : detail.periodProcess === payrollPeriodProcess.APPROVED ? Object.keys(payrollPeriodProcess)[3]
                            : Object.keys(payrollPeriodProcess)[0],

            period: details.payRollPeriod.period,
            periodYear: details.payRollPeriod.periodYear
        })));
        setLoading(false);
    }

    const payrollOnChange = async (e, selected) => {
        if (!selected) return;
        setLoading(true);
        const {data} = await payrollProcessService().findOne(selected.value, requestPath);
        localStorageService.setItem("selected_payroll", selected);
        setPeriodDetails(data);
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
                <div className="col-md-7 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Change Period Status"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-2">
                    <div className="mt-2 d-flex justify-content-start">
                        <NavLink to={"/payroll"}>
                            <span className="capitalize text-muted">|&nbsp;Payroll&nbsp;|</span>
                        </NavLink>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="mt-1 d-flex justify-content-end">
                        <PayrollDropDown payrollOnChange={payrollOnChange} payrollProcessList={payrollProcessList}/>
                    </div>
                </div>
            </div>
            <div className="row">
                <PeriodStatusChangeList
                    setTableData={setTableData}
                    tableData={tableData}
                    isLoading={isLoading}
                    fetchData={fetchPeriodDetails}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({setPayrollTaxDetails: state.setPayrollTaxDetails,});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(PeriodStatusChange);
