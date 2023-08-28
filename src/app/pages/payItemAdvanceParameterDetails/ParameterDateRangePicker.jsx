import * as React from 'react';
import {DateRangePicker} from "rsuite";

export default function ParameterDateRangePicker({dateRangeFunc, startDate, endDate}) {

    const handleSubmit = ([validFrom, validTo]) => {
        dateRangeFunc([
            (validFrom.getMonth() + 1) + "/" + validFrom.getDate() + "/" + validFrom.getFullYear(),
            (validTo.getMonth() + 1) + "/" + validTo.getDate() + "/" + validTo.getFullYear(),
        ]);
    };

    return (
        <DateRangePicker
            size="sm"
            placeholder="Valid From - Valid To"
            appearance="subtle"
            style={{width: 300}}
            onOk={handleSubmit}
            defaultValue={[startDate, endDate]}
        />
    );
}
