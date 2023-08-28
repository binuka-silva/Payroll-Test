import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const processPeriodService = () => {

    //Get all
    const getAll = async () => {
        const response = await axios
            .get(API_CONFIGURATIONS.GET_ALL_PROCESS_PERIODS, {
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

    // //Get all branches by organization id
    // const getBranchesByOrganizationId = async (organizationId) => {
    //     const response = await axios
    //         .get(`${API_CONFIGURATIONS.GET_ALL_BRANCHES_BY_ORGANIZATION}${organizationId}`)
    //         .then((response) => {
    //             return response;
    //         })
    //         .catch((error) => {
    //             throw error.response.data.errorCode;
    //         });
    //     return response;
    // };
    //
    //
    //
    // //Find one
    // const findOne = async (id) => {
    //     const response = await axios
    //         .get(`${API_CONFIGURATIONS.FIND_ONE_WAREHOUSE}${id}`)
    //         .then((response) => {
    //             return response;
    //         })
    //         .catch((error) => {
    //             throw error.response.data.errorCode;
    //         });
    //     return response;
    // };
    //
    //Create
    const create = async (processPeriod) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.CREATE_PROCESS_PERIODS, processPeriod, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    };

    //Update
    const update = async (processPeriod) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_PROCESS_PERIODS}/${processPeriod.id}`, processPeriod, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Delete
    //IsActive Change
    const isActiveChange = async (processPeriod) => {
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
        await axios.patch(`${API_CONFIGURATIONS.DELETE_PROCESS_PERIODS}/${processPeriod.id}`, isActivePatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const deleteProcessPeriod = async (processPeriod) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };

        await axios.delete(`${API_CONFIGURATIONS.DELETE_PROCESS_PERIODS}/${processPeriod.id}`, axiosConfig)
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
        deleteProcessPeriod,
        isActiveChange, // Delete = IsActive false
    };
};

export default processPeriodService;