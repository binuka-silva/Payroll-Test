import localStorageService from "../services/localStorageService";
import configurationService from "../api/configurationServices/configurationService";

export default async function handlePageSize(pageSize, path) {
    try {
        const sessionObj = localStorageService.getItem("auth_user")
        const reqObj = {...JSON.parse(sessionObj?.tablePageCount), [path]: pageSize};
        sessionObj.tablePageCount = JSON.stringify(reqObj);

        const formData = new FormData();
        formData.append("tablePageCount", JSON.stringify(reqObj))
        const {data} = await configurationService().update(formData);
        localStorageService.setItem("auth_user", sessionObj)
    } catch (e) {
        console.error(e);
    }
}