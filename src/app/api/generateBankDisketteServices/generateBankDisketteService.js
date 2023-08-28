import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const generateBankDisketteService = () => {

    const getAllBankDisketteValues = (data, isPeriodChange = false) => {
        return axios.post(API_CONFIGURATIONS.GENERATE_BANK_DISKETTES, data, {
            withCredentials: true,
            params: {
                isPeriodChange
            }
        });
    };

    const confirmBankDiskette = (bankDiskette) => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.put(`${API_CONFIGURATIONS.GENERATE_BANK_DISKETTES}/Confirm`, bankDiskette, axiosConfig);
    };

    const generateBankDiskette = (bankDiskette) => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.put(`${API_CONFIGURATIONS.GENERATE_BANK_DISKETTES}/Generate`, bankDiskette, axiosConfig);
    };

    return {
        confirmBankDiskette,
        generateBankDiskette,
        getAllBankDisketteValues,
    };
};

export default generateBankDisketteService;