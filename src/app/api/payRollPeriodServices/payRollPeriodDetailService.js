import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const payRollPeriodDetailService = () => {

    //Get all
    const getAll = async () => {
        const response = await axios
            .get(API_CONFIGURATIONS.GET_ALL_PAY_ROLL_PERIOD_DETAILS, {
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
            .get(`${API_CONFIGURATIONS.FIND_ONE_PAY_ROLL_PERIOD_DETAILS}/${id}`, {
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
    const create = async (payRollPeriod) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.CREATE_PAY_ROLL_PERIOD_DETAILS, payRollPeriod, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    };

    const update = async (id, isExtend, payRollPeriod) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            params: {
                isExtend
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_PAY_ROLL_PERIOD_DETAILS}/${id}`, payRollPeriod, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    }

    //Delete
    //IsActive Change
    const isActiveChange = async (payRollPeriod) => {
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
        await axios.patch(`${API_CONFIGURATIONS.DELETE_PAY_ROLL_PERIOD_DETAILS}/${payRollPeriod.id}`, isActivePatchObj, axiosConfig)
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

export default payRollPeriodDetailService;