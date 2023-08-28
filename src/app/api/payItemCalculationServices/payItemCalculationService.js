import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const payItemCalculationService = () => {

    //Get all
    const getAllFunctions = async () => {
        const response = await axios
            .get(API_CONFIGURATIONS.FUNCTIONS, {
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

    const getEmployeesFilterDetails = () => {
        return axios.get(API_CONFIGURATIONS.FORMULAS_Employees_Filter_Details, {withCredentials: true});
    };

    //Find one
    const findOne = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.FIND_ONE_PAY_ITEM_CALCULATIONS}/${id}`, {
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
    const create = async (data) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.FORMULAS, data, axiosConfig)
            .then((response) => {
                return response.data;
            });
    };

    //Update
    const update = (id, data) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        axios.put(`${API_CONFIGURATIONS.FORMULAS}/${id}`, data, axiosConfig)
            .then((response) => {
                return response.data;
            });
    };

    //Delete
    //IsActive Change
    const isActiveChange = async (payItemAdvanceParameter) => {
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
        await axios.patch(`${API_CONFIGURATIONS.REMOVE_PAY_ITEM_CALCULATIONS}/${payItemAdvanceParameter.id}`, isActivePatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };


    //Remove
    const remove = async (id) => {
        return await axios
            .delete(`${API_CONFIGURATIONS.REMOVE_PAY_ITEM_CALCULATIONS}/${id}`, {
                withCredentials: true
            });
    }

    // //Delete All
    // const deleteAll = async () => {
    //     await axios.get(API_CONFIGURATIONS.DELETEALL_WAREHOUSE)
    //         .then((response) => {
    //             return response.data;
    //         })
    //         .catch((error) => {
    //             throw error.response.data.errorCode;
    //         });
    // };

    return {
        create,
        update,
        getAllFunctions,
        getEmployeesFilterDetails,
        findOne,
        remove,
        isActiveChange, // Delete = IsActive false
    };
};

export default payItemCalculationService;