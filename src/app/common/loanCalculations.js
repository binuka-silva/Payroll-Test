export function fixedInterestLoan(amount, yearlyRate, months) {
    const rateAsDecimal = yearlyRate / 100;
    const interest = amount * rateAsDecimal * months / 12;
    const totalPayable = roundToCeiling(amount + interest, 0.01);

    let monthlyEmiList = [];
    for (let i = 1; i <= months; i++) {
        monthlyEmiList.push({
            no: i,
            interest: roundToCeiling(interest / months, 0.01),
            principal: roundToCeiling(amount / months, 0.01)
        });
    }

    return {
        totalInterest: roundToCeiling(interest, 0.01),
        monthlyEmi: monthlyEmiList,
        totalPayable: totalPayable
    };
}

export function reducingBalanceLoan(amount, yearlyRate, months) {
    const rateAsDecimal = yearlyRate / 100;
    const principal = roundToCeiling(amount / months, 0.01);

    const monthlyEmiList = [];
    let tempAmount = amount;
    let totalInterest = 0;
    for (let i = 1; i <= months; i++) {
        let interest = roundToCeiling(tempAmount * rateAsDecimal / 12, 0.01);
        monthlyEmiList.push({No: i, principal, interest});

        totalInterest += interest;
        tempAmount -= principal;
    }

    return {
        monthlyEmi: monthlyEmiList,
        totalInterest: roundToCeiling(totalInterest, 0.01),
        totalPayable: roundToCeiling(amount + totalInterest, 0.01)
    };
}

export function reducingBalanceLoanPmt(amount, yearlyRate, months) {
    const periodicInterestRate = yearlyRate / (100 * 12);
    const monthlyEmiModel = roundToCeiling(amount * periodicInterestRate / (1 - Math.pow(1 + periodicInterestRate, -months)), 0.01);
    const totalInterest = roundToCeiling(monthlyEmiModel * months - amount, 0.01);

    const monthlyEmiList = [];
    let tempAmount = amount;
    for (let i = 1; i <= months; i++) {
        let interest = roundToCeiling(tempAmount * periodicInterestRate, 0.01);
        let principal = roundToCeiling(monthlyEmiModel - interest, 0.01);
        monthlyEmiList.push({No: i, interest, principal});
        tempAmount -= principal;
    }

    return {
        monthlyEmi: monthlyEmiList,
        totalInterest: totalInterest,
        totalPayable: amount + totalInterest
    };
}

export function roundToCeiling(value, decimalPoints) {
    let count = String(decimalPoints).split(".")[1].length;
    let multiplier = Math.pow(10, count);
    return Math.ceil(value * multiplier) / multiplier;
}
