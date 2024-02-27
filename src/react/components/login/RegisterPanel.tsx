import React, {FC, useState} from "react";
import {Button, CircularProgress, Stack, TextField, Typography} from '@mui/material';
import {isValidNonEmptyString} from '@/util/both/CommonValidators';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import useAction from '@/react/hooks/useAction';
import callServer from '@/util/frontend/callServer';


interface Props {
    initialEmail?: string
}

const REGEX_EMAIL_MATCHER = /^.+@.+\..+$/

function isValidEmail(email?: string | null): boolean {
    if (!email || email?.length < 3) {
        return false
    }

    email = String(email)

    return !!(email?.toLowerCase()?.match(REGEX_EMAIL_MATCHER))
}

function getPasswordValidationErrors(password?: string | any): string[] {
    if (!password || typeof password !== "string" || password?.length < 1) {
        return ["Password is empty"]
    }

    if (password?.length < 3) {
        return ["Password is too short"]
    }

    return []
}

export const RegisterPanel: FC<Props> = (props) => {
    const [email, setEmail] = useState<string>(props.initialEmail ?? '')
    const [didEmailFieldLoseFocus, setDidEmailFieldLoseFocus] = useState<boolean>(false)

    const [password, setPassword] = useState<string>('')
    const [didPasswordFieldLoseFocus, setDidPasswordFieldLoseFocus] = useState<boolean>(false)

    const [passwordAgain, setPasswordAgain] = useState<string>('')
    const [didPasswordAgainFieldLoseFocus, setDidPasswordAgainFieldLoseFocus] = useState<boolean>(false)


    const isEmailValid = isValidEmail(email)

    const passwordValidationErrors = getPasswordValidationErrors(password)

    const isPasswordValid = passwordValidationErrors.length === 0

    const doPasswordsMatch = password === passwordAgain && isValidNonEmptyString(passwordAgain)

    const usedSubmitRegistrationInquiry = useAction({
        actionFunction: async () => {
            await callServer({
                url: '/api/registration/submitEmailPasswordRegistrationInquiry',
                method: 'POST',
                data: {
                    email: email,
                    password: password,
                },
            }).catch((e) => {
                alert('Error while starting your registration')
                throw e
            }).then(() => {
                setEmail('')
                setDidEmailFieldLoseFocus(false)
                setPassword('')
                setDidPasswordFieldLoseFocus(false)
                setPasswordAgain('')
                setDidPasswordAgainFieldLoseFocus(false)
                alert(`Congrats! Go, visit your inbox for ${email} to verify your email and access your account!`)
            })
        },
    })

    return (<>
        <Stack spacing={2}>
            <Typography variant="h5">Sign Up</Typography>
            <TextField
                variant="standard"
                fullWidth
                label="email to register"
                placeholder="mail.something@to.me"
                autoFocus
                value={email}
                error={didEmailFieldLoseFocus && !isEmailValid}
                onBlur={() => setDidEmailFieldLoseFocus(true)}
                onChange={e => setEmail(e.target.value)}
            />

            {didEmailFieldLoseFocus && !isEmailValid && (
                <Typography variant="caption" color="red">Email is invalid</Typography>
            )}

            {(isEmailValid || email?.length > 5) && (<>
                <TextField
                    variant="standard"
                    fullWidth
                    label="password"
                    type="password"
                    placeholder="top secret stuff"
                    value={password}
                    error={didPasswordFieldLoseFocus && !isPasswordValid}
                    onBlur={() => setDidPasswordFieldLoseFocus(true)}
                    onChange={e => setPassword(e.target.value)}
                />

                {didPasswordFieldLoseFocus && passwordValidationErrors.map(it => {
                    return (
                        <Typography key={it} variant="caption" color="red">{it}</Typography>
                    )
                })}

                <TextField
                    variant="standard"
                    fullWidth
                    label="password again"
                    type="password"
                    placeholder="top secret stuff"
                    value={passwordAgain}
                    error={didPasswordAgainFieldLoseFocus && !doPasswordsMatch}
                    onBlur={() => setDidPasswordAgainFieldLoseFocus(true)}
                    onChange={e => setPasswordAgain(e.target.value)}
                />

                {didPasswordAgainFieldLoseFocus && !doPasswordsMatch && (
                    <Typography variant="caption" color="red">Passwords do not match</Typography>
                )}

            </>)}


            {(isEmailValid || email?.length > 5) && (isPasswordValid || password?.length > 5) && (<>
                <Button
                    variant="contained"
                    disabled={!(isEmailValid && isPasswordValid && doPasswordsMatch)}
                    endIcon={usedSubmitRegistrationInquiry.pending ? <CircularProgress
                        size="1.3rem"
                        sx={{color: 'white'}}
                    /> : <CelebrationOutlinedIcon/>}
                    onClick={() => usedSubmitRegistrationInquiry.run()}
                >
                    Register
                </Button>
            </>)}
        </Stack>
    </>)
}
