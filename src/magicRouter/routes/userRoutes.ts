import {MagicRouter, SimpleJsonRequest, SimpleJsonResponse} from "@/magicRouter/MagicRouter";
import {resolveLoggedInUserId} from "@/util/backend/resolveLoginStatus";
import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";


const PATH_PREFIX_USER = '/api/user'

export function setUserRoutes(magicRouter: MagicRouter) {

    magicRouter.setSimpleJsonHandler('GET', PATH_PREFIX_USER + '/userInfo',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse<UserInfoResponse>> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<UpstreamUserInfoResponse>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/user/userInfo',
                params: {
                    userId: loggedInUserId,
                },
            })


            return {
                body: {
                    userId: upstreamResponse.data.userId,
                    nickName: upstreamResponse.data.nickName,
                },
            }
        },
        {skipReadingBody: true},
    )
}


export interface UpstreamUserInfoResponse {
    userId: number;
    nickName: string;
}

export interface UserInfoResponse {
    userId: number;
    nickName: string;
}
