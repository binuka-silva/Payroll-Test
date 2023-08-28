export const azureAdConfigs = {
    appId: process.env.REACT_APP_AZURE_AD_CONFIGS_APP_ID,
    redirectUri: process.env.REACT_APP_AZURE_AD_CONFIGS_REDIRECT_URL,
    scopes: [process.env.REACT_APP_AZURE_AD_CONFIGS_SCOPES],
    authority: process.env.REACT_APP_AZURE_AD_CONFIGS_AUTHORITY
}