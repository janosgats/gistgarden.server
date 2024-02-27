import {MagicRouter, SimpleJsonRequest, SimpleJsonResponse} from "@/magicRouter/MagicRouter";
import callUpstream from "@/util/backend/callUpstream";
import appConfig from "@/config/appConfig";


const PATH_PREFIX_REGISTRATION = '/api/registration'


export function setRegistrationRoutes(magicRouter: MagicRouter) {

    magicRouter.setSimpleJsonHandler('POST', PATH_PREFIX_REGISTRATION + '/submitEmailPasswordRegistrationInquiry',
        async (request: SimpleJsonRequest): Promise<SimpleJsonResponse> => {

            await callUpstream({
                baseURL: appConfig.upstreamApis.gistGardenWebserviceBaseUrl,
                url: '/api/registration/submitEmailPasswordRegistrationInquiry',
                method: "post",
                data: {
                    email: request.body.email,
                    password: request.body.password,
                },
            })

            return {}
        },
    )
}