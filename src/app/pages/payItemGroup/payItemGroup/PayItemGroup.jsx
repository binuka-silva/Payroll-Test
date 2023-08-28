import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import PayItemGroupList from "./PayItemGroupList";
import payItemGroupService from "../../../api/payItemGroupServices/payItemGroupService";

const PayItemGroup = () => {
    const [payItemGroupList, setPayItemGroupList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        // fetchPayItemGroupData();
        //Fetch table data
    }, []);

    const fetchPayItemGroupData = async () => {
        setLoading(true);
        try {
            const {data} = await payItemGroupService().getAll();
            setPayItemGroupList(data.map(groupData => ({
                id: groupData.id,
                createdBy: groupData.createdBy,
                code: groupData.code,
                name: groupData.name,
                description: groupData.description
            })));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Pay Item Groups"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>
            <div className="row">
                <PayItemGroupList
                    fetchPayItemGroupDataFunc={fetchPayItemGroupData}
                    payItemGroupList={payItemGroupList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default withRouter(PayItemGroup);
