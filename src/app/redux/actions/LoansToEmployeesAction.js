export const SET_LOANS_TO_EMPLOYEES = "SET_LOANS_TO_EMPLOYEES";

export function setLoansToEmployeesrDetails(loansToEmployeesDetail) {
    return dispatch => {
        dispatch({
            type: SET_LOANS_TO_EMPLOYEES,
            data: loansToEmployeesDetail
        });
    };
}