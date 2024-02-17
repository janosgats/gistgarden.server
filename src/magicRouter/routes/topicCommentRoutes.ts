import {MagicRouter, SimpleJsonRequest, SimpleJsonResponse} from "@/magicRouter/MagicRouter";
import {resolveLoggedInUserId} from "@/util/backend/resolveLoginStatus";
import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";


const PATH_PREFIX_TOPIC = '/api/topicComment'

export function setTopicCommentRoutes(magicRouter: MagicRouter) {
    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_TOPIC + '/listCommentsOnTopic',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<SimpleTopicCommentResponse[]>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topicComment/listCommentsOnTopic',
                method: 'POST',
                data: {
                    initiatorUserId: loggedInUserId,
                    topicId: request.body.topicId,
                },
            })

            return {
                body: upstreamResponse.data,
            }
        },
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_TOPIC + '/createCommentOnTopic',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topicComment/createCommentOnTopic',
                method: "POST",
                data: {
                    initiatorUserId: loggedInUserId,
                    topicId: request.body.topicId,
                    commentDescription: request.body.commentDescription,
                },
            })

            return {}
        },
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_TOPIC + '/setDescription',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topicComment/setDescription',
                method: "POST",
                data: {
                    initiatorUserId: loggedInUserId,
                    topicCommentId: request.body.topicCommentId,
                    newDescription: request.body.newDescription,
                },
            })

            return {}
        },
    )


    magicRouter.setSimpleJsonHandler('DELETE', PATH_PREFIX_TOPIC + '/deleteComment',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/topicComment/deleteComment',
                method: "DELETE",
                data: {
                    initiatorUserId: loggedInUserId,
                    topicCommentId: request.body.topicCommentId,
                },
            })

            return {}
        },
    )
}


export interface SimpleTopicCommentResponse {
    id: number;
    topicId: number;
    description: string;
    creatorUserId: number;
}