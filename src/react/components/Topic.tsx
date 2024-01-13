import React, {FC, useState} from "react";
import {SimpleTopicResponse} from "@/magicRouter/routes/groupManagementRoutes";
import {CallStatus} from "@/util/CallStatus";
import callServer from "@/util/frontend/callServer";

interface Props {
    initialTopic: SimpleTopicResponse
}

export const Topic: FC<Props> = (props) => {
    const [lastSavedTopicState, setLastSavedTopicState] = useState<SimpleTopicResponse>(props.initialTopic)
    const [description, setDescription] = useState<string>(props.initialTopic.description)

    const [saveNewDescriptionCallStatus, setSaveNewDescriptionCallStatus] = useState<CallStatus>(CallStatus.OPEN)
    const [didLastSaveFinishInTheNearPast, setDidLastSaveFinishInTheNearPast] = useState<boolean>(false)
    const [toggleIsDoneStateCallStatus, setToggleIsDoneStateCallStatus] = useState<CallStatus>(CallStatus.OPEN)


    async function saveNewDescriptionIfChanged() {
        if (description === lastSavedTopicState.description) {
            return
        }

        setSaveNewDescriptionCallStatus(CallStatus.PENDING)

        await callServer({
            url: '/api/topic/setDescription',
            method: 'POST',
            data: {
                topicId: props.initialTopic.id,
                newDescription: description,
            },
        })
            .then(() => {
                setSaveNewDescriptionCallStatus(CallStatus.SUCCESS)
                setLastSavedTopicState((prevState) => ({...prevState, description: description}))
            })
            .catch(() => {
                setSaveNewDescriptionCallStatus(CallStatus.FAILURE)
            })
            .finally(() => {
                setDidLastSaveFinishInTheNearPast(true)
                setTimeout(() => {
                    setDidLastSaveFinishInTheNearPast(false)
                }, 1500)
            })
    }

    async function toggleIsDoneState() {
        const newIsDone = !lastSavedTopicState.isDone

        setToggleIsDoneStateCallStatus(CallStatus.PENDING)

        await callServer({
            url: '/api/topic/setIsDoneState',
            method: 'POST',
            data: {
                topicId: props.initialTopic.id,
                newIsDone: newIsDone,
            },
        })
            .then(() => {
                setToggleIsDoneStateCallStatus(CallStatus.SUCCESS)
                setLastSavedTopicState((prevState) => ({...prevState, isDone: newIsDone}))
            })
            .catch(() => {
                setToggleIsDoneStateCallStatus(CallStatus.FAILURE)
            })
    }

    return (<>
        {toggleIsDoneStateCallStatus === CallStatus.PENDING ? (
            <span>&#x21bb;</span>
        ) : (
            <input type="checkbox" checked={lastSavedTopicState.isDone} onChange={() => toggleIsDoneState()}/>
        )}
        {toggleIsDoneStateCallStatus === CallStatus.FAILURE && <span>Error while saving <button onClick={() => toggleIsDoneState()}>Retry</button></span>}


        <input value={description} onChange={e => setDescription(e.target.value)} onBlur={() => saveNewDescriptionIfChanged()}/>
        ({props.initialTopic.id})
        {saveNewDescriptionCallStatus === CallStatus.PENDING && <span>saving...</span>}
        {saveNewDescriptionCallStatus === CallStatus.SUCCESS && didLastSaveFinishInTheNearPast && <span>Saved</span>}
        {saveNewDescriptionCallStatus === CallStatus.FAILURE && <span>Error while saving <button onClick={() => saveNewDescriptionIfChanged()}>Retry</button></span>}
    </>)
}