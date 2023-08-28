import axios from "axios";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";

const userService = () => {

    const addUser = async (data) => {
        return await axios.post(API_CONFIGURATIONS.USERS, data, {
            withCredentials: true
        });
    }

    const getAllUsers = async () => {
        return await axios.get(API_CONFIGURATIONS.USERS, {
            withCredentials: true
        });
    }

    const updateUser = async (id, data) => {
        return await axios.put(`${API_CONFIGURATIONS.USERS}/${id}`, data, {
            withCredentials: true
        })
    }

    const isAllowChangeUser = async (id, IsDelete) => {
        return await axios.patch(`${API_CONFIGURATIONS.USERS}/${id}`, "", {
            params: {
                IsDelete
            },
            withCredentials: true
        });
    }

    const deleteUser = async (id) => {
        return await axios.delete(`${API_CONFIGURATIONS.USERS}/${id}`, {
            withCredentials: true
        });
    }

    return {
        addUser,
        updateUser,
        getAllUsers,
        deleteUser,
        isAllowChangeUser
    };
};

export default userService;