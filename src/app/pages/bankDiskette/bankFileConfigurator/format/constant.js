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
    empNo: {
        value: "EmpNo",
        label: "EMP NO"
    },
    bank: {
        value: "BankId",
        label: "BANK"
    },
    branch: {
        value: "BranchId",
        label: "BRANCH"
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
}

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

export {
    TRIM_TYPES,
    FILL_DIRECTIONS,
    FIELD_TYPES,
    FUNCTION_CODES
};
