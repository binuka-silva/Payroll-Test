import {SET_EMPLOYEE_DETAILS} from "../actions/EmployeeTemplateActions";

const initialState = {};

const employeeTemplateReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_EMPLOYEE_DETAILS: {
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

export default employeeTemplateReducer;
