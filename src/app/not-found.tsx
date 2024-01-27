import React from "react";
import {Button} from '@mui/material';
import Link from 'next/link';

export default function NotFound() {


    return (
        <>
            <h1>This page is Not Found</h1>
            <Link href="/" style={{textDecoration: 'none', color: 'inherit'}}>
                <Button variant="contained">Go home</Button>
            </Link>
        </>
    )
}