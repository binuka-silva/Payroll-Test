import React from "react";
import AutoCompleteDropDown from "./AutoCompleteDropDown";
import localStorageService from "../services/localStorageService";

const PayrollDropDown = ({payrollProcessList, payrollOnChange, sx = {width: 300}}) => {

    return (
        <AutoCompleteDropDown
            dropDownData={payrollProcessList}
            onChange={payrollOnChange}
            sx={sx}
            isLabelVisible={true}
            isFreeDropDown={true}
            label="Payroll"
            variant="filled"
            defaultValue={
                localStorageService.getItem("selected_payroll") ??
                payrollProcessList.find((p) =>
                    p.value === localStorageService.getItem("auth_user")?.payrollDefinitionId) ??
                payrollProcessList[0]
            }
        />
    );
};

export default PayrollDropDown;
