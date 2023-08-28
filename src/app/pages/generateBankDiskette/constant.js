const payrollPeriodProcess = {
    OPEN: 1,
    PROCESSED: 2,
    CLOSE: 3,
    FINALIZED: 4
}

const payrollProcessStatus = {
    NEW: 1,
    PROCESSING: 2,
    SUCCESSES: 3,
    FAILED: 4,
    CANCELLED: 5,
}

const TRIM_TYPES = {
    LEFT_TRIM: 1,
    RIGHT_TRIM: 2,
    TRIM: 3
}

const FILL_DIRECTIONS = {
    LEFT: 1,
    RIGHT: 2,
}

const FIELD_TYPES = {
    employeeName: {
        value: "EmployeeName",
        label: "EMPLOYEE NAME"
    },
    initials: {
        value: "Name7",
        label: "INITIALS"
    },
    fullName: {
        value: "EmployeeName",
        label: "FULL NAME"
    },
    nic: {
        value: "InsuranceId",
        label: "NIC"
    },
    bank: {
        value: "BankId",
        label: "BANK"
    },
    branch: {
        value: "BranchId",
        label: "BRANCH"
    },
    empNo: {
        value: "EmpNo",
        label: "EMP NO"
    },
    accountNumber: {
        value: "AccountNumber",
        label: "A/C_NUMBER"
    },
    bankSequence: {
        value: "sequence",
        label: "BANK_SEQUENCE"
    },
    amount: {
        value: "amount",
        label: "AMOUNT"
    },
    freeText: {
        value: 31,
        label: "FFREETEXT"
    },
    effectiveDate: {
        value: 32,
        label: "FEFFECTIVEDATE"
    },
}

const fieldTypesArray = ["EmployeeName", "Name7", "InsuranceId", "BankId", "BranchId", "AccountNumber", "sequence", "amount"];

const FUNCTION_CODES = {
    FITEMGRP: 10,
    FPAYPARA: 11,
    FPARAEMP: 18,
    FGETEMPVAL: 21,
    FGETBANKEMPVAL: 26,
    FGETBANKDVAL: 27,
    FGETBANKDROWVAL: 28,
    FGETSUMEMPBANKVAL: 29,
    FGETCOM: 30,
    FFREETEXT: 31,
    FEFFECTIVEDATE: 32,
}

const functionCodesArray = ["29"];

const requestPath = "/bank-diskette";

const emptyGuid = "00000000-0000-0000-0000-000000000000";

export {
    payrollPeriodProcess,
    payrollProcessStatus,
    TRIM_TYPES,
    FILL_DIRECTIONS,
    FIELD_TYPES,
    fieldTypesArray,
    FUNCTION_CODES,
    functionCodesArray,
    requestPath,
    emptyGuid,
};

