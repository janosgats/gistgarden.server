import React, {FC, useState} from "react";
import useEndpoint from '@/react/hooks/useEndpoint';
import {SimpleGroupResponse} from '@/magicRouter/routes/groupManagementRoutes';
import callServer from '@/util/frontend/callServer';
import {Box, Button, CircularProgress, Collapse, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Tooltip, Typography} from '@mui/material';
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
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import {DragDropContext, Draggable, Droppable, DropResult} from '@hello-pangea/dnd';
import UnfoldLessOutlinedIcon from '@mui/icons-material/UnfoldLessOutlined';
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';

interface Props {
    groupId: number
    displayAsStandalone: boolean
    showPrivateTopics: boolean
}

export const GroupTopicsDisplay: FC<Props> = (props) => {
    const [isMinimized, setIsMinimized] = useState<boolean>(false)
    const [isNewTopicAdderOpen, setIsNewTopicAdderOpen] = useState<boolean>(false)
    const [shouldShowArchiveTopics, setShouldShowArchiveTopics] = useState<boolean>(false)
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


    const usedNonArchiveTopics = useEndpoint<SimpleTopicResponse[]>({
        config: {
            url: '/api/topic/listTopicsInGroup',
            method: "POST",
            data: {
                groupId: props.groupId,
                includeArchiveTopics: false,
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

    const usedAllTopics = useEndpoint<SimpleTopicResponse[]>({
        config: {
            url: '/api/topic/listTopicsInGroup',
            method: "POST",
            data: {
                groupId: props.groupId,
                includeArchiveTopics: true,
            },
        },
        customSuccessProcessor: (axiosResponse) => {
            setTopicsToDisplay(axiosResponse.data)
            return axiosResponse.data
        },
        onError: () => {
            setTopicsToDisplay(null)
        },
        sendRequestOnDependencyChange: shouldShowArchiveTopics,
    })

    function reloadTopics() {
        if (shouldShowArchiveTopics) {
            usedAllTopics.reloadEndpoint()
        } else {
            usedNonArchiveTopics.reloadEndpoint()
        }
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return; // dropped outside the list
        if (!topicsToDisplay) return;

        const topicsInNewOrder = [...topicsToDisplay];
        const [removed] = topicsInNewOrder.splice(result.source.index, 1);
        topicsInNewOrder.splice(result.destination.index, 0, removed);
        setTopicsToDisplay(topicsInNewOrder);


        callServer({
            url: '/api/topic/saveTopicDisplayOrder',
            method: "POST",
            data: {
                groupId: props.groupId,
                topicIdsInDisplayOrder: topicsInNewOrder.filter(it => !it.isArchive).map(it => it.id),
            },
        }).catch((e) => {
            console.error('API call to save TopicOrder failed', e)
        })
    };

    return (
        <>
            <UsedEndpointSuspense usedEndpoint={usedGroup} pendingNode={<Stack><CircularProgress/></Stack>} failedNode={'Error loading group name :/'}>
                <Stack display="flex" direction="row" justifyContent="space-between">

                    <Stack direction="row">
                        <Typography variant="h4" marginBottom={1}>
                            {usedGroup.data?.name}
                        </Typography>
                        <Tooltip title="Click for More">
                            <IconButton onClick={e => setMoreMenuAnchorElement(e.currentTarget)}>
                                <MoreHorizOutlinedIcon/>
                            </IconButton>
                        </Tooltip>
                    </Stack>

                    <Box>
                        <Tooltip title={isMinimized ? "Expand Group" : "Collapse Group"}>
                            <IconButton color="secondary" onClick={() => setIsMinimized(prev => !prev)}>
                                {isMinimized ? <UnfoldMoreOutlinedIcon/> : <UnfoldLessOutlinedIcon/>}
                            </IconButton>
                        </Tooltip>
                    </Box>


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


            <Collapse in={!isMinimized} collapsedSize={0}>


                {usedNonArchiveTopics.pending && <p>Loading topics...</p>}
                {(usedAllTopics.failed || usedNonArchiveTopics.failed) && <p>Failed to load topics :/ <button onClick={() => reloadTopics()}>Retry</button></p>}
                <Stack spacing={2}>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="nonArchiveTopicsList">
                            {(droppableProvided) => (
                                <Stack spacing={2} ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                                    {topicsToDisplay
                                        ?.map((topic, index) => (
                                            <Draggable key={topic.id} draggableId={topic.id.toString()} index={index}>
                                                {(draggableProvided) => {
                                                    const isTopicDisplayed = (props.showPrivateTopics || !topic.isPrivate) && !topic.isArchive
                                                    if (!isTopicDisplayed) {
                                                        return <div
                                                            ref={draggableProvided.innerRef}
                                                            key={topic.id}
                                                            {...draggableProvided.draggableProps}
                                                            {...draggableProvided.dragHandleProps}
                                                            style={{display: 'none'}}
                                                        />
                                                    }

                                                    return (
                                                        <Topic
                                                            draggableProvided={draggableProvided}
                                                            key={topic.id}
                                                            initialTopic={topic}
                                                            afterTopicDeletionAttempt={(wasDeletionSurelySuccessful) => {
                                                                if (wasDeletionSurelySuccessful) {
                                                                    setTopicsToDisplay(prevState => prevState?.filter(it => it.id !== topic.id) ?? null)
                                                                } else {
                                                                    reloadTopics()
                                                                }
                                                            }}
                                                            afterSetIsArchiveStateAttempt={(wasSurelySuccessful, newIsArchive) => {
                                                                if (wasSurelySuccessful) {
                                                                    setTopicsToDisplay(prevState => prevState?.map(it => {
                                                                        if (it.id === topic.id) {
                                                                            return {
                                                                                ...it,
                                                                                isArchive: newIsArchive,
                                                                            }
                                                                        }
                                                                        return it
                                                                    }) || null)
                                                                } else {
                                                                    reloadTopics()
                                                                }
                                                            }}
                                                        />
                                                    )
                                                }}
                                            </Draggable>
                                        ))}
                                    {droppableProvided.placeholder}
                                </Stack>
                            )}
                        </Droppable>
                    </DragDropContext>

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
                            reloadTopics()
                            setIsNewTopicAdderOpen(false)
                        }}/>
                    )}
                </Stack>

                <Stack marginTop={2}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setShouldShowArchiveTopics(prevState => !prevState)}
                        fullWidth
                        startIcon={shouldShowArchiveTopics ? <KeyboardDoubleArrowUpOutlinedIcon/> : <KeyboardDoubleArrowDownOutlinedIcon/>}
                        endIcon={shouldShowArchiveTopics ? <KeyboardDoubleArrowUpOutlinedIcon/> : <KeyboardDoubleArrowDownOutlinedIcon/>}
                    >
                        {shouldShowArchiveTopics ? 'Hide' : 'Show'} archive topics
                    </Button>


                    {shouldShowArchiveTopics && (
                        <UsedEndpointSuspense usedEndpoint={usedAllTopics}>
                            <Stack spacing={2}>
                                {topicsToDisplay
                                    ?.filter(it => props.showPrivateTopics || !it.isPrivate)
                                    ?.filter(it => it.isArchive)
                                    ?.map(topic => (
                                        <Topic
                                            key={topic.id}
                                            initialTopic={topic}
                                            afterTopicDeletionAttempt={(wasDeletionSurelySuccessful) => {
                                                if (wasDeletionSurelySuccessful) {
                                                    setTopicsToDisplay(prevState => prevState?.filter(it => it.id !== topic.id) ?? null)
                                                } else {
                                                    reloadTopics()
                                                }
                                            }}
                                            afterSetIsArchiveStateAttempt={(wasSurelySuccessful, newIsArchive) => {
                                                if (wasSurelySuccessful) {
                                                    setTopicsToDisplay(prevState => prevState?.map(it => {
                                                        if (it.id === topic.id) {
                                                            return {
                                                                ...it,
                                                                isArchive: newIsArchive,
                                                            }
                                                        }
                                                        return it
                                                    }) || null)
                                                } else {
                                                    reloadTopics()
                                                }
                                            }}
                                        />
                                    ))}
                            </Stack>
                        </UsedEndpointSuspense>
                    )}
                </Stack>
            </Collapse>
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
