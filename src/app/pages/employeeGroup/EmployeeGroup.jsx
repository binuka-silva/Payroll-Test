import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import EmployeeGroupList from "./EmployeeGroupList";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import employeeGroupService from "../../api/employeeGroupServices/employeeGroupService";

const EmployeeGroup = () => {

    const [employeeGroupList, setEmployeeGroupList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    //Component did mount only
    useEffect(async () => {
        window.scrollTo(0, 0);
        //Fetch table data
        // await fetchEmployeeGroupData();
    }, []);

    //Fetch table data
    const fetchEmployeeGroupData = async () => {
        setLoading(true);
        await employeeGroupService().getAll().then(async (response) => {
            setEmployeeGroupList(response.data);
        });
        setLoading(false);
    };

    return (
        <>
            {/*<Breadcrumb
                routeSegments={[
                    {name: "Master", path: "/employee-group"},
                    {name: "Employee Group"},
                ]}
            ></Breadcrumb>*/}
            {/* <div className="row">
                <div className="mb-4">
                    <EmployeeGroupModal className="mb-3"
                                        centered={true}
                                        name="Add Employee Group"
                                        fetchEmployeeGroupDataFunc={fetchEmployeeGroupData}></EmployeeGroupModal>
                </div>
            </div>
            <div className="separator-breadcrumb border-top"></div> */}
            <div className="row">
                <EmployeeGroupList
                    fetchEmployeeGroupDataFunc={fetchEmployeeGroupData}
                    employeeGroupList={employeeGroupList}
                    isLoading={isLoading}
                />
            </div>
            <NotificationContainer/>
        </>
    );
}

export default withRouter(EmployeeGroup);
