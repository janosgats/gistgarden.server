import React, {FC, useState} from "react";
import {CallStatus} from "@/util/both/CallStatus";
import callServer from "@/util/frontend/callServer";
import {Avatar, Checkbox, CircularProgress, IconButton, Stack, TextField, Tooltip} from '@mui/material';
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

interface Props {
    initialTopic: SimpleTopicResponse,
    onDeleteRequest: () => void
}

export const Topic: FC<Props> = (props) => {
    const currentUserContext = useCurrentUserContext()

    const [lastSavedTopicState, setLastSavedTopicState] = useState<SimpleTopicResponse>(props.initialTopic)
    const [description, setDescription] = useState<string>(props.initialTopic.description)

    const [saveNewDescriptionCallStatus, setSaveNewDescriptionCallStatus] = useState<CallStatus>(CallStatus.OPEN)
    const [didLastSaveFinishInTheNearPast, setDidLastSaveFinishInTheNearPast] = useState<boolean>(false)
    const [toggleIsDoneStateCallStatus, setToggleIsDoneStateCallStatus] = useState<CallStatus>(CallStatus.OPEN)
    const [toggleIsPrivateStateCallStatus, setToggleIsPrivateStateCallStatus] = useState<CallStatus>(CallStatus.OPEN)


    async function saveNewDescriptionIfChanged() {
        if (description === lastSavedTopicState.description) {
            return
        }

        setSaveNewDescriptionCallStatus(CallStatus.PENDING)

        await callServer({
            url: '/api/topic/setDescription',
            method: 'POST',
            data: {
                topicId: props.initialTopic.id,
                newDescription: description,
            },
        })
            .then(() => {
                setSaveNewDescriptionCallStatus(CallStatus.SUCCEEDED)
                setLastSavedTopicState((prevState) => ({...prevState, description: description}))
            })
            .catch(() => {
                setSaveNewDescriptionCallStatus(CallStatus.FAILED)
            })
            .finally(() => {
                setDidLastSaveFinishInTheNearPast(true)
                setTimeout(() => {
                    setDidLastSaveFinishInTheNearPast(false)
                }, 1500)
            })
    }

    async function toggleIsDoneState() {
        const newIsDone = !lastSavedTopicState.isDone

        setToggleIsDoneStateCallStatus(CallStatus.PENDING)

        await callServer({
            url: '/api/topic/setIsDoneState',
            method: 'POST',
            data: {
                topicId: props.initialTopic.id,
                newIsDone: newIsDone,
            },
        })
            .then(() => {
                setToggleIsDoneStateCallStatus(CallStatus.SUCCEEDED)
                setLastSavedTopicState((prevState) => ({...prevState, isDone: newIsDone}))
            })
            .catch(() => {
                setToggleIsDoneStateCallStatus(CallStatus.FAILED)
            })
    }

    async function toggleIsPrivateState() {
        const newIsPrivate = !lastSavedTopicState.isPrivate

        if (!newIsPrivate && !confirm("Are you sure you want to make this topic public? Every member of this group will see it.")) {
            return
        }

        setToggleIsPrivateStateCallStatus(CallStatus.PENDING)

        callServer({
            url: '/api/topic/setIsPrivateState',
            method: 'POST',
            data: {
                topicId: props.initialTopic.id,
                newIsPrivate: newIsPrivate,
            },
        })
            .then(() => {
                setToggleIsPrivateStateCallStatus(CallStatus.SUCCEEDED)
                setLastSavedTopicState((prevState) => ({...prevState, isPrivate: newIsPrivate}))
            })
            .catch(() => {
                setToggleIsPrivateStateCallStatus(CallStatus.FAILED)
                alert('Error while toggling privacy setting of topic')
            })
    }

    const wasTopicCreatedByCurrentUser = (props.initialTopic.creatorUserId === currentUserContext.userId) || !props.initialTopic.creatorUserId

    return (<Stack direction="row">
        <Stack>
            <Tooltip title="Drag to reorder">
                <IconButton sx={{paddingLeft: 0, paddingRight: 0}}>
                    <DragIndicatorOutlinedIcon/>
                </IconButton>
            </Tooltip>
        </Stack>
        <Stack>
            {toggleIsDoneStateCallStatus === CallStatus.PENDING ? (
                <CircularProgress size="1.375rem" sx={{margin: '10px', color: ProgressColors.pending}}/>
            ) : (
                <Checkbox
                    color="secondary"
                    checked={lastSavedTopicState.isDone}
                    onChange={() => toggleIsDoneState()}
                />
            )}
            {toggleIsDoneStateCallStatus === CallStatus.FAILED && <span>Error while saving <button onClick={() => toggleIsDoneState()}>Retry</button></span>}

        </Stack>

        <TextField
            variant="standard"
            multiline
            fullWidth
            placeholder="Enter some text..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            onBlur={() => saveNewDescriptionIfChanged()}
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

        {saveNewDescriptionCallStatus === CallStatus.PENDING && (
            <CircularProgress size="1.375rem" sx={{marginTop: '0.7rem', marginLeft: '-1.9rem', color: ProgressColors.pending}}/>
        )}

        {saveNewDescriptionCallStatus === CallStatus.SUCCEEDED && didLastSaveFinishInTheNearPast && (
            <CheckCircleOutlinedIcon sx={{marginTop: '0.7rem', marginLeft: '-1.9rem', color: ProgressColors.success}}/>
        )}
        {saveNewDescriptionCallStatus === CallStatus.FAILED && <span>Error while saving <button onClick={() => saveNewDescriptionIfChanged()}>Retry</button></span>}

        <Stack>
            <Tooltip title={`${lastSavedTopicState.isPrivate ? 'Only visible for You' : 'Visible for all Group Members'} (Click to toggle)`}>
                <IconButton
                    onClick={() => toggleIsPrivateState()}
                    disabled={toggleIsPrivateStateCallStatus === CallStatus.PENDING}
                    sx={theme => ({color: lastSavedTopicState.isPrivate ? theme.palette.accessControl.red : theme.palette.accessControl.green})}
                >
                    {lastSavedTopicState.isPrivate ? (
                        <LockOutlinedIcon/>
                    ) : (
                        <LockOpenOutlinedIcon></LockOpenOutlinedIcon>
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
        <Stack>
            <Tooltip title="Delete Topic">
                <IconButton onClick={() => {
                    confirm("Do you want to delete this topic? This action cannot be undone") && props.onDeleteRequest()
                }}>
                    <DeleteForeverOutlinedIcon sx={{color: "red"}}/>
                </IconButton>
            </Tooltip>
        </Stack>
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