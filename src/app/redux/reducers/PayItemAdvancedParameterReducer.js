import {SET_PAY_ITEM_ADVANCE_PARAMETER} from "../actions/PayItemAdvancedParameterActions";

const initialState = {};

const payItemAdvanceParameterReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_PAY_ITEM_ADVANCE_PARAMETER: {
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

export default payItemAdvanceParameterReducer;