import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";
import qs from "qs";

const employeeDetailTemplateService = () => {

    const getAllEmployeeCriteria = async () => {
        return await axios
            .get(API_CONFIGURATIONS.GET_ALL_EMPLOYEE_CRITERIA, {
                withCredentials: true
            });
    }

    const getAllEmployeeTypes = async () => {
        return await axios
            .get(API_CONFIGURATIONS.GET_ALL_EMPLOYEE_CRITERIA_DETAILS, {
                params: {
                    id: "EmploymentType"
                },
                withCredentials: true
            });
    }

    const getAllEmployeeCategory = async () => {
        return await axios
            .get(API_CONFIGURATIONS.GET_ALL_EMPLOYEE_CRITERIA_DETAILS, {
                params: {
                    id: "EmpCatName"
                },
                withCredentials: true
            });
    }

    const getAllEmployeeCompany = async () => {
        return await axios
            .get(API_CONFIGURATIONS.GET_ALL_EMPLOYEE_CRITERIA_DETAILS, {
                params: {
                    id: "CompanyId"
                },
                withCredentials: true
            });
    }

    const getAllDesignation = async () => {
        return await axios
            .get(API_CONFIGURATIONS.GET_ALL_EMPLOYEE_CRITERIA_DETAILS, {
                params: {
                    id: "PosCode"
                },
                withCredentials: true
            });
    }

    const getAllEmployeeStatus = async () => {
        return await axios
            .get(API_CONFIGURATIONS.GET_ALL_EMPLOYEE_CRITERIA_DETAILS, {
                params: {
                    id: "EmployeeStatus"
                },
                withCredentials: true
            });
    }

    const getAllWageClass = async () => {
        return await axios
            .get(API_CONFIGURATIONS.GET_ALL_EMPLOYEE_CRITERIA_DETAILS, {
                params: {
                    id: "WageClass"
                },
                withCredentials: true
            });
    }

    const getSelectedCriteria = async (idList) => {
        return await axios
            .get(API_CONFIGURATIONS.GET_ALL_EMPLOYEE_CRITERIA_DETAILS, {
                params: {
                    id: idList
                },
                paramsSerializer: params => {
                    return qs.stringify(params)
                },
                withCredentials: true
            });
    }

    const saveTemplate = async (data) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.EMPLOYEE_TEMPLATES, data, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    }

    const updateTemplate = async (id, data) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.EMPLOYEE_TEMPLATES}/${id}`, data, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    }

    const getSelectedEmployees = async (data) => {
        return await axios
            .post(API_CONFIGURATIONS.GET_ALL_SELECTED_EMPLOYEES, data, {
                withCredentials: true,
            });
    }

    return {
        getAllEmployeeCriteria,
        getAllEmployeeTypes,
        getAllEmployeeCompany,
        getAllEmployeeStatus,
        getAllWageClass,
        getAllDesignation,
        getAllEmployeeCategory,
        getSelectedCriteria,
        saveTemplate,
        getSelectedEmployees,
        updateTemplate
    };
};

export default employeeDetailTemplateService;