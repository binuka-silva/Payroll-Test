import {SET_PAY_ITEM_GROUP_DETAILS} from "../actions/PayItemGroupActions";


const initialState = {};

const payItemGroupReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_PAY_ITEM_GROUP_DETAILS: {
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

export default payItemGroupReducer;
