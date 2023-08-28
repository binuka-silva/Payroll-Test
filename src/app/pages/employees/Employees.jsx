import React, {useEffect, useState} from "react";
import {Breadcrumb} from "@gull";
import {withRouter} from "react-router-dom";
import EmployeesList from "./EmployeesList";
import employeeService from "../../api/employeeServices/employeeService";
import {syncStatus} from "./constant";

const Employees = () => {
    const [isLoading, setLoading] = useState(false);
    const [isProcessing, setProcessing] = useState(false);
    const [addedCount, setAddedCount] = useState(0);
    const [updatedCount, setUpdatedCount] = useState(0);
    const [employeeList, setEmployeeList] = useState([]);

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    //Sync table data
    const syncEmployeesData = async () => {
        try {
            setLoading(true);
            const {data} = await employeeService().syncWithIfsEmployees();
            if (!data.find(d => d.status !== syncStatus.SUCCESSES)) {
                setLoading(false);
                const addedData = JSON.parse(data.addedData);
                const mappedEmp = data.employee.map(e => ({...e, isNew: !!addedData.find(add => add === e.id)}));
                setEmployeesToTable(mappedEmp);
                setAddedCount(data.addedCount)
                setUpdatedCount(data.updatedCount)
            } else {
                setProcessing(true);
            }
        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    };

    const setEmployeesToTable = (employees) => {
        setEmployeeList(employees.map(emp => ({
            id: emp.id,
            companyId: emp.companyId,
            empNo: emp.empNo,
            isNew: emp.isNew,
            // personId: emp.personId,
            designation: emp.empPosCode,
            employeeName: emp.employeeName,
            employeeStatus: emp.employeeStatus,
            empCatId: emp.empCatName
        })));
    }

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    {name: "Dashboard", path: "/dashboard/v1/"},
                    {name: "Employees"},
                ]}
            ></Breadcrumb>
            {isProcessing && <EmployeesList fetchEmployeeGroupDataFunc={syncEmployeesData} employeeList={employeeList}
                                            isLoading={isLoading} setLoading={setLoading} setAddedCount={setAddedCount}
                                            updatedCount={updatedCount} addedCount={addedCount}
                                            setProcessing={setProcessing} isProcessing={isProcessing}/>}
            {!isProcessing && <EmployeesList fetchEmployeeGroupDataFunc={syncEmployeesData} employeeList={employeeList}
                                             isLoading={isLoading} setLoading={setLoading} setAddedCount={setAddedCount}
                                             updatedCount={updatedCount} addedCount={addedCount}
                                             setProcessing={setProcessing} isProcessing={isProcessing}/>}
        </>
    );
}

export default withRouter(Employees);
