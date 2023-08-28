export const SET_BANK_FILE = "SET_BANK_FILE";

export function setBankFile(bankFile) {
    return dispatch => {
        dispatch({
            type: SET_BANK_FILE,
            data: bankFile
        });
    };
}