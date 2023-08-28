import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const bankDisketteLineTypeService = () => {

    //Get all with pagination
    const getAllByPagination = async (page, size, orderBy, isAccending, q, filters) => {
        filters = filters?.map(filter => (
            filter.column.field == "multiLines" ?
                {
                    field: filter.column.field,
                    value: filter.value == "checked"
                }
                :
                {
                    field: filter.column.field,
                    value: filter.value
                }
        ));
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
            .get(`${API_CONFIGURATIONS.BANK_DISKETTE_LINE_TYPE}/pagination`, {
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
    const getAll = () => {
        return axios.get(API_CONFIGURATIONS.BANK_DISKETTE_LINE_TYPE, {
            withCredentials: true
        });
    };

    //Find one
    const findOne = (id) => {
        return axios.get(`${API_CONFIGURATIONS.BANK_DISKETTE_LINE_TYPE}/${id}`, {
            withCredentials: true
        });
    };


    //Create
    const create = (lineType) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.post(API_CONFIGURATIONS.BANK_DISKETTE_LINE_TYPE, lineType, axiosConfig);
    };

    //Update
    const update = (lineType) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.put(`${API_CONFIGURATIONS.BANK_DISKETTE_LINE_TYPE}/${lineType.id}`, lineType, axiosConfig);
    };

    //Delete
    //IsActive Change
    const isActiveChange = (lineType) => {
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
        }];
        return axios.patch(`${API_CONFIGURATIONS.BANK_DISKETTE_LINE_TYPE}/${lineType.id}`, isActivePatchObj, axiosConfig);
    };

    //Delete
    const remove = (lineType) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };

        return axios.delete(`${API_CONFIGURATIONS.BANK_DISKETTE_LINE_TYPE}/${lineType.id}`, axiosConfig);
    };

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

export default bankDisketteLineTypeService;