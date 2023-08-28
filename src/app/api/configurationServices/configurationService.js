import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const configurationService = () => {
    //Get all
    const getAll = async () => {
        const response = await axios
            .get(API_CONFIGURATIONS.CONFIGURATIONS, {
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

    //Update
    const update = async (configuration) => {
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return await axios.put(`${API_CONFIGURATIONS.CONFIGURATIONS}`, configuration, axiosConfig);
    };

    return {
        update,
        getAll,
    };
};

export default configurationService;