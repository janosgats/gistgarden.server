import {NextResponse} from "next/server";


export const revalidate = 0

export const GET = async (): Promise<NextResponse> => {
    return NextResponse.json({message: "UP"});
}