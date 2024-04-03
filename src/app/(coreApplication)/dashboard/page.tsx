'use client'

import React, {FC, useState} from "react";
import callServer from "@/util/frontend/callServer";
import useEndpoint from "@/react/hooks/useEndpoint";
import {DevPanel} from "@/react/components/DevPanel";
import Link from "next/link";
import {CreateGroupResponse, SimpleGroupResponse} from "@/magicRouter/routes/groupManagementRoutes";
import {UsedEndpointSuspense} from "@/react/components/UsedEndpointSuspense";
import {Avatar, Box, Button, Card, CardActions, CardContent, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Stack, Tooltip, Typography} from '@mui/material';
import _ from 'lodash';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Grid from '@mui/system/Unstable_Grid';
import {useCurrentUserContext} from '@/react/context/CurrentUserContext';
import {UserInfoResponse} from '@/magicRouter/routes/userRoutes';
import {parseISO} from 'date-fns';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {SearchEverythingDialog} from '@/react/components/searchEverything/SearchEverythingDialog';
import {GroupDisplayHelper} from '@/util/frontend/GroupDisplayHelper';

const GroupLoadSkeleton = <Stack spacing={2} paddingTop={2}>
    {_.times(6, (i) =>
        <Skeleton key={i} variant="rectangular" height={56} animation="wave"/>,
    )}
</Stack>

export default function Home() {
    const currentUserContext = useCurrentUserContext()

    const [isCreateNewGroupDialogOpen, setIsCreateNewGroupDialogOpen] = useState<boolean>(false)
    const [isSearchEverythingDialogOpen, setIsSearchEverythingDialogOpen] = useState<boolean>(false)

    const usedBelongingGroups = useEndpoint<SimpleGroupResponse[]>({
        config: {
            url: '/api/groupManagement/listBelongingGroups',
        },
    })

    const usedUserInfo = useEndpoint<UserInfoResponse>({
        config: {
            url: '/api/user/userInfo',
        },
    })

    return (
        <>
            <p>Logged in user:
                <UsedEndpointSuspense usedEndpoint={usedUserInfo} pendingNode="&nbsp;Loading username...">
                    &nbsp;{usedUserInfo.data?.nickName}
                </UsedEndpointSuspense>
                &nbsp;({currentUserContext.userId})
            </p>

            <Card variant="elevation" elevation={12}>
                <Box margin={1}>
                    <Button
                        fullWidth
                        startIcon={<SearchOutlinedIcon/>}
                        onClick={() => setIsSearchEverythingDialogOpen(true)}
                    >
                        Search everything...
                    </Button>

                </Box>
            </Card>

            <SearchEverythingDialog isOpen={isSearchEverythingDialogOpen} onClose={() => setIsSearchEverythingDialogOpen(false)}/>

            <Grid container spacing={4} margin={2}>
                <Grid xs={12} lg="auto">
                    <Card variant="elevation" elevation={12}>
                        <CardContent>
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                <Typography variant="h4">Your Groups</Typography>
                            </Box>
                            <UsedEndpointSuspense usedEndpoint={usedBelongingGroups} pendingNode={GroupLoadSkeleton}>
                                <List>
                                    {usedBelongingGroups.data?.map((group, index) => (
                                        <div key={group.id}>
                                            {index > 0 && <Divider variant="middle" component="li"/>}
                                            <Link href={`/views/instantMultiGroup?groups=${group.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                                                <ListItemButton alignItems="flex-start" disableRipple>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{bgcolor: GroupDisplayHelper.getAvatarBackgroundColor(group.id)}}>
                                                            {GroupDisplayHelper.getFirstLettersOfWords(group.name).substring(0, 2)}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={group.name}
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography
                                                                    sx={{display: 'inline'}}
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                >
                                                                    Végh Béla, Winch Eszter, +4
                                                                </Typography>
                                                                <Tooltip title={parseISO(group.lastActivityAt)?.toLocaleString() || group.lastActivityAt}>
                                                                    <span>{' — ' + GroupDisplayHelper.calculateAgeFromLastActivityAt(group.lastActivityAt)}</span>
                                                                </Tooltip>
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItemButton>
                                            </Link>
                                        </div>
                                    ))}
                                </List>
                            </UsedEndpointSuspense>
                        </CardContent>
                        <CardActions sx={{justifyContent: 'right'}}>
                            {!isCreateNewGroupDialogOpen && (
                                <Button
                                    startIcon={<GroupAddIcon/>}
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setIsCreateNewGroupDialogOpen(true)}
                                >
                                    Create new Group
                                </Button>
                            )}
                        </CardActions>

                        {isCreateNewGroupDialogOpen && (
                            <CreateGroupPanel afterNewGroupCreationSubmitted={() => usedBelongingGroups.reloadEndpoint()}/>
                        )}
                    </Card>
                </Grid>
                <Grid xs={12} lg={5}>
                    <Card variant="elevation" elevation={12}>
                        <CardContent>
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                <Typography variant="h4">Recent Topics</Typography>
                            </Box>
                            <List>
                                {_.times(5).map(it => (
                                    <ListItem key={it}>
                                        <Link href={"/todo: take to topic anchor in owning group"} style={{color: "inherit", textDecoration: "none"}}>
                                            <Typography sx={{'&:hover': {color: 'orange'}}}>
                                                Example Topic {it + 1}
                                            </Typography>
                                        </Link>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                        <CardActions sx={{justifyContent: 'right'}}>
                            <Button
                                startIcon={<AddOutlinedIcon/>}
                                variant="outlined"
                                color="secondary"
                                onClick={() => alert('TODO: Open QuickAdd')}>
                                Add a topic
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}


interface CreateGroupPanelProps {
    afterNewGroupCreationSubmitted?: () => void
}

const CreateGroupPanel: FC<CreateGroupPanelProps> = (props) => {
    const [enteredName, setEnteredName] = useState<string>("")

    function onSubmit() {
        callServer<CreateGroupResponse>({
            url: '/api/groupManagement/createGroup',
            method: "POST",
            data: {
                groupName: enteredName,
            },
        })
            .then(() => setEnteredName(""))
            .catch((err) => {
                alert('error while creating group')
                throw err
            })
            .finally(() => {
                props.afterNewGroupCreationSubmitted?.()
            })
    }

    return (<>
        <DevPanel>
            <label>Group name: </label>
            <input value={enteredName} onChange={e => setEnteredName(e.target.value)} autoFocus style={{marginBottom: 8}}/>
            <br/>
            <Button onClick={() => onSubmit()} variant="contained" size="small">Create Group</Button>
        </DevPanel>
    </>)
}
