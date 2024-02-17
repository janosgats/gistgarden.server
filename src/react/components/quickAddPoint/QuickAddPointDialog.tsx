import React, {FC, useRef, useState} from "react";
import callServer from "@/util/frontend/callServer";
import {Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, Slide, Stack, Switch, TextField, Tooltip, Typography, useTheme} from '@mui/material';
import {TransitionProps} from '@mui/material/transitions';
import {AddToGroupSearcher} from '@/react/components/quickAddPoint/AddToGroupSearcher';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
    isOpen: boolean,
    onClose: () => void
}

export const QuickAddPointDialog: FC<Props> = (props) => {
    const theme = useTheme()
    const [newTopicDescription, setNewTopicDescription] = useState<string>('')
    const [isTopicSetToBePrivate, setIsTopicSetToBePrivate] = useState<boolean>(true)

    const topicDescriptionInputRef = useRef<HTMLElement>()


    return (<>
        <Dialog
            open={props.isOpen}
            onClose={props.onClose}
            TransitionComponent={Transition}
            fullWidth
        >
            <DialogTitle>{"'have a point?"}</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <TextField
                        inputRef={topicDescriptionInputRef}
                        variant="standard"
                        multiline
                        fullWidth
                        placeholder="Enter your new point..."
                        autoFocus
                        value={newTopicDescription}
                        onChange={e => setNewTopicDescription(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Clear">
                                        <IconButton onClick={() => {
                                            setNewTopicDescription('');
                                            topicDescriptionInputRef.current?.focus?.()
                                        }}>
                                            <ClearOutlinedIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Stack direction="row" alignItems="center">
                        <Typography variant="subtitle1">
                            Topic visibility:&nbsp;
                        </Typography>
                        <LockOpenOutlinedIcon sx={{color: isTopicSetToBePrivate ? undefined : theme.palette.accessControl.green}}/>
                        <Tooltip title={'Click to change to ' + (isTopicSetToBePrivate ? 'Public' : 'Private')}>
                            <Switch
                                checked={isTopicSetToBePrivate}
                                onClick={() => setIsTopicSetToBePrivate(prev => !prev)}
                                color="error"
                            />
                        </Tooltip>
                        <LockOutlinedIcon sx={{color: isTopicSetToBePrivate ? theme.palette.accessControl.red : undefined}}/>
                    </Stack>
                    <AddToGroupSearcher
                        onAddToGroupClicked={async (groupId) => addTopicToGroup({
                            groupId,
                            newTopicDescription,
                            isPrivate: isTopicSetToBePrivate,
                        })}
                        isTopicSetToBePrivate={isTopicSetToBePrivate}
                        closeDialog={props.onClose}
                    />
                </Stack>
            </DialogContent>
        </Dialog>
    </>)
}

async function addTopicToGroup(command: AddTopicToGroupCommand): Promise<void> {
    await callServer({
        url: '/api/topic/createTopicInGroup',
        method: "POST",
        data: {
            groupId: command.groupId,
            topicDescription: command.newTopicDescription,
            isPrivate: command.isPrivate,
        },
    })
        .catch((err) => {
            alert('Error while saving new topic. Please try again')
            throw err
        })
}

interface AddTopicToGroupCommand {
    groupId: number
    newTopicDescription: string
    isPrivate: boolean
}