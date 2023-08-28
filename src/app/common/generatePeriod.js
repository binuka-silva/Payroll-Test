import moment from "moment";

export default function generatePeriod(period, payDay, tax, selectedDate, extendStart) {
    let startDate;
    let endDate;

    if (extendStart) {
        startDate = extendStart;
        endDate = moment(extendStart, "DD.MM.YYYY").add(1, "years").format("DD.MM.YYYY");
    } else {
        startDate = moment(selectedDate).format("DD.MM.YYYY");
        endDate = moment(selectedDate).add(1, "years").format("DD.MM.YYYY");
    }
    switch (period) {
        case "month":
            return getMonths(
                moment(startDate, "DD.MM.YYYY"),
                moment(endDate, "DD.MM.YYYY"),
                parseInt(payDay), tax, selectedDate, extendStart
            );
        case "week":
            return getWeeks(
                moment(startDate, "DD.MM.YYYY"),
                moment(endDate, "DD.MM.YYYY"),
                parseInt(payDay), tax, selectedDate, extendStart
            );
        case "biweek":
            return getBiWeeks(
                moment(startDate, "DD.MM.YYYY"),
                moment(endDate, "DD.MM.YYYY"),
                parseInt(payDay), tax, selectedDate, extendStart
            );
        case "day":
            return getDates(
                moment(startDate, "DD.MM.YYYY"),
                moment(endDate, "DD.MM.YYYY"),
                parseInt(payDay), tax, selectedDate, extendStart
            );

        default:
            break;
    }
}

const getMonths = (start, end, paymentDate, tax, selectedDate, extendDate) => {
    const monthPayPeriods = [];
    let year;
    if (extendDate) {
        year = moment(extendDate).format("YYYY");
    } else {
        year = moment(selectedDate).format("YYYY");
    }

    const firstMonth = moment(year).startOf("year");
    Array.from({ length: end.diff(start, "month") }).map((_, index) => {
        const periodNo = index + 1;

        const dateFrom = moment(start).add(index, "month").format("YYYY-MM-DD");

        const dateTo = moment(start)
            .add(index + 1, "month")
            .subtract(1, "days")
            .format("YYYY-MM-DD");

        const taxPeriod = moment(firstMonth)
            .subtract(parseInt(tax), "months")
            .add(index, "month")
            .format("YYYY-MM");

        const accountingPeriod = moment(start)
            .add(index, "month")
            .format("YYYY-MM");

        const dateFromMoment = moment(start).add(index, "month");

        let payDate;
        let payDay;

        if (paymentDate < dateFromMoment.date()) {
            const lstMonth = monthPayPeriods.find(
                (month) => parseInt(month.payDate.split("-")[1]) === 12
            );
            if (lstMonth) {
                payDate = `${parseInt(year) + 1}-${
                    dateTo.split("-")[1]
                }-${paymentDate}`;
                payDay = moment(payDate).format("dddd");
            } else {
                payDate = `${year}-${dateTo.split("-")[1]}-${paymentDate}`;
                payDay = moment(payDate).format("dddd");
            }
        } else {
            payDate = moment([year, start.month(), paymentDate])
                .add(index, "months")
                .format("YYYY-MM-DD");

            payDay = moment([year, start.month(), paymentDate])
                .add(index, "months")
                .format("dddd");
        }

        monthPayPeriods.push({
            periodNo,
            dateFrom,
            dateTo,
            taxPeriod,
            accountingPeriod,
            payDate,
            payDay,
        });
    });

    return monthPayPeriods;
};

const getWeeks = (start, end, paymentDate, tax, selectedDate, extendDate) => {
    const weekPayPeriods = [];
    const firstMonthOfSelectedDateYear = moment(start)
        .startOf("years")
        .format("YYYY-MM");
    let selectedCurrentWeek = moment(start).week();
    let startWeekTaxPeriodOfCurrentYear = moment(start)
        .add(parseInt(tax), "month")
        .week();
    let actualStartWeekNumberTax =
        startWeekTaxPeriodOfCurrentYear - selectedCurrentWeek;

    let x = 0;
    let y = actualStartWeekNumberTax;

    Array.from({ length: end.diff(start, "weeks") + 1 }).map((_, index) => {
        const periodNo = index + 1;

        const dateFrom = moment(start).add(index, "weeks").format("YYYY-MM-DD");

        const dateTo = moment(start)
            .add(periodNo, "weeks")
            .subtract(1, "days")
            .format("YYYY-MM-DD");

        const accountingPeriod = moment(start)
            .add(index, "weeks")
            .format("YYYY-MM");

        let taxPeriod;

        if (periodNo > actualStartWeekNumberTax) {
            taxPeriod = moment(firstMonthOfSelectedDateYear)
                .add(x, "weeks")
                .format("YYYY-MM");
            x++;
        } else {
            taxPeriod = moment(firstMonthOfSelectedDateYear)
                .subtract(y, "weeks")
                .format("YYYY-MM");
            y--;
        }

        const dateFromMoment = moment(start).add(index, "week");
        const dateMoment = moment(start).add(index, "week").day();

        let payDate;
        let payDay;

        if (paymentDate >= dateMoment) {
            payDate = moment(dateFrom).day(paymentDate).format("YYYY-MM-DD");
            payDay = moment(dateFrom).day(paymentDate).format("dddd");
        } else {
            payDate = moment(dateFrom)
                .add(1, "week")
                .day(paymentDate)
                .format("YYYY-MM-DD");
            payDay = moment(dateFrom)
                .add(1, "week")
                .day(paymentDate)
                .format("dddd");
        }

        weekPayPeriods.push({
            periodNo,
            dateFrom,
            dateTo,
            taxPeriod,
            accountingPeriod,
            payDate,
            payDay,
        });
    });
    return weekPayPeriods;
};

const getBiWeeks = (start, end, paymentDate, tax, selectedDate, extendDate) => {
    const biWeekPayPeriods = [];
    const firstMonthOfSelectedDateYear = moment(start)
        .startOf("years")
        .format("YYYY-MM");
    let selectedCurrentWeek = moment(start).week();
    let startWeekTaxPeriodOfCurrentYear = moment(start)
        .add(parseInt(tax), "month")
        .week();
    let actualStartWeekNumberTax =
        startWeekTaxPeriodOfCurrentYear - selectedCurrentWeek;

    let x = 0;
    let y = actualStartWeekNumberTax;
    let a = "";
    Array.from({ length: (end.diff(start, "weeks") + 1) / 2 }).map((_, index) => {
        const periodNo = index + 1;

        const dateFrom = a === "" ? moment(start).add(index, "weeks").format("YYYY-MM-DD") : moment(a).add(1, "days").format("YYYY-MM-DD");

        const dateTo = moment(dateFrom)
            .add(2, "weeks")
            .subtract(1, "days")
            .format("YYYY-MM-DD");
        a = dateTo

        const accountingPeriod = a === "" ? moment(start).add(index, "weeks").format("YYYY-MM") : moment(a).add(1, "days").format("YYYY-MM");

        let taxPeriod;

        if (periodNo > actualStartWeekNumberTax) {
            taxPeriod = moment(firstMonthOfSelectedDateYear)
                .add(x, "weeks")
                .format("YYYY-MM");
            x++;
        } else {
            taxPeriod = moment(firstMonthOfSelectedDateYear)
                .subtract(y, "weeks")
                .format("YYYY-MM");
            y--;
        }

        const dateFromMoment = moment(start).add(index, "week");
        const dateMoment = a === "" ? moment(start).add(index, "weeks").day() : moment(a).add(1, "days").day();

        let payDate;
        let payDay;

        if (paymentDate >= dateMoment) {
            payDate = moment(dateFrom).day(paymentDate).format("YYYY-MM-DD");
            payDay = moment(dateFrom).day(paymentDate).format("dddd");
        } else {
            payDate = moment(dateFrom)
                .add(2, "weeks")
                .day(paymentDate)
                .format("YYYY-MM-DD");
            payDay = moment(dateFrom)
                .add(2, "weeks")
                .day(paymentDate)
                .format("dddd");
        }

        biWeekPayPeriods.push({
            periodNo,
            dateFrom,
            dateTo,
            taxPeriod,
            accountingPeriod,
            payDate,
            payDay,
        });
    });
    return biWeekPayPeriods;
};

const getDates = (start, end, paymentDate, tax, selectedDate, extendDate) => {
    const datePayPeriods = [];
    const firstMonth = moment().startOf("year");
    let periodNo = 0;
    Array.from({ length: end.diff(start, "day") + 1 }).map((_, index) => {
        periodNo++;

        const dateFrom = moment(start).add(index, "day").format("YYYY-MM-DD");

        const dateTo = moment(start).add(index, "day").format("YYYY-MM-DD");

        const taxPeriod = moment(firstMonth)
            .subtract(parseInt(tax), "months")
            .add(index, "week")
            .format("YYYY-MM");

        const accountingPeriod = moment(start)
            .add(index, "day")
            .format("YYYY-MM");

        const payDate = moment(start).add(index, "day").format("YYYY-MM-DD");

        const payDay = moment(start).add(index, "day").format("dddd");

        datePayPeriods.push({
            periodNo,
            dateFrom,
            dateTo,
            taxPeriod,
            accountingPeriod,
            payDate,
            payDay,
        });
    });
    return datePayPeriods;
};