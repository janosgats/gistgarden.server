'use client'

import React, {useState} from "react";
import {useParams} from "next/navigation";
import _ from 'lodash';
import {GroupTopicsDisplay} from '@/react/components/group/GroupTopicsDisplay';
import {ShowPrivateTopicsSwitch} from '@/app/(coreApplication)/views/instantMultiGroup/ShowPrivateTopicsSwitch';


export default function Page() {
    const params = useParams()
    const groupId = _.parseInt(params['groupId'] as string)

    const [shouldShowPrivateTopics, setShouldShowPrivateTopics] = useState<boolean>(true)


    return (
        <>
            <ShowPrivateTopicsSwitch shouldShowPrivateTopics={shouldShowPrivateTopics} setShouldShowPrivateTopics={setShouldShowPrivateTopics}/>
            <GroupTopicsDisplay groupId={groupId} displayAsStandalone={true} showPrivateTopics={shouldShowPrivateTopics}/>
        </>
    )
}
