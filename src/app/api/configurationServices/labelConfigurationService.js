import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const labelConfigurationService = () => {

    //Get all
    const getAll = async () => {
        const response = await axios
            .get(API_CONFIGURATIONS.LABEL_CONFIGURATION, {
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

    const getAllUserConfigs = () => {
        return axios.get(API_CONFIGURATIONS.USER_LABEL_CONFIGURATION, {
            withCredentials: true
        });
    };

    //Find one
    const findOne = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.LABEL_CONFIGURATION}/${id}`, {
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
    const create = async (labelConfiguration) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.LABEL_CONFIGURATION, labelConfiguration, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    };

    //Update
    const update = async (labelConfiguration) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.LABEL_CONFIGURATION}/${labelConfiguration.id}`, labelConfiguration, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Delete
    //IsActive Change
    const deleteLabelConfiguration = async (id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };

        await axios.delete(`${API_CONFIGURATIONS.LABEL_CONFIGURATION}/${id}`, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const isActiveChange = async (labelConfiguration) => {
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
        await axios.patch(`${API_CONFIGURATIONS.LABEL_CONFIGURATION}/${labelConfiguration.id}`, isActivePatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };


    return {
        create,
        update,
        getAll,
        getAllUserConfigs,
        findOne,
        deleteLabelConfiguration,
        isActiveChange, // Delete = IsActive false
    };
};

export default labelConfigurationService;