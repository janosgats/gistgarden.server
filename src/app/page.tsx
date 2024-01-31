'use client'

import React, {FC, useState} from "react";
import callServer from "@/util/frontend/callServer";
import useEndpoint from "@/react/hooks/useEndpoint";
import {DevPanel} from "@/react/components/DevPanel";
import Link from "next/link";
import {CreateGroupResponse, SimpleGroupResponse} from "@/magicRouter/routes/groupManagementRoutes";
import {UsedEndpointSuspense} from "@/react/components/UsedEndpointSuspense";
import {Avatar, Box, Button, Card, CardActions, CardContent, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Stack, Typography} from '@mui/material';
import _ from 'lodash';
import {Property} from 'csstype';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Grid from '@mui/system/Unstable_Grid';

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

export default function Home() {

    const usedBelongingGroups = useEndpoint<SimpleGroupResponse[]>({
        config: {
            url: '/api/groupManagement/listBelongingGroups',
        },
    })


    async function onLoginClicked() {
        await callServer({
            url: '/api/userAuth/login',
            method: "POST",
        })
    }

    async function onGetUserInfoClicked() {
        const response = await callServer({
            url: '/api/user/userInfo',
        })

        alert(JSON.stringify(response.data))
    }


    return (
        <>
            <h1>Valami</h1>

            <Button onClick={() => onLoginClicked()}>Login</Button>
            <Button onClick={() => onGetUserInfoClicked()}>Get user info</Button>
            <br/>
            <CreateGroupPanel afterNewGroupCreationSubmitted={() => usedBelongingGroups.reloadEndpoint()}/>

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
                                            <Link href={`/group/${group.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
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
                                                                {" — 3 days ago"}
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
                            <Button startIcon={<GroupAddIcon/>} variant="outlined" color="secondary">Create new Group</Button>
                        </CardActions>
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
            .finally(() => {
                props.afterNewGroupCreationSubmitted?.()
            })
    }

    return (<>
        <DevPanel>
            <input value={enteredName} onChange={e => setEnteredName(e.target.value)}/>
            <button onClick={() => onSubmit()}>Create Group</button>
        </DevPanel>
    </>)
}
