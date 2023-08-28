import { API_CONFIGURATIONS } from "../constants/apiConfigurations";
import axios from "axios";

const payrollTakeProfitService = () => {

    //Get all
    const getAll = async() => {
        const response = await axios
            .get(API_CONFIGURATIONS.GET_ALL_PAYROLL_TAKE_PROFIT, {
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

    //Find one
    const findOne = async(id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.FIND_ONE_PAYROLL_TAKE_PROFIT}/${id}`, {
                withCredentials: true
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data.errorCode;
            });
        return response;
    };

    //Create
    const create = async(payrollTakeProfit) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.CREATE_PAYROLL_TAKE_PROFIT, payrollTakeProfit, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    };

    //Update
    const update = async(payrollTakeProfit, id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_PAYROLL_TAKE_PROFIT}/${id}`, payrollTakeProfit, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Delete
    const deletePayrollTakeProfit = async(payrollTakeProfit) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };

        await axios.delete(`${API_CONFIGURATIONS.DELETE_PAYROLL_TAKE_PROFIT}/${payrollTakeProfit.id}`, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //IsActive Change
    const isActiveChange = async(payrollTakeProfit) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        let isActivePatchObj = [{
            "path": "IsDelete",
            "op": "replace",
            "value": true
        }]
        await axios.patch(`${API_CONFIGURATIONS.DELETE_PAYROLL_TAKE_PROFIT}/${payrollTakeProfit.id}`, isActivePatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    return {
        create,
        update,
        getAll,
        findOne,
        deletePayrollTakeProfit,
        isActiveChange, // Delete = IsActive false
    };
};

export default payrollTakeProfitService;