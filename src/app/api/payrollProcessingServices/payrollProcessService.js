import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const payrollProcessingService = () => {

    const getDetails = (payrollId, payrollPeriodDetailId) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            params: {
                payrollId,
                payrollPeriodDetailId
            },
            withCredentials: true
        };
        return axios.get(API_CONFIGURATIONS.PAYROLL_PROCESSING, axiosConfig);
    };

    const process = (payrollProcess) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.post(API_CONFIGURATIONS.PAYROLL_PROCESSING, payrollProcess, axiosConfig);
    };

    const confirmPayroll = (payrollProcess, isExtend) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.patch(API_CONFIGURATIONS.PAYROLL_PROCESSING, payrollProcess, axiosConfig);
    };

    const getInactiveEmp = (empIds) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.put(API_CONFIGURATIONS.PAYROLL_PROCESSING, empIds, axiosConfig);
    };

    const rollback = (rollbackProcess) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.post(`${API_CONFIGURATIONS.PAYROLL_PROCESSING}/Rollback`, rollbackProcess, axiosConfig);
    };

    //Get all
    const getPayrollProcessEmployeeStatus = async () => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.PAYROLL_PROCESSING}/PayrollProcessEmployeeStatus`, {
                withCredentials: true
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data;
            });
        return response;
    };

    return {
        getDetails,
        process,
        confirmPayroll,
        getInactiveEmp,
        rollback,
        getPayrollProcessEmployeeStatus,
    }
};

export default payrollProcessingService;