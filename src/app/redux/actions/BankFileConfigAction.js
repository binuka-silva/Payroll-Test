export const SET_BANK_FILE_CONFIG = "SET_BANK_FILE_CONFIG";

export function setBankFileConfig(bankFile) {
    return dispatch => {
        dispatch({
            type: SET_BANK_FILE_CONFIG,
            data: bankFile
        });
    };
}