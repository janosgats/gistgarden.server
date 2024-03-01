import {MagicRouter, SimpleJsonRequest, SimpleJsonResponse} from "@/magicRouter/MagicRouter";
import {resolveLoggedInUserId} from "@/util/backend/resolveLoginStatus";
import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";


const PATH_PREFIX_GROUP_MANAGEMENT = '/api/groupManagement'

export function setGroupManagementRoutes(magicRouter: MagicRouter) {


    magicRouter.setSimpleJsonHandler('GET', PATH_PREFIX_GROUP_MANAGEMENT + '/listBelongingGroups',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<SimpleGroupResponse[]>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/groupManagement/listBelongingGroups',
                params: {
                    initiatorUserId: loggedInUserId,
                },
            })

            return {
                body: upstreamResponse.data,
            }
        },
        {skipReadingBody: true},
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_GROUP_MANAGEMENT + '/createGroup',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<CreateGroupResponse>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/groupManagement/createGroup',
                method: "POST",
                data: {
                    initiatorUserId: loggedInUserId,
                    groupName: request.body.groupName,
                },
            })

            return {
                body: upstreamResponse.data,
            }
        },
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_GROUP_MANAGEMENT + '/setGroupName',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream<CreateGroupResponse>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/groupManagement/setGroupName',
                method: "POST",
                data: {
                    initiatorUserId: loggedInUserId,
                    groupId: request.body.groupId,
                    newGroupName: request.body.newGroupName,
                },
            })

            return {}
        },
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_GROUP_MANAGEMENT + '/getGroup',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<SimpleGroupResponse[]>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/groupManagement/getGroup',
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


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_GROUP_MANAGEMENT + '/listGroupMembers',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            const upstreamResponse = await callUpstream<SimpleGroupMemberResponse[]>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/groupManagement/listGroupMembers',
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


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_GROUP_MANAGEMENT + '/addMemberToGroup',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream<SimpleGroupMemberResponse[]>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/groupManagement/addMemberToGroup',
                method: 'POST',
                data: {
                    initiatorUserId: loggedInUserId,
                    groupId: request.body.groupId,
                    userIdToAdd: request.body.userIdToAdd,
                },
            })

            return {}
        },
    )


    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_GROUP_MANAGEMENT + '/removeMemberFromGroup',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {
            const loggedInUserId = await resolveLoggedInUserId()

            await callUpstream<SimpleGroupMemberResponse[]>({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/userInitiated/groupManagement/removeMemberFromGroup',
                method: 'POST',
                data: {
                    initiatorUserId: loggedInUserId,
                    groupId: request.body.groupId,
                    userIdToRemove: request.body.userIdToRemove,
                },
            })

            return {}
        },
    )
}

export interface SimpleGroupResponse {
    id: number;
    name: string;
    lastActivityAt: string;
}

export interface CreateGroupResponse {
    groupId: number;
    groupName: string;
}

export interface SimpleGroupMemberResponse {
    userId: number
}