import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const quickReportsService = () => {

    //Get all
    const getAll = () => {
        return axios.get(API_CONFIGURATIONS.QUICK_REPORTS, {
            withCredentials: true
        });
    };

    const execute = (id, queries) => {
        return axios.get(`${API_CONFIGURATIONS.QUICK_REPORTS}/${id}`, {
            withCredentials: true,
            params: {
                q: JSON.stringify(queries)
            }
        });
    };

    //Create
    const create = (data) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.post(API_CONFIGURATIONS.QUICK_REPORTS, data, axiosConfig);
    };

    //Update
    const update = (id, data) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.put(`${API_CONFIGURATIONS.QUICK_REPORTS}/${id}`, data, axiosConfig);
    };

    const deleteReport = (id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.delete(`${API_CONFIGURATIONS.QUICK_REPORTS}/${id}`, axiosConfig);
    };


    return {
        create,
        update,
        getAll,
        execute,
        deleteReport,
    };
};

export default quickReportsService;