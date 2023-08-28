import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";
import {loanActionTypes} from "../../pages/loansToEmployees/constant";

const loansToEmployeesService = () => {
    //Get all with pagination
    const getAllByPagination = async (
        page,
        size,
        orderBy,
        isAccending,
        q,
        filters
    ) => {
        filters = filters?.map((filter) => ({
            field: filter.column.field,
            value: filter.value,
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
            .get(`${API_CONFIGURATIONS.GET_ALL_LOANS_TO_EMPLOYEES}/pagination`, {
                withCredentials: true,
                params: {
                    page,
                    size,
                    orderBy,
                    isAccending,
                    q,
                    filters,
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
            .get(API_CONFIGURATIONS.GET_ALL_LOANS_TO_EMPLOYEES)
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
            .get(`${API_CONFIGURATIONS.FIND_ONE_LOANS_TO_EMPLOYEES}/${id}`, {
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
    const create = async (loansToEmployees) => {
        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
        };
        await axios
            .post(
                API_CONFIGURATIONS.CREATE_LOANS_TO_EMPLOYEES,
                loansToEmployees,
                axiosConfig
            )
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //Create
    const createLoanList = async (loan) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(`${API_CONFIGURATIONS.CREATE_L0AN_LIST}/LoanList`, loan, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);

            });
    };

    const createExcel = (loan) => {
        let axiosConfig = {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        return axios.post(API_CONFIGURATIONS.CREATE_LOAN_EXCEL, loan, axiosConfig);
    };

    //Don't use anymore
    const addInvalidRecords = (loan) => {
        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
        };
        return axios.post(API_CONFIGURATIONS.INVALID_LOAN, loan, axiosConfig);
    };

    const getAllInvalidLoans = (payrollId) => {
        return axios.get(`${API_CONFIGURATIONS.PAYROLL_PROCESS}/${payrollId}/InvalidLoans`, {
            withCredentials: true
        });
    };

    //Update
    const update = async (loansToEmployees, id, loanActions = loanActionTypes.UPDATE) => {
        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
            params: {
                loanActions
            }
        };
        await axios
            .put(
                `${API_CONFIGURATIONS.UPDATE_LOANS_TO_EMPLOYEES}/${id}`,
                loansToEmployees,
                axiosConfig
            )
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const deleteLoansToEmployees = async (loansToEmployees) => {
        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
        };

        await axios
            .delete(
                `${API_CONFIGURATIONS.DELETE_LOANS_TO_EMPLOYEES}/${loansToEmployees.id}`,
                axiosConfig
            )
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //IsActive Change
    const isActiveChange = async (loansToEmployees) => {
        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
        };
        let isActivePatchObj = [
            {
                path: "IsDelete",
                op: "replace",
                value: true,
            },
        ];
        await axios
            .patch(
                `${API_CONFIGURATIONS.DELETE_LOANS_TO_EMPLOYEES}/${loansToEmployees.id}`,
                isActivePatchObj,
                axiosConfig
            )
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    return {
        create,
        createLoanList,
        createExcel,
        update,
        getAll,
        getAllByPagination,
        addInvalidRecords,
        getAllInvalidLoans,
        findOne,
        deleteLoansToEmployees,
        isActiveChange, // Delete = IsActive false
    };
};

export default loansToEmployeesService;
