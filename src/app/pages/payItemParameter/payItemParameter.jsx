import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {NavLink, withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import PayItemParameterList from "./payItemParameterList";
import payItemParameterService from "../../api/payItemParameterServices/payItemParameterService";

const PayItemParameter = () => {
    const [payItemParameterList, setPayItemParameterList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        //Fetch table data
        // fetchPayItemParameterData();
    }, []);

    //Fetch table data
    // const fetchPayItemParameterData = async () => {
    //   await payItemParameterService()
    //     .getAll()
    //     .then(async (response) => {
    //       setPayItemParameterList(response.data);
    //     });
    // };

    const fetchPayItemParameterData = async () => {
        setLoading(true);
        await payItemParameterService()
            .getAll()
            .then(({data}) => {
                data = data.map((parameterData) => ({
                    id: parameterData.id,
                    code: parameterData.code,
                    name: parameterData.name,
                    value: parameterData.value,
                    description: parameterData.description,
                    validityPeriod: `${
                        parameterData.validFrom.replaceAll("-", "/").split("T")[0]
                    }-${parameterData.validTo.replaceAll("-", "/").split("T")[0]}`,
                }));
                setPayItemParameterList(data);
            })
            .catch((r) => console.error(r));
        setLoading(false);
    };

    return (
        <>
            <div className="row">
                <div className="col-md-8 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Pay Item Parameters"},
                        ]}
                    ></Breadcrumb>
                </div>
                <div className="col-md-4">
                    <div className="mt-2 d-flex justify-content-start">
                        <NavLink to={"/pay-items"}>
              <span className="capitalize text-muted">
                |&nbsp;Pay&nbsp;Items&nbsp;|
              </span>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="row">
                <PayItemParameterList
                    fetchPayItemParameterDataFunc={fetchPayItemParameterData}
                    payItemParameterList={payItemParameterList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default withRouter(PayItemParameter);
