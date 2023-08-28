import {SET_PAY_ITEM_CALCULATIONS_DETAILS} from "../actions/PayItemCalculationsActions";

const initialState = {};

const payItemCalculationsReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_PAY_ITEM_CALCULATIONS_DETAILS: {
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

export default payItemCalculationsReducer;