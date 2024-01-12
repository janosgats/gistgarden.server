'use client'

import React, {useState} from "react";
import useEndpoint from "@/react/hooks/useEndpoint";
import {useParams} from "next/navigation";
import {DevPanel} from "@/react/components/DevPanel";
import callServer from "@/util/frontend/callServer";
import {SimpleTopicResponse} from "@/magicRouter/routes/groupManagementRoutes";

export default function Page() {
    const params = useParams()
    const groupId = params['groupId']


    const [newTopicDescription, setNewTopicDescription] = useState<string>()


    const usedTopics = useEndpoint<SimpleTopicResponse[]>({
        config: {
            url: '/api/groupManagement/listTopicsInGroup',
            method: "POST",
            data: {
                groupId: groupId
            }
        }
    })

    async function onCreateNewTopicClicked() {
        await callServer({
            url: '/api/groupManagement/createTopicInGroup',
            method: "POST",
            data: {
                groupId: groupId,
                topicDescription: newTopicDescription,
            }
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
            <h1>Group</h1>

            <h3>Topics:</h3>
            {usedTopics.pending && (<p>Loading...</p>)}
            {usedTopics.failed && (<p>Failed :/</p>)}
            {usedTopics.succeeded && (
                <ul>
                    {usedTopics.data?.map(topic => (
                        <li key={topic.id}>{topic.description} ({topic.id}) {topic.isDone ? ('DONE') : ('TODO')} </li>
                    ))}
                </ul>
            )}

            <DevPanel>
                <input value={newTopicDescription} onChange={e => setNewTopicDescription(e.target.value)}/>
                <button onClick={() => onCreateNewTopicClicked()}>Add new topic</button>
            </DevPanel>
        </main>
    )
}