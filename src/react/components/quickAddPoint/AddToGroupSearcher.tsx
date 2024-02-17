import React, {FC, useEffect, useState} from "react";
import {CreateGroupResponse, SimpleGroupResponse} from "@/magicRouter/routes/groupManagementRoutes";
import {CallStatus} from "@/util/both/CallStatus";
import {Autocomplete, Button, Card, CardActions, CardContent, CircularProgress, IconButton, InputAdornment, ListItem, TextField, Tooltip, Typography, useTheme} from '@mui/material';

import PlusOneOutlinedIcon from '@mui/icons-material/PlusOneOutlined';
import useEndpoint from '@/react/hooks/useEndpoint';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {useRouter} from 'next/navigation';
import callServer from '@/util/frontend/callServer';

interface Props {
    onAddToGroupClicked: (groupId: number) => Promise<void>
    isTopicSetToBePrivate: boolean
    closeDialog: () => void
}

export const AddToGroupSearcher: FC<Props> = (props) => {
    const [searchInputText, setSearchInputText] = useState<string>('')
    const [isAutocompleteOpen, setIsAutocompleteOpen] = useState<boolean>(false)
    const usedBelongingGroups = useEndpoint<SimpleGroupResponse[]>({
        config: {
            url: '/api/groupManagement/listBelongingGroups',
        },
        sendRequestOnDependencyChange: false,
        initialPending: false,
    })

    useEffect(() => {
        if (isAutocompleteOpen) {
            usedBelongingGroups.reloadEndpoint()
        }

    }, [isAutocompleteOpen])

    function onCreateNewGroup() {
        callServer<CreateGroupResponse>({
            url: '/api/groupManagement/createGroup',
            method: "POST",
            data: {
                groupName: searchInputText,
            },
        })
            .catch(() => alert('Error while creating group'))
            .then(() => usedBelongingGroups.reloadEndpoint())
    }


    return (<>
        <Autocomplete
            onInputChange={(e, newInputValue) => setSearchInputText(newInputValue)}
            options={usedBelongingGroups.data || []}
            renderOption={(renderOptionProps, option, state, ownerState) =>
                <OptionComponent key={option.id}
                                 group={option}
                                 onAddToGroupClicked={props.onAddToGroupClicked}
                                 isTopicSetToBePrivate={props.isTopicSetToBePrivate}
                                 closeDialog={props.closeDialog}/>
            }
            renderInput={(params) =>
                <TextField
                    {...params}
                    label="Search for groups"
                    fullWidth
                    InputProps={{
                        ...(params.InputProps),
                        startAdornment: <InputAdornment position="start"> <SearchIcon/> </InputAdornment>,
                        endAdornment: (
                            <>
                                {usedBelongingGroups.pending ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            }
            open={isAutocompleteOpen}
            onOpen={() => setIsAutocompleteOpen(true)}
            onClose={() => setIsAutocompleteOpen(false)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            loading={usedBelongingGroups.pending}
            noOptionsText={
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle2" sx={{textDecoration: "italic"}}>Hmm, No results...</Typography>
                    </CardContent>
                    <CardActions>
                        <Button sx={{textTransform: "none"}} onClick={() => onCreateNewGroup()}>
                            CREATE NEW GROUP CALLED &quot;{searchInputText}&quot;
                        </Button>
                    </CardActions>
                </Card>
            }
        />
    </>)
}

interface OptionComponentProps {
    onAddToGroupClicked: (groupId: number) => Promise<void>
    isTopicSetToBePrivate: boolean
    group: SimpleGroupResponse
    closeDialog: () => void
}

const OptionComponent: FC<OptionComponentProps> = (props) => {
    const theme = useTheme()
    const router = useRouter()

    const [addToGroupCallStatus, setAddToGroupCallStatus] = useState<CallStatus>(CallStatus.OPEN)

    function handleAddToGroupClicked() {
        setAddToGroupCallStatus(CallStatus.PENDING)
        props.onAddToGroupClicked(props.group.id)
            .then(() => {
                setAddToGroupCallStatus(CallStatus.SUCCEEDED)
            })
            .catch((err) => {
                setAddToGroupCallStatus(CallStatus.FAILED)
                alert('Failed to add topic to group')
            })
    }

    return (
        <ListItem>
            <Typography>{props.group.name} ({props.group.id})</Typography>

            {addToGroupCallStatus === CallStatus.PENDING && (
                <CircularProgress color="primary" size="2.5rem" sx={{padding: '0.6rem'}}/>
            )}
            {addToGroupCallStatus !== CallStatus.PENDING && (
                <Tooltip title={`Add topic to this group as ${props.isTopicSetToBePrivate ? 'Private' : 'Public'}`}>
                    <IconButton onClick={handleAddToGroupClicked} sx={{color: props.isTopicSetToBePrivate ? theme.palette.accessControl.red : theme.palette.accessControl.green}}>
                        <PlusOneOutlinedIcon/>
                    </IconButton>
                </Tooltip>
            )}

            <Tooltip title="Navigate to this group">
                <IconButton onClick={() => {
                    router.push(`/group/${props.group.id}`);
                    props.closeDialog()
                }}>
                    <OpenInNewOutlinedIcon color="secondary"/>
                </IconButton>
            </Tooltip>
        </ListItem>
    )
}