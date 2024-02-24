import React, {FC, useEffect} from "react";
import {Alert, Button, Snackbar} from '@mui/material';
import {useCurrentUserContext} from '@/react/context/CurrentUserContext';
import {userLoginStatusEventBus} from '@/util/frontend/callServer';


export const NotLoggedInSnackbar: FC = () => {
    const currentUserContext = useCurrentUserContext()
    const [isOpen, setIsOpen] = React.useState(false);

    useEffect(() => {
        userLoginStatusEventBus.setSessionExpiredSubscriber(() => {
            setIsOpen(true)
        })
    }, [])

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsOpen(false);
    };

    function handleGoToLoginClick() {
        currentUserContext.reload()
        setIsOpen(false)
    }

    return (
        <Snackbar open={isOpen} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity="warning"
                variant="filled"
                sx={{width: '100%'}}
            >
                Your session expired. To use the site, please log in
                <Button onClick={handleGoToLoginClick} variant="contained" sx={{marginLeft: 2}} size="small">Go to Login</Button>
            </Alert>
        </Snackbar>
    )
}