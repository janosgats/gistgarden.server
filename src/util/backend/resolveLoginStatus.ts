import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";
import {cookies as nextCookies} from "next/headers";

export const SESSION_COOKIE_NAME = 'sessionId'

interface ResolveLoginStatusFromSessionIdResponse {
    isSessionValid: boolean
    userId: number | null
}

export interface LoginStatus {
    isLoggedIn: boolean
    userId: number | null
}

const NOT_LOGGED_IN_RESULT: LoginStatus = {
    isLoggedIn: false,
    userId: null,
}


export async function resolveLoginStatus(): Promise<LoginStatus> {
    const cookies = nextCookies()

    if (!cookies.has(SESSION_COOKIE_NAME)) {
        return NOT_LOGGED_IN_RESULT
    }

    const upstreamResponse = await callUpstream<ResolveLoginStatusFromSessionIdResponse>({
        baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
        url: '/api/userAuth/resolveLoginStatusFromSessionId',
        method: 'POST',
        data: {
            sessionId: cookies.get(SESSION_COOKIE_NAME)!.value,
        },
    })

    return {
        isLoggedIn: upstreamResponse.data.isSessionValid && !!upstreamResponse.data.userId,
        userId: upstreamResponse.data.userId,
    }
}

export async function resolveLoggedInUserId(): Promise<number> {
    const loginStatus = await resolveLoginStatus()

    if (!loginStatus.isLoggedIn) {
        throw Error('No user is logged in')
    }

    return loginStatus.userId!
}
