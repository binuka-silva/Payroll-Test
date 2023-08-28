import {combineReducers} from "redux";
import LoginReducer from "./LoginReducer";
import UserReducer from "./UserReducer";
import LayoutReducer from "./LayoutReducer";
import ScrumBoardReducer from "./ScrumBoardReducer";
import NotificationReducer from "./NotificationReducer";
import EcommerceReducer from "./EcommerceReducer";
import employeeTemplateReducer from "./EmployeeTemplateReducer";
import payRollPeriodsReducer from "./PayrollPeriodsReducer";
import payItemAdvanceParameterReducer from "./PayItemAdvancedParameterReducer";
import payItemGroupReducer from "./PayItemGroupReducer";
import payItemCalculationsReducer from "./PayItemCalculationsReducer";
import payrollTaxReducer from "./PayrollTaxDetailsReducer";
import bankDetailsReducer from "./BankDetailsReducer";
import SideNavReducer from "./SideNavReducer";
import userRoleReducer from "./UserRoleReducer";
import bankFileReducer from "./BankFileReducer";
import bankFileConfigReducer from "./BankFileConfigReducer";
import {USER_LOGGED_OUT} from "../actions/UserActions";
import loansToEmployeesReducer from "./LoansToEmployeesReducer";

const appReducer = combineReducers({
    login: LoginReducer,
    user: UserReducer,
    employeeTemplate: employeeTemplateReducer,
    payrollPeriod: payRollPeriodsReducer,
    payItemGroup: payItemGroupReducer,
    payItemCalculation: payItemCalculationsReducer,
    userRole: userRoleReducer,
    payItemAdvanceParameter: payItemAdvanceParameterReducer,
    payrollTaxDetails: payrollTaxReducer,
    bankDetails: bankDetailsReducer,
    //payrollCompanyAccountsDetails: payrollCompanyAccountsReducer,
    //payrollParameterDetails: payrollParameterReducer,
    layout: LayoutReducer,
    sideNav: SideNavReducer,
    scrumboard: ScrumBoardReducer,
    notification: NotificationReducer,
    ecommerce: EcommerceReducer,
    bankFile: bankFileReducer,
    bankFileConfig: bankFileConfigReducer,
    loansToEmployees: loansToEmployeesReducer,
});

const RootReducer = (state, action) => {
    if (action.type === USER_LOGGED_OUT) {
        return appReducer(undefined, action)
    }

    return appReducer(state, action);
}

export default RootReducer;