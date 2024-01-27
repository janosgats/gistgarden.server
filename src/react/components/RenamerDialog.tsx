import React, {FC, useEffect, useRef, useState} from "react";
import {Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, Slide, Stack, TextField, Tooltip} from '@mui/material';
import {TransitionProps} from '@mui/material/transitions';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import {isValidNonEmptyString} from '@/util/both/CommonValidators';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

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
    originalName: string
    onSubmit: (newName: string) => Promise<void>
}

export const RenamerDialog: FC<Props> = (props) => {
    const newNameInputRef = useRef<HTMLElement>()

    const [newNameInput, setNewNameInput] = useState<string>(props.originalName)
    const [isRenamePromisePending, setIsRenamePromisePending] = useState<boolean>(false)

    useEffect(() => {
        setNewNameInput(props.originalName)
    }, [props.originalName])

    useEffect(() => {
        if (props.isOpen) {
            setNewNameInput(props.originalName)
        }
    }, [props.isOpen])


    function handleRenameClick() {
        setIsRenamePromisePending(true)

        props.onSubmit(newNameInput)
            .finally(() => {
                setIsRenamePromisePending(false)
            })
    }


    return (<>
        <Dialog
            open={props.isOpen}
            onClose={props.onClose}
            TransitionComponent={Transition}
            fullWidth
        >
            <DialogTitle>{"Rename"}</DialogTitle>
            <DialogContent>
                <TextField
                    inputRef={newNameInputRef}
                    variant="standard"
                    fullWidth
                    placeholder="Enter the new name..."
                    autoFocus
                    value={newNameInput}
                    onChange={e => setNewNameInput(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title="Clear">
                                    <IconButton onClick={() => {
                                        setNewNameInput('');
                                        newNameInputRef.current?.focus?.()
                                    }}>
                                        <ClearOutlinedIcon/>
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                />

                <Stack direction="row" display="flex" justifyContent="end" paddingTop={1} spacing={2}>
                    <Button variant="outlined" color="error" onClick={() => props.onClose()}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleRenameClick}
                        disabled={!isValidNonEmptyString(newNameInput)}
                        startIcon={isRenamePromisePending ? <CircularProgress sx={{color: 'white'}} size={20}/> : <DriveFileRenameOutlineOutlinedIcon/>}
                    >
                        Rename
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    </>)
}
