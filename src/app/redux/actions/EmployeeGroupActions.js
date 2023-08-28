import employeeGroupService from "../../api/employeeGroupServices/employeeGroupService";

export const FETCH_EMPLOYEE_GROUP_LOADING = "FETCH_EMPLOYEE_GROUP_LOADING";
export const FETCH_EMPLOYEE_GROUP_SUCCESS = "FETCH_EMPLOYEE_GROUP_SUCCESS";
export const FETCH_EMPLOYEE_GROUP_ERROR = "FETCH_EMPLOYEE_GROUP_ERROR";


export function fetchEmployeeGroupList() {
    return dispatch => {
        dispatch({
            type: FETCH_EMPLOYEE_GROUP_LOADING
        });
        employeeGroupService().getAll()
            .then(user => {
                return dispatch({
                    type: FETCH_EMPLOYEE_GROUP_SUCCESS
                });
            })
            .catch(error => {
                return dispatch({
                    type: FETCH_EMPLOYEE_GROUP_ERROR,
                    payload: error
                });
            });
    };
}