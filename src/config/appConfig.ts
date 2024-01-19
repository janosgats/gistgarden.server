export interface UpstreamApisConfig {
    pointPulseWebserviceBaseUrl: string;
}

export interface AppConfig {
    upstreamApis: UpstreamApisConfig
    useSecureDirectiveWhenSettingJwtCookie: boolean
}


const devConfig: AppConfig = {
    upstreamApis: {
        pointPulseWebserviceBaseUrl: 'http://localhost:3000',
    },
    useSecureDirectiveWhenSettingJwtCookie: false,
}


function getConfig(): AppConfig {
    const activeProfile = process.env['ACTIVE_PROFILE']

    if (activeProfile === 'dev') {
        return devConfig
    }

    throw Error(`unrecognized ACTIVE_PROFILE: ${activeProfile}`)
}

const appConfig = getConfig()

export default appConfig


