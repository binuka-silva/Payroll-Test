import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter,} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../../api/payrollProcessServices/payrollProcessService";
import PayrollProcessList from "./PayrollProcessList";
//import "./styles/payroll.scss";
import moment from "moment";
import payRollPeriodService from "../../../api/payRollPeriodServices/payRollPeriodService";
import employeeTemplateService from "../../../api/employeeTemplateServices/employeeTemplateService";

const PayrollProcess = () => {
    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isDataLoaded, setDataLoaded] = useState(false);
    const [payrollPeriodData, setPayrollPeriodData] = useState([]);
    const [employeeTemplateData, setEmployeeTemplateData] = useState([]);
    const [cutoffDateList, setCutoffDateList] = useState([]);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        //Fetch table data
        //  fetchPayrollPeriodData();
        // fetchEmployeeTemplateData();
        // fetchPayrollProcessData();
        setDataLoaded(false);
    }, []);

    // useEffect(() => {
    //     payrollPeriodData.length > 0 && employeeTemplateData.length > 0 && fetchPayrollProcessData();
    // },[payrollPeriodData, employeeTemplateData]);

    async function fetchPayrollPeriodData() {
        setLoading(true);
        payRollPeriodService()
            .getAll()
            .then((response) => {
                let payrollPeriodDataArray = [];
                response.data.forEach((item) => {
                    payrollPeriodDataArray.push({
                        value: item.id,
                        label: item.periodName,
                        periodYear: item.periodYear.split(" ")[0],
                        period: item.period,
                    });
                });
                setCutoffDateList([
                    {label: "Monday", value: "Monday"},
                    {label: "Tuesday", value: "Tuesday"},
                    {
                        label: "Wednesday",
                        value: "Wednesday",
                    },
                    {
                        label: "Thursday",
                        value: "Thursday",
                    },
                    {label: "Friday", value: "Friday"},
                    {
                        label: "Saturday",
                        value: "Saturday",
                    },
                    {label: "Sunday", value: "Sunday"},
                ]);
                setPayrollPeriodData(payrollPeriodDataArray);
                setLoading(false);
            });
    }

    //Load data
    async function fetchEmployeeTemplateData() {
        setLoading(true);
        employeeTemplateService()
            .getAllEmployeeTemplates()
            .then((response) => {
                let employeeTemplateDataArray = [];
                response.data.forEach((item) => {
                    employeeTemplateDataArray.push({
                        value: item.id,
                        code: item.code,
                        label: item.name,
                    });
                });
                setEmployeeTemplateData(employeeTemplateDataArray);
            });
    }

    //Fetch table data
    const fetchPayrollProcessData = () => {
        setLoading(true);
        payrollProcessService()
            .getAll()
            .then(({data}) => {
                data = data.map((payrollProcess) => {
                    let processDate;
                    if (payrollProcess.payRollPeriod.period === "week") {
                        processDate = payrollProcess.cutOffDate;
                    } else {
                        processDate = payrollProcess.payRollPeriod?.payDay;
                    }
                    return {
                        id: payrollProcess.id,
                        code: payrollProcess.code,
                        name: payrollProcess.name,
                        cutOffDate: payrollProcess.cutOffDate,
                        isProcessed: payrollProcess.isProcessed,
                        payRollPeriod: payrollProcess.payRollPeriod?.periodName,
                        processYear: moment(payrollProcess.payRollPeriod?.periodYear).format(
                            "YYYY"
                        ),
                        processDate,
                        employeeTemplate: payrollProcess.employeeTemplate?.code,
                        createdBy: payrollProcess.createdBy,
                    }
                });
                setPayrollProcessList(data);
                setLoading(false);
            });
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Payroll"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>
            <div className="row">
                <PayrollProcessList
                    fetchPayrollProcessDataFunc={fetchPayrollProcessData}
                    fetchPayrollPeriodDataFuync={fetchPayrollPeriodData}
                    fetchEmployeeTemplateDataFunc={fetchEmployeeTemplateData}
                    payrollProcessList={payrollProcessList}
                    payrollPeriodData={payrollPeriodData}
                    employeeTemplateData={employeeTemplateData}
                    cutoffDateList={cutoffDateList}
                    isLoading={isLoading}
                    setLoading={setLoading}
                    isDataLoaded={isDataLoaded}
                    setDataLoaded={setDataLoaded}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default withRouter(PayrollProcess);
