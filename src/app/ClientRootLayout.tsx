'use client'
import React, {useState} from "react";
import {Box, createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import {NavBar} from '@/react/components/nav/NavBar';
import {QuickAddPointDialog} from '@/react/components/quickAddPoint/QuickAddPointDialog';


const drawerWidth = 240;

export default function ClientRootLayout({children}: { children: React.ReactNode }) {

    const [isQuickAddPointDialogOpen, setIsQuickAddPointDialogOpen] = useState<boolean>(false)

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#48ff00',
            },
            secondary: {
                main: '#90caf9',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
    )
}