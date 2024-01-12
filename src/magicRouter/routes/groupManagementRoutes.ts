import {MagicRouter, SimpleJsonRequest, SimpleJsonResponse} from "@/magicRouter/MagicRouter";
import {resolveLoggedInUserId} from "@/util/backend/resolveLoginStatus";
import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";


const PATH_PREFIX_GROUP_MANAGEMENT = '/api/groupManagement'

export function setGroupManagementRoutes(magicRouter: MagicRouter) {

    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_GROUP_MANAGEMENT + '/createTopicInGroup',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream({
                baseURL: appConfig.upstreamApis.pointPulseWebserviceBaseUrl,
                url: '/api/userFacingGroupManagement/createTopicInGroup',
                method: "POST",
                data: {
                    initiatorUserId: loggedInUserId,
                    groupId: request.body.groupId,
                    topicDescription: request.body.topicDescription,
                }
            })

            return {}
        }
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_GROUP_MANAGEMENT + '/listTopicsInGroup',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<SimpleTopicResponse[]>({
                baseURL: appConfig.upstreamApis.pointPulseWebserviceBaseUrl,
                url: '/api/userFacingGroupManagement/listTopicsInGroup',
                method: 'POST',
                data: {
                    initiatorUserId: loggedInUserId,
                    groupId: request.body.groupId,
                }
            })

            return {
                body: upstreamResponse.data
            }
        }
    )


    magicRouter.setSimpleJsonHandler('GET', PATH_PREFIX_GROUP_MANAGEMENT + '/listBelongingGroups',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<SimpleGroupResponse[]>({
                baseURL: appConfig.upstreamApis.pointPulseWebserviceBaseUrl,
                url: '/api/userFacingGroupManagement/listBelongingGroups',
                params: {
                    initiatorUserId: loggedInUserId
                }
            })

            return {
                body: upstreamResponse.data
            }
        },
        {skipReadingBody: true}
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_GROUP_MANAGEMENT + '/createGroup',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<CreateGroupResponse>({
                baseURL: appConfig.upstreamApis.pointPulseWebserviceBaseUrl,
                url: '/api/userFacingGroupManagement/createGroup',
                method: "POST",
                data: {
                    initiatorUserId: loggedInUserId,
                    groupName: request.body.groupName,
                }
            })

            return {
                body: upstreamResponse.data
            }
        }
    )
}


export interface SimpleTopicResponse {
    id: number;
    isDone: boolean;
    description: string;
}

export interface SimpleGroupResponse {
    id: number;
    name: string;
}

export interface CreateGroupResponse {
    groupId: number;
    groupName: string;
}