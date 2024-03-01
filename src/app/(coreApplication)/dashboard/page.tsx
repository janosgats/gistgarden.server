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
import {Property} from 'csstype';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Grid from '@mui/system/Unstable_Grid';
import {useCurrentUserContext} from '@/react/context/CurrentUserContext';
import {UserInfoResponse} from '@/magicRouter/routes/userRoutes';
import {differenceInSeconds, parseISO} from 'date-fns';

function getFirstLettersOfWords(sentence: string): string {
    if (!sentence) {
        return 'N/A'
    }
    return sentence
        .split(' ')
        .map(word => word.charAt(0))
        .join('');
}

const avatarColors: Property.Color[] = [
    "red",
    "green",
    "blue",
    "purple",
    "orange",
    "yellow",
    "magenta",
    "greenyellow",
    "cyan",
    "tomato",
    "darkblue",
    "brown",
    "lime",
    "gold",
    "fuchsia",
]

const GroupLoadSkeleton = <Stack spacing={2} paddingTop={2}>
    {_.times(6, (i) =>
        <Skeleton key={i} variant="rectangular" height={56} animation="wave"/>,
    )}
</Stack>

function getAvatarBackgroundColor(groupId: number): Property.Color {
    const colorIndex = groupId % avatarColors.length
    return avatarColors[colorIndex]
}

function calculateAgeFromLastActivityAt(lastActivityAtString: string): string {
    const lastActivityAt = parseISO(lastActivityAtString)

    const ageSeconds = differenceInSeconds(Date.now(), lastActivityAt)

    const MINUTE_AS_SECONDS = 60
    const HOUR_AS_SECONDS = 60 * MINUTE_AS_SECONDS
    const DAY_AS_SECONDS = 24 * HOUR_AS_SECONDS
    const WEEK_AS_SECONDS = 7 * DAY_AS_SECONDS
    const MONTH_AS_SECONDS = 30.5 * DAY_AS_SECONDS
    const YEAR_AS_SECONDS = 365 * DAY_AS_SECONDS

    function getPluralEnding(value: number): string {
        return value > 1 ? 's' : ''
    }

    if (ageSeconds < 40) {
        return 'just now'
    }
    if (ageSeconds < HOUR_AS_SECONDS) {
        const minutes = Math.floor(ageSeconds / MINUTE_AS_SECONDS)
        return `${minutes} min` + getPluralEnding(minutes)
    }
    if (ageSeconds < DAY_AS_SECONDS) {
        const hours = Math.floor(ageSeconds / HOUR_AS_SECONDS)

        return `${hours} hour` + getPluralEnding(hours)
    }
    if (ageSeconds < WEEK_AS_SECONDS) {
        const days = Math.floor(ageSeconds / DAY_AS_SECONDS)
        return `${days} day` + getPluralEnding(days)
    }
    if (ageSeconds < MONTH_AS_SECONDS) {
        const weeks = Math.floor(ageSeconds / WEEK_AS_SECONDS)
        return `${weeks} week` + getPluralEnding(weeks)
    }
    if (ageSeconds < YEAR_AS_SECONDS) {
        const months = Math.floor(ageSeconds / MONTH_AS_SECONDS)
        return `${months} month` + getPluralEnding(months)
    }

    const years = Math.floor(ageSeconds / YEAR_AS_SECONDS)
    return `${years} year` + getPluralEnding(years)
}

export default function Home() {
    const currentUserContext = useCurrentUserContext()

    const [isCreateNewGroupDialogOpen, setIsCreateNewGroupDialogOpen] = useState<boolean>(false)

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
                                                        <Avatar sx={{bgcolor: getAvatarBackgroundColor(group.id)}}>
                                                            {getFirstLettersOfWords(group.name).substring(0, 2)}
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
                                                                    <span>{' — ' + calculateAgeFromLastActivityAt(group.lastActivityAt)}</span>
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
