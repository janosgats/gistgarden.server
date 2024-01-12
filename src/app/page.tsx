'use client' //TODO: Change this back to a Server Component after finished playing around

import React, {FC, useState} from "react";
import callServer from "@/util/frontend/callServer";
import useEndpoint from "@/react/hooks/useEndpoint";
import {DevPanel} from "@/react/components/DevPanel";
import Link from "next/link";
import {CreateGroupResponse, SimpleGroupResponse} from "@/magicRouter/routes/groupManagementRoutes";

export default function Home() {

    const usedBelongingGroups = useEndpoint<SimpleGroupResponse[]>({
        config: {
            url: '/api/groupManagement/listBelongingGroups'
        }
    })


    async function onLoginClicked() {
        await callServer({
            url: '/api/userAuth/login',
            method: "POST"
        })
    }

    async function onGetUserInfoClicked() {
        const response = await callServer({
            url: '/api/user/userInfo',
        })

        alert(JSON.stringify(response.data))
    }


    return (
        <main>
            <h1>Valami</h1>

            <button onClick={() => onLoginClicked()}>Login</button>
            <button onClick={() => onGetUserInfoClicked()}>Get user info</button>
            <br/>
            <CreateGroupPanel afterNewGroupCreationSubmitted={() => usedBelongingGroups.reloadEndpoint()}/>

            <h3>Groups:</h3>
            {usedBelongingGroups.pending && (<p>Loading...</p>)}
            {usedBelongingGroups.failed && (<p>Failed :/</p>)}
            {usedBelongingGroups.succeeded && (
                <ul>
                    {usedBelongingGroups.data?.map(group => (
                        <li key={group.id}><Link href={`/group/${group.id}`}>{group.name} ({group.id})</Link></li>
                    ))}
                </ul>
            )}
        </main>
    )
}


interface CreateGroupPanelProps {
    afterNewGroupCreationSubmitted?: () => void
}

const CreateGroupPanel: FC<CreateGroupPanelProps> = (props) => {
    const [enteredName, setEnteredName] = useState<string>("")

    function onSubmit() {
        callServer<CreateGroupResponse>({
            url: '/api/groupManagement/createGroup',
            method: "POST",
            data: {
                groupName: enteredName,
            }
        })
            .then(() => setEnteredName(""))
            .finally(() => {
                props.afterNewGroupCreationSubmitted?.()
            })
    }

    return (<>
        <DevPanel>
            <input value={enteredName} onChange={e => setEnteredName(e.target.value)}/>
            <button onClick={() => onSubmit()}>Create Group</button>
        </DevPanel>
    </>)
}
