import React, {FC, ReactNode} from "react";

interface Props {
    children: ReactNode
}

export const DevPanel: FC<Props> = (props) => {
    return (<>
        <div style={{padding: 20, borderStyle: 'dashed', borderColor: 'black'}}>
            {props.children}
        </div>
    </>)
}