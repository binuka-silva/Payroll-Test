export const SET_PAY_ITEM_GROUP_DETAILS = "SET_PAY_ITEM_GROUP_DETAILS";

export function setPayItemGroupDetails(groupDetail) {
    return dispatch => {
        dispatch({
            type: SET_PAY_ITEM_GROUP_DETAILS,
            data: groupDetail
        });
    };
}
