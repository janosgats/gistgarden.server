import {MagicRouter, SimpleJsonRequest, SimpleJsonResponse} from "@/magicRouter/MagicRouter";
import {resolveLoggedInUserId} from "@/util/backend/resolveLoginStatus";
import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";


const PATH_PREFIX_TOPIC = '/api/topic'

export function setTopicRoutes(magicRouter: MagicRouter) {

    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_TOPIC + '/createTopicInGroup',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topic/createTopicInGroup',
                method: "POST",
                data: {
                    initiatorUserId: loggedInUserId,
                    groupId: request.body.groupId,
                    topicDescription: request.body.topicDescription,
                },
            })

            return {}
        },
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_TOPIC + '/listTopicsInGroup',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<SimpleTopicResponse[]>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topic/listTopicsInGroup',
                method: 'POST',
                data: {
                    initiatorUserId: loggedInUserId,
                    groupId: request.body.groupId,
                },
            })

            return {
                body: upstreamResponse.data,
            }
        },
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_TOPIC + '/setDescription',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<SimpleTopicResponse[]>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topic/setDescription',
                method: 'POST',
                data: {
                    initiatorUserId: loggedInUserId,
                    topicId: request.body.topicId,
                    newDescription: request.body.newDescription,
                },
            })

            return {}
        },
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_TOPIC + '/setIsDoneState',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<SimpleTopicResponse[]>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topic/setIsDoneState',
                method: 'POST',
                data: {
                    initiatorUserId: loggedInUserId,
                    topicId: request.body.topicId,
                    newIsDone: request.body.newIsDone,
                },
            })

            return {}
        },
    )


    magicRouter.setSimpleJsonHandler('DELETE', PATH_PREFIX_TOPIC + '/deleteTopic',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topic/deleteTopic',
                method: 'DELETE',
                data: {
                    initiatorUserId: loggedInUserId,
                    topicId: request.body.topicId,
                },
            })

            return {}
        },
    )

}


export interface SimpleTopicResponse {
    id: number;
    isDone: boolean;
    description: string;
}