export const SET_USER_ROLE_DETAILS = "SET_USER_ROLE_DETAILS";

export function setUserRoleDetails(userRoleDetails) {
    return dispatch => {
        dispatch({
            type: SET_USER_ROLE_DETAILS,
            data: userRoleDetails
        });
    };
}