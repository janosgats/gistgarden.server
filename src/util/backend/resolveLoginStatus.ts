import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";
import {cookies as nextCookies} from "next/headers";

export const JWT_COOKIE_NAME = 'jwtToken'
interface ResolveJwtResponse {
    userId: number
}

export interface LoginStatus {
    isLoggedIn: boolean
    userId: number | null
}

const NOT_LOGGED_IN_RESULT: LoginStatus = {
    isLoggedIn: false,
    userId: null
}


export async function resolveLoginStatus(): Promise<LoginStatus> {
    const cookies = nextCookies()

    if (!cookies.has(JWT_COOKIE_NAME)) {
        return NOT_LOGGED_IN_RESULT
    }

    const upstreamResponse = await callUpstream<ResolveJwtResponse>({
        baseURL: appConfig.upstreamApis.pointPulseWebserviceBaseUrl,
        url: '/api/userAuth/resolveJwt',
        method: 'POST',
        data: {
            jwt: cookies.get(JWT_COOKIE_NAME)!.value
        }
    })

    return {
        isLoggedIn: !!upstreamResponse.data.userId,
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
