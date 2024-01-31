import {NextRequest, NextResponse} from "next/server";
import globalMagicRouter from "@/magicRouter/globalMagicRouter";
import {withFilters} from "@/apiFilters/withFilters";


export const revalidate = 0


async function unfilteredApiHandler(req: NextRequest): Promise<NextResponse> {
    return await globalMagicRouter.handleRequest(req)
}


const apiHandler = withFilters(unfilteredApiHandler)


export const GET = async (): Promise<NextResponse> => {
    return NextResponse.json({message: "UP"});
}