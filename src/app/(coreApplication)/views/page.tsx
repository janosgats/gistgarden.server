'use client'

import React from "react";
import {Typography} from '@mui/material';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';

export default function Home() {
    const searchParams = useSearchParams()
    const searchedGroupIds = searchParams.get('groups') as string

    return (
        <>
            <Typography variant="h4">Views</Typography>
            <br/>
            <Link href="/views/instantMultiGroup">Instant Multi Group View</Link>

            <br/>
            <br/>
            <br/>
            <Typography>Your Saved Views:</Typography>
            saved views will be listed here


        </>
    )
}