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
                    isPrivate: request.body.isPrivate,
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
                    includeArchiveTopics: request.body.includeArchiveTopics,
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

            await callUpstream<SimpleTopicResponse[]>({
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

            await callUpstream<SimpleTopicResponse[]>({
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


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_TOPIC + '/setIsArchiveState',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream<SimpleTopicResponse[]>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topic/setIsArchiveState',
                method: 'POST',
                data: {
                    initiatorUserId: loggedInUserId,
                    topicId: request.body.topicId,
                    newIsArchive: request.body.newIsArchive,
                },
            })

            return {}
        },
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_TOPIC + '/setIsPrivateState',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream<SimpleTopicResponse[]>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topic/setIsPrivateState',
                method: 'POST',
                data: {
                    initiatorUserId: loggedInUserId,
                    topicId: request.body.topicId,
                    newIsPrivate: request.body.newIsPrivate,
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


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_TOPIC + '/saveTopicDisplayOrder',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topic/saveTopicDisplayOrder',
                method: 'POST',
                data: {
                    initiatorUserId: loggedInUserId,
                    groupId: request.body.groupId,
                    topicIdsInDisplayOrder: request.body.topicIdsInDisplayOrder,
                },
            })

            return {}
        },
    )

}


export interface SimpleTopicResponse {
    id: number;
    isDone: boolean;
    isArchive: boolean;
    isPrivate: boolean;
    description: string;
    creatorUserId: number;
}