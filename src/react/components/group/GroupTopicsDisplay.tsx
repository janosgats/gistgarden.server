import React, {FC, useState} from "react";
import useEndpoint from '@/react/hooks/useEndpoint';
import {SimpleGroupResponse} from '@/magicRouter/routes/groupManagementRoutes';
import callServer from '@/util/frontend/callServer';
import {Button, CircularProgress, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Tooltip, Typography} from '@mui/material';
import {UsedEndpointSuspense} from '@/react/components/UsedEndpointSuspense';
import Link from 'next/link';
import JoinFullOutlinedIcon from '@mui/icons-material/JoinFullOutlined';
import {Topic} from '@/react/components/topic/Topic';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import {RenamerDialog} from '@/react/components/RenamerDialog';
import {SimpleTopicResponse} from '@/magicRouter/routes/topicRoutes';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import {GroupMembersEditorDialog} from '@/react/components/group/GroupMembersEditorDialog';
import {NewTopicAdder} from '@/react/components/group/NewTopicAdder';

interface Props {
    groupId: number
    displayAsStandalone: boolean
    showPrivateTopics: boolean
}

export const GroupTopicsDisplay: FC<Props> = (props) => {
    const [isNewTopicAdderOpen, setIsNewTopicAdderOpen] = useState<boolean>(false)
    const [isGroupRenamerOpen, setIsGroupRenamerOpen] = useState<boolean>(false)
    const [isGroupMemberEditorOpen, setIsGroupMemberEditorOpen] = useState<boolean>(false)
    const [topicsToDisplay, setTopicsToDisplay] = useState<SimpleTopicResponse[] | null>(null)

    const [moreMenuAnchorElement, setMoreMenuAnchorElement] = useState<null | HTMLElement>(null);

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
        customSuccessProcessor: (axiosResponse) => {
            setTopicsToDisplay(axiosResponse.data)
            return axiosResponse.data
        },
        onError: () => {
            setTopicsToDisplay(null)
        },
    })

    return (
        <>
            <UsedEndpointSuspense usedEndpoint={usedGroup} pendingNode={<Stack><CircularProgress/></Stack>} failedNode={'Error loading group name :/'}>
                <Stack direction="row">
                    <Typography variant="h4" marginBottom={1}>
                        {usedGroup.data?.name}
                    </Typography>


                    <Stack>
                        <Tooltip title="Click for More">
                            <IconButton onClick={e => setMoreMenuAnchorElement(e.currentTarget)}>
                                <MoreHorizOutlinedIcon/>
                            </IconButton>
                        </Tooltip>
                    </Stack>


                    <Menu
                        anchorEl={moreMenuAnchorElement}
                        open={!!moreMenuAnchorElement}
                        onClose={() => setMoreMenuAnchorElement(null)}
                    >
                        <MenuItem
                            onClick={() => {
                                setMoreMenuAnchorElement(null)
                                setIsGroupRenamerOpen(true)
                            }}
                        >
                            <ListItemIcon>
                                <DriveFileRenameOutlineOutlinedIcon/>
                            </ListItemIcon>
                            <ListItemText>Rename Group</ListItemText>
                        </MenuItem>

                        <MenuItem
                            onClick={() => {
                                setMoreMenuAnchorElement(null)
                                setIsGroupMemberEditorOpen(true)
                            }}
                        >
                            <ListItemIcon>
                                <PeopleOutlinedIcon/>
                            </ListItemIcon>
                            <ListItemText>Edit Members</ListItemText>
                        </MenuItem>

                        {!props.displayAsStandalone && (
                            <Link href={`/group/${props.groupId}`} style={{textDecoration: 'none', color: 'inherit'}}>
                                <MenuItem
                                    onClick={() => {
                                        setMoreMenuAnchorElement(null)
                                    }}
                                >
                                    <ListItemIcon>
                                        <OpenInNewOutlinedIcon color="secondary"/>
                                    </ListItemIcon>
                                    <ListItemText>Open this Group Standalone</ListItemText>
                                </MenuItem>
                            </Link>
                        )}
                    </Menu>

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

            <GroupMembersEditorDialog
                isOpen={isGroupMemberEditorOpen}
                onClose={() => setIsGroupMemberEditorOpen(false)}
                groupId={props.groupId}
            />


            {props.displayAsStandalone && (
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
                    {topicsToDisplay?.filter(it => props.showPrivateTopics || !it.isPrivate)?.map(topic => (
                        <Topic
                            key={topic.id}
                            initialTopic={topic}
                            afterTopicDeletionAttempt={(wasDeletionSurelySuccessful) => {
                                if (wasDeletionSurelySuccessful) {
                                    setTopicsToDisplay(prevState => prevState?.filter(it => it.id !== topic.id) ?? null)
                                } else {
                                    usedTopics.reloadEndpoint()
                                }
                            }}/>
                    ))}

                    {!isNewTopicAdderOpen && (
                        <Button
                            variant="outlined"
                            color="primary"
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
