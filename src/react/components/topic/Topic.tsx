import React, {FC, useState} from "react";
import callServer from "@/util/frontend/callServer";
import {Avatar, Box, Checkbox, CircularProgress, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField, Tooltip, useTheme} from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import {ProgressColors} from '@/react/res/ProgressColors';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import {SimpleTopicResponse} from '@/magicRouter/routes/topicRoutes';
import {useCurrentUserContext} from '@/react/context/CurrentUserContext';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import "@/react/theme/augmentedTheme"
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import useAction from '@/react/hooks/useAction';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import {TopicCommentsDisplay} from '@/react/components/topic/TopicCommentsDisplay';

interface Props {
    initialTopic: SimpleTopicResponse,
    afterTopicDeletionAttempt: (wasDeletionSurelySuccessful: boolean) => void
    afterSetIsArchiveStateAttempt: (wasSurelySuccessful: boolean, newIsArchive: boolean) => void
}

export const Topic: FC<Props> = (props) => {
    const theme = useTheme();
    const currentUserContext = useCurrentUserContext()


    const [lastSavedTopicState, setLastSavedTopicState] = useState<SimpleTopicResponse>(props.initialTopic)
    const [didLastSaveDescriptionFinishInTheNearPast, setDidLastSaveDescriptionFinishInTheNearPast] = useState<boolean>(false)
    const [description, setDescription] = useState<string>(props.initialTopic.description)

    const [moreMenuAnchorElement, setMoreMenuAnchorElement] = useState<null | HTMLElement>(null);

    const [isTopicCommentAdderOpen, setIsTopicCommentAdderOpen] = useState<boolean>(false)


    const usedToggleIsPrivate = useAction({
        actionFunction: async () => {
            const newIsPrivate = !lastSavedTopicState.isPrivate

            if (!newIsPrivate && !confirm("Are you sure you want to make this topic public? Every member of this group will see it.")) {
                return
            }

            await callServer({
                url: '/api/topic/setIsPrivateState',
                method: 'POST',
                data: {
                    topicId: props.initialTopic.id,
                    newIsPrivate: newIsPrivate,
                },
            })
                .then(() => {
                    setLastSavedTopicState((prevState) => ({...prevState, isPrivate: newIsPrivate}))
                })
                .catch((err) => {
                    alert('Error while toggling privacy setting of topic')
                    throw err
                })
        },
    })

    const usedToggleIsDone = useAction({
        actionFunction: async () => {
            const newIsDone = !lastSavedTopicState.isDone

            await callServer({
                url: '/api/topic/setIsDoneState',
                method: 'POST',
                data: {
                    topicId: props.initialTopic.id,
                    newIsDone: newIsDone,
                },
            })
                .then(() => {
                    setLastSavedTopicState((prevState) => ({...prevState, isDone: newIsDone}))
                })
        },
    })

    const usedDeleteTopic = useAction({
        actionFunction: async () => {
            if (!confirm("Do you want to delete this topic? This action cannot be undone")) {
                return
            }

            await callServer({
                url: '/api/topic/deleteTopic',
                method: "DELETE",
                data: {
                    topicId: props.initialTopic.id,
                },
            })
                .then(() => {
                    props.afterTopicDeletionAttempt(true)
                })
                .catch((err) => {
                    alert('Error while deleting topic')
                    props.afterTopicDeletionAttempt(false)
                    throw err
                })
        },
    })

    const usedSetIsArchiveState = useAction<boolean>({
        actionFunction: async (newIsArchive) => {
            await callServer({
                url: '/api/topic/setIsArchiveState',
                method: "POST",
                data: {
                    topicId: props.initialTopic.id,
                    newIsArchive: newIsArchive,
                },
            })
                .then(() => {
                    setLastSavedTopicState((prevState) => ({...prevState, isArchive: newIsArchive}))
                    props.afterSetIsArchiveStateAttempt(true, newIsArchive)
                })
                .catch((err) => {
                    alert('Error while ' + (newIsArchive ? '' : 'un') + 'archiving topic')
                    props.afterSetIsArchiveStateAttempt(false, newIsArchive)
                    throw err
                })
        },
    })

    const usedSaveNewDescriptionIfChanged = useAction({
        actionFunction: async () => {
            if (description === lastSavedTopicState.description) {
                return
            }

            await callServer({
                url: '/api/topic/setDescription',
                method: 'POST',
                data: {
                    topicId: props.initialTopic.id,
                    newDescription: description,
                },
            })
                .then(() => {
                    setLastSavedTopicState((prevState) => ({...prevState, description: description}))
                })
                .finally(() => {
                    setDidLastSaveDescriptionFinishInTheNearPast(true)
                    setTimeout(() => {
                        setDidLastSaveDescriptionFinishInTheNearPast(false)
                    }, 1500)
                })
        },
    })

    const wasTopicCreatedByCurrentUser = (props.initialTopic.creatorUserId === currentUserContext.userId) || !props.initialTopic.creatorUserId

    return (<Box>
        <Stack direction="row">
            <Stack sx={{
                flexDirection: 'row',
                [theme.breakpoints.down('md')]: {
                    flexDirection: 'column-reverse',
                    justifyContent: 'start',
                },
            }}>
                <Stack>
                    <Tooltip title="Drag to reorder">
                        <IconButton sx={{paddingLeft: 0, paddingRight: 0}} onClick={() => alert('TODO: ordering is not yet implemented')}>
                            <DragIndicatorOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Stack>
                    {usedToggleIsDone.pending ? (
                        <CircularProgress size="1.375rem" sx={{margin: '10px', color: ProgressColors.pending}}/>
                    ) : (
                        <Checkbox
                            color="secondary"
                            sx={{
                                color: lastSavedTopicState.isPrivate ? theme.palette.accessControl.red : 'secondary',
                                '&.Mui-checked': {
                                    color: lastSavedTopicState.isPrivate ? theme.palette.accessControl.red : 'secondary',
                                },
                            }}
                            checked={lastSavedTopicState.isDone}
                            onChange={() => usedToggleIsDone.run()}
                        />
                    )}
                    {usedToggleIsDone.failed && <span>Error while saving <button onClick={() => usedToggleIsDone.run()}>Retry</button></span>}

                </Stack>
            </Stack>

            <TextField
                variant="standard"
                multiline
                fullWidth
                placeholder="Enter some text..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={() => usedSaveNewDescriptionIfChanged.run()}
                disabled={lastSavedTopicState.isDone}
                sx={{...(lastSavedTopicState?.isDone && {textDecoration: "line-through", color: 'gray'})}}
                InputProps={{
                    ...(wasTopicCreatedByCurrentUser ? {} : {
                        readOnly: true,
                        sx: {
                            "&:hover:not(.Mui-disabled, .Mui-error):before": {
                                borderBottom: "1px solid rgba(255, 255, 255, 0.7)",
                            },
                            '&::after': {
                                borderBottomStyle: 'none',
                            },
                        },
                    }),
                    ...(lastSavedTopicState.isPrivate && {
                        endAdornment: (
                            <Tooltip title={'Private topic. Only visible for You'}>
                                <LockOutlinedIcon sx={{color: theme.palette.accessControl.red}}/>
                            </Tooltip>
                        ),
                        sx: {
                            "&:before": {
                                borderBottomColor: theme.palette.accessControl.red,
                            },
                            '&::after': {
                                borderBottomColor: theme.palette.accessControl.red,
                            },
                        },
                    }),
                }}
            />

            {usedSaveNewDescriptionIfChanged.pending && (
                <CircularProgress size="1.375rem" sx={{marginTop: '0.7rem', marginLeft: '-1.9rem', color: ProgressColors.pending}}/>
            )}

            {usedSaveNewDescriptionIfChanged.succeeded && didLastSaveDescriptionFinishInTheNearPast && (
                <CheckCircleOutlinedIcon sx={{marginTop: '0.7rem', marginLeft: '-1.9rem', color: ProgressColors.success}}/>
            )}
            {usedSaveNewDescriptionIfChanged.failed && <span>Error while saving <button onClick={() => usedSaveNewDescriptionIfChanged.run()}>Retry</button></span>}


            <Stack
                direction="row"
                sx={theme => ({
                    [theme.breakpoints.down('md')]: {
                        display: 'none',
                    },
                })}
            >
                <Stack>
                    <Tooltip title="Add comment">
                        <IconButton onClick={() => setIsTopicCommentAdderOpen(true)}>
                            <CommentOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Stack>
                    <Tooltip title={lastSavedTopicState.isArchive ? 'Unarchive' : 'Archive'}>
                        <IconButton
                            onClick={() => usedSetIsArchiveState.run(!lastSavedTopicState.isArchive)}>
                            {lastSavedTopicState.isArchive ? (
                                <UnarchiveOutlinedIcon sx={{color: "orangered"}}/>
                            ) : (
                                <ArchiveOutlinedIcon sx={{color: "orange"}}/>
                            )}
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            <Stack sx={{
                flexDirection: 'row',
                [theme.breakpoints.down('md')]: {
                    flexDirection: 'column-reverse',
                    justifyContent: 'start',
                },
            }}>
                <Stack>
                    <Tooltip title="Click for More">
                        <IconButton onClick={e => setMoreMenuAnchorElement(e.currentTarget)}>
                            <MoreVertOutlinedIcon/>
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
                            setIsTopicCommentAdderOpen(true)
                        }}
                        sx={{
                            [theme.breakpoints.up('md')]: {
                                display: 'none',
                            },
                        }}
                    >
                        <ListItemIcon>
                            <CommentOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText>Comment</ListItemText>
                    </MenuItem>

                    <MenuItem
                        onClick={() => usedSetIsArchiveState.run(!lastSavedTopicState.isArchive).then(() => setMoreMenuAnchorElement(null))}
                        disabled={usedSetIsArchiveState.pending}
                        sx={{
                            [theme.breakpoints.up('md')]: {
                                display: 'none',
                            },
                        }}
                    >
                        <ListItemIcon>
                            {lastSavedTopicState.isArchive ? (
                                <UnarchiveOutlinedIcon sx={{color: "orangered"}}/>
                            ) : (
                                <ArchiveOutlinedIcon sx={{color: "orange"}}/>
                            )}
                        </ListItemIcon>
                        <ListItemText>{lastSavedTopicState.isArchive ? 'Unarchive' : 'Archive'}</ListItemText>
                    </MenuItem>

                    <MenuItem
                        onClick={() => usedToggleIsPrivate.run().then(() => setMoreMenuAnchorElement(null))}
                        disabled={usedToggleIsPrivate.pending}
                    >
                        <ListItemIcon sx={{color: lastSavedTopicState.isPrivate ? theme.palette.accessControl.green : theme.palette.accessControl.red}}>
                            {lastSavedTopicState.isPrivate ? (
                                <LockOpenOutlinedIcon/>
                            ) : (
                                <LockOutlinedIcon/>
                            )}
                        </ListItemIcon>
                        <ListItemText>Make {lastSavedTopicState.isPrivate ? 'Public' : 'Private'}</ListItemText>
                    </MenuItem>

                    <MenuItem
                        onClick={() => usedDeleteTopic.run().then(() => setMoreMenuAnchorElement(null))}
                        disabled={usedDeleteTopic.pending}
                    >
                        <ListItemIcon sx={{color: "red"}}>
                            <DeleteForeverOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                </Menu>

                <Stack>
                    <Tooltip title={"Added by user " + props.initialTopic.creatorUserId}>
                        <div style={{padding: 8}}>
                            <Avatar sx={{width: 26, height: 26, display: 'inline-flex'}}>
                                {props.initialTopic.creatorUserId}
                            </Avatar>
                        </div>
                    </Tooltip>
                </Stack>
            </Stack>
        </Stack>

        <Box sx={{paddingLeft: 9}}>
            <TopicCommentsDisplay
                topicId={props.initialTopic.id}
                isCommentAdderOpen={isTopicCommentAdderOpen}
                onCommentAdderClose={() => setIsTopicCommentAdderOpen(false)}
            />
        </Box>
    </Box>)
}