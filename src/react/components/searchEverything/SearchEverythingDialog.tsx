import React, {FC, useEffect, useRef, useState} from "react";
import {Avatar, Dialog, DialogContent, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Slide, Stack, TextField, Tooltip, Typography, useTheme} from '@mui/material';
import {TransitionProps} from '@mui/material/transitions';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import useEndpoint from '@/react/hooks/useEndpoint';
import {SimpleGroupResponse} from '@/magicRouter/routes/groupManagementRoutes';
import Link from 'next/link';
import {parseISO} from 'date-fns';
import {GroupDisplayHelper} from '@/util/frontend/GroupDisplayHelper';


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

export const SearchEverythingDialog: FC<Props> = (props) => {
    const theme = useTheme()
    const [searchText, setSearchText] = useState<string>("")
    const searchTextFieldRef = useRef<HTMLElement>()


    const [groupsToSearchIn, setGroupsToSearchIn] = useState<SimpleGroupResponse[]>([])


    const usedBelongingGroups = useEndpoint<SimpleGroupResponse[]>({
        config: {
            url: '/api/groupManagement/listBelongingGroups',
        },
        customSuccessProcessor: (axiosResponse) => {
            setGroupsToSearchIn(axiosResponse.data)
            return axiosResponse.data
        },
        sendRequestOnDependencyChange: false,
    })

    useEffect(() => {
        if (props.isOpen) {
            usedBelongingGroups.reloadEndpoint()
        }
    }, [props.isOpen])


    return (<>
        <Dialog
            open={props.isOpen}
            onClose={props.onClose}
            TransitionComponent={Transition}
            fullWidth
            disableRestoreFocus
        >
            <DialogContent>
                <Stack spacing={1}>
                    <TextField
                        variant="standard"
                        fullWidth
                        autoFocus
                        placeholder="Search everything..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchOutlinedIcon/>,
                            ref: searchTextFieldRef,
                        }}
                    />

                    <List>
                        {groupsToSearchIn.filter(group =>
                            group.name?.toLowerCase()?.includes(searchText?.toLowerCase()),
                        ).map((group, index) => (
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


                    <br/>
                    Search in Users: Coming soon
                    <br/>
                    Search Topics: Coming soon
                </Stack>
            </DialogContent>
        </Dialog>
    </>)
}