import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";
import qs from "qs";

const PayItemsToEmployeesService = () => {

    //Get all
    const getAll = async () => {
        const response = await axios
            .get(API_CONFIGURATIONS.GET_ALL_PAY_ITEMS_TO_EMPLOYEES)
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
            .get(`${API_CONFIGURATIONS.FIND_ONE_PAY_ITEMS_TO_EMPLOYEES}/${id}`)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data.errorCode;
            });
        return response;
    };


    //Create
    const create = async (payItemsToEmployees) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.CREATE_PAY_ITEMS_TO_EMPLOYEES, payItemsToEmployees, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    };

    //Update
    const update = async (payItemsToEmployees, id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_PAY_ITEMS_TO_EMPLOYEES}/${id}`, payItemsToEmployees, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Delete
    // const deletePayItemsToEmployees = async(payItemsToEmployees) => {
    //     let axiosConfig = {
    //         headers: {
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             "Access-Control-Allow-Origin": "*",
    //         },
    //         withCredentials: true
    //     };

    //     await axios.delete(`${API_CONFIGURATIONS.DELETE_PAY_ITEMS_TO_EMPLOYEES}/${payItemsToEmployees.id}`, axiosConfig)
    //         .then((response) => {
    //             return response.data;
    //         })
    //         .catch((error) => {
    //             throw error.response;
    //         });
    // };

    const deletePayItemsToEmployees = async (payItemsToEmployees) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
            params: {
                id: payItemsToEmployees
            },
            paramsSerializer: params => {
                return qs.stringify(params)
            },
        };

        await axios.delete(API_CONFIGURATIONS.DELETE_PAY_ITEMS_TO_EMPLOYEES, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //IsActive Change
    const isActiveChange = async (payItemsToEmployees) => {
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
        await axios.patch(`${API_CONFIGURATIONS.DELETE_PAY_ITEMS_TO_EMPLOYEES}/${payItemsToEmployees.id}`, isActivePatchObj, axiosConfig)
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
        deletePayItemsToEmployees,
        isActiveChange, // Delete = IsActive false
    };
};

export default PayItemsToEmployeesService;