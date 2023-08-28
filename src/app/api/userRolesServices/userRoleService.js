import axios from "axios";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";

const userRolesService = () => {

    const getAllPages = async () => {
        return await axios.get(API_CONFIGURATIONS.USER_ROLES_PAGES, {
            withCredentials: true
        });
    };

    const addRole = async (data) => {
        return await axios.post(API_CONFIGURATIONS.USER_ROLES, data, {
            withCredentials: true
        });
    }

    const getAllRoles = async () => {
        return await axios.get(API_CONFIGURATIONS.USER_ROLES, {
            withCredentials: true
        });
    }

    const updateRole = async (id, data) => {
        return await axios.put(`${API_CONFIGURATIONS.USER_ROLES}/${id}`, data, {
            withCredentials: true
        })
    }

    const changePermissions = async (id, data) => {

        return await axios.patch(`${API_CONFIGURATIONS.USER_ROLES}/${id}/permissions`, data, {
            withCredentials: true
        });
    }

    const isActiveChangeRole = async (id, isActive) => {
        return await axios.patch(`${API_CONFIGURATIONS.USER_ROLES}/${id}`, "", {
            params: {
                isActive
            },
            withCredentials: true
        });
    }

    const deleteRole = async (id) => {
        return await axios.delete(`${API_CONFIGURATIONS.USER_ROLES}/${id}`, {
            withCredentials: true
        });
    }

    return {
        getAllPages,
        getAllRoles,
        updateRole,
        isActiveChangeRole,
        changePermissions,
        deleteRole,
        addRole
    };
};

export default userRolesService;