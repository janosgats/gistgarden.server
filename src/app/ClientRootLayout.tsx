'use client'
import React from "react";
import Link from "next/link";
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';

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
                <Link href="/"><h2>Home</h2></Link>
                <Link href="/t1/"><h2>t1 page</h2></Link>

                {children}
                </body>
            </CssBaseline>
        </ThemeProvider>
        </html>
    )
}
