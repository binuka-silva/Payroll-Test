 const BASE_URL = process.env.REACT_APP_BASE_URL;
 const BASE_STATIC_URL = process.env.REACT_APP_BASE_STATIC_URL;
 export const BASE_CRYSTAL_URL = process.env.REACT_APP_BASE_CRYSTAL_URL;

 export const API_CONFIGURATIONS = {
     //Auth
     AUTH_USER: `${BASE_URL}Auth`,
     FORGOT_PASSWORD_USER: `${BASE_URL}Auth/ForgotPassword`,
     RESET_PASSWORD_USER: `${BASE_URL}Auth/ResetPassword`,
     USERS: `${BASE_URL}User`,

     //Banks
     CREATE_BANKS: `${BASE_URL}Banks`,
     GET_ALL_BANKS: `${BASE_URL}Banks`,
     FIND_ONE_BANK: `${BASE_URL}Banks`,
     UPDATE_BANKS: `${BASE_URL}Banks`,
     DELETE_BANKS: `${BASE_URL}Banks`, // Change Is active status

     //Branches
     CREATE_BRANCHES: `${BASE_URL}Branches`,
     GET_ALL_BRANCHES: `${BASE_URL}Branches`,
     FIND_ONE_BRANCHES: `${BASE_URL}Branches`,
     UPDATE_BRANCHES: `${BASE_URL}Branches`,
     DELETE_BRANCHES: `${BASE_URL}Branches`, // Change Is active status

     //Employees
     EMPLOYEES: `${BASE_URL}Employees`,

     CONFIGURATIONS: `${BASE_URL}Configuration`,

     //Employee Template
     EMPLOYEE_TEMPLATES: `${BASE_URL}EmployeeTemplates`,
     GET_ALL_SELECTED_EMPLOYEES: `${BASE_URL}EmployeeTemplates/Employees`,
     GET_ALL_EMPLOYEE_CRITERIA: `${BASE_URL}EmployeeTemplates/EmployeeCriteria`,
     GET_ALL_EMPLOYEE_CRITERIA_DETAILS: `${BASE_URL}EmployeeTemplates/EmployeeCriteria/details`,

     //PayItem Group
     PAY_ITEM_GROUPS: `${BASE_URL}PayItemGroups`,
     PAY_ITEM_GROUPS_ARITHMETIC: `${BASE_URL}PayItemGroups/ArithmeticSigns`,

     //PayItem Group Details
     PAY_ITEM_GROUP_DETAILS: `${BASE_URL}PayItemGroupDetails`,

     //PayItem Calculation
     FORMULAS: `${BASE_URL}Formulas`,
     FUNCTIONS: `${BASE_URL}Formulas/Functions`,
     FORMULAS_Employees_Filter_Details: `${BASE_URL}Formulas/EmployeesFilterDetails`,

     //PayItem Calculations
     GET_ALL_PAY_ITEM_CALCULATIONS: `${BASE_URL}Formulas`,
     FIND_ONE_PAY_ITEM_CALCULATIONS: `${BASE_URL}Formulas`,
     REMOVE_PAY_ITEM_CALCULATIONS: `${BASE_URL}Formulas`,

     //User Roles
     USER_ROLES_PAGES: `${BASE_URL}UserRoles/Pages`,
     USER_ROLES: `${BASE_URL}UserRoles`,

     //Employee Group
     CREATE_EMPLOYEE_GROUP: `${BASE_URL}EmployeeGroups`,
     GET_ALL_EMPLOYEE_GROUP: `${BASE_URL}EmployeeGroups`,
     UPDATE_EMPLOYEE_GROUP: `${BASE_URL}EmployeeGroups`,
     DELETE_EMPLOYEE_GROUP: `${BASE_URL}EmployeeGroups`, // Change Is active status

     //Pay Item Period
     CREATE_PAY_ITEM_PERIODS: `${BASE_URL}PayItemPeriods`,
     GET_ALL_PAY_ITEM_PERIODS: `${BASE_URL}PayItemPeriods`,
     FIND_ONE_PAY_ITEM_PERIODS: `${BASE_URL}PayItemPeriods`,
     UPDATE_PAY_ITEM_PERIODS: `${BASE_URL}PayItemPeriods`,
     DELETE_PAY_ITEM_PERIODS: `${BASE_URL}PayItemPeriods`, // Change Is active status

     //Pay Item type
     CREATE_PAY_ITEM_TYPES: `${BASE_URL}PayItemTypes`,
     GET_ALL_PAY_ITEM_TYPES: `${BASE_URL}PayItemTypes`,
     FIND_ONE_PAY_ITEM_TYPES: `${BASE_URL}PayItemTypes`,
     UPDATE_PAY_ITEM_TYPES: `${BASE_URL}PayItemTypes`,
     DELETE_PAY_ITEM_TYPES: `${BASE_URL}PayItemTypes`, // Change Is active status

     //Payment Type
     CREATE_PAYMENT_TYPE: `${BASE_URL}PaymentTypes`,
     GET_ALL_PAYMENT_TYPE: `${BASE_URL}PaymentTypes`,
     FIND_ONE_PAYMENT_TYPE: `${BASE_URL}PaymentTypes`,
     UPDATE_PAYMENT_TYPE: `${BASE_URL}PaymentTypes`,
     DELETE_PAYMENT_TYPE: `${BASE_URL}PaymentTypes`, // Change Is active status

     //Process Period
     CREATE_PROCESS_PERIODS: `${BASE_URL}ProcessPeriods`,
     GET_ALL_PROCESS_PERIODS: `${BASE_URL}ProcessPeriods`,
     UPDATE_PROCESS_PERIODS: `${BASE_URL}ProcessPeriods`,
     DELETE_PROCESS_PERIODS: `${BASE_URL}ProcessPeriods`, // Change Is active status

     //Pay Roll Period
     CREATE_PAY_ROLL_PERIOD_DETAILS: `${BASE_URL}PayRollPeriods`,
     GET_ALL_PAY_ROLL_PERIOD_DETAILS: `${BASE_URL}PayRollPeriods`,
     UPDATE_PAY_ROLL_PERIOD_DETAILS: `${BASE_URL}PayRollPeriods`,
     DELETE_PAY_ROLL_PERIOD_DETAILS: `${BASE_URL}PayRollPeriods`, // Change Is active status

     STATUS_PAY_ROLL_PERIOD_DETAILS: `${BASE_URL}ChangePeriodStatus`, // Change Is active status

     GET_ALL_PAY_ROLL_PERIODS: `${BASE_URL}PayRollPeriods`,
     FIND_ONE_PAY_ROLL_PERIODS: `${BASE_URL}PayRollPeriods`,
     REMOVE_PAY_ROLL_PERIODS: `${BASE_URL}PayRollPeriods`,

     //Pay Item
     PAY_ITEMS: `${BASE_URL}PayItems`, // Change Is active status

     //Pay Item Parameter
     CREATE_PAY_ITEM_PARAMETERS: `${BASE_URL}PayItemParameter`,
     GET_ALL_PAY_ITEM_PARAMETERS: `${BASE_URL}PayItemParameter`,
     FIND_ONE_PAY_ITEM_PARAMETERS: `${BASE_URL}PayItemParameter`,
     UPDATE_PAY_ITEM_PARAMETERS: `${BASE_URL}PayItemParameter`,
     DELETE_PAY_ITEM_PARAMETERS: `${BASE_URL}PayItemParameter`, // Change Is active status

     //Pay Item Advance Parameter
     CREATE_PAY_ITEM_ADVANCE_PARAMETERS: `${BASE_URL}payItemAdvanceParameter`,
     GET_ALL_PAY_ITEM_ADVANCE_PARAMETERS: `${BASE_URL}payItemAdvanceParameter`,
     FIND_ONE_PAY_ITEM_ADVANCE_PARAMETERS: `${BASE_URL}payItemAdvanceParameter`,
     UPDATE_PAY_ITEM_ADVANCE_PARAMETERS: `${BASE_URL}payItemAdvanceParameter`,
     DELETE_PAY_ITEM_ADVANCE_PARAMETERS: `${BASE_URL}payItemAdvanceParameter`, // Change Is active status

     //Pay Item Advance Parameter Details
     CREATE_PAY_ITEM_ADVANCE_PARAMETER_DETAILS: `${BASE_URL}payItemAdvanceParameter`,
     GET_ALL_PAY_ITEM_ADVANCE_PARAMETER_DETAILS: `${BASE_URL}payItemAdvanceParameter`,
     FIND_ONE_PAY_ITEM_ADVANCE_PARAMETER_DETAILS: `${BASE_URL}payItemAdvanceParameter`,
     UPDATE_PAY_ITEM_ADVANCE_PARAMETER_DETAILS: `${BASE_URL}payItemAdvanceParameter`,
     DELETE_PAY_ITEM_ADVANCE_PARAMETER_DETAILS: `${BASE_URL}payItemAdvanceParameter`, // Change Is active status

     //Company Accounts  
     CREATE_COMPANY_ACCOUNTS: `${BASE_URL}companyAccounts`,
     GET_ALL_COMPANY_ACCOUNTS: `${BASE_URL}companyAccounts`,
     GET_ALL_COMPANY_ACCOUNTS_CATEGORIES: `${BASE_URL}companyAccounts/companyAccountsCategories`,
     FIND_ONE_COMPANY_ACCOUNTS: `${BASE_URL}companyAccounts`,
     UPDATE_COMPANY_ACCOUNTS: `${BASE_URL}companyAccounts`,
     DELETE_COMPANY_ACCOUNTS: `${BASE_URL}companyAccounts`, // Change Is active status

     //Payroll Process 
     CREATE_PAYROLL_PROCESS: `${BASE_URL}PayrollDefinitions`,
     GET_ALL_PAYROLL_PROCESS: `${BASE_URL}PayrollDefinitions`,
     FIND_ONE_PAYROLL_PROCESS: `${BASE_URL}PayrollDefinitions`,

     PAYROLL_PROCESS: `${BASE_URL}PayrollDefinitions`,

     PAYROLL_PROCESS_COMPANY_ACCOUNTS: `${BASE_URL}PayrollDefinitions`,
     PAYROLL_PROCESS_PAYROLL_PAY_ITEM: `${BASE_URL}PayrollDefinitions`,
     PAYROLL_PROCESS_PAYROLL_BANK_DISKETTE: `${BASE_URL}PayrollDefinitions`,
     PAYROLL_PROCESS_EMPLOYEES_TO_PAY_ITEMS: `${BASE_URL}PayrollDefinitions`,
     PAYROLL_PROCESS_SALARY: `${BASE_URL}PayrollDefinitions`,
     PAYROLL_PROCESS_PAY_ITEMS_TO_EMPLOYEES: `${BASE_URL}PayrollDefinitions`,
     UPDATE_PAYROLL_PROCESS: `${BASE_URL}PayrollDefinitions`,
     PATCH_PAYROLL_PROCESS: `${BASE_URL}PayrollDefinitions`,
     UPDATE_PAYROLL_PAY_ITEM_TO_BANK_DISKETTE: `${BASE_URL}PayrollDefinitions`,
     PAYROLL_PROCESS_PAYROLL_LOAN_TYPE: `${BASE_URL}PayrollDefinitions`,
     PAYROLL_PROCESS_LOANS_EMPLOYEES: `${BASE_URL}PayrollDefinitions`,
     PAYROLL_PROCESS_PAYROLL_DEDUCTIONS: `${BASE_URL}PayrollDefinitions`,
     PAYROLL_PROCESS_PAYROLL_TAKE_PROFIT: `${BASE_URL}PayrollDefinitions`,
     DELETE_PAYROLL_PROCESS: `${BASE_URL}PayrollDefinitions`, // Change Is active status

     //Payroll Parameters  
     CREATE_PAYROLL_PARAMETERS: `${BASE_URL}payrollParameter`,
     GET_ALL_PAYROLL_PARAMETERS: `${BASE_URL}payrollParameter`,
     PAYROLL_PARAMETERS_DATA_TYPES: `${BASE_URL}payrollParameter/payrollParameterDataTypes`,
     FIND_ONE_PAYROLL_PARAMETERS: `${BASE_URL}payrollParameter`,
     UPDATE_PAYROLL_PARAMETERS: `${BASE_URL}payrollParameter`,
     DELETE_PAYROLL_PARAMETERS: `${BASE_URL}payrollParameter`, // Change Is active status

     EMPLOYEE_PARAMETERS_DATA_TYPES: `${BASE_URL}employeeParameter/employeeParameterDataTypes`,
     EMPLOYEE_PARAMETERS: `${BASE_URL}employeeParameter`,

     //Payroll Pay Items
     CREATE_PAYROLL_PAY_ITEM: `${BASE_URL}payrollPayItem`,
     GET_ALL_PAYROLL_PAY_ITEM: `${BASE_URL}payrollPayItem`,
     FIND_ONE_PAYROLL_PAY_ITEM: `${BASE_URL}payrollPayItem`,
     PAYROLL_PAY_ITEM_EMPLOYEES_TO_PAY_ITEMS: `${BASE_URL}payrollPayItem`,
     PAYROLL_PAY_ITEM_SALARY: `${BASE_URL}payrollPayItem`,
     PAYROLL_PAY_ITEM_PAY_ITEMS_TO_EMPLOYEES: `${BASE_URL}payrollPayItem`,
     UPDATE_PAYROLL_PAY_ITEM: `${BASE_URL}payrollPayItem`,
     DELETE_PAYROLL_PAY_ITEM: `${BASE_URL}payrollPayItem`, // Change Is active status

     //Employees To Pay Items
     CREATE_EMPLOYEES_TO_PAY_ITEMS: `${BASE_URL}employeesToPayItems`,
     GET_ALL_EMPLOYEES_TO_PAY_ITEMS: `${BASE_URL}employeesToPayItems`,
     FIND_ONE_EMPLOYEES_TO_PAY_ITEMS: `${BASE_URL}employeesToPayItems`,
     UPDATE_EMPLOYEES_TO_PAY_ITEMS: `${BASE_URL}employeesToPayItems`,
     UPDATE_EMPLOYEES_TO_PAY_ITEMS_WITH_SALARY_STATUS: `${BASE_URL}employeesToPayItems`,
     DELETE_EMPLOYEES_TO_PAY_ITEMS: `${BASE_URL}employeesToPayItems/delete`, // Change Is active status

     CREATE_EMPLOYEES_TO_PAY_ITEMS_EXCEL: `${BASE_URL}employeesToPayItems/Excel`, // Change Is active status
     INVALID_EMPLOYEE_TO_PAY_ITEMS: `${BASE_URL}employeesToPayItems/Excel`, // Change Is active status

     //Pay Items To Employees
     CREATE_PAY_ITEMS_TO_EMPLOYEES: `${BASE_URL}payItemsToEmployees`,
     GET_ALL_PAY_ITEMS_TO_EMPLOYEES: `${BASE_URL}payItemsToEmployees`,
     FIND_ONE_PAY_ITEMS_TO_EMPLOYEES: `${BASE_URL}payItemsToEmployees`,
     UPDATE_PAY_ITEMS_TO_EMPLOYEES: `${BASE_URL}payItemsToEmployees`,
     DELETE_PAY_ITEMS_TO_EMPLOYEES: `${BASE_URL}payItemsToEmployees`, // Change Is active status

     BANK_FILE_FORMAT: `${BASE_URL}bankFileLineFormat`,
     BANK_FILE_CONFIG: `${BASE_URL}bankFileConfigurator`,

     //Label Configuration
     LABEL_CONFIGURATION: `${BASE_URL}labelConfiguration`,
     USER_LABEL_CONFIGURATION: `${BASE_URL}labelConfiguration/user`,

     STATIC_FILES: `${BASE_STATIC_URL}StaticFiles`,

     //Bank Diskette Line Types
     BANK_DISKETTE_LINE_TYPE: `${BASE_URL}BankDisketteLineType`,

     PAYROLL_PROCESSING: `${BASE_URL}PayrollProcess`,

     //BankFiles
     CREATE_BANK_FILES: `${BASE_URL}BankFile`,
     GET_ALL_BANK_FILES: `${BASE_URL}BankFile`,
     FIND_ONE_BANK_FILES: `${BASE_URL}BankFile`,
     BANK_FILE_BANK_CONFIGURATORS: `${BASE_URL}BankFile`,
     UPDATE_BANK_FILES: `${BASE_URL}BankFile`,
     DELETE_BANK_FILES: `${BASE_URL}BankFile`, // Change Is active status

     //BankFileConfigurators
     CREATE_BANK_FILE_CONFIGURATORS: `${BASE_URL}BankFileConfigurator`,
     GET_ALL_BANK_FILE_CONFIGURATORS: `${BASE_URL}BankFileConfigurator`,
     FIND_ONE_BANK_FILE_CONFIGURATORS: `${BASE_URL}BankFileConfigurator`,
     UPDATE_BANK_FILE_CONFIGURATORS: `${BASE_URL}BankFileConfigurator`,
     UPDATE_PAYROLL_PAY_ITEM_TO_CONFIGURATOR_LINE_TYPE: `${BASE_URL}BankFileConfigurator`,
     DELETE_BANK_FILE_CONFIGURATORS: `${BASE_URL}BankFileConfigurator`, // Change Is active status

     //Payroll Bank Diskettes
     CREATE_PAYROLL_BANK_DISKETTES: `${BASE_URL}payrollBankDiskette`,
     GET_ALL_PAYROLL_BANK_DISKETTES: `${BASE_URL}payrollBankDiskette`,
     FIND_ONE_PAYROLL_BANK_DISKETTES: `${BASE_URL}payrollBankDiskette`,
     UPDATE_PAYROLL_BANK_DISKETTES: `${BASE_URL}payrollBankDiskette`,
     DELETE_PAYROLL_BANK_DISKETTES: `${BASE_URL}payrollBankDiskette`, // Change Is active status

     GENERATE_BANK_DISKETTES: `${BASE_URL}generateBankDiskette`, // Change Is active status

     //Salary Increment
     CREATE_SALARIES: `${BASE_URL}salary`,
     GET_ALL_SALARIES: `${BASE_URL}salary`,
     FIND_ONE_SALARIES: `${BASE_URL}salary`,
     UPDATE_SALARIES: `${BASE_URL}salary`,
     CREATE_SALARY_LIST: `${BASE_URL}salary`,
     UPDATE_SALARY_STATUS: `${BASE_URL}salary`,
     UPDATE_SALARY_ROLLBACK: `${BASE_URL}salary`,
     DELETE_SALARIES: `${BASE_URL}salary`, // Change Is active status

     CREATE_SALARY_EXCEL: `${BASE_URL}salary/Excel`, // Change Is active status
     INVALID_SALARY: `${BASE_URL}salary/Excel`, // Change Is active status

     QUICK_REPORTS: `${BASE_URL}quickReports`,
     REPORTS: `${BASE_URL}reports`,

     DASHBOARD: `${BASE_URL}dashboard`,

     //Loan Type
     CREATE_LOAN_TYPE: `${BASE_URL}LoanType`,
     GET_ALL_LOAN_TYPE: `${BASE_URL}LoanType`,
     GET_ALL_LOAN_CALCULATION_LOGIC_TYPES: `${BASE_URL}LoanType/LoanCalculationLogicTypes`,
     FIND_ONE_LOAN_TYPE: `${BASE_URL}LoanType`,
     UPDATE_LOAN_TYPE: `${BASE_URL}LoanType`,
     DELETE_LOAN_TYPE: `${BASE_URL}LoanType`, // Change Is active status

     //Payroll Loan Types
     CREATE_PAYROLL_LOAN_TYPE: `${BASE_URL}payrollLoanType`,
     GET_ALL_PAYROLL_LOAN_TYPE: `${BASE_URL}payrollLoanType`,
     FIND_ONE_PAYROLL_LOAN_TYPE: `${BASE_URL}payrollLoanType`,
     UPDATE_PAYROLL_LOAN_TYPE: `${BASE_URL}payrollLoanType`,
     DELETE_PAYROLL_LOAN_TYPE: `${BASE_URL}payrollLoanType`, // Change Is active status

     //Loans To Employees
     CREATE_LOANS_TO_EMPLOYEES: `${BASE_URL}loansToEmployees`,
     CREATE_L0AN_LIST: `${BASE_URL}loansToEmployees`,
     GET_ALL_LOANS_TO_EMPLOYEES: `${BASE_URL}loansToEmployees`,
     FIND_ONE_LOANS_TO_EMPLOYEES: `${BASE_URL}loansToEmployees`,
     UPDATE_LOANS_TO_EMPLOYEES: `${BASE_URL}loansToEmployees`,
     DELETE_LOANS_TO_EMPLOYEES: `${BASE_URL}loansToEmployees`, // Change Is active status

     CREATE_LOAN_EXCEL: `${BASE_URL}loansToEmployees/Excel`,
     INVALID_LOAN: `${BASE_URL}loansToEmployees/Excel`,

     //Payroll Deductions
     CREATE_PAYROLL_DEDUCTIONS: `${BASE_URL}payrollDeductions`,
     GET_ALL_PAYROLL_DEDUCTIONS: `${BASE_URL}payrollDeductions`,
     FIND_ONE_PAYROLL_DEDUCTIONS: `${BASE_URL}payrollDeductions`,
     UPDATE_PAYROLL_DEDUCTIONS: `${BASE_URL}payrollDeductions`,
     DELETE_PAYROLL_DEDUCTIONS: `${BASE_URL}payrollDeductions`, // Change Is active status

     //Payroll TakeProfit
     CREATE_PAYROLL_TAKE_PROFIT: `${BASE_URL}payrollTakeProfit`,
     GET_ALL_PAYROLL_TAKE_PROFIT: `${BASE_URL}payrollTakeProfit`,
     FIND_ONE_PAYROLL_TAKE_PROFIT: `${BASE_URL}payrollTakeProfit`,
     UPDATE_PAYROLL_TAKE_PROFIT: `${BASE_URL}payrollTakeProfit`,
     DELETE_PAYROLL_TAKE_PROFIT: `${BASE_URL}payrollTakeProfit`, // Change Is active status
 }