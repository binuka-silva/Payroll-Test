import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const payItemAdvanceParameterDetailsService = () => {

    //Get all
    const getAll = async () => {
        const response = await axios
            .get(API_CONFIGURATIONS.GET_ALL_PAY_ITEM_ADVANCE_PARAMETER_DETAILS, {
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
            .get(`${API_CONFIGURATIONS.FIND_ONE_PAY_ITEM_ADVANCE_PARAMETER_DETAILS}/${id}`, {
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
    const create = async (payItemAdvanceParameterDetails) => {

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.CREATE_PAY_ITEM_ADVANCE_PARAMETER_DETAILS, payItemAdvanceParameterDetails, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    };

    //Update
    // const update = async(payItemAdvanceParameterDetails) => {
    //     let axiosConfig = {
    //         headers: {
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             "Access-Control-Allow-Origin": "*",
    //         },
    //         withCredentials: true
    //     };
    //     await axios.put(`${API_CONFIGURATIONS.UPDATE_PAY_ITEM_ADVANCE_PARAMETER_DETAILS}/${payItemAdvanceParameterDetails.id}`, payItemAdvanceParameterDetails, axiosConfig)
    //         .then((response) => {
    //             return response.data;
    //         })
    //         .catch((error) => {
    //             throw error.response;
    //         });
    // };

    const update = async (id, payItemAdvanceParameterDetails) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_PAY_ITEM_ADVANCE_PARAMETER_DETAILS}/${id}`, payItemAdvanceParameterDetails, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    }

    //Delete
    //IsActive Change
    const isActiveChange = async (payItemAdvanceParameterDetails) => {
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
        await axios.patch(`${API_CONFIGURATIONS.DELETE_PAY_ITEM_ADVANCE_PARAMETER_DETAILS}/${payItemAdvanceParameterDetails.id}`, isActivePatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

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
        getAll,
        findOne,
        isActiveChange, // Delete = IsActive false
    };
};

export default payItemAdvanceParameterDetailsService;