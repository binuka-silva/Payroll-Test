import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";
import qs from "qs";

const salaryService = () => {

    //Get all
    const getAll = async () => {
        const response = await axios
            .get(API_CONFIGURATIONS.GET_ALL_SALARIES, {
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

    //Find one
    const findOne = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.FIND_ONE_SALARIES}/${id}`, {
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
    const create = async (salary) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.CREATE_SALARIES, salary, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);

            });
    };
    //Create
    const createSalaryList = async (salary) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(`${API_CONFIGURATIONS.CREATE_SALARY_LIST}/SalaryList`, salary, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);

            });
    };

    const createExcel = (salary) => {
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.post(API_CONFIGURATIONS.CREATE_SALARY_EXCEL, salary, axiosConfig);
    };

    //Don't use anymore
    const addInvalidRecords = (salary) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.post(API_CONFIGURATIONS.INVALID_SALARY, salary, axiosConfig);
    };

    const getAllInvalidSalaries = (payrollId) => {
        return axios.get(`${API_CONFIGURATIONS.PAYROLL_PROCESS}/${payrollId}/InvalidSalary`, {
            withCredentials: true
        });
    };

    //Update
    const update = async (salary, id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_SALARIES}/${id}`, salary, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Update
    const updateSalaryStatus = async (salary, id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_SALARY_STATUS}/${id}/SalaryStatus`, salary, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Update
    const updateSalaryRollback = async (salary, id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_SALARY_ROLLBACK}/${id}/SalaryRollback`, salary, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const deleteSalary = async (salary) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
            params: {
                id: salary
            },
            paramsSerializer: params => {
                return qs.stringify(params)
            },
        };

        await axios.delete(API_CONFIGURATIONS.DELETE_SALARIES, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //IsActive Change
    const isActiveChange = async (salary) => {
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
        await axios.patch(`${API_CONFIGURATIONS.DELETE_SALARIES}/${salary.id}`, isActivePatchObj, axiosConfig)
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
        createSalaryList,
        createExcel,
        addInvalidRecords,
        getAllInvalidSalaries,
        updateSalaryStatus,
        updateSalaryRollback,
        getAll,
        findOne,
        deleteSalary,
        isActiveChange, // Delete = IsActive false
    };
};

export default salaryService;