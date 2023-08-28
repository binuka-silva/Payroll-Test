export const SET_PAY_ROLL_PERIODS_DETAILS = "SET_PAY_ROLL_PERIODS_DETAILS";

export function setPayRollPeriodsDetails(payRollPeriodsDetail) {
    return dispatch => {
        dispatch({
            type: SET_PAY_ROLL_PERIODS_DETAILS,
            data: payRollPeriodsDetail
        });
    };
}