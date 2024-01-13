import {NextRequest, NextResponse} from "next/server";
import {HTTP_METHOD} from "next/dist/server/web/http";


interface RouteHandler {

    endpointMatcher: (req: NextRequest) => boolean

    handle: (req: NextRequest) => Promise<NextResponse>
}

export interface SimpleJsonRequest {
    req: NextRequest
    body: any
}

export interface SimpleJsonResponse {
    status?: number
    body?: any
    headers?: HeadersInit
}

export interface SetSimpleJsonHandlerSettings {
    skipReadingBody?: boolean
}

export class MagicRouter {
    protected routeHandlers: RouteHandler[]

    constructor() {
        this.routeHandlers = []
    }


    setSimpleJsonHandler(
        method: HTTP_METHOD,
        path: string,
        handler: (request: SimpleJsonRequest) => Promise<SimpleJsonResponse>,
        settings: SetSimpleJsonHandlerSettings = {},
    ) {
        this.routeHandlers.push({
            endpointMatcher: (req: NextRequest) => {
                return req.method === method && req.nextUrl.pathname === path
            },
            async handle(req: NextRequest): Promise<NextResponse> {
                let requestBody = null
                if (!(settings?.skipReadingBody)) {
                    requestBody = await req.json()
                }

                const simpleJsonResponse = await handler({
                    req: req,
                    body: requestBody,
                })


                let responseBody = simpleJsonResponse.body
                if (responseBody === undefined || responseBody === null) {
                    responseBody = {}
                }

                const responseInit: ResponseInit = {
                    status: simpleJsonResponse.status,
                    headers: simpleJsonResponse.headers,
                }

                return NextResponse.json(responseBody, responseInit);
            },
        })
    }

    async handleRequest(req: NextRequest): Promise<NextResponse> {
        const matchedRouteHandler = this.routeHandlers.find(routeHandler => routeHandler.endpointMatcher(req))

        if (matchedRouteHandler === undefined) {
            throw new RouteNotFoundError(`MagicRouter could not find a matching RouteHandler for ${req.method} ${req.nextUrl.pathname}`)
        }

        return await matchedRouteHandler.handle(req)
    }
}

export class RouteNotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}

