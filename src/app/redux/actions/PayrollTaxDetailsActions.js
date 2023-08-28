export const SET_PAYROLL_TAX_DETAILS = "SET_PAYROLL_TAX_DETAILS";

export function setPayrollTaxDetails(payrollTaxDetails) {
    return dispatch => {
        dispatch({
            type: SET_PAYROLL_TAX_DETAILS,
            data: payrollTaxDetails
        });
    };
}