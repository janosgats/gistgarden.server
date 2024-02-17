import React, {FC, useState} from "react";
import callServer from '@/util/frontend/callServer';
import {IconButton, keyframes, Stack, TextField, Tooltip} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface Props {
    groupId: number
    afterNewTopicSaved: () => void
}

const blinkKeyframes = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const NewTopicAdder: FC<Props> = (props) => {
    const [newTopicDescription, setNewTopicDescription] = useState<string>('')
    const [isBlinkAnimationOnAdderControlsEnabled, setIsBlinkAnimationOnAdderControlsEnabled] = useState<boolean>(false)

    async function saveNewTopic(isPrivate: boolean) {
        if (!newTopicDescription) {
            return
        }

        await callServer({
            url: '/api/topic/createTopicInGroup',
            method: "POST",
            data: {
                groupId: props.groupId,
                topicDescription: newTopicDescription,
                isPrivate: isPrivate,
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

    return (<Stack direction="row" alignItems="center">
        <AddOutlinedIcon sx={{marginRight: 1}}/>
        <TextField
            variant="standard"
            multiline
            fullWidth
            placeholder="Enter your new topic..."
            autoFocus
            value={newTopicDescription}
            onChange={e => setNewTopicDescription(e.target.value)}
            onBlur={() => setIsBlinkAnimationOnAdderControlsEnabled(true)}
            onFocus={() => setIsBlinkAnimationOnAdderControlsEnabled(false)}
            InputProps={{
                endAdornment: <Stack
                    direction="row"
                    sx={{
                        animation: isBlinkAnimationOnAdderControlsEnabled ? `${blinkKeyframes} 1s linear ` : undefined,
                    }}
                >
                    <Tooltip title="Add as Private (Only visible for You)">
                        <IconButton
                            sx={{display: 'flex', flexDirection: 'column', color: "red"}}
                            onClick={() => saveNewTopic(true)}
                            disabled={!newTopicDescription}
                        >
                            <LockOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Add as Public (Visible to all Group Members)">
                        <IconButton
                            color="primary"
                            sx={{display: 'flex', flexDirection: 'column'}}
                            onClick={() => saveNewTopic(false)}
                            disabled={!newTopicDescription}
                        >
                            <LockOpenOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                </Stack>,
            }}
        />
    </Stack>)
}