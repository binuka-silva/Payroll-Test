export const SET_PAY_ITEM_ADVANCE_PARAMETER = "SET_PAY_ITEM_ADVANCE_PARAMETER";

export function setPayItemAdvanceParameterDetails(payItemAdvanceParameterDetail) {
    return dispatch => {
        dispatch({
            type: SET_PAY_ITEM_ADVANCE_PARAMETER,
            data: payItemAdvanceParameterDetail
        });
    };
}