import * as React from 'react';
import {DateRangePicker} from "rsuite";

export default function UserDateRangePicker({dateRangeFunc, startDate, endDate}) {
    const handleSubmit = ([validFrom, validTo]) => {
        dateRangeFunc([
            validFrom.toLocaleDateString(),
            validTo.toLocaleDateString(),
        ]);
    };
    return (
        <DateRangePicker size="sm" placeholder="Validity Period" appearance="subtle" defaultValue={[startDate, endDate]}
                         style={{width: 230}} onOk={handleSubmit}/>
    );
}
