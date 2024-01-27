'use client'

import React from "react";
import {Button} from '@mui/material';

export default function Home() {


    return (
        <>
            <h1>T1</h1>

            <ul>
                <li>private points</li>
                <li>adding a random point: Quick Add</li>
                <li>viewing points together: Views</li>
                <ul>
                    <li>built-in views</li>
                    <ul>
                        <li>every new point</li>
                        <li>every 1:1</li>
                        <li>every point that belongs to any person in a specified group</li>
                    </ul>
                    <li>custom views in which you can set custom filters. MVP: multiple groups included in filter</li>
                </ul>
                <li>private points for a set of people during conversation</li>
                <ul>
                    <li>use Views</li>
                    <li>use &quot;view together with&quot; feature on top of a group&apos;s page</li>
                </ul>
                <li>reorder topics</li>
                <li>1:1s</li>
            </ul>


            <br/>
            <br/>
            <br/>

            <Button variant="outlined">Hello world</Button>

            <br/>
            <br/>
            <br/>

        </>
    )
}