import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const reportsService = () => {

    //Get all
    const getAll = () => {
        return axios.get(API_CONFIGURATIONS.REPORTS, {
            withCredentials: true
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
        return axios.post(API_CONFIGURATIONS.REPORTS, data, axiosConfig);
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
        return axios.put(`${API_CONFIGURATIONS.REPORTS}/${id}`, data, axiosConfig);
    };

    const deleteReport = (id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.delete(`${API_CONFIGURATIONS.REPORTS}/${id}`, axiosConfig);
    };

    const viewReport = (id, payrollId, periodId, exportType) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
            params: {payrollId, periodId, exportType}
        };
        return axios.get(`${API_CONFIGURATIONS.REPORTS}/view/${id}`, axiosConfig);
    }


    return {
        create,
        update,
        getAll,
        deleteReport,
        viewReport
    };
};

export default reportsService;