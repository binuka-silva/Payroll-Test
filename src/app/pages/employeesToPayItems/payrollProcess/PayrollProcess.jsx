import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter,} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payrollProcessService from "../../../api/payrollProcessServices/payrollProcessService";
import PayrollProcessEmployeesToPayItemsList from "./PayrollProcessList";
import moment from "moment";

const PayrollProcessEmployeesToPayItems = () => {
    const [payrollProcessList, setPayrollProcessList] = useState([]);
    const [isLoading, setLoading] = useState(true);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        //Fetch table data
        fetchPayrollProcessData();
    }, []);

    //Fetch table data
    const fetchPayrollProcessData = () => {
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
                setLoading(false)
            });
    };

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    {name: "Master", path: "/dashboard/v1"},
                    {name: "Assign Pay Items"},
                ]}
            ></Breadcrumb>
            <div className="row">
                <PayrollProcessEmployeesToPayItemsList
                    fetchPayrollProcessDataFunc={fetchPayrollProcessData}
                    payrollProcessList={payrollProcessList}
                    isLoading={isLoading}
                    setLoading={setLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default withRouter(PayrollProcessEmployeesToPayItems);
