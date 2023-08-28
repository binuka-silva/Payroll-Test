import {SET_LOANS_TO_EMPLOYEES} from "../actions/LoansToEmployeesAction";

const initialState = {};

const loansToEmployeesReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_LOANS_TO_EMPLOYEES: {
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

export default loansToEmployeesReducer;