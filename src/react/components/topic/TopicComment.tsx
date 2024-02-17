import React, {FC, useState} from "react";
import callServer from "@/util/frontend/callServer";
import {Avatar, Box, CircularProgress, IconButton, Stack, TextField, Tooltip} from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import {ProgressColors} from '@/react/res/ProgressColors';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import {useCurrentUserContext} from '@/react/context/CurrentUserContext';
import "@/react/theme/augmentedTheme"
import useAction from '@/react/hooks/useAction';
import {SimpleTopicCommentResponse} from '@/magicRouter/routes/topicCommentRoutes';

interface Props {
    initialTopicComment: SimpleTopicCommentResponse,
    afterDeletionAttempt: (wasDeletionSurelySuccessful: boolean) => void,
}

export const TopicComment: FC<Props> = (props) => {
    const currentUserContext = useCurrentUserContext()


    const [lastSavedTopicCommentState, setLastSavedTopicCommentState] = useState<SimpleTopicCommentResponse>(props.initialTopicComment)
    const [description, setDescription] = useState<string>(props.initialTopicComment.description)

    const [didLastSaveDescriptionFinishInTheNearPast, setDidLastSaveDescriptionFinishInTheNearPast] = useState<boolean>(false)


    const usedDeleteComment = useAction({
        actionFunction: async () => {
            if (!confirm("Do you want to delete this comment? This action cannot be undone")) {
                return
            }

            await callServer({
                url: '/api/topicComment/deleteComment',
                method: "DELETE",
                data: {
                    topicCommentId: props.initialTopicComment.id,
                },
            }).then(() => {
                props.afterDeletionAttempt(true)
            })
                .catch((err) => {
                    alert('Error while deleting comment')
                    props.afterDeletionAttempt(false)
                    throw err
                })
        },
    })

    const usedSaveNewDescriptionIfChanged = useAction({
        actionFunction: async () => {
            if (description === lastSavedTopicCommentState.description) {
                return
            }

            await callServer({
                url: '/api/topicComment/setDescription',
                method: 'POST',
                data: {
                    topicCommentId: props.initialTopicComment.id,
                    newDescription: description,
                },
            })
                .then(() => {
                    setLastSavedTopicCommentState((prevState) => ({...prevState, description: description}))
                })
                .finally(() => {
                    setDidLastSaveDescriptionFinishInTheNearPast(true)
                    setTimeout(() => {
                        setDidLastSaveDescriptionFinishInTheNearPast(false)
                    }, 1500)
                })
        },
    })

    const wasCommentCreatedByCurrentUser = (props.initialTopicComment.creatorUserId === currentUserContext.userId) || !props.initialTopicComment.creatorUserId

    return (<Stack direction="row">
        <TextField
            variant="standard"
            size="small"
            multiline
            fullWidth
            placeholder="Enter some text..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            onBlur={() => usedSaveNewDescriptionIfChanged.run()}
            color="secondary"
            InputProps={{
                startAdornment: (
                    <Tooltip title={"Commented by user " + props.initialTopicComment.creatorUserId}>
                        <Box style={{paddingRight: 6}}>
                            <Avatar sx={{width: 20, height: 20, display: 'inline-flex'}}>
                                {props.initialTopicComment.creatorUserId}
                            </Avatar>
                        </Box>
                    </Tooltip>
                ),
                ...(wasCommentCreatedByCurrentUser ? {
                    endAdornment: (
                        <Tooltip title="Delete comment">
                            <IconButton
                                onClick={() => usedDeleteComment.run()}
                                disabled={usedDeleteComment.pending}
                                size="small"
                                sx={{paddingTop: 0, paddingBottom: 0, marginBottom: 0, color: 'red'}}
                                className="comment-end-adornment"
                            >
                                <DeleteForeverOutlinedIcon sx={{width: 22, height: 22}}/>
                            </IconButton>
                        </Tooltip>
                    ),
                } : {
                    disableUnderline: true,
                    readOnly: true,
                }),

                sx: {
                    ...(wasCommentCreatedByCurrentUser && {
                        '&:before': {
                            borderBottomStyle: 'none',
                        },
                        "&:hover:not(.Mui-disabled, .Mui-error):before": {
                            borderBottomStyle: "dashed",
                            borderBottomWidth: "1px",
                        },
                        '&::after': {
                            borderBottomStyle: 'dashed',
                            borderBottomWidth: "1px",
                        },
                    }),
                    "& .comment-end-adornment": {
                        display: 'none',
                    },
                    "&:hover .comment-end-adornment": {
                        display: 'inline-flex',
                    },
                },
            }}
        />

        {usedSaveNewDescriptionIfChanged.pending && (
            <CircularProgress size="1.1rem" sx={{marginTop: '0.7rem', marginLeft: '-1.9rem', color: ProgressColors.pending}}/>
        )}

        {usedSaveNewDescriptionIfChanged.succeeded && didLastSaveDescriptionFinishInTheNearPast && (
            <CheckCircleOutlinedIcon sx={{
                marginTop: '0.7rem', marginLeft: '-1.9rem',
                color: ProgressColors.success, fontSize: "1.1rem",
            }}/>
        )}
        {usedSaveNewDescriptionIfChanged.failed && <span>Error while saving comment<button onClick={() => usedSaveNewDescriptionIfChanged.run()}>Retry</button></span>}

    </Stack>)
}