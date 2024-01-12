import {MagicRouter, SimpleJsonRequest, SimpleJsonResponse} from "@/magicRouter/MagicRouter";
import {resolveLoggedInUserId} from "@/util/backend/resolveLoginStatus";
import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";


const PATH_PREFIX_USER = '/api/user'

export function setUserRoutes(magicRouter: MagicRouter) {

    magicRouter.setSimpleJsonHandler('GET', PATH_PREFIX_USER + '/userInfo',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<UserInfoResponse>({
                baseURL: appConfig.upstreamApis.pointPulseWebserviceBaseUrl,
                url: '/api/user/userInfo',
                params: {
                    userId: loggedInUserId
                }
            })


            return {
                body: {
                    userId: upstreamResponse.data.userId,
                    nickName: upstreamResponse.data.nickName,

                }
            }
        },
        {skipReadingBody: true}
    )
}


export interface UserInfoResponse {
    userId: number;
    nickName: string;
}
