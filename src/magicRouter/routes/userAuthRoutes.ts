import {MagicRouter, SimpleJsonRequest, SimpleJsonResponse} from "@/magicRouter/MagicRouter";
import {JWT_COOKIE_NAME} from "@/util/backend/resolveLoginStatus";
import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";


const PATH_PREFIX_USER_AUTH = '/api/userAuth'

const YEAR_AS_DAYS = 365
const DAY_AS_HOURS = 24
const HOUR_AS_SECONDS = 3600
const SECOND_AS_MILLIS = 1000

export function setUserAuthRoutes(magicRouter: MagicRouter) {

    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_USER_AUTH + '/login',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {


            const loginResponse = await callUpstream<LoginResponse>({
                baseURL: appConfig.upstreamApis.pointPulseWebserviceBaseUrl,
                url: '/api/userAuth/mockLogin',
                method: "post",
            })

            const {jwt} = loginResponse.data

            const secureDirectives = appConfig.useSecureDirectiveWhenSettingJwtCookie ? ' secure; ' : ' '
            const timestampOfOneYearFromNow = new Date().getTime() + (YEAR_AS_DAYS * DAY_AS_HOURS * HOUR_AS_SECONDS * SECOND_AS_MILLIS)
            const expirationString = new Date(timestampOfOneYearFromNow).toUTCString()
            return {
                headers: {'Set-Cookie': `${JWT_COOKIE_NAME}=${jwt}; expires='${expirationString}'; path=/; ${secureDirectives} samesite=strict; HttpOnly`},
            }
        },
        {skipReadingBody: true},
    )
}


interface LoginResponse {
    userId: number;
    jwt: string;
}
