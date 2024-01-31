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

const k8sc1Config: AppConfig = {
    upstreamApis: {
        gistGardenWebserviceBaseUrl: 'http://gistgarden-ws-cluster-ip:3001',
    },
    useSecureDirectiveWhenSettingJwtCookie: true,
}

const ENV_VAR_NAME_ACTIVE_PROFILE = 'GG_ACTIVE_PROFILE'

const ENV_VAR_NAME_DID_SETUP_RUN_ALREADY = 'DID_SETUP_RUN_ALREADY_XoBy82gF3O9IWtR'

function isThisTheFirstRunOfSetup(): boolean {
    if (process.env[ENV_VAR_NAME_DID_SETUP_RUN_ALREADY] !== 'true') {
        process.env[ENV_VAR_NAME_DID_SETUP_RUN_ALREADY] = 'true'
        return true
    }
    return false
}

function getConfig(): AppConfig {
    const activeProfile = process.env[ENV_VAR_NAME_ACTIVE_PROFILE]

    if (isThisTheFirstRunOfSetup()) {
        console.log(`Active profile from ${ENV_VAR_NAME_ACTIVE_PROFILE}: ${activeProfile}`)
    }

    if (activeProfile === 'dev') {
        return devConfig
    }

    if (activeProfile === 'k8sc1') {
        return k8sc1Config
    }

    if (activeProfile === 'ci_build') {
        return k8sc1Config
    }

    throw Error(`Unrecognized active profile specified in ${ENV_VAR_NAME_ACTIVE_PROFILE}: ${activeProfile}`)
}

const appConfig = getConfig()

export default appConfig


