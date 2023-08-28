export const SET_PAY_ROLL_COMPANY_ACCOUNTS = "SET_PAY_ROLL_COMPANY_ACCOUNTS";

export function setPayrollCompanyAccountsDetails(payrollCompanyAccountsDetails) {
    return dispatch => {
        dispatch({
            type: SET_PAY_ROLL_COMPANY_ACCOUNTS,
            data: payrollCompanyAccountsDetails
        });
    };
}