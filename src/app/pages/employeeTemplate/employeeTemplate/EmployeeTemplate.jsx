import React, {useEffect, useState} from "react";
import {NavLink, withRouter} from "react-router-dom";
import {Breadcrumb} from "@gull";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import EmployeeTemplateList from "./EmployeeTemplateList";
import employeeTemplateService from "../../../api/employeeTemplateServices/employeeTemplateService";

const EmployeeTemplate = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(async () => {
        window.scrollTo(0, 0);
        //Fetch table data
        // await fetchTemplateData();
    }, []);

    //Fetch table data
    const fetchTemplateData = async () => {
        setLoading(true);
        try {
            const {data} = await employeeTemplateService().getAllEmployeeTemplates();
            setEmployeeList(data.map(c => ({
                id: c.id,
                code: c.code,
                name: c.name,
                createdDate: c.createdDate.split("T")[0]
            })));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    return (
        <>
            <div className="row">
                <div className="col-md-8 row">
                    <Breadcrumb
                        routeSegments={[
                            {name: "Dashboard", path: "/dashboard/v1/"},
                            {name: "Employee Template"},
                        ]}
                    />
                </div>
                <div className="col-md-4">
                    <div className="mt-2 d-flex justify-content-start">
                        <NavLink to={"/employees"}>
                <span className="capitalize text-muted">
                  |&nbsp;Employee&nbsp;|
                </span>
                        </NavLink>
                    </div>
                </div>
                {/* <div className="col-md-1">
            <div className="mt-3 d-flex justify-content-end">
              <PayrollButton toCreate={"/employee-template-details"} />
            </div>
          </div> */}
            </div>
            <br/>
            <div className="row">
                <EmployeeTemplateList
                    fetchTemplateDataFunc={fetchTemplateData}
                    templateList={employeeList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
}

export default withRouter(EmployeeTemplate);
