'use client'
import React, {useState} from "react";
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
                </body>
            </CssBaseline>
        </ThemeSelectorContextProvider>
    )
}
