export const SET_PAY_ROLL_PARAMETERS = "SET_PAY_ROLL_PARAMETERS";

export function setPayrollParameterDetails(payrollParameterDetails) {
    return dispatch => {
        dispatch({
            type: SET_PAY_ROLL_PARAMETERS,
            data: payrollParameterDetails
        });
    };
}