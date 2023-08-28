import {SET_PAY_ROLL_PERIODS_DETAILS} from "../actions/PayrollPeriodsActions";

const initialState = {};

const payRollPeriodsReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_PAY_ROLL_PERIODS_DETAILS: {

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

export default payRollPeriodsReducer;