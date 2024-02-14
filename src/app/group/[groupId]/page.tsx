'use client'

import React from "react";
import {useParams} from "next/navigation";
import _ from 'lodash';
import {GroupTopicsDisplay} from '@/react/components/GroupTopicsDisplay';


export default function Page() {
    const params = useParams()
    const groupId = _.parseInt(params['groupId'] as string)


    return (
        <>
            <GroupTopicsDisplay groupId={groupId} displayAsStandalone={true}/>
        </>
    )
}
