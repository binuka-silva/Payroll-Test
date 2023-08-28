import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const dashboardService = () => {

    const getEmpDetails = () => {
        return axios.get(`${API_CONFIGURATIONS.DASHBOARD}/Employees`, {
            withCredentials: true
        });
    };

    const getPayrollDetails = (id) => {
        return axios.get(`${API_CONFIGURATIONS.DASHBOARD}/Payrolls/${id}`, {
            withCredentials: true
        });
    };

    const getPayItems = (payrollId) => {
        return axios.get(`${API_CONFIGURATIONS.DASHBOARD}/PayItems`, {
            withCredentials: true,
            params: {
                payrollId
            }
        });
    };

    const getLastMonthSummaryByPayItem = (payrollId, payItemId) => {
        return axios.get(`${API_CONFIGURATIONS.DASHBOARD}/Payrolls`, {
            withCredentials: true,
            params: {
                payrollId, payItemId
            }
        });
    };

    return {
        getEmpDetails,
        getPayrollDetails,
        getPayItems,
        getLastMonthSummaryByPayItem,
    };
};

export default dashboardService;