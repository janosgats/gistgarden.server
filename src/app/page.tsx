'use client'

import React from "react";
import Link from "next/link";
import {Button, Stack, Typography, useTheme} from '@mui/material';
import GrassIcon from '@mui/icons-material/Grass';


export default function Home() {
    const theme = useTheme()

    return (
        <Stack alignItems="center" height="100vh" justifyContent="center" spacing={3}>

            <Link href="/dashboard" style={{textDecoration: 'none', color: 'inherit'}}>
                <GrassIcon sx={{fontSize: "13rem", transform: 'translateY(7%)', color: 'lime'}}/>
            </Link>
            <Typography variant="h4" textAlign="center" style={{marginTop: theme.spacing(0)}}>
                Welcome to
            </Typography>
            <Typography variant="h2" textAlign="center" style={{marginTop: theme.spacing(2)}}>
                Gist&nbsp;<span style={{color: "lime"}}>Garden</span>
            </Typography>


            <Link href="/dashboard" style={{textDecoration: 'none', color: 'inherit'}}>
                <Button variant="contained" size="large">Go to Dashboard</Button>
            </Link>

        </Stack>
    )
}
