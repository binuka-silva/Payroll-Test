import {SET_BANK_DETAILS} from "../actions/BankDetailsAction";

const initialState = {};

const bankDetailsReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_BANK_DETAILS: {
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

export default bankDetailsReducer;