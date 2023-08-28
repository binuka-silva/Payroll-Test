export const SET_EMPLOYEE_DETAILS = "SET_EMPLOYEE_DETAILS";

export function setEmployeeTemplateDetails(templateDetail) {
    return dispatch => {
        dispatch({
            type: SET_EMPLOYEE_DETAILS,
            data: templateDetail
        });
    };
}
