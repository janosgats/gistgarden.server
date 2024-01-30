export interface UpstreamApisConfig {
    gistGardenWebserviceBaseUrl: string;
}

export interface AppConfig {
    upstreamApis: UpstreamApisConfig
    useSecureDirectiveWhenSettingJwtCookie: boolean
}


const devConfig: AppConfig = {
    upstreamApis: {
        gistGardenWebserviceBaseUrl: 'http://localhost:3001',
    },
    useSecureDirectiveWhenSettingJwtCookie: false,
}

const ACTIVE_PROFILE_ENV_VAR_NAME = 'GG_ACTIVE_PROFILE'

function getConfig(): AppConfig {
    const activeProfile = process.env[ACTIVE_PROFILE_ENV_VAR_NAME]

    if (activeProfile === 'dev') {
        return devConfig
    }

    throw Error(`unrecognized ${ACTIVE_PROFILE_ENV_VAR_NAME}: ${activeProfile}`)
}

const appConfig = getConfig()

export default appConfig


