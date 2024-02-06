'use client'
import React, {FC, ReactNode, useContext, useState} from "react";
import {Box, CssBaseline} from '@mui/material';
import {NavBar} from '@/react/components/nav/NavBar';
import {QuickAddPointDialog} from '@/react/components/quickAddPoint/QuickAddPointDialog';
import {ThemeSelectorContextProvider} from '@/react/context/ThemeSelectorContext';
import {CurrentUserContext, CurrentUserContextProvider, MultiAttemptQueryStatus} from '@/react/context/CurrentUserContext';
import {LoginPrompt} from '@/react/components/LoginPrompt';


const drawerWidth = 240;

export default function ClientRootLayout({children}: { children: React.ReactNode }) {
    const [isQuickAddPointDialogOpen, setIsQuickAddPointDialogOpen] = useState<boolean>(false)

    return (
        <ThemeSelectorContextProvider>
            <CssBaseline enableColorScheme>
                <CurrentUserContextProvider>
                    <body>
                    <LoginWall>
                        <Box sx={{display: 'flex'}}>
                            <NavBar drawerWidth={drawerWidth} openQuickAddPointDialog={() => setIsQuickAddPointDialogOpen(true)}/>
                            <Box
                                component="main"
                                sx={{
                                    flexGrow: 1,
                                    p: 3,
                                    width: {lg: `calc(100% - ${drawerWidth}px)`},
                                }}
                            >
                                {children}
                            </Box>
                        </Box>
                        <QuickAddPointDialog isOpen={isQuickAddPointDialogOpen} onClose={() => setIsQuickAddPointDialogOpen(false)}/>
                        <BottomDecoration/>
                    </LoginWall>
                    </body>
                </CurrentUserContextProvider>
            </CssBaseline>
        </ThemeSelectorContextProvider>
    )
}

const BottomDecoration: FC = () => {
    return (<>
        <div>
            <img
                src="/res/img/grass-footer-3.svg"
                alt="lively grass footer"
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    transform: 'translateY(10%) translateX(-6%)',
                    minWidth: '110vw',
                    minHeight: '30vh',
                    zIndex: -9999,
                }}
            />
        </div>
    </>)
}
const LoginWall: FC<{ children: ReactNode }> = ({children}) => {
    const currentUserContext = useContext(CurrentUserContext)

    if (currentUserContext.isLoggedIn) {
        return children
    }

    switch (currentUserContext.queryStatus) {
        case MultiAttemptQueryStatus.IN_PROGRESS:
            return <p>Checking your login status...</p>;
        case MultiAttemptQueryStatus.SUCCEEDED:
            return <LoginPrompt onLoginSuccess={() => currentUserContext.reload()}/>;
        case MultiAttemptQueryStatus.FAILED:
            return <p>We could not check your login status. Are you connected to the internet?</p>
    }

    return <p>Unexpected happening here. Please try refreshing the page</p>
}
