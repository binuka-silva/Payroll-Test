const PARAMETER_NAMES = {
    VALUE1: "Value 1",
    VALUE2: "Value 2",
    VALUE3: "Value 3",
    VALUE4: "Value 4",
    VALUE: "Value",
    PERIOD_TYPE: "PeriodType",
    PARAMETER: "Parameter ID",
    ADVANCE_PARAMETER: "Advance Parameter ID",
    GROUP: "Group ID",
    PAY_ITEM: "PayItem ID",
    LOAN_TYPE: "LoanType ID",
    LOAN_DETAIL: "LoanDetail",
    LOAN_SEQ: "LoanSequence",
    LOAN_DED: "Loan Deduction",
    DAY_TYPES: "DayType",
    CALCULATION_METHOD: "CalculationMethod",
    COVER: "Cover Value",
    FIELD_NAME: "Field Name",
    QUERY: "Query ID",
    START_DATE: "Start Date",
    END_DATE: "End Date",
    DATE1: "Date 1",
    DATE2: "Date 2",
    NUMBER_OF_PERIODS: "Number of Periods",
    ROUNDING_TYPE: "RoundingType",
    ROUNDING_VALUE: "Rounding Value",
    ROUNDING_TO: "Rounding To",
    ROUND_BY: "RoundBy",
    SQL: "SQL",
    ARGUMENT1: "Argument 1",
    ARGUMENT2: "Argument 2",
    ARGUMENT3: "Argument 3",
    ARGUMENT4: "Argument 4",
    ARGUMENT5: "Argument 5",
    ADV_PARA_VALUE: "AdvParaValue"
}

const ADV_PARA_VALUES = {
    value1: {
        value: 1,
        label: "VALUE1"
    },
    value2: {
        value: 2,
        label: "VALUE2"
    },
    value3: {
        value: 3,
        label: "VALUE3"
    },
    value4: {
        value: 4,
        label: "VALUE4"
    }
}

const ROUNDING_TYPE = {
    roundUp: {
        value: 1,
        label: "ROUND UP"
    },
    roundDown: {
        value: 2,
        label: "ROUND DOWN"
    },
    noRounding: {
        value: 3,
        label: "N0 ROUNDING"
    }
}

const CALCULATION_METHOD = {
    days: {
        value: 1,
        label: "DAYS"
    },
    months: {
        value: 2,
        label: "MONTHS"
    },
    years: {
        value: 3,
        label: "YEARS"
    }
}

const PARAMETER_TYPES = {
    VALUE: "value",
    DATE: "date",
}

const DAY_TYPES = {
    calendar: {
        value: 1,
        label: "CALENDAR DAYS"
    },
    working: {
        value: 2,
        label: "WORKING DAYS"
    }
}

const PERIOD_TYPES = {
    default: {
        value: 1,
        label: "DEFAULT"
    },
    accounting: {
        value: 2,
        label: "ACCOUNTING"
    },
    tax: {
        value: 3,
        label: "TAX YEAR"
    }
}

const EMP_FIELD_TYPES = {
    employeeType: {
        value: "EmploymentType",
        label: "EMPLOYEE TYPE"
    },
    category: {
        value: "EmpCatName",
        label: "CATEGORY"
    },
    position: {
        value: "EmpPosCode",
        label: "POSITION ID"
    },
    gender: {
        value: "Gender",
        label: "GENDER"
    }
}

const PAY_ITEM_FIELD_TYPES = {
    units: {
        value: "Units",
        label: "Units"
    },
    amount: {
        value: "Amount",
        label: "Amount"
    },
}

const EMPLOYEE_DETAILS_FIELDS = {
    employeeType: "EmploymentType",
    employeeCat: "EmpCatName"
}

const LOAN_DETAILS = {
    monthlyLoanCapital: {
        value: 1,
        label: "Monthly Loan Capital"
    },
    monthlyLoanInterest: {
        value: 2,
        label: "Monthly Loan Interest"
    },
    capitalBal: {
        value: 3,
        label: "Balance Capital"
    },
    interestBal: {
        value: 4,
        label: "Balance Interest"
    },
    balanceInstallments: {
        value: 5,
        label: "Balance Installments"
    }
}

const FUNCTION_CODES = {
    roundCfDf: "6",
    employeeParameter: "18",
    payItemParameter: "8",
    payrollParameter: "11"
}

export {
    PARAMETER_NAMES,
    PARAMETER_TYPES,
    ROUNDING_TYPE,
    CALCULATION_METHOD,
    DAY_TYPES,
    PERIOD_TYPES,
    EMP_FIELD_TYPES,
    PAY_ITEM_FIELD_TYPES,
    ADV_PARA_VALUES,
    FUNCTION_CODES,
    LOAN_DETAILS,
    EMPLOYEE_DETAILS_FIELDS
};
