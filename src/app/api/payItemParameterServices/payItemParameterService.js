import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const payItemParameterService = () => {

    //Get all with pagination
    const getAllByPagination = async (page, size, orderBy, isAccending, q, filters) => {
        filters = filters?.map(filter => ({
            field: filter.column.field,
            value: filter.value
        }));
        if (!q) {
            q = "''";
        }
        if (!orderBy) {
            orderBy = "''";
        }
        if (!filters) {
            filters = "";
        }
        filters = JSON.stringify(filters);
        const response = await axios
            .get(`${API_CONFIGURATIONS.GET_ALL_PAY_ITEM_PARAMETERS}/pagination`, {
                withCredentials: true,
                params:
                    {
                        page, size, orderBy, isAccending, q, filters
                    },
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data;
            });
        return response;
    };

    //Get all
    const getAll = async () => {
        const response = await axios
            .get(API_CONFIGURATIONS.GET_ALL_PAY_ITEM_PARAMETERS, {
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
            .get(`${API_CONFIGURATIONS.FIND_ONE_PAY_ITEM_PARAMETERS}/${id}`, {
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
    const create = async (payItemParameter) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.CREATE_PAY_ITEM_PARAMETERS, payItemParameter, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    };

    //Update
    const update = async (payItemParameter) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_PAY_ITEM_PARAMETERS}/${payItemParameter.id}`, payItemParameter, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Delete
    //IsActive Change
    const isActiveChange = async (payItemParameter) => {
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
        await axios.patch(`${API_CONFIGURATIONS.DELETE_PAY_ITEM_PARAMETERS}/${payItemParameter.id}`, isActivePatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const deleteParameter = async (payItemParameter) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };

        await axios.delete(`${API_CONFIGURATIONS.DELETE_PAY_ITEM_PARAMETERS}/${payItemParameter.id}`, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    return {
        findOne,
        create,
        update,
        getAll,
        getAllByPagination,
        deleteParameter,
        isActiveChange, // Delete = IsActive false
    };
};

export default payItemParameterService;