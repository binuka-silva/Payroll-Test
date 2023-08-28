import {SET_PAYROLL_TAX_DETAILS} from "../actions/PayrollTaxDetailsActions";

const initialState = {};

const payrollTaxReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_PAYROLL_TAX_DETAILS: {
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

export default payrollTaxReducer;