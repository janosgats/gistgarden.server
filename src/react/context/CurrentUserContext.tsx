import React, {createContext, FC, ReactNode, useContext, useEffect, useState} from 'react';
import useEndpoint from '@/react/hooks/useEndpoint';
import {CurrentUserInfo} from '@/magicRouter/routes/userAuthRoutes';
import {userLoginStatusEventBus} from '@/util/frontend/callServer';

interface ICurrentUserContext {
    reload: () => void
    queryStatus: MultiAttemptQueryStatus
    /**
     * This defaults to false when we don't know the status yet
     */
    isLoggedIn: boolean

    userId: number | null
}

const LOGIN_STATUS_REQUEST_MAX_TRIALS = 3

export const CurrentUserContext = createContext<ICurrentUserContext>(null as any);

export const CurrentUserContextProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [requestFailureCount, setRequestFailureCount] = useState<number>(0);


    const usedLoginStatus = useEndpoint<CurrentUserInfo>({
        config: {
            url: '/api/userAuth/loginStatus',
            method: 'GET',
        },
        onError: () => {
            setRequestFailureCount(prev => prev + 1)
        },
    })


    useEffect(() => {
        if (requestFailureCount < LOGIN_STATUS_REQUEST_MAX_TRIALS) {
            usedLoginStatus.reloadEndpoint()
        } else {
            console.error(`Querying loginStatus failed ${requestFailureCount} times`)
        }
    }, [requestFailureCount])

    function calculateLoginStatusQueryStatus(): MultiAttemptQueryStatus {
        if (usedLoginStatus.pending) {
            return MultiAttemptQueryStatus.IN_PROGRESS
        }

        if (usedLoginStatus.succeeded) {
            return MultiAttemptQueryStatus.SUCCEEDED
        }

        if (usedLoginStatus.failed && requestFailureCount < LOGIN_STATUS_REQUEST_MAX_TRIALS) {
            return MultiAttemptQueryStatus.IN_PROGRESS
        }

        return MultiAttemptQueryStatus.FAILED
    }

    function composeValueToProvide(): ICurrentUserContext {
        return {
            reload: () => {
                setRequestFailureCount(0)
                usedLoginStatus.reloadEndpoint()
            },
            queryStatus: calculateLoginStatusQueryStatus(),
            isLoggedIn: usedLoginStatus.data?.isLoggedIn ?? false,
            userId: usedLoginStatus.data?.userId ?? null,
        }
    }

    const [valueToProvide, setValueToProvide] = useState<ICurrentUserContext>(() => composeValueToProvide());
    useEffect(() => {
        const composedValue = composeValueToProvide()
        userLoginStatusEventBus.setSessionExpiredSubscriber(() => composedValue.reload())
        setValueToProvide(composedValue)
    }, [usedLoginStatus.succeeded, requestFailureCount])


    return (
        <CurrentUserContext.Provider value={valueToProvide}>
            {children}
        </CurrentUserContext.Provider>
    )
}


export enum MultiAttemptQueryStatus {
    IN_PROGRESS = 1,
    SUCCEEDED,
    FAILED
}

export function useCurrentUserContext() {
    return useContext(CurrentUserContext)
}