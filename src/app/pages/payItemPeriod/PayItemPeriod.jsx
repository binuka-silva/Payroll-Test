import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import PayItemPeriodList from "./PayItemPeriodList";
import payItemPeriodService from "../../api/payItemPeriodServices/payItemPeriodService";

const PayItemPeriod = () => {

    const [payItemPeriodList, setPayItemPeriodList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(async () => {
        window.scrollTo(0, 0);
        //Fetch table data
        // await fetchPayItemPeriodData();
    }, []);

    //Fetch table data
    const fetchPayItemPeriodData = async () => {
        setLoading(true);
        await payItemPeriodService().getAll().then(async (response) => {
            setPayItemPeriodList(response.data);
        });
        setLoading(false);
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Pay Item Period"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>
            <div className="row">
                <PayItemPeriodList
                    fetchPayItemPeriodDataFunc={fetchPayItemPeriodData}
                    payItemPeriodList={payItemPeriodList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
}

export default withRouter(PayItemPeriod);
