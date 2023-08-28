import {SET_BANK_FILE_CONFIG} from "../actions/BankFileConfigAction";


const initialState = {};

const bankFileConfigReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_BANK_FILE_CONFIG: {
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

export default bankFileConfigReducer;