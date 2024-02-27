'use client'

import React from "react";
import {CssBaseline} from '@mui/material';
import {ThemeSelectorContextProvider} from '@/react/context/ThemeSelectorContext';


export default function ClientRootLayout({children}: { children: React.ReactNode }) {
    return (
        <ThemeSelectorContextProvider>
            <CssBaseline enableColorScheme>
                <body>
                {children}
                </body>
            </CssBaseline>
        </ThemeSelectorContextProvider>
    )
}