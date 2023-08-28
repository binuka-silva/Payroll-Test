import React, {useEffect, useState} from "react";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import EmployeeList from "./EmployeeList";
import {connect, useSelector} from "react-redux";
import employeeDetailTemplateService from "../../../api/employeeTemplateServices/employeeTemplateDetailService";
import localStorageService from "../../../services/localStorageService";

const Employee = ({setPayrollTaxDetails, payrollProcessList}) => {
    const [employeeList, setEmployeeList] = useState();
    const [isLoading, setLoading] = useState(false);

    const payrollDetails = useSelector(
        (state) => state.payrollTaxDetails
    );

    //Component did mount only
    useEffect(() => {
        window.scrollTo(0, 0);
        //Fetch table data
        getEmployees();

        // return () => {
        //   setPayrollTaxDetails({
        //     code: "",
        //     accountNumber: "",
        //     category: "",
        //     active: "",
        //     lastEditDate: "",
        //     bank: "",
        //     branch: "",
        //     id: "",
        //   });
        // };

    }, []);

    const getEmployees = async () => {
        setLoading(true);
        const {data} = await employeeDetailTemplateService().getSelectedEmployees(payrollDetails.employeeTemplate.details);
        const user = localStorageService.getItem("auth_user");
        setEmployeeList(data.map(emp => {
            const payroll = emp.employeePayrollDefinitions.find(def => def.payrollDefinitionId === payrollDetails.id);
            let hasEmployeeBank;
            if (user.isEmployeeBankCommonInPayrolls) {
                hasEmployeeBank = emp.employeeBankList[0]?.employeeBankDetails.length !== 0;
            } else {
                const empBank = emp.employeeBankList.find(b => b.payrollDefinitionId === payrollDetails.id);
                empBank && (hasEmployeeBank = empBank.employeeBankDetails.length !== 0);
            }
            return {
                id: emp.id,
                empId: emp.empNo,
                name: emp.employeeName,
                designation: emp.empPosCode,
                isActive: emp.employeeStatus,
                payrollActiveChangeDate: payroll?.payrollChangeActive,
                employeeType: emp.employmentType,
                employeeCategory: emp.empCatName,
                hasEmployeeBank,
                isBankPayment: payroll?.isBankPayment,
                isProfileCompleted: emp.isProfileCompleted,
                isPayrollActive: payroll?.isPayrollActive,
                organization: emp.companyId
            }
        }));
        data && setLoading(false);
    }

    return (
        <>
            <div>
                <div className="row">
                    <EmployeeList
                        employeeList={employeeList}
                        fetchEmpDataFunc={getEmployees}
                        isLoading={isLoading}
                        setLoading={setLoading}
                    />
                </div>
                <NotificationContainer/>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    setPayrollTaxDetails: state.setPayrollTaxDetails,
});

export default connect(mapStateToProps, {
    // setPayrollTaxDetails,
})(Employee);
