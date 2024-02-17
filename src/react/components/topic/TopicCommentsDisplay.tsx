import React, {FC, useState} from "react";
import callServer from "@/util/frontend/callServer";
import {Stack} from '@mui/material';
import "@/react/theme/augmentedTheme"
import useAction from '@/react/hooks/useAction';
import {SimpleTopicCommentResponse} from '@/magicRouter/routes/topicCommentRoutes';
import {TopicComment} from '@/react/components/topic/TopicComment';
import useEndpoint from '@/react/hooks/useEndpoint';
import {TopicCommentAdder} from '@/react/components/topic/TopicCommentAdder';

interface Props {
    topicId: number

    isCommentAdderOpen: boolean,
    onCommentAdderClose: () => void,
}

export const TopicCommentsDisplay: FC<Props> = (props) => {
    const [commentsToDisplay, setCommentsToDisplay] = useState<SimpleTopicCommentResponse[] | null>(null)
    const [shouldDisplayLoadingIndicatorWhileFetchingComments, setShouldDisplayLoadingIndicatorWhileFetchingComments] = useState<boolean>(false)

    const usedComments = useEndpoint<SimpleTopicCommentResponse[]>({
        config: {
            url: '/api/topicComment/listCommentsOnTopic',
            method: "POST",
            data: {
                topicId: props.topicId,
            },
        },
        customSuccessProcessor: (axiosResponse) => {
            setCommentsToDisplay(axiosResponse.data)
            return axiosResponse.data
        },
        onError: () => {
            setCommentsToDisplay(null)
        },
        deps: [props.topicId],
    })


    const usedAddComment = useAction<string>({
        actionFunction: async (newCommentDescription: string) => {
            await callServer({
                url: '/api/topicComment/createCommentOnTopic',
                method: "POST",
                data: {
                    topicId: props.topicId,
                    commentDescription: newCommentDescription,
                },
            })
                .then(() => {
                    props.onCommentAdderClose()
                })
                .finally(() => {
                    setShouldDisplayLoadingIndicatorWhileFetchingComments(true)
                    usedComments.reloadEndpoint()
                })
        },
    })

    return (<Stack>
        {usedComments.failed && (
            <span>Error while loading comments. <button onClick={() => usedComments.reloadEndpoint()}>Retry</button></span>
        )}

        {commentsToDisplay?.map(comment => (
            <TopicComment
                key={comment.id}
                initialTopicComment={comment}
                afterDeletionAttempt={(wasDeletionSurelySuccessful) => {
                    if (wasDeletionSurelySuccessful) {
                        setCommentsToDisplay(prevState => prevState?.filter(it => it.id !== comment.id) ?? null)
                    } else {
                        setShouldDisplayLoadingIndicatorWhileFetchingComments(true)
                        usedComments.reloadEndpoint()
                    }
                }}
            />
        ))}

        {usedComments.pending && shouldDisplayLoadingIndicatorWhileFetchingComments && (
            <span>Loading comments...</span>
        )}

        {props.isCommentAdderOpen && (
            <TopicCommentAdder usedAddComment={usedAddComment}/>
        )}

    </Stack>)
}