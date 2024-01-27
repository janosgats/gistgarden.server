'use client'

import React from "react";
import {Button} from '@mui/material';

export default function Home() {


    return (
        <>
            <h1>T1</h1>

            <ul>
                <li>easy sharing, search, and creation of topics</li>
                <li>private topics</li>
                <li>adding a random topic: Quick Add</li>
                <li>viewing topics together: Views</li>
                <ul>
                    <li>built-in views</li>
                    <ul>
                        <li>every new topic</li>
                        <li>every 1:1</li>
                        <li>every topic related to a person</li>
                        <li>every topic that relates to any person in a specified group</li>
                        <li>AI LLM based indexing and LLM search in topic</li>
                    </ul>
                    <li>custom views in which you can set custom filters. MVP: multiple groups included in filter</li>
                </ul>
                <li>private topics for a set of people during conversation</li>
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