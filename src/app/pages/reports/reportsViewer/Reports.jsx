import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../../api/payrollProcessServices/payrollProcessService";
import GullLoadable from "../../../../@gull/components/GullLoadable/GullLoadable";
import localStorageService from "../../../services/localStorageService";
import {requestPath} from "./constant";
import {NotificationManager} from "react-notifications";
import {RESP_STATUS_CODES} from "../../../common/response";
import {NOTIFICATION_ERROR} from "../../../common/notifications";
import PayrollDropDown from "../../../components/PayrollDropDown";
import ReportsList from "./ReportsList";
import reportsService from "../../../api/reportsServices/reportsService";


const Reports = () => {
    const [isLoading, setLoading] = useState(false);

    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [payroll, setPayroll] = useState(null);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        fetchReportData();
    }, []);

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
                payrollProcessService().findOne(localStorageService.getItem("selected_payroll")?.value
                    ?? payrollList.find(p => p.value === localStorageService.getItem("auth_user")?.payrollDefinitionId)?.value ??
                    payrollList[0]?.value, requestPath).then(({data: details}) => {
                    setPayroll(details);
                    setLoading(false);
                });
            })
        }
    }, [payroll]);

    const fetchPayrollProcessData = async () => {
        return await payrollProcessService().getAll();
    };

    const payrollOnChange = async (e, selected) => {
        if (!selected) return;
        setLoading(true);
        const {data} = await payrollProcessService().findOne(selected.value, requestPath);
        localStorageService.setItem("selected_payroll", selected);
        setPayroll(data);
    }

    const fetchReportData = () => {
        reportsService().getAll().then(({data}) => {
            setTableData(data.map(d => ({...d, report: `${d.fileName.split("#", 1)}.rpt`})));
        }).catch(error => {
            if (error.statusCode === 409) {
                NotificationManager.error(error.message, "Error");
            }
            if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
            } else {
                NotificationManager.error("Failed to Fetch", "Error");
            }
        });
    }

    return (
        <>
            <div className="row">
                {isLoading && (
                    <div className="overlay">
                        <GullLoadable/>
                    </div>
                )}
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Reports Viewer"},
                        ]}
                    ></Breadcrumb>
                </div>
                {/*<div className="col-md-3">
                    <div className="mt-1 d-flex justify-content-end">
                        <PayrollDropDown payrollOnChange={payrollOnChange} payrollProcessList={payrollProcessList}/>
                    </div>
                </div>*/}
            </div>
            <div className="row">
                <ReportsList
                    tableData={tableData}
                    payroll={payroll}
                    setLoading={setLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default Reports;
