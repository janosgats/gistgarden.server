import React, {FC, useEffect, useRef, useState} from "react";
import {Button, Dialog, DialogContent, DialogTitle, Slide, Stack, TextField} from '@mui/material';
import {TransitionProps} from '@mui/material/transitions';
import useEndpoint from '@/react/hooks/useEndpoint';
import {UsedEndpointSuspense} from '@/react/components/UsedEndpointSuspense';
import {SimpleGroupMemberResponse} from '@/magicRouter/routes/groupManagementRoutes';
import useAction from '@/react/hooks/useAction';
import callServer from '@/util/frontend/callServer';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
    isOpen: boolean,
    onClose: () => void
    groupId: number
}

export const GroupMembersEditorDialog: FC<Props> = (props) => {
    const newNameInputRef = useRef<HTMLElement>()

    const [userIdInput, setUserIdInput] = useState<string>('')

    const usedGroupMembers = useEndpoint<SimpleGroupMemberResponse[]>({
        config: {
            url: '/api/groupManagement/listGroupMembers',
            method: 'POST',
            data: {
                groupId: props.groupId,
            },
        },
        deps: [props.groupId],
    })

    useEffect(() => {
        if (props.isOpen) {
            usedGroupMembers.reloadEndpoint()
        }
    }, [props.isOpen])

    const usedAddMember = useAction({
        actionFunction: async () => {
            await callServer({
                    url: '/api/groupManagement/addMemberToGroup',
                    method: 'POST',
                    data: {
                        groupId: props.groupId,
                        userIdToAdd: userIdInput,
                    },
                },
            )
                .then(() => {

                    setUserIdInput('')
                })
                .catch((err) => {
                    alert('Error while adding member')
                    throw err
                })
        },
    })


    const usedRemoveMember = useAction({
        actionFunction: async () => {
            await callServer({
                    url: '/api/groupManagement/removeMemberFromGroup',
                    method: 'POST',
                    data: {
                        groupId: props.groupId,
                        userIdToRemove: userIdInput,
                    },
                },
            )
                .then(() => {

                    setUserIdInput('')
                })
                .catch((err) => {
                    alert('Error while removing member')
                    throw err
                })
        },
    })


    return (<>
        <Dialog
            open={props.isOpen}
            onClose={props.onClose}
            TransitionComponent={Transition}
            fullWidth
        >
            <DialogTitle>{"Edit Group Members"}</DialogTitle>
            <DialogContent>
                <UsedEndpointSuspense usedEndpoint={usedGroupMembers} pendingNode={<span>Loading members...</span>}>

                    Current Member userIDs: {usedGroupMembers.data?.map(it => it.userId).join(',')}
                </UsedEndpointSuspense>


                <TextField
                    inputRef={newNameInputRef}
                    variant="standard"
                    fullWidth
                    placeholder="Enter user id..."
                    type="number"
                    autoFocus
                    value={userIdInput}
                    onChange={e => setUserIdInput(e.target.value)}
                />

                <Stack
                    direction="row"
                    display="flex"
                    justifyContent="space-around"
                    paddingTop={1}
                    spacing={2}
                >
                    <Button
                        variant="contained"
                        color="error"
                        disabled={!userIdInput || usedRemoveMember.pending}
                        onClick={() => usedRemoveMember.run().then(() => props.onClose())}
                    >
                        Remove user {userIdInput} from group
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!userIdInput || usedAddMember.pending}
                        onClick={() => usedAddMember.run().then(() => props.onClose())}
                    >
                        Add user {userIdInput} to group
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    </>)
}
