export const setPayrollDetailsData = (details, payItemsData = null) => {
    let payrollPayItems = [];
    if (payItemsData) {
        payrollPayItems = details.payrollPayItemPageHeader?.payrollPayItems?.filter((v) => v.active === true).map((payrollPayItem) => {
            const payItem = payItemsData.find((v) => v.id === payrollPayItem.payItemId);
            return {
                id: payrollPayItem.id,
                payItemCode: payItem?.code,
                name: payItem?.name
            }
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

    const employeesPayItems =
        details.employeesPayItemsPageHader?.employeesToPayItems?.map(
            (employeesToPayItem) => ({
                id: employeesToPayItem.id,
                amount: employeesToPayItem.amount,
                units: employeesToPayItem.units,
                employerAmount: employeesToPayItem.employerAmount,
                startDate: employeesToPayItem.startDate?.split("T")[0],
                endDate: employeesToPayItem.endDate?.split("T")[0],
                employee: empData?.find((v) => v.id === employeesToPayItem?.employeeId)?.empNo,
                empName: empData?.find((v) => v.id === employeesToPayItem?.employeeId)?.empName,
                oldValue: employeesToPayItem.amount,
                payrollPayItemId: employeesToPayItem.payrollPayItemId,
                payrollPayItemCode: payrollPayItems?.find((v) => v.id === employeesToPayItem?.payrollPayItemId)?.payItemCode,

            })
        );

    const salaries = details.salaryPageHader?.salary?.map((sal) => ({
        id: sal.id,
        value: sal.value,
        oldValue: sal.oldValue,
        newValue: sal.newValue,
        arrearsAmount: sal.arrearsAmount,
        isPercentage: sal.isPercentage,
        effectiveDate: sal.effectiveDate?.split("T")[0],
        employee: empData?.find((v) => v.value === sal.employeeId)?.label,
        empName: empData?.find((v) => v.value === sal.employeeId)?.empName,
        payrollPayItemCode: payrollPayItems?.find((v) => v.id === sal?.payrollPayItemId)?.payItemCode,
    }));

    return {empData, payrollPayItems, employeesPayItems, salaries}
}
