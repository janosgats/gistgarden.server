import {MagicRouter, SimpleJsonRequest, SimpleJsonResponse} from "@/magicRouter/MagicRouter";
import {JWT_COOKIE_NAME} from "@/util/backend/resolveLoginStatus";
import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";


const PATH_PREFIX_USER_AUTH = '/api/userAuth'

export function setUserAuthRoutes(magicRouter: MagicRouter) {

    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_USER_AUTH + '/login',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {


            const loginResponse = await callUpstream<LoginResponse>({
                baseURL: appConfig.upstreamApis.pointPulseWebserviceBaseUrl,
                url: '/api/userAuth/mockLogin',
                method: "post",
            })

            const {jwt} = loginResponse.data
            return {
                headers: {'Set-Cookie': `${JWT_COOKIE_NAME}=${jwt}; path=/; secure; samesite=strict; HttpOnly`}
            }
        },
        {skipReadingBody: true}
    )
}


interface LoginResponse {
    userId: number;
    jwt: string;
}
