import React from "react";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import axios from "axios";

const payRollPeriodStatusChangeService = () => {
    const changeStatus = (data) => {
        let patchObj = [{
            "path": "periodProcess",
            "op": "replace",
            "value": data.value
        }];

        return axios.patch(`${API_CONFIGURATIONS.STATUS_PAY_ROLL_PERIOD_DETAILS}/${data.id}`, patchObj, {
            withCredentials: true
        });
    };

    return {
        changeStatus,
    };
};

export default payRollPeriodStatusChangeService;