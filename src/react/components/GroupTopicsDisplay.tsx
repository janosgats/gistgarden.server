import React, {FC, useState} from "react";
import useEndpoint from '@/react/hooks/useEndpoint';
import {SimpleGroupResponse, SimpleTopicResponse} from '@/magicRouter/routes/groupManagementRoutes';
import callServer from '@/util/frontend/callServer';
import {Button, Checkbox, CircularProgress, IconButton, Stack, TextField, Tooltip, Typography} from '@mui/material';
import {UsedEndpointSuspense} from '@/react/components/UsedEndpointSuspense';
import Link from 'next/link';
import JoinFullOutlinedIcon from '@mui/icons-material/JoinFullOutlined';
import {Topic} from '@/react/components/Topic';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import {RenamerDialog} from '@/react/components/RenamerDialog';

interface Props {
    groupId: number
    hideViewTogetherLink?: boolean
    colorAddNewTopicButtonAsSecondary?: boolean
}

export const GroupTopicsDisplay: FC<Props> = (props) => {
    const [isNewTopicAdderOpen, setIsNewTopicAdderOpen] = useState<boolean>(false)
    const [isGroupRenamerOpen, setIsGroupRenamerOpen] = useState<boolean>(false)

    const usedGroup = useEndpoint<SimpleGroupResponse>({
        config: {
            url: '/api/groupManagement/getGroup',
            method: "POST",
            data: {
                groupId: props.groupId,
            },
        },
    })


    const usedTopics = useEndpoint<SimpleTopicResponse[]>({
        config: {
            url: '/api/topic/listTopicsInGroup',
            method: "POST",
            data: {
                groupId: props.groupId,
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
            <UsedEndpointSuspense usedEndpoint={usedGroup} pendingNode={<Stack><CircularProgress/></Stack>} failedNode={'Error loading group name :/'}>
                <Stack direction="row">
                    <Typography variant="h4">
                        {usedGroup.data?.name}
                    </Typography>
                    <Tooltip title="Rename group">
                        <IconButton onClick={() => setIsGroupRenamerOpen(true)}>
                            <DriveFileRenameOutlineOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </UsedEndpointSuspense>


            <RenamerDialog
                isOpen={isGroupRenamerOpen}
                onClose={() => setIsGroupRenamerOpen(false)}
                originalName={usedGroup.data?.name ?? ''}
                onSubmit={(newName) => renameGroup(props.groupId, newName).then(() => {
                    setIsGroupRenamerOpen(false)
                    usedGroup.reloadEndpoint()
                })}
            />


            {!props.hideViewTogetherLink && (
                <Tooltip title="Open a page to display topics from multiple groups next to each other">
                    <Link href={`/views/instantMultiGroup?groups=${props.groupId}`} style={{textDecoration: 'none', color: 'inherit'}}>
                        <Button size="small" variant="text" color="primary" startIcon={<JoinFullOutlinedIcon/>}>
                            View together with another group
                        </Button>
                    </Link>
                </Tooltip>
            )}
            <UsedEndpointSuspense usedEndpoint={usedTopics}>
                <Stack spacing={2}>
                    {usedTopics.data?.map(topic => (
                        <Topic key={topic.id} initialTopic={topic} onDeleteRequest={() => handleTopicDeletion(topic.id)}/>
                    ))}

                    {!isNewTopicAdderOpen && (
                        <Button
                            variant="outlined"
                            color={props.colorAddNewTopicButtonAsSecondary ? 'secondary' : 'primary'}
                            onClick={() => setIsNewTopicAdderOpen(true)}
                            startIcon={<AddOutlinedIcon/>}>
                            Add new topic
                        </Button>
                    )}
                    {isNewTopicAdderOpen && (
                        <NewTopicAdder groupId={props.groupId} afterNewTopicSaved={() => {
                            usedTopics.reloadEndpoint()
                            setIsNewTopicAdderOpen(false)
                        }}/>
                    )}


                </Stack>
            </UsedEndpointSuspense>
        </>
    )
}

async function renameGroup(groupId: number, newName: string): Promise<void> {
    await callServer({
        url: '/api/groupManagement/setGroupName',
        method: 'POST',
        data: {
            groupId: groupId,
            newGroupName: newName,
        },
    }).catch((e) => {
        alert('Error while renaming group. ' + e?.message)
    })
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