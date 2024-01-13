import React, {FC, ReactNode} from "react";
import {UsedEndpoint} from "@/react/hooks/useEndpoint";

interface Props {
    usedEndpoint: UsedEndpoint<any>
    pendingNode?: ReactNode
    failedNode?: ReactNode
    children: ReactNode
}

export const UsedEndpointSuspense: FC<Props> = (props) => {
    const nodeToDisplayOnPending = props.pendingNode || <p>Loading...</p>
    const nodeToDisplayOnFailed = props.failedNode || <p>Failed :/</p>

    return (<>
        {props.usedEndpoint.pending && nodeToDisplayOnPending}
        {props.usedEndpoint.failed && nodeToDisplayOnFailed}
        {props.usedEndpoint.succeeded && props.children}
    </>)
}