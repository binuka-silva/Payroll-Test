import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const bankFileFormatService = () => {

    //Get all
    const getAll = (configId) => {
        return axios.get(`${API_CONFIGURATIONS.BANK_FILE_FORMAT}/${configId}`, {
            withCredentials: true
        });
    };

    const getAllFormat = () => {
        return axios.get(`${API_CONFIGURATIONS.BANK_FILE_FORMAT}/Format`, {
            withCredentials: true
        });
    };

    //Create
    const create = (format) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.post(API_CONFIGURATIONS.BANK_FILE_FORMAT, format, axiosConfig);
    };

    //Update
    const update = (id, format) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.put(`${API_CONFIGURATIONS.BANK_FILE_FORMAT}/${id}`, format, axiosConfig);
    };

    //Delete
    const remove = (id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };

        return axios.delete(`${API_CONFIGURATIONS.BANK_FILE_FORMAT}/${id}`, axiosConfig);
    };

    return {
        create,
        update,
        getAll,
        getAllFormat,
        remove,
    };
};

export default bankFileFormatService;