import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const employeeTemplateService = () => {

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
            .get(`${API_CONFIGURATIONS.EMPLOYEE_TEMPLATES}/pagination`, {
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

    const getAllEmployeeTemplates = async () => {
        return await axios
            .get(API_CONFIGURATIONS.EMPLOYEE_TEMPLATES, {
                withCredentials: true
            });
    };

    const getEmployeeTemplateDetails = async (id) => {
        return await axios
            .get(`${API_CONFIGURATIONS.EMPLOYEE_TEMPLATES}/${id}`, {
                withCredentials: true
            });
    }

    const removeEmployeeTemplate = async (id) => {
        return await axios
            .delete(`${API_CONFIGURATIONS.EMPLOYEE_TEMPLATES}/${id}`, {
                withCredentials: true
            });
    }

    return {
        getAllEmployeeTemplates,
        getEmployeeTemplateDetails,
        getAllByPagination,
        removeEmployeeTemplate
    };
};

export default employeeTemplateService;