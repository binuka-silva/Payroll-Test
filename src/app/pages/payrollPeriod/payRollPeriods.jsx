import React, {useEffect, useState} from "react";
import {NavLink, withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import PayRollPeriodsList from "./payRollPeriodsList";
import payRollPeriodService from "../../api/payRollPeriodServices/payRollPeriodService";
import {Breadcrumb} from "@gull";

const PayRollPeriods = () => {
    const [payRollPeriodsList, setPayRollPeriodsList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        //Fetch table data
        // fetchPayRollPeriodsData();
    }, []);

    //Fetch table data
    const fetchPayRollPeriodsData = async () => {
        setLoading(true);
        try {
            const {data} = await payRollPeriodService().getAll();
            setPayRollPeriodsList(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <>
            <div className="row">
                <div className="col-md-8 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Payroll Periods"},
                        ]}
                    />
                </div>
                <div className="col-md-4">
                    <div className="mt-2 d-flex justify-content-start">
                        <NavLink to={"/payroll"}>
              <span className="capitalize text-muted">
                |&nbsp;Payroll&nbsp;|
              </span>
                        </NavLink>
                    </div>
                </div>
                {/* <div className="col-md-1">
          <div className="mt-3 d-flex justify-content-end">
            <PayrollButton toCreate={"/payroll-period"} />
          </div>
        </div> */}
            </div>
            <br/>
            <div className="row" style={{backgroundColor: "red"}}>
                <PayRollPeriodsList
                    fetchPayRollPeriodsDataFunc={fetchPayRollPeriodsData}
                    payRollPeriodsList={payRollPeriodsList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default withRouter(PayRollPeriods);
