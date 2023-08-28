export const SET_BANK_DETAILS = "SET_BANK_DETAILS";

export function setBankDetails(bankDetails) {
    return dispatch => {
        dispatch({
            type: SET_BANK_DETAILS,
            data: bankDetails
        });
    };
}