import {SET_PAY_ROLL_PARAMETERS} from "../actions/PayrollParameterActions";

const initialState = {};

const payrollParameterReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_PAY_ROLL_PARAMETERS: {
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

export default payrollParameterReducer;