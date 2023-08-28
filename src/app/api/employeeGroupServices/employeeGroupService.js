import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const employeeGroupService = () => {

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
            .get(`${API_CONFIGURATIONS.GET_ALL_EMPLOYEE_GROUP}/pagination`, {
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
            .get(API_CONFIGURATIONS.GET_ALL_EMPLOYEE_GROUP, {
                withCredentials: true
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response;
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
    const create = async (employeeGroup) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.CREATE_EMPLOYEE_GROUP, employeeGroup, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Update
    const update = async (employeeGroup) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_EMPLOYEE_GROUP}/${employeeGroup.id}`, employeeGroup, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Delete
    //IsActive Change
    const deleteEmployeeGroup = async (employeeGroup) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };

        await axios.delete(`${API_CONFIGURATIONS.DELETE_EMPLOYEE_GROUP}/${employeeGroup.id}`, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const isActiveChange = async (employeeGroup) => {
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
        await axios.patch(`${API_CONFIGURATIONS.DELETE_EMPLOYEE_GROUP}/${employeeGroup.id}`, isActivePatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //
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
        isActiveChange,
        deleteEmployeeGroup, // Delete = IsActive false
    };
};

export default employeeGroupService;