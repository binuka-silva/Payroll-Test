export const SET_SIDE_NAV = "SET_SIDE_NAV";
export const SET_DEFAULT_SIDE_NAV = "SET_DEFAULT_SIDE_NAV";

export const setSideNav = data => dispatch => {
    dispatch({
        type: SET_SIDE_NAV,
        data: data
    });
};

export const setDefaultSideNav = data => dispatch => {
    dispatch({
        type: SET_DEFAULT_SIDE_NAV,
        data: data
    });
};
