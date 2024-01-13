'use client'

import React, {useState} from "react";
import useEndpoint from "@/react/hooks/useEndpoint";
import {useParams} from "next/navigation";
import {DevPanel} from "@/react/components/DevPanel";
import callServer from "@/util/frontend/callServer";
import {SimpleGroupResponse, SimpleTopicResponse} from "@/magicRouter/routes/groupManagementRoutes";
import {UsedEndpointSuspense} from "@/react/components/UsedEndpointSuspense";
import {Topic} from "@/react/components/Topic";

export default function Page() {
    const params = useParams()
    const groupId = params['groupId']


    const [newTopicDescription, setNewTopicDescription] = useState<string>()

    const usedGroup = useEndpoint<SimpleGroupResponse>({
        config: {
            url: '/api/groupManagement/getGroup',
            method: "POST",
            data: {
                groupId: groupId,
            },
        },
    })


    const usedTopics = useEndpoint<SimpleTopicResponse[]>({
        config: {
            url: '/api/topic/listTopicsInGroup',
            method: "POST",
            data: {
                groupId: groupId,
            },
        },
    })

    async function onCreateNewTopicClicked() {
        await callServer({
            url: '/api/topic/createTopicInGroup',
            method: "POST",
            data: {
                groupId: groupId,
                topicDescription: newTopicDescription,
            },
        })
            .then(() => {
                setNewTopicDescription("")
            })
            .finally(() => {
                usedTopics.reloadEndpoint()
            })
    }

    return (
        <main>
            <h1>Group:&nbsp;
                <UsedEndpointSuspense usedEndpoint={usedGroup} pendingNode={<span>&#x21bb;</span>} failedNode={'Error loading group name :/'}>
                    {usedGroup.data?.name}
                </UsedEndpointSuspense>
            </h1>

            <h3>Topics:</h3>
            <UsedEndpointSuspense usedEndpoint={usedTopics}>
                <ul>
                    {usedTopics.data?.map(topic => (
                        <li key={topic.id}><Topic initialTopic={topic}/></li>
                    ))}
                </ul>
            </UsedEndpointSuspense>

            <DevPanel>
                <input value={newTopicDescription} onChange={e => setNewTopicDescription(e.target.value)}/>
                <button onClick={() => onCreateNewTopicClicked()}>Add new topic</button>
            </DevPanel>
        </main>
    )
}