import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const employeeService = () => {

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
            .get(`${API_CONFIGURATIONS.EMPLOYEES}/pagination`, {
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

    const syncWithIfsEmployees = async () => {
        return await axios
            .post(API_CONFIGURATIONS.EMPLOYEES, {}, {
                withCredentials: true
            });
    };

    const getEmployees = () => {
        return axios
            .get(API_CONFIGURATIONS.EMPLOYEES, {
                withCredentials: true
            });
    };

    return {
        syncWithIfsEmployees,
        getEmployees,
        getAllByPagination
    };
};

export default employeeService;