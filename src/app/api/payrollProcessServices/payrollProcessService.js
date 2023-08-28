import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const payrollProcessService = () => {

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
            .get(`${API_CONFIGURATIONS.GET_ALL_PAYROLL_PROCESS}/pagination`, {
                withCredentials: true,
                params: {
                    page,
                    size,
                    orderBy,
                    isAccending,
                    q,
                    filters
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
            .get(API_CONFIGURATIONS.GET_ALL_PAYROLL_PROCESS, {
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

    //Get Employees
    const getPayrollEmployees = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.FIND_ONE_PAYROLL_PROCESS}/employees/${id}`, {
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

    //Get name list
    const getNames = async () => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.GET_ALL_PAYROLL_PROCESS}/names`, {
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
    const findOne = async (id, path = "") => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.FIND_ONE_PAYROLL_PROCESS}/${id}`, {
                withCredentials: true,
                headers: {
                    "RequestPath": path
                }
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data;
            });
        return response;
    };

    const getCompanyAccounts = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.PAYROLL_PROCESS_COMPANY_ACCOUNTS}/${id}/CompanyAccount`, {
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

    const getPayrollPayItems = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.PAYROLL_PROCESS_PAYROLL_PAY_ITEM}/${id}/PayrollPayItem`, {
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

    const getPayrollBankDiskettes = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.PAYROLL_PROCESS_PAYROLL_BANK_DISKETTE}/${id}/PayrollBankDiskettes`, {
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

    const getEmployeesToPayItems = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.PAYROLL_PROCESS_EMPLOYEES_TO_PAY_ITEMS}/${id}/EmployeesPayItems`, {
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

    const getSalary = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.PAYROLL_PROCESS_SALARY}/${id}/PayrollSalary`, {
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

    const getPayItemsToEmployees = async (id) => {
        const response = await axios
            .get(`${API_CONFIGURATIONS.PAYROLL_PROCESS_PAY_ITEMS_TO_EMPLOYEES}/${id}/PayItemsToEmployees`, {
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
    const create = async (payrollProcess) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.post(API_CONFIGURATIONS.CREATE_PAYROLL_PROCESS, payrollProcess, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response.data;
            });
    };

    //Update
    const update = async (payrollProcess, id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_PAYROLL_PROCESS}/${id}`, payrollProcess, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const setTaxNumber = async (id, number) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        let taxNumberPatchObj = [{
            "path": "TaxNumber",
            "op": "replace",
            "value": number
        }]

        await axios.patch(`${API_CONFIGURATIONS.PATCH_PAYROLL_PROCESS}/${id}/TaxNumber`, taxNumberPatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const setEPFId = async (id, epfId) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        let epfIdPatchObj = [{
            "path": "EPFId",
            "op": "replace",
            "value": epfId
        }]

        await axios.patch(`${API_CONFIGURATIONS.PATCH_PAYROLL_PROCESS}/${id}/EPFId`, epfIdPatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const setETFId = async (id, etfId) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        let etfIdPatchObj = [{
            "path": "ETFId",
            "op": "replace",
            "value": etfId
        }]

        await axios.patch(`${API_CONFIGURATIONS.PATCH_PAYROLL_PROCESS}/${id}/ETFId`, etfIdPatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Delete
    const deletePayrollProcess = async (payrollProcess) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };

        await axios.delete(`${API_CONFIGURATIONS.DELETE_PAYROLL_PROCESS}/${payrollProcess.id}`, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //IsActive Change
    const isActiveChange = async (payrollProcess) => {
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
        await axios.patch(`${API_CONFIGURATIONS.DELETE_PAYROLL_PROCESS}/${payrollProcess.id}`, isActivePatchObj, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    //Update
    const updatePayrollPayItem = async (payItem, id) => {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true
        };
        await axios.put(`${API_CONFIGURATIONS.UPDATE_PAYROLL_PAY_ITEM_TO_BANK_DISKETTE}/${id}/PayrollPayItemToBankDiskette`, payItem, axiosConfig)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                throw error.response;
            });
    };

    const getPayrollLoanTypes = async (id) => {
        const response = await axios
            .get(
                `${API_CONFIGURATIONS.PAYROLL_PROCESS_PAYROLL_LOAN_TYPE}/${id}/PayrollLoanType`,
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data.errorCode;
            });
        return response;
    };

    const getLoansToEmployees = async (id) => {
        const response = await axios
            .get(
                `${API_CONFIGURATIONS.PAYROLL_PROCESS_LOANS_EMPLOYEES}/${id}/LoansToEmployees`,
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                return response;
            })
            .catch((error) => {
                throw error.response.data.errorCode;
            });
        return response;
    };

     const getPayrollDeductions = async (id) => {
       const response = await axios
         .get(
           `${API_CONFIGURATIONS.PAYROLL_PROCESS_PAYROLL_DEDUCTIONS}/${id}/PayrollDeduction`,
           {
             withCredentials: true,
           }
         )
         .then((response) => {
           return response;
         })
         .catch((error) => {
           throw error.response.data.errorCode;
         });
       return response;
     };

     const getPayrollTakeProfit = async (id) => {
       const response = await axios
         .get(
           `${API_CONFIGURATIONS.PAYROLL_PROCESS_PAYROLL_TAKE_PROFIT}/${id}/PayrollTakeProfit`,
           {
             withCredentials: true,
           }
         )
         .then((response) => {
           return response;
         })
         .catch((error) => {
           throw error.response.data.errorCode;
         });
       return response; 
     };

    return {
        create,
        update,
        getAll,
        getPayrollEmployees,
        getNames,
        getAllByPagination,
        findOne,
        getCompanyAccounts,
        getPayrollPayItems,
        getPayrollBankDiskettes,
        getEmployeesToPayItems,
        getPayItemsToEmployees,
        getSalary,
        setTaxNumber,
        setEPFId,
        setETFId,
        deletePayrollProcess,
        updatePayrollPayItem,
        getPayrollLoanTypes,
        getLoansToEmployees,
        getPayrollDeductions,
        getPayrollTakeProfit, 
        isActiveChange, // Delete = IsActive false
    };
};

export default payrollProcessService;