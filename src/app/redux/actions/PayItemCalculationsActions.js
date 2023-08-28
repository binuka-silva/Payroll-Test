export const SET_PAY_ITEM_CALCULATIONS_DETAILS = "SET_PAY_ITEM_CALCULATIONS_DETAILS";

export function setPayItemCalculationsDetails(payItemCalculationsDetails) {
    return dispatch => {
        dispatch({
            type: SET_PAY_ITEM_CALCULATIONS_DETAILS,
            data: payItemCalculationsDetails
        });
    };
}