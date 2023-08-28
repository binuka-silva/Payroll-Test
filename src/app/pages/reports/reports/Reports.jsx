import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import {NotificationManager} from "react-notifications";
import {RESP_STATUS_CODES} from "../../../common/response";
import {NOTIFICATION_ERROR} from "../../../common/notifications";
import ReportsList from "./ReportsList";
import reportsService from "../../../api/reportsServices/reportsService";


const Reports = () => {
    const [isLoading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        fetchReportData();
    }, []);

    const fetchReportData = () => {
        setLoading(true);
        reportsService().getAll().then(({data}) => {
            setLoading(false);
            setTableData(data.map(d => ({...d, report: `${d.fileName.split("#", 1)}.rpt`})));
        }).catch(error => {
            setLoading(false);
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
                <div className="col-md-9 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Reports"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>
            <div className="row">
                <ReportsList
                    setTableData={setTableData}
                    tableData={tableData}
                    fetchReportDataFunc={fetchReportData}
                    setLoading={setLoading}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default Reports;
