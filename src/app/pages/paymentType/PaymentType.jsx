import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter} from "react-router-dom";
import PaymentTypeList from "./PaymentTypeList";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import paymentTypeService from "../../api/paymentTypeServices/paymentTypeService";

const PaymentType = () => {

    const [paymentTypeList, setPaymentTypeList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(async () => {
        window.scrollTo(0, 0);
        //Fetch table data
        // await fetchPaymentTypeData();
    }, []);

    //Fetch table data
    const fetchPaymentTypeData = async () => {
        setLoading(true);
        await paymentTypeService().getAll().then(async (response) => {
            setPaymentTypeList(response.data);
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
                            {name: "Payment Type"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>

            <div className="row">
                <PaymentTypeList
                    fetchPaymentTypeDataFunc={fetchPaymentTypeData}
                    paymentTypeList={paymentTypeList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
}

export default withRouter(PaymentType);
