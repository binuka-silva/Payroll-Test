import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {NavLink, withRouter} from "react-router-dom";
import history from "../../../@history";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import PayItemAdvanceParameterList from "./PayItemAdvanceParameterList";
import payItemAdvanceParameterService from "../../api/PayItemAdvanceParameterServeces/payItemAdvanceParameterService";

const PayItemAdvanceParameter = () => {
    const [payItemAdvanceParameterList, setPayItemAdvanceParameterList] =
        useState([]);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        //Fetch table data
        // fetchPayItemAdvanceParameterData();
    }, []);

    //Fetch table data
    // const fetchPayItemAdvanceParameterData = async () => {
    //   await payItemAdvanceParameterService()
    //     .getAll()
    //     .then(async (response) => {
    //       setPayItemAdvanceParameterList(response.data);
    //     });
    // };

    const fetchPayItemAdvanceParameterData = async () => {
        await payItemAdvanceParameterService()
            .getAll()
            .then(({data}) => {
                data = data.map((parameterData) => ({
                    id: parameterData.id,
                    code: parameterData.code,
                    name: parameterData.name,
                    description: parameterData.description,
                    validityPeriod: `${
                        parameterData.validFrom.replaceAll("/", "-").split("T")[0]
                    } ~ ${parameterData.validTo.replaceAll("/", "-").split("T")[0]}`,
                }));
                setPayItemAdvanceParameterList(data);
            })
            .catch((r) => console.error(r));
    };

    const CreateParameter = () =>
        new Promise(async (resolve, reject) => {
            history.push("/pay-item-advance-parameter-details");
        });

    return (
        <>
            <div className="row">
                <div className="col-md-8 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Pay Item Advance Parameters"},
                        ]}
                    />
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
                {/* <div className="col-md-1">
          <div className="mt-3 d-flex justify-content-end">
            <PayrollButton toCreate={"/pay-item-advance-parameter-details"} />
          </div>
        </div> */}
            </div>
            <br/>
            <div className="row">
                <PayItemAdvanceParameterList
                    fetchPayItemAdvanceParameterDataFunc={
                        fetchPayItemAdvanceParameterData
                    }
                    payItemAdvanceParameterList={payItemAdvanceParameterList}
                />
            </div>
            <NotificationContainer/>
        </>
    );
};

export default withRouter(PayItemAdvanceParameter);
