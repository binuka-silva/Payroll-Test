import axios from "axios";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";

const employeeService = () => {
    //Update
    const update = async (employee) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(API_CONFIGURATIONS.EMPLOYEES, employee, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const updateBankDetails = (payrollId, employeeId, employeeBank) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.put(`${API_CONFIGURATIONS.PAYROLL_PROCESS}/${payrollId}/Employees/${employeeId}`, employeeBank, axiosConfig);
    };

    const getBankDetails = (payrollId, employeeId) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.get(`${API_CONFIGURATIONS.PAYROLL_PROCESS}/${payrollId}/Employees/${employeeId}`, axiosConfig);
    };

    return {
        update,
        updateBankDetails,
        getBankDetails
    };
};

export default employeeService;