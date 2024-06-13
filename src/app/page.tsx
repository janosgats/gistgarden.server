'use client'

import React from "react";
import Link from "next/link";
import {Button, Stack, Typography} from '@mui/material';


export default function Home() {

    return (
        <Stack alignItems="center" height="100vh" justifyContent="center" spacing={3}>

            <Typography variant="h2" textAlign="center">This will be a landing page</Typography>

            <Link href="/dashboard" style={{textDecoration: 'none', color: 'inherit'}}>
                <Button variant="contained">Go to Dashboard</Button>
            </Link>
            xy2
        </Stack>
    )
}
