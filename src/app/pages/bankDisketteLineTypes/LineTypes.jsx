import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import bankDisketteLineTypeService from "../../api/bankDisketteLineTypeService/bankDisketteLineTypeService";
import LineTypesList from "./LineTypesList";
import {NotificationManager} from "react-notifications";

const LineTypes = () => {

    const [lineTypeList, setLineTypeList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(() => {
        NotificationManager.listNotify.forEach(n => NotificationManager.remove({id: n.id}));
        window.scrollTo(0, 0);
        //Fetch table data
        // fetchLineTypes();
    }, []);

    //Fetch table data
    const fetchLineTypes = async () => {
        setLoading(true);
        await bankDisketteLineTypeService().getAll()
            .then((response) => {
                setLineTypeList(response.data);
                setLoading(false);
            })
            .catch((error) => {
                NotificationManager.error(
                    "Data Laoding Error: " + error.statusText
                    + "\n Please refresh the page",
                    "Error"
                );
            });
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Bank File", path: "/bank-file"},
                            {
                                name: "Bank File Configurator",
                                path: "/bank-file-configurator",
                            },
                            {name: "Line Types"},
                        ]}
                    ></Breadcrumb>
                </div>
            </div>

            <div className="row">
                <LineTypesList
                    fetchLineTypesFunc={fetchLineTypes}
                    lineTypeList={lineTypeList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
}

export default withRouter(LineTypes);
