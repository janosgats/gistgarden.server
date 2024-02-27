import React from "react";
import {Button, Stack, Typography} from '@mui/material';
import Link from 'next/link';

export default function NotFoundCatchAll() {
    return (
        <>
            <Stack alignItems="center" height="100vh" justifyContent="center" spacing={3}>

                <Typography variant="h2" textAlign="center">This page is Not Found</Typography>

                <Link href="/" style={{textDecoration: 'none', color: 'inherit'}}>
                    <Button variant="contained">Go home</Button>
                </Link>

            </Stack>
        </>
    )
}