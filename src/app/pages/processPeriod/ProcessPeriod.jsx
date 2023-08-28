import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import ProcessPeriodList from "./ProcessPeriodList";
import processPeriodService from "../../api/processPeriodServices/processPeriodService";

const ProcessPeriod = () => {

    const [processPeriodList, setProcessPeriodList] = useState([]);

    //Component did mount only
    useEffect(async () => {
        window.scrollTo(0, 0);
        //Fetch table data
        await fetchProcessPeriodData();
    }, []);

    //Fetch table data
    const fetchProcessPeriodData = async () => {
        await processPeriodService().getAll().then(async (response) => {
            setProcessPeriodList(response.data);
        });
    };

    return (
        <>
            {/*<Breadcrumb
                routeSegments={[
                    {name: "Master", path: "/process-period"},
                    {name: "Process Period"},
                ]}
            ></Breadcrumb>*/}
            {/* <div className="row">
                <div className="mb-4">
                    <ProcessPeriodModal className="mb-3"
                                        centered={true}
                                        name="Add Process Period"
                                        fetchProcessPeriodDataFunc={fetchProcessPeriodData}></ProcessPeriodModal>
                </div>
            </div>
            <div className="separator-breadcrumb border-top"></div> */}
            <div className="row">
                <ProcessPeriodList fetchProcessPeriodDataFunc={fetchProcessPeriodData}
                                   processPeriodList={processPeriodList}/>
            </div>
            <NotificationContainer/>
        </>
    );
}

export default withRouter(ProcessPeriod);
