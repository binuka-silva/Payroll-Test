import axios from "axios";
import localStorageService from "../../services/localStorageService";
import {API_CONFIGURATIONS} from "../constants/apiConfigurations";
import history from "../../../@history";
import {removeCookie, setCookie} from "../../common/cookieService";
import {PublicClientApplication} from "@azure/msal-browser";
import {azureAdConfigs} from "../../pages/sessions/constant";

class AuthService {
    user = {
        userId: "1",
        role: 'ADMIN',
        displayName: "Watson Joyce",
        email: "watsonjoyce@gmail.com",
        photoURL: "/assets/images/face-7.jpg",
        age: 25,
        token: "faslkhfh423oiu4h4kj432rkj23h432u49ufjaklj423h4jkhkjh"
    }

    constructor() {
        this.publicClientApplication = new PublicClientApplication({
            auth: {
                clientId: azureAdConfigs.appId,
                redirectUri: azureAdConfigs.redirectUri,
            },
            cache: {
                cacheLocation: "localStorage",
                storeAuthStateInCookie: false
            }
        });
    }

    loginWithEmailAndPassword = (credentials) => {
        const loginBody = {
            email: credentials.email,
            password: credentials.password
        }
        return axios.post(API_CONFIGURATIONS.AUTH_USER, loginBody, {
            withCredentials: true
        }).then(resp => {
            if (resp.status === 202) {
                history.push(`/session/reset-password?code=${resp.data.token}&id=${resp.data.id}`)
            } else {
                return this.setAuthDetails(resp.data);
            }
        }).catch(e => {
            console.error(e);
            return {auth: false, error: e};
        })
    };

    loginWithToken = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.user);
            }, 100);
        }).then(data => {
            this.setSession(data.token);
            this.setUser(data);
            return data;
        });
    };

    loginWithAzureAd = async () => {
        try {
            const {account, idToken, accessToken} = await this.publicClientApplication.loginPopup({
                scopes: azureAdConfigs.scopes,
                prompt: "select_account"
            });

            const resp = await axios.post(`${API_CONFIGURATIONS.AUTH_USER}/sso`, {}, {
                withCredentials: true,
                headers: {
                    "Authorization": "Bearer " + idToken
                }
            });
            this.setSession(accessToken);

            return this.setAuthDetails(resp.data, account.homeAccountId);
        } catch (e) {
            console.error(e);
            return {auth: false, error: e};
        }
    }

    logout = async () => {
        try {
            const currentAccount = this.publicClientApplication.getAccountByHomeId(localStorageService.getItem("auth_user")?.homeAccountId);
            await this.publicClientApplication.logoutRedirect({
                account: currentAccount,
                postLogoutRedirectUri: azureAdConfigs.redirectUri,
                onRedirectNavigate: (url) => false
            });

            await axios.delete(API_CONFIGURATIONS.AUTH_USER, {
                withCredentials: true
            });

            removeCookie("isAuth");
            removeCookie("reportLoggedIn");
            this.setSession(null);
            this.removeUser();
        } catch(e){
            console.error(e);
        }
    }

    setAuthDetails = (data, homeAccountId) => {
        data.labels = data.labels.map((labelConfig) => ({
            labelId: labelConfig.id,
            permissionPage: labelConfig.permissionPage,
            editedLabel: labelConfig.editedLabel,
            label: labelConfig.labelName,
        }));
        homeAccountId && (data.homeAccountId = homeAccountId);

        localStorageService.setItem("label_list", data.labels);
        document.title = data.appTitle ?? "Payroll";

        setCookie("isAuth", true, 0);
        this.setUser(data);
        return {auth: true, data};
    }

    setSession = token => {
        if (token) {
            localStorageService.setItem("jwt_token", token);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        } else {
            localStorageService.clearStorage();
            delete axios.defaults.headers.common["Authorization"];
        }
    };
    setUser = (user) => {
        localStorageService.setItem("auth_user", user);
    }
    removeUser = () => {
        localStorageService.removeItem("auth_user");
    }
}

export const signup = async (data) => {
    return await axios.post(API_CONFIGURATIONS.USERS, data);
}

export const resetPassword = async (data) => {
    return await axios.post(API_CONFIGURATIONS.RESET_PASSWORD_USER, data);
}

export const forgotPassword = async (email) => {
    return await axios.post(API_CONFIGURATIONS.FORGOT_PASSWORD_USER, "", {
        params: {
            email
        }
    })
}

export default new AuthService();
