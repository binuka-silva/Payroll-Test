import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const payrollPayItemService = () => {

    //Get all
    const getAll = async () => {
        const response = await axios
            .get(API_CONFIGURATIONS.GET_ALL_PAYROLL_PAY_ITEM, {
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
    const findOne = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.FIND_ONE_PAYROLL_PAY_ITEM}/${id}`, {
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

    const getEmployeesToPayItems = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.PAYROLL_PAY_ITEM_EMPLOYEES_TO_PAY_ITEMS}/${id}/EmployeesToPayItems`)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data.errorCode;
            });
        return response;
    };

    const getSalary = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.PAYROLL_PAY_ITEM_SALARY}/${id}/PayItemSalary`)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data.errorCode;
            });
        return response;
    };

    const getPayItemsToEmployees = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.PAYROLL_PAY_ITEM_PAY_ITEMS_TO_EMPLOYEES}/${id}/PayItemsToEmployee`)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data.errorCode;
            });
        return response;
    };

    //Create
    const create = async (payrollPayItem) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.CREATE_PAYROLL_PAY_ITEM, payrollPayItem, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    };

    //Update
    const update = async (payrollPayItem, id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_PAYROLL_PAY_ITEM}/${id}`, payrollPayItem, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Delete

    const deletePayrollPayItem = async (payrollPayItem) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };

        await axios.delete(`${API_CONFIGURATIONS.DELETE_PAYROLL_PAY_ITEM}/${payrollPayItem.id}`, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //IsActive Change
    const isActiveChange = async (payrollPayItem) => {
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
        await axios.patch(`${API_CONFIGURATIONS.DELETE_PAYROLL_PAY_ITEM}/${payrollPayItem.id}`, isActivePatchObj, axiosConfig)
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
        getEmployeesToPayItems,
        getSalary,
        getPayItemsToEmployees,
        deletePayrollPayItem,
        isActiveChange, // Delete = IsActive false
    };
};

export default payrollPayItemService;