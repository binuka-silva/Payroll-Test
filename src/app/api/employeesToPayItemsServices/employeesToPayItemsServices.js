import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";
import qs from "qs";

const employeesToPayItemsServices = () => {

    //Get all with pagination
    const getAllByPagination = async (page, size, orderBy, isAccending, q, filters) => {
        filters = filters?.map(filter => ({
            field: filter.column.field,
            value: filter.value
        }));
        if (!q) {
            q = "''";
        }
        if (!orderBy) {
            orderBy = "''";
        }
        if (!filters) {
            filters = "";
        }
        filters = JSON.stringify(filters);
        const response = await axios
            .get(`${API_CONFIGURATIONS.GET_ALL_EMPLOYEES_TO_PAY_ITEMS}/pagination`, {
                withCredentials: true,
                params:
                    {
                        page, size, orderBy, isAccending, q, filters
                    },
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data;
            });
        return response;
    };

    //Get all
    const getAll = async () => {
        const response = await axios
            .get(API_CONFIGURATIONS.GET_ALL_EMPLOYEES_TO_PAY_ITEMS)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data;
            });
        return response;
    };

    const getAllInvalidEmployeesToPayItems = (payrollId) => {
        return axios.get(`${API_CONFIGURATIONS.PAYROLL_PROCESS}/${payrollId}/InvalidEmployeesPayItems`, {
            withCredentials: true
        });
    };

    //Find one
    const findOne = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.FIND_ONE_EMPLOYEES_TO_PAY_ITEMS}/${id}`)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data.errorCode;
            });
        return response;
    };


    //Create
    const create = async (employeesToPayItems) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.CREATE_EMPLOYEES_TO_PAY_ITEMS, employeesToPayItems, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);

            });
    };

    const createExcel = (employeesToPayItems) => {
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.post(API_CONFIGURATIONS.CREATE_EMPLOYEES_TO_PAY_ITEMS_EXCEL, employeesToPayItems, axiosConfig);
    };

    //Don't use anymore
    const addInvalidRecords = (employeesToPayItems) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.post(API_CONFIGURATIONS.INVALID_EMPLOYEE_TO_PAY_ITEMS, employeesToPayItems, axiosConfig);
    };

    //Update
    const update = async (employeesToPayItems, id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_EMPLOYEES_TO_PAY_ITEMS}/${id}`, employeesToPayItems, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Update
    const updateWithSalaryStatus = async (employeesToPayItems, id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_EMPLOYEES_TO_PAY_ITEMS_WITH_SALARY_STATUS}/${id}/EmployeesToPayItemsSalaryStatus`, employeesToPayItems, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const deleteEmployeesToPayItems = async (employeesToPayItems) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
        };

        await axios.post(API_CONFIGURATIONS.DELETE_EMPLOYEES_TO_PAY_ITEMS, employeesToPayItems, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //IsActive Change
    const isActiveChange = async (employeesToPayItems) => {
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
        await axios.patch(`${API_CONFIGURATIONS.DELETE_EMPLOYEES_TO_PAY_ITEMS}/${employeesToPayItems.id}`, isActivePatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    return {
        create,
        addInvalidRecords,
        createExcel,
        update,
        updateWithSalaryStatus,
        getAll,
        getAllByPagination,
        getAllInvalidEmployeesToPayItems,
        findOne,
        deleteEmployeesToPayItems,
        isActiveChange, // Delete = IsActive false
    };
};

export default employeesToPayItemsServices;
