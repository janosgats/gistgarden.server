'use client'
import React, {FC, useState} from "react";
import {Box, CssBaseline} from '@mui/material';
import {NavBar} from '@/react/components/nav/NavBar';
import {QuickAddPointDialog} from '@/react/components/quickAddPoint/QuickAddPointDialog';
import {ThemeSelectorContextProvider} from '@/react/context/ThemeSelectorContext';


const drawerWidth = 240;

export default function ClientRootLayout({children}: { children: React.ReactNode }) {
    const [isQuickAddPointDialogOpen, setIsQuickAddPointDialogOpen] = useState<boolean>(false)

    return (
        <ThemeSelectorContextProvider>
            <CssBaseline enableColorScheme>
                <body>
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
                </body>
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
