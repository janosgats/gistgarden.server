import {MagicRouter, SimpleJsonRequest, SimpleJsonResponse} from "@/magicRouter/MagicRouter";
import {resolveLoginStatus, SESSION_COOKIE_NAME} from "@/util/backend/resolveLoginStatus";
import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";
import {getSanitizedBoolean} from '@/util/both/CommonValidators';


const PATH_PREFIX_USER_AUTH = '/api/userAuth'


const DAY_AS_HOURS = 24
const HOUR_AS_SECONDS = 3600
const SECOND_AS_MILLIS = 1000

const DAY_AS_MILLIS = DAY_AS_HOURS * HOUR_AS_SECONDS * SECOND_AS_MILLIS

export function setUserAuthRoutes(magicRouter: MagicRouter) {

    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_USER_AUTH + '/loginByPassword',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse<LoginByPasswordResponse>> => {
            const keepMeLoggedIn = getSanitizedBoolean(request.body.keepMeLoggedIn)

            const createSessionResponse = await callUpstream<CreateSessionUpstreamResponse>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userAuth/createSessionByPasswordLogin',
                method: "post",
                data: {
                    email: request.body.email,
                    password: request.body.password,
                    keepMeLoggedIn: keepMeLoggedIn,
                },
            })

            if (!createSessionResponse.data.areCredentialsValid) {
                return {
                    body: {
                        areCredentialsValid: false,
                    },
                }
            }

            function calculateExpiryDirectives(): string {
                if (!keepMeLoggedIn) {
                    return "";
                }

                const timestampOfExpiry = new Date().getTime() + (365 * DAY_AS_MILLIS)
                const expirationString = new Date(timestampOfExpiry).toUTCString()

                return ` expires='${expirationString}'; `
            }

            const secureDirectives = appConfig.useSecureDirectiveWhenSettingSessionCookie ? ' secure; ' : ' '
            return {
                body: {
                    areCredentialsValid: createSessionResponse.data.areCredentialsValid,
                },
                headers: {
                    'Set-Cookie': `${SESSION_COOKIE_NAME}=${createSessionResponse.data.sessionId}; ${calculateExpiryDirectives()} path=/; ` +
                        `${secureDirectives} samesite=strict; HttpOnly`,
                },
            }
        },
    )

    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_USER_AUTH + '/logOut',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            return {
                headers: {
                    'Set-Cookie': `${SESSION_COOKIE_NAME}=logged_out; expires='${new Date(0).toUTCString()}'; path=/; samesite=strict; HttpOnly`,
                },
            }
        },
        {skipReadingBody: true},
    )

    magicRouter.setSimpleJsonHandler('GET', PATH_PREFIX_USER_AUTH + '/loginStatus',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse<CurrentUserInfo>> => {
            const loginStatus = await resolveLoginStatus()

            return {
                body: {
                    isLoggedIn: loginStatus.isLoggedIn,
                    userId: loginStatus.userId,
                },
            }
        },
        {skipReadingBody: true},
    )
}


interface CreateSessionUpstreamResponse {
    areCredentialsValid: boolean;
    userId: number | null;
    sessionId: string | null;
}

export interface LoginByPasswordResponse {
    areCredentialsValid: boolean;
}

export interface CurrentUserInfo {
    isLoggedIn: boolean
    userId: number | null
}