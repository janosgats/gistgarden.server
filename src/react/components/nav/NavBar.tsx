import React, {FC, ReactNode, useContext} from "react";
import {Box, Divider, Drawer, Fab, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Switch, Tooltip, Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import {useRouter} from 'next/navigation';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import {ThemeOption, ThemeSelectorContext} from '@/react/context/ThemeSelectorContext';
import GrassIcon from '@mui/icons-material/Grass';

interface Props {
    drawerWidth: number
    openQuickAddPointDialog: () => void
}

export const NavBar: FC<Props> = (props) => {

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };


    return (
        <Box sx={{display: 'flex'}}>
            <Box sx={{'& > :not(style)': {m: 1}}}>
                <Fab
                    size="small"
                    color="secondary"
                    sx={{
                        display: {xs: 'inline-flex', lg: 'none'},
                        position: "fixed",
                        top: (theme) => theme.spacing(1),
                        left: (theme) => theme.spacing(1),
                    }}
                    onClick={() => handleDrawerToggle()}
                >
                    <MenuIcon/>
                </Fab>
            </Box>
            <Box
                component="nav"
                sx={{width: {lg: props.drawerWidth}, flexShrink: {lg: 0}}}
            >
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {
                            xs: 'none',
                            lg: 'block',
                        },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: props.drawerWidth,
                        },
                    }}
                    PaperProps={{sx: {backgroundColor: 'transparent', borderRight: 0}}}
                    open
                >
                    <DrawerContent onItemClicked={() => null} openQuickAddPointDialog={props.openQuickAddPointDialog}/>
                </Drawer>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', lg: 'none'},
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: props.drawerWidth,
                        },
                    }}
                >
                    <DrawerContent onItemClicked={handleDrawerClose} openQuickAddPointDialog={props.openQuickAddPointDialog}/>
                </Drawer>
            </Box>
        </Box>
    )
}


interface DrawerContentProps {
    onItemClicked: () => void
    openQuickAddPointDialog: () => void
}

const DrawerContent: FC<DrawerContentProps> = (props) => {
    const router = useRouter()
    const themeSelectorContext = useContext(ThemeSelectorContext)

    function handleMenuItemClick(action: () => void) {
        props.onItemClicked()
        action()
    }

    function handleRouterPushingMenuItemClick(href: string) {
        handleMenuItemClick(() => router.push(href))
    }


    const BasicMenuItem: FC<{ text: string, icon: ReactNode, action: () => void }> = (props) => {
        return (
            <ListItem disablePadding>
                <ListItemButton onClick={props.action}>
                    <ListItemIcon>
                        {props.icon}
                    </ListItemIcon>
                    <ListItemText primary={props.text}/>
                </ListItemButton>
            </ListItem>
        )
    }

    const BasicRouterPushingMenuItem: FC<{ text: string, icon: ReactNode, href: string }> = (props) => {
        return (
            <BasicMenuItem text={props.text} icon={props.icon} action={() => handleRouterPushingMenuItemClick(props.href)}/>
        )
    }

    return (
        <div>
            <List>
                <ListItem>
                    <ListItemButton onClick={() => handleRouterPushingMenuItemClick('/')}>
                        <Stack
                            width="100%"
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            display="flex"
                            flexDirection="row"
                            spacing={1}
                            color="#C4FF00"
                        >
                            <Typography fontWeight="bold" variant="h6">
                                Gist Garden
                            </Typography>
                            <GrassIcon sx={{fontSize: "2rem"}}/>
                        </Stack>
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider/>
            <List>
                <BasicMenuItem text="Quickly Add a Point!" icon={<CreateOutlinedIcon/>} action={() => handleMenuItemClick(props.openQuickAddPointDialog)}/>
            </List>
            <Divider/>
            <List>
                <BasicMenuItem text="Views" icon={<ViewAgendaOutlinedIcon/>} action={() => handleRouterPushingMenuItemClick("/views")}/>
            </List>
            <Divider/>
            <List>
                <BasicRouterPushingMenuItem text="Settings" icon={<SettingsOutlinedIcon/>} href="/settings"/>
                <BasicMenuItem text="Log out" icon={<LogoutOutlinedIcon/>} action={() => alert('TODO: log out')}/>
            </List>
            <Divider/>
            <List>
                <BasicRouterPushingMenuItem text="t1 page" icon={<BugReportOutlinedIcon/>} href="/t1"/>
                <BasicMenuItem text="Show window size" icon={<BugReportOutlinedIcon/>} action={() =>
                    alert(
                        `window.inner*: ${window.innerWidth}x${window.innerHeight}\n` +
                        `window.screen.avail*: ${window.screen.availWidth}x${window.screen.availHeight}\n` +
                        `window.screen.*: ${window.screen.width}x${window.screen.height}\n`,
                    )
                }/>
                <ListItem>
                    <ListItemIcon>
                        <Brightness4OutlinedIcon/>
                    </ListItemIcon>
                    <DarkModeOutlinedIcon/>
                    <Tooltip title={'Switch to ' + (themeSelectorContext.currentThemeOption === ThemeOption.LIGHT ? 'dark' : 'light') + ' theme'}>
                        <Switch color="secondary" checked={themeSelectorContext.currentThemeOption === ThemeOption.LIGHT} onClick={() => themeSelectorContext.toggleTheme()}/>
                    </Tooltip>
                    <LightModeOutlinedIcon/>
                </ListItem>
            </List>
        </div>
    )
}