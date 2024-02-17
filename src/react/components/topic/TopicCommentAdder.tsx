import React, {FC, useState} from "react";
import {CircularProgress, Stack, TextField, useTheme} from '@mui/material';
import {ProgressColors} from '@/react/res/ProgressColors';
import "@/react/theme/augmentedTheme"
import {UsedAction} from '@/react/hooks/useAction';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

interface Props {
    usedAddComment: UsedAction<string, void>
}

export const TopicCommentAdder: FC<Props> = (props) => {
    const theme = useTheme()
    const [description, setDescription] = useState<string>('')


    return (<Stack direction="row">
        <TextField
            variant="standard"
            size="small"
            autoFocus
            multiline
            fullWidth
            placeholder="Add new comment..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            onBlur={() => description && props.usedAddComment.run(description)}
            color="secondary"
            InputProps={{
                startAdornment: (
                    <AddOutlinedIcon sx={{color: theme.palette.text.secondary}}/>
                ),
                sx: {
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
                },
            }}
        />

        {props.usedAddComment.pending && (
            <CircularProgress size="1.375rem" sx={{marginTop: '0.7rem', marginLeft: '-1.9rem', color: ProgressColors.pending}}/>
        )}
        {props.usedAddComment.failed && <span>Error while saving new comment<button onClick={() => props.usedAddComment.run(description)}>Retry</button></span>}

    </Stack>)
}