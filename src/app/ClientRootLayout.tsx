'use client'
import React from "react";
import {Box, createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import {NavBar} from '@/react/components/nav/NavBar';


const drawerWidth = 240;

export default function ClientRootLayout({children}: { children: React.ReactNode }) {

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
        <html lang="en">
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme>
                <body>
                <Box sx={{display: 'flex'}}>
                    <NavBar drawerWidth={drawerWidth}/>
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
                </body>
            </CssBaseline>
        </ThemeProvider>
        </html>
    )
}