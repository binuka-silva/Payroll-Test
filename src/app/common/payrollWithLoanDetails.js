export const setPayrollDetailsData = (details, loanTypeData = null) => {

    let payrollLoanTypes = [];
    if (loanTypeData) {
        payrollLoanTypes = details.payrollLoanTypePageHeader?.payrollLoanType?.filter((v) => v.active === true).map((payrollLoanType) => {
            const loanType = loanTypeData.find((v) => v.value === payrollLoanType.loanTypeId);
            return {
                id: payrollLoanType.id,
                label: loanType?.label,
                loanTypeCode: loanType?.code,
                name: loanType?.name,
                maxAmount: loanType?.maxAmount,
                maxInstalments: loanType?.maxInstalments,
                interestRate: loanType?.interestRate,
                active: loanType?.active,
                allowMultiple: loanType?.allowMultiple,
            };
        });
    }

    const empData = details.selectedEmployeesPageHeader?.map((emp) => ({

        id: emp.id,
        value: emp.id,
        label: emp.empNo,
        empNo: emp.empNo,
        empName: emp.employeeName,
        designation: emp.empPosCode,
        organization: emp.companyId,
        employeeType: emp.employmentType,
        employeeCategory: emp.empCatName,
        isActive: emp.employeeStatus,
        isProcessedInactive: emp.isProcessedInactive ?? false,
        employmentDate: emp.employmentDate,
    }));

    const loans = details.loansEmployeesPageHader?.loansToEmployees?.map((sal) => ({
        id: sal.id,
        amount: sal.amount,
        instalments: sal.instalments,
        monthlyEmis: sal.monthlyEmis,
        effectiveDate: sal.effectiveDate?.split("T")[0],
        applyDate: sal.applyDate?.split("T")[0],
        active: sal.active,
        sequence: sal.sequence,
        employee: empData?.find((v) => v.value === sal.employeeId)?.label,
        empName: empData?.find((v) => v.value === sal.employeeId)?.empName,
        payrollLoanTypeCode: payrollLoanTypes?.find((v) => v.id === sal?.payrollLoanTypeId)?.loanTypeCode,
    }));

    return {empData, payrollLoanTypes, loans};
}
