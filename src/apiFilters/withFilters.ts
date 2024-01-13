import {NextRequest, NextResponse} from "next/server";
import {RouteNotFoundError} from '@/magicRouter/MagicRouter';
import ApiCallerResponseCodeIsNotSuccessError from '@/error/ApiCallerResponseCodeIsNotSuccessError';
import ProducedProblemRelayError from '@/util/problemRelay/error/ProducedProblemRelayError';
import ReceivedProblemRelayError from '@/util/problemRelay/error/ReceivedProblemRelayError';
import ProblemRelayResponseFactory from '@/util/problemRelay/responseFactory/ProblemRelayResponseFactory';
import ProblemMarker from '@/util/problemRelay/model/ProblemMarker';


type NextApiHandler = (req: NextRequest) => Promise<NextResponse>

export const withFilters = (toWrap: NextApiHandler): NextApiHandler => {

    return async (req: NextRequest): Promise<NextResponse> => {
        try {
            return await toWrap(req)
        } catch (error) {
            return await handleCaughtError(req, error);
        }
    };
};


async function handleCaughtError(req: NextRequest, error: unknown): Promise<NextResponse> {
    if (error instanceof RouteNotFoundError) {
        return NextResponse.json({
            title: 'RouteNotFound',
            errorMessage: (error as any)?.['message'],
        }, {
            status: 404,
        })
    }

    if (error instanceof ReceivedProblemRelayError) {
        console.info('ReceivedProblemRelayError caught in withFilters', error.marker)

        if (isProblemMarkerAllowedToBeSentToClient(error.marker)) {
            const responseInstructions = ProblemRelayResponseFactory.v1FromReceived(error.receivedProblem);

            return NextResponse.json(responseInstructions.body, {
                status: responseInstructions.statusCode,
                headers: {
                    [responseInstructions.header.name]: responseInstructions.header.value,
                },
            })
        }

        return getBasicErrorResponse(409, {message: 'ReceivedProblemRelayError caught'});
    }

    if (error instanceof ProducedProblemRelayError) {
        console.info('ProducedProblemRelayError caught in withFilters', error.marker)

        if (isProblemMarkerAllowedToBeSentToClient(error.marker)) {
            const responseInstructions = ProblemRelayResponseFactory.v1FromProduced(error);

            return NextResponse.json(responseInstructions.body, {
                status: responseInstructions.statusCode,
                headers: {
                    [responseInstructions.header.name]: responseInstructions.header.value,
                },
            })
        }

        return getBasicErrorResponse(409, {message: 'ProducedProblemRelayError caught'});
    }

    if (error instanceof ApiCallerResponseCodeIsNotSuccessError) {
        console.error('ApiCallerResponseCodeIsNotSuccessError caught in withFilters', error)
        return getBasicErrorResponse(500, {message: 'HTTP status code from upstream API indicates failure.'});
    }

    if (error instanceof Error) {
        console.error('thrown Error caught in withFilters', error)
        return getBasicErrorResponse(500, {message: 'Error occurred'});
    }


    console.error('unknown thrown thingy caught in withFilters', error)
    return getBasicErrorResponse(500, {message: 'Unexpected error occurred'});
}

function getBasicErrorResponse(status: number, body: Record<string, any>, headers: HeadersInit | undefined = undefined): NextResponse {
    return NextResponse.json(body, {
        status: status,
        headers: headers,
    })
}


function isProblemMarkerAllowedToBeSentToClient(problemMarker: ProblemMarker) {
    return true; // TODO: implement filtering of what can be forwarded to client
}