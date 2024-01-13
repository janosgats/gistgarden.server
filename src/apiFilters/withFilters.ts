import {NextRequest, NextResponse} from "next/server";
import {RouteNotFoundError} from '@/magicRouter/MagicRouter';


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

    console.log('error caught in api filter', error)

    let statusCode = 500

    if (error instanceof RouteNotFoundError) {
        statusCode = 404
    }

    return NextResponse.json({
        title: 'error caught in api filter',
        errorMessage: (error as any)?.['message'],
    }, {
        status: statusCode,
    })
}