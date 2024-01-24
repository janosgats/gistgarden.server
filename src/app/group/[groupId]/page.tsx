'use client'

import React, {FC, useState} from "react";
import useEndpoint from "@/react/hooks/useEndpoint";
import {useParams} from "next/navigation";
import callServer from "@/util/frontend/callServer";
import {SimpleGroupResponse, SimpleTopicResponse} from "@/magicRouter/routes/groupManagementRoutes";
import {UsedEndpointSuspense} from "@/react/components/UsedEndpointSuspense";
import {Topic} from "@/react/components/Topic";
import {Button, Checkbox, CircularProgress, Stack, TextField} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import _ from 'lodash';

export default function Page() {
    const params = useParams()
    const groupId = _.parseInt(params['groupId'] as string)


    const [isNewTopicAdderOpen, setIsNewTopicAdderOpen] = useState<boolean>(false)

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

    async function handleTopicDeletion(topicId: number) {
        await callServer({
            url: '/api/topic/deleteTopic',
            method: "DELETE",
            data: {
                topicId: topicId,
            },
        })
            .catch(() => {
                alert('Error while deleting topic')
            })
            .finally(() => {
                usedTopics.reloadEndpoint()
            })
    }

    return (
        <>
            <h1>Group:&nbsp;
                <UsedEndpointSuspense usedEndpoint={usedGroup} pendingNode={<CircularProgress/>} failedNode={'Error loading group name :/'}>
                    {usedGroup.data?.name}
                </UsedEndpointSuspense>
            </h1>

            <h3>Topics:</h3>
            <UsedEndpointSuspense usedEndpoint={usedTopics}>
                <Stack spacing={2}>
                    {usedTopics.data?.map(topic => (
                        <Topic key={topic.id} initialTopic={topic} onDeleteRequest={() => handleTopicDeletion(topic.id)}/>
                    ))}

                    {!isNewTopicAdderOpen && (
                        <Button variant="outlined" onClick={() => setIsNewTopicAdderOpen(true)} startIcon={<AddOutlinedIcon/>}>Add new topic</Button>
                    )}
                    {isNewTopicAdderOpen && (
                        <NewTopicAdder groupId={groupId} afterNewTopicSaved={() => {
                            usedTopics.reloadEndpoint()
                            setIsNewTopicAdderOpen(false)
                        }}/>
                    )}


                </Stack>
            </UsedEndpointSuspense>
        </>
    )
}

interface NewTopicAdderProps {
    groupId: number
    afterNewTopicSaved: () => void
}

const NewTopicAdder: FC<NewTopicAdderProps> = (props) => {
    const [newTopicDescription, setNewTopicDescription] = useState<string>('')

    async function saveNewTopic() {
        if (!newTopicDescription) {
            return
        }

        await callServer({
            url: '/api/topic/createTopicInGroup',
            method: "POST",
            data: {
                groupId: props.groupId,
                topicDescription: newTopicDescription,
            },
        })
            .catch(() => {
                alert('Error while saving new topic. Please try again')
            })
            .then(() => {
                setNewTopicDescription("")
                props.afterNewTopicSaved()
            })
    }

    return (<Stack direction="row">
        <Checkbox
            color="secondary"
            checked={false}
            disabled
        />
        <TextField
            variant="standard"
            multiline
            fullWidth
            placeholder="Enter your new topic..."
            autoFocus
            value={newTopicDescription}
            onChange={e => setNewTopicDescription(e.target.value)}
            onBlur={() => saveNewTopic()}
        />
    </Stack>)
}