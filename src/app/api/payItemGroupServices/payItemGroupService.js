import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const payItemGroupService = () => {

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
            .get(`${API_CONFIGURATIONS.PAY_ITEM_GROUPS}/pagination`, {
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
            .get(API_CONFIGURATIONS.PAY_ITEM_GROUPS, {
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
            .get(`${API_CONFIGURATIONS.PAY_ITEM_GROUPS}/${id}`, {
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
    const create = async (payItemGroup) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.PAY_ITEM_GROUPS, payItemGroup, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    };

    //Update
    const update = async (payItemGroup) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.PAY_ITEM_GROUPS}/${payItemGroup.id}`, payItemGroup, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
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
        await axios.patch(`${API_CONFIGURATIONS.PAY_ITEM_GROUPS}/${payItemAdvanceParameter.id}`, isActivePatchObj, axiosConfig)
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
            .delete(`${API_CONFIGURATIONS.PAY_ITEM_GROUPS}/${id}`, {
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
        getAll,
        getAllByPagination,
        findOne,
        remove,
        isActiveChange, // Delete = IsActive false
    };
};

export default payItemGroupService;