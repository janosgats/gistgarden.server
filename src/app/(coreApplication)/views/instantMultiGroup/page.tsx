'use client'

import React, {FC, useEffect, useState} from "react";
import {Autocomplete, Button, Card, CardContent, Checkbox, CircularProgress, InputAdornment, ListItem, Paper, Stack, TextField, Tooltip, Typography, useTheme} from '@mui/material';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import useEndpoint from '@/react/hooks/useEndpoint';
import {SimpleGroupResponse} from '@/magicRouter/routes/groupManagementRoutes';
import SearchIcon from '@mui/icons-material/Search';
import _ from 'lodash';
import {isValidNonNegativeNumber} from '@/util/both/CommonValidators';
import DisplaySettingsOutlinedIcon from '@mui/icons-material/DisplaySettingsOutlined';
import {GroupTopicsDisplay} from '@/react/components/group/GroupTopicsDisplay';
import {ShowPrivateTopicsSwitch} from '@/app/(coreApplication)/views/instantMultiGroup/ShowPrivateTopicsSwitch';

const SEARCH_PARAM_KEY_GROUP_IDS = 'groups'

export default function Home() {
    const theme = useTheme()

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [shouldShowPrivateTopics, setShouldShowPrivateTopics] = useState<boolean>(true)

    const searchedGroupIdsText = searchParams.get(SEARCH_PARAM_KEY_GROUP_IDS) as string

    const [groupIdsToDisplay, setGroupIdsToDisplay] = useState<number[]>(
        searchedGroupIdsText
            ?.split(',')
            ?.filter(it => isValidNonNegativeNumber(it))
            ?.map(it => _.parseInt(it)) ?? [],
    )

    useEffect(() => {
        router.push(`${pathname}?groups=${groupIdsToDisplay.join(',')}`)
    }, [groupIdsToDisplay])


    function addNewGroupIdToDisplay(newGroupId: number) {
        newGroupId = _.parseInt(newGroupId as any)

        setGroupIdsToDisplay((prevState) => {
            if (prevState.includes(newGroupId)) {
                return prevState
            }
            return [...prevState, newGroupId]
        })
    }

    function removeGroupIdToDisplay(groupIdToRemove: number) {
        groupIdToRemove = _.parseInt(groupIdToRemove as any)

        setGroupIdsToDisplay((prevState) => {
            return prevState.filter(it => it !== groupIdToRemove)
        })
    }

    return (
        <>
            <Typography variant="h4">Instant View of Multiple Groups</Typography>

            <ShowPrivateTopicsSwitch shouldShowPrivateTopics={shouldShowPrivateTopics} setShouldShowPrivateTopics={setShouldShowPrivateTopics}/>

            <p>Groups in view: {groupIdsToDisplay.join('+')}</p>


            <Stack spacing={3} sx={{
                [theme.breakpoints.down('sm')]: {
                    marginLeft: -4,
                    marginRight: -4,
                },
            }}>
                {groupIdsToDisplay.map(groupId => (
                    <Paper key={groupId} variant="elevation" elevation={6} sx={{padding: 2}}>
                        <GroupTopicsDisplay groupId={groupId} displayAsStandalone={false} showPrivateTopics={shouldShowPrivateTopics}/>
                    </Paper>
                ))}

                <Paper variant="elevation" elevation={6} sx={{padding: 2}}>
                    <ChangeDisplayedGroupsPanel
                        currentGroupIdsToDisplay={groupIdsToDisplay}
                        onAddNewGroup={(newGroupId) => addNewGroupIdToDisplay(newGroupId)}
                        onRemoveGroup={(groupIdToRemove) => removeGroupIdToDisplay(groupIdToRemove)}
                    />
                </Paper>
            </Stack>
        </>
    )
}

interface AddGroupToViewPanelProps {
    currentGroupIdsToDisplay: number[]

    onAddNewGroup: (groupId: number) => void
    onRemoveGroup: (groupId: number) => void
}

const ChangeDisplayedGroupsPanel: FC<AddGroupToViewPanelProps> = (props) => {
    const [isAutocompleteOpen, setIsAutocompleteOpen] = useState<boolean>(false)
    const [searchInputText, setSearchInputText] = useState<string>('')

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

    return (<>
        {isAutocompleteOpen || (
            <Tooltip title={`Add or remove groups to display in this view`}>
                <Button variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={() => setIsAutocompleteOpen(true)}
                        startIcon={<DisplaySettingsOutlinedIcon/>}>
                    Display other groups too
                </Button>
            </Tooltip>
        )}


        {isAutocompleteOpen && (
            <Autocomplete
                onInputChange={(e, newInputValue) => setSearchInputText(newInputValue)}
                options={usedBelongingGroups.data || []}
                renderOption={(renderOptionProps, option, state, ownerState) => {
                    const isOptionCurrentlyDisplayed = props.currentGroupIdsToDisplay.includes(option.id)

                    return (
                        <ListItem
                            key={option.id}
                            {...(_.omit(renderOptionProps, 'key'))}
                            onClick={() => isOptionCurrentlyDisplayed ? props.onRemoveGroup(option.id) : props.onAddNewGroup(option.id)}
                        ><Checkbox
                            style={{marginRight: 8}}
                            checked={isOptionCurrentlyDisplayed}
                        />
                            <Typography>{option.name}</Typography>
                        </ListItem>
                    )
                }}
                onChange={(e, value) => console.log(value)}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Search for groups to add to this view"
                        placeholder="Start typing the group name..."
                        fullWidth
                        autoFocus
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
                open={true}
                onBlur={() => setIsAutocompleteOpen(false)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.name}
                loading={usedBelongingGroups.pending}
                noOptionsText={
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle2" sx={{textDecoration: "italic"}}>
                                Hmm, No results for &quot;{searchInputText}&quot;...
                            </Typography>
                        </CardContent>
                    </Card>
                }
            />
        )}
    </>)
}