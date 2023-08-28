export default () => {
    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (e) => {
        const {data, tempData, lineTypeList} = e.data;

        const fieldTypesArray = ["EmployeeName", "Name7", "InsuranceId", "BankId", "BranchId", "AccountNumber", "sequence", "amount"];

        const functionCodesArray = ["29"];

        //Get Unique Array
        const temp = tempData
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex((t) => {
                        const keys = Object.keys(value);
                        const uniq = keys.filter(
                            (key) =>
                                fieldTypesArray.includes(key) ||
                                functionCodesArray.includes(key)
                        );
                        const isDuplicate = [];
                        uniq.forEach((key) => isDuplicate.push(t[key] === value[key]));
                        return isDuplicate.filter((u) => !u)?.length <= 0;
                    })
            );

        postMessage({
            tableData: temp, resData: data, lineTypeList
        });
    }
}
