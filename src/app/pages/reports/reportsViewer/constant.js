export const payrollPeriodProcess = {
    OPEN: 1,
    PROCESSED: 2,
    CLOSE: 3,
    APPROVED: 4
};

export const exportType = {
    ONLY_VIEW: 0,
    PDF: 1,
    EXCEL: 2,
}

export const modalParams = ["@payrollId", '@dateFrom', '@dateTo'];

export const requestPath = "/reports/viewer";

export const reportIdQuery = "rp_id";
export const tokenQuery = "token";
