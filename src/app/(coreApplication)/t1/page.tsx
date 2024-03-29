'use client'

import React, {FC} from "react";
import {Button} from '@mui/material';

export default function Home() {

    const Done: FC<{ children: React.ReactNode }> = (props) => {
        return (
            <li style={{color: 'lime'}}>
                {props.children}
            </li>
        )
    }


    return (
        <>
            <h1>T1</h1>

            <ul>
                <li>easy sharing, search, and creation of topics</li>
                <ul>
                    <li>basic &quot;Search for anything&quot; interface</li>
                    <li>AI LLM based indexing and LLM search in topics</li>
                </ul>
                <Done>comments on topics</Done>
                <Done>adding a random topic: Quick Add</Done>
                <Done>viewing topics together: Views</Done>
                <ul>
                    <li>built-in views</li>
                    <ul>
                        <li>every new topic</li>
                        <li>every 1:1</li>
                        <li>every topic related to a person</li>
                        <li>every topic that relates to any person in a specified group</li>
                    </ul>
                    <li>custom views in which you can set custom filters. MVP: multiple groups included in filter</li>
                </ul>
                <li>private topics for a set of people during conversation</li>
                <ul>
                    <Done>private topics (only visible for you)</Done>
                    <Done>use Views or use &quot;view together with&quot; feature on top of a group&apos;s page</Done>
                    <li>Topic linking</li>
                </ul>
                <li>reorder topics</li>
                <li>1:1s</li>
                <li>tags</li>
                <ul>
                    <li>tag based filtering for topics</li>
                    <li>tag based filtering for groups (in Views)</li>
                </ul>
                <li>link groups to groups, topics to groups, topics to topics</li>
                <ul>
                    <li>graph visualization based on the links</li>
                    <li>?maybe make the tasks&apos; markdowns and use those to create links?</li>
                </ul>
                <li>adding and removing members to groups</li>
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