import {SET_BANK_FILE} from "../actions/BankFileAction";

const initialState = {};

const bankFileReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_BANK_FILE: {
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

export default bankFileReducer;