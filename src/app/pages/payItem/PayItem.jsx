import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payItemService from "../../api/payItemServices/payItemService";
import PayItemList from "./PayItemList";


const PayItem = () => {
    const [payItemList, setPayItemList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(async () => {
        window.scrollTo(0, 0);
        //Fetch table data
        // await fetchPayItemData();
    }, []);

    //Fetch table data
    const fetchPayItemData = async () => {
        setLoading(true);
        await payItemService()
            .getAll()
            .then(({data}) => {
                data = data.map(payItem => ({
                    id: payItem.id,
                    payItemType: payItem.payItemType?.type,
                    payItemPeriod: payItem.payItemPeriod?.name,
                    code: payItem.code,
                    name: payItem.name,
                    active: payItem.active,
                    order: payItem.order,
                    paymentType: payItem.paymentType?.type,
                    createdBy: payItem.createdBy,
                }));
                setPayItemList(data);
                setLoading(false);
            })
    };


    return (
        <>
            <Breadcrumb
                routeSegments={[
                    {name: "Dashboard", path: "/dashboard/v1/"},
                    {name: "Pay Items"},
                ]}
            ></Breadcrumb>

            <div className="row">
                <PayItemList
                    fetchPayItemDataFunc={fetchPayItemData}
                    payItemList={payItemList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default withRouter(PayItem);
