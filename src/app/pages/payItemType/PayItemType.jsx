import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import payItemTypeService from "../../api/payItemTypeServices/payItemTypeService";
import PayItemTypeList from "./PayItemTypeList";

const PayItemType = () => {

    const [payItemTypeList, setPayItemTypeList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(async () => {
        window.scrollTo(0, 0);
        //Fetch table data
        // await fetchPayItemTypeData();
    }, []);

    //Fetch table data
    const fetchPayItemTypeData = async () => {
        setLoading(true);
        await payItemTypeService().getAll().then(async (response) => {
            setPayItemTypeList(response.data);
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
                            {name: "Pay Item Type"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>
            <div className="row">
                <PayItemTypeList
                    fetchPayItemTypeDataFunc={fetchPayItemTypeData}
                    payItemTypeList={payItemTypeList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
}

export default withRouter(PayItemType);
