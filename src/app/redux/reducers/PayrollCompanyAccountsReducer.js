import {SET_PAY_ROLL_COMPANY_ACCOUNTS} from "../actions/PayrollCompanyAccountsActions";

const initialState = {};

const payrollCompanyAccountsReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_PAY_ROLL_COMPANY_ACCOUNTS: {
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

export default payrollCompanyAccountsReducer;