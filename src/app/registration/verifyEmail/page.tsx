'use client'

import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {Button, CircularProgress, Stack, Typography} from '@mui/material';
import {useRouter, useSearchParams} from 'next/navigation';
import useAction from '@/react/hooks/useAction';
import {CallStatus} from '@/util/both/CallStatus';
import callServer from '@/util/frontend/callServer';
import CommonProblemMarkers from '@/util/both/problemRelay/CommonProblemMarkers';


export default function Page() {
    const ignoreStrictModeSecondRenderRef = useRef(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const inquiryId = searchParams.get('id') as string
    const secret = searchParams.get('secret') as string

    const [subMessage, setSubMessage] = useState<string>('')

    function onVerificationSuccessful() {
        function getMessageForTimeRemaining(secondsRemaining: number): string {
            return `Redirecting you to login in ${secondsRemaining}...`
        }

        setSubMessage(getMessageForTimeRemaining(3))

        setTimeout(() => {
            setSubMessage(getMessageForTimeRemaining(2))

            setTimeout(() => {
                setSubMessage(getMessageForTimeRemaining(1))

                setTimeout(() => {
                    setSubMessage(getMessageForTimeRemaining(0))
                    router.push('/dashboard')
                }, 1000)

            }, 1000)

        }, 1000)
    }

    const usedVerifyEmailAction = useAction({
        actionFunction: async () => {
            await callServer({
                url: '/api/registration/verifyEmailForEmailPasswordRegistration',
                method: 'post',
                data: {
                    inquiryId: inquiryId,
                    emailVerificationSecret: secret,
                },
            }).then(() => {
                onVerificationSuccessful()
            }).catch((e) => {
                if (CommonProblemMarkers.GgWs.Registration.EMAIL_PASSWORD_REGISTRATION_INQUIRY_NOT_FOUND.matches(e)) {
                    setSubMessage('Your registration inquiry was not found. If you don\'t have an account yet, please repeat the registration process')
                } else if (CommonProblemMarkers.GgWs.Registration.EMAIL_IS_ALREADY_TAKEN.matches(e)) {
                    setSubMessage('The email you tried to verify is already used by another account')
                } else if (CommonProblemMarkers.GgWs.Registration.EMAIL_PASSWORD_REGISTRATION_INQUIRY_IS_EXPIRED.matches(e)) {
                    setSubMessage('Your registration inquiry is already expired. Please repeat the registration process')
                } else {
                    setSubMessage('Unknown error')
                }
                throw e
            })
        },
    })

    useEffect(() => {
        if (ignoreStrictModeSecondRenderRef.current) {
            return
        }

        if (inquiryId && secret) {
            usedVerifyEmailAction.run()
        }

        return () => {
            ignoreStrictModeSecondRenderRef.current = true
        }
    }, [inquiryId, secret])

    return (
        <Stack alignItems="center" justifyContent="start" spacing={3} marginTop="45vh">

            <Typography variant="h2" textAlign="center">
                {usedVerifyEmailAction.callStatus === CallStatus.OPEN && (
                    <>Extracting data from URL...</>
                )}
                {usedVerifyEmailAction.pending && (
                    <>Verifying your email...</>
                )}
                {usedVerifyEmailAction.failed && (
                    <>Error verifying your email :/</>
                )}
                {usedVerifyEmailAction.succeeded && (
                    <>Email successfully verified</>
                )}
            </Typography>

            {subMessage && (
                <Typography variant="h5" textAlign="center">
                    {subMessage}
                </Typography>
            )}
            {(usedVerifyEmailAction.pending || usedVerifyEmailAction.callStatus === CallStatus.OPEN) && (
                <CircularProgress size="4rem" sx={{color: 'white'}}/>
            )}

            {usedVerifyEmailAction.succeeded && (
                <Link href="/dashboard" style={{textDecoration: 'none', color: 'inherit'}}>
                    <Button variant="contained">Go to Dashboard</Button>
                </Link>
            )}

        </Stack>
    )
}
