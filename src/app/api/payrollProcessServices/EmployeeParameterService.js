import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const employeeParameterService = () => {

    //Get all
    const getAll = (payroll) => {
        return axios.get(API_CONFIGURATIONS.EMPLOYEE_PARAMETERS, {
            params: {payroll},
            withCredentials: true
        });
    };

    //Get all Payroll Parameter Data types
    const getAllEmployeeParameterDataTypes = () => {
        return axios
            .get(API_CONFIGURATIONS.EMPLOYEE_PARAMETERS_DATA_TYPES, {
                withCredentials: true
            });
    }

    //Find one
    const findOne = (id) => {
        return axios.get(`${API_CONFIGURATIONS.EMPLOYEE_PARAMETERS}/${id}`, {
            withCredentials: true
        });
    };


    //Create
    const create = (employeeParameter) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.post(API_CONFIGURATIONS.EMPLOYEE_PARAMETERS, employeeParameter, axiosConfig);
    };

    //Update
    const update = (employeeParameter, id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.put(`${API_CONFIGURATIONS.EMPLOYEE_PARAMETERS}/${id}`, employeeParameter, axiosConfig);
    };

    //Delete
    const deleteEmployeeParameter = (employeeParameterId) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };

        return axios.delete(`${API_CONFIGURATIONS.EMPLOYEE_PARAMETERS}/${employeeParameterId}`, axiosConfig);
    };

    //IsActive Change
    const isActiveChange = (payrollParameter) => {
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
        return axios.patch(`${API_CONFIGURATIONS.EMPLOYEE_PARAMETERS}/${payrollParameter.id}`, isActivePatchObj, axiosConfig);
    };

    return {
        create,
        update,
        getAll,
        getAllEmployeeParameterDataTypes,
        findOne,
        deleteEmployeeParameter,
        isActiveChange,
    };
};

export default employeeParameterService;