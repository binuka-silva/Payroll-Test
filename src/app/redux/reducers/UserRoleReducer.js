import {SET_USER_ROLE_DETAILS} from "../actions/UserRoleActions";


const initialState = {};

const userRoleReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_USER_ROLE_DETAILS: {
            return {
                ...state,
                ...action.data
            };
        }
        default: {
            return state;
        }
    }
};

export default userRoleReducer;