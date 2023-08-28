import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../api/payrollProcessServices/payrollProcessService";
import {setPayrollTaxDetails} from "../../redux/actions/PayrollTaxDetailsActions";
import QuickReportsList from "./QuickReportsList";
import {connect} from "react-redux";
import GullLoadable from "../../../@gull/components/GullLoadable/GullLoadable";
import localStorageService from "../../services/localStorageService";
import {requestPath} from "./constant";
import quickReportsService from "../../api/quickReportsServices/quickReportsService";
import {NotificationManager} from "react-notifications";
import {RESP_STATUS_CODES} from "../../common/response";
import {NOTIFICATION_ERROR} from "../../common/notifications";
import PayrollDropDown from "../../components/PayrollDropDown";


const QuickReports = () => {
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
                    payrollList[0], requestPath).then(({data: details}) => {
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
        quickReportsService().getAll().then(({data}) => {
            setTableData(data.map(d => ({...d, showQuery: `${d.query.substring(0, 30)} ...`})));
        }).catch(error => {
            if (error.statusCode === 409) {
                NotificationManager.error(error.message, "Error");
            }
            if (error.status === RESP_STATUS_CODES.FORBIDDEN || error.status === RESP_STATUS_CODES.UNAUTHORIZED) {
                NotificationManager.error(NOTIFICATION_ERROR.AUTH_FAILED, error.statusText);
            } else {
                NotificationManager.error("Failed to Save", "Error");
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
                <div className="col-md-9 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Quick Reports"},
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
                <QuickReportsList
                    setTableData={setTableData}
                    tableData={tableData}
                    payroll={payroll}
                    fetchReportDataFunc={fetchReportData}
                    setLoading={setLoading}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

const mapStateToProps = (state) => ({setPayrollTaxDetails: state.setPayrollTaxDetails,});

export default connect(mapStateToProps, {
    setPayrollTaxDetails,
})(QuickReports);
