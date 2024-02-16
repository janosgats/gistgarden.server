import React, {FC, useState} from "react";
import callServer from "@/util/frontend/callServer";
import {Avatar, Checkbox, CircularProgress, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField, Tooltip} from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import {ProgressColors} from '@/react/res/ProgressColors';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import {SimpleTopicResponse} from '@/magicRouter/routes/topicRoutes';
import {useCurrentUserContext} from '@/react/context/CurrentUserContext';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import "@/react/theme/augmentedTheme"
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import useAction from '@/react/hooks/useAction';

interface Props {
    initialTopic: SimpleTopicResponse,
    afterTopicDeletionAttempt: (wasDeletionSurelySuccessful: boolean) => void
}

export const Topic: FC<Props> = (props) => {
    const currentUserContext = useCurrentUserContext()

    const [lastSavedTopicState, setLastSavedTopicState] = useState<SimpleTopicResponse>(props.initialTopic)
    const [description, setDescription] = useState<string>(props.initialTopic.description)

    const [didLastSaveDescriptionFinishInTheNearPast, setDidLastSaveDescriptionFinishInTheNearPast] = useState<boolean>(false)

    const [moreMenuAnchorElement, setMoreMenuAnchorElement] = useState<null | HTMLElement>(null);


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

    return (<Stack direction="row">
        <Stack>
            <Tooltip title="Drag to reorder">
                <IconButton sx={{paddingLeft: 0, paddingRight: 0, color: lastSavedTopicState.isPrivate ? 'red' : undefined}}>
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
                    sx={theme => ({
                        color: lastSavedTopicState.isPrivate ? theme.palette.accessControl.red : 'secondary',
                        '&.Mui-checked': {
                            color: lastSavedTopicState.isPrivate ? theme.palette.accessControl.red : 'secondary',
                        },
                    })
                    }
                    checked={lastSavedTopicState.isDone}
                    onChange={() => usedToggleIsDone.run()}
                />
            )}
            {usedToggleIsDone.failed && <span>Error while saving <button onClick={() => usedToggleIsDone.run()}>Retry</button></span>}

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
                        '&::after': {
                            borderBottomColor: 'white',
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
                <Tooltip title={`${lastSavedTopicState.isPrivate ? 'Only visible for You' : 'Visible for all Group Members'} (Click to toggle)`}>
                    <IconButton
                        onClick={() => usedToggleIsPrivate.run()}
                        disabled={usedToggleIsPrivate.pending}
                        sx={theme => ({color: lastSavedTopicState.isPrivate ? theme.palette.accessControl.red : theme.palette.accessControl.green})}
                    >
                        {lastSavedTopicState.isPrivate ? (
                            <LockOutlinedIcon/>
                        ) : (
                            <LockOpenOutlinedIcon/>
                        )}
                    </IconButton>
                </Tooltip>
            </Stack>
            <Stack>
                <Tooltip title="Archive">
                    <IconButton onClick={() => alert('TODO: implement archival')}>
                        <ArchiveOutlinedIcon sx={{color: "orange"}}/>
                    </IconButton>
                </Tooltip>
            </Stack>
        </Stack>

        <Stack>
            <IconButton onClick={e => setMoreMenuAnchorElement(e.currentTarget)} sx={{color: lastSavedTopicState.isPrivate ? 'red' : undefined}}>
                <MoreVertOutlinedIcon/>
            </IconButton>
        </Stack>

        <Menu
            id="basic-menu"
            anchorEl={moreMenuAnchorElement}
            open={!!moreMenuAnchorElement}
            onClose={() => setMoreMenuAnchorElement(null)}
        >
            <MenuItem
                onClick={() => usedToggleIsPrivate.run().then(() => setMoreMenuAnchorElement(null))}
                disabled={usedToggleIsPrivate.pending}

                sx={theme => ({
                    [theme.breakpoints.up('md')]: {
                        display: 'none',
                    },
                })}
            >
                <ListItemIcon sx={theme => ({color: lastSavedTopicState.isPrivate ? theme.palette.accessControl.red : theme.palette.accessControl.green})}>
                    {lastSavedTopicState.isPrivate ? (
                        <LockOutlinedIcon/>
                    ) : (
                        <LockOpenOutlinedIcon/>
                    )}
                </ListItemIcon>
                <ListItemText>Make {lastSavedTopicState.isPrivate ? 'Public' : 'Private'}</ListItemText>
            </MenuItem>

            <MenuItem
                onClick={() => alert('TODO: implement archival')}
                sx={theme => ({
                    [theme.breakpoints.up('md')]: {
                        display: 'none',
                    },
                })}
            >
                <ListItemIcon sx={{color: "orange"}}>
                    <ArchiveOutlinedIcon/>
                </ListItemIcon>
                <ListItemText>Archive</ListItemText>
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
    </Stack>)
}