import React, {FC, useRef, useState} from "react";
import callServer from "@/util/frontend/callServer";
import {Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, Slide, TextField, Tooltip} from '@mui/material';
import {TransitionProps} from '@mui/material/transitions';
import {AddToGroupSearcher} from '@/react/components/quickAddPoint/AddToGroupSearcher';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';


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
    const [newTopicDescription, setNewTopicDescription] = useState<string>('')

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
                <br/>
                <br/>
                <AddToGroupSearcher onAddToGroupClicked={async (groupId) => addTopicToGroup(groupId, newTopicDescription)} closeDialog={props.onClose}/>
            </DialogContent>
        </Dialog>
    </>)
}

async function addTopicToGroup(groupId: number, newTopicDescription: string): Promise<void> {
    await callServer({
        url: '/api/topic/createTopicInGroup',
        method: "POST",
        data: {
            groupId: groupId,
            topicDescription: newTopicDescription,
        },
    })
        .catch((err) => {
            alert('Error while saving new topic. Please try again')
            throw err
        })
}