import React, {FC, useState} from "react";
import {Button, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography, useTheme} from '@mui/material';
import callServer from '@/util/frontend/callServer';
import {LoginByPasswordResponse} from '@/magicRouter/routes/userAuthRoutes';
import {VisibilityOffOutlined as VisibilityOffOutlinedIcon, VisibilityOutlined as VisibilityOutlinedIcon} from '@mui/icons-material';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

interface Props {
    onLoginSuccess: () => void
}

export const LoginPanel: FC<Props> = (props) => {
    const theme = useTheme()

    const [isLoginPromisePending, setIsLoginPromisePending] = useState<boolean>(false)
    const [keepMeLoggedIn, setKeepMeLoggedIn] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')


    function handleLoginClick() {
        setIsLoginPromisePending(true)

        callServer<LoginByPasswordResponse>({
            url: '/api/userAuth/loginByPassword',
            method: "POST",
            data: {
                email: email,
                password: password,
                keepMeLoggedIn: keepMeLoggedIn,
            },
        })
            .then((res) => {
                if (res.data.areCredentialsValid) {
                    props.onLoginSuccess()
                } else {
                    alert('The entered credentials are invalid')
                }
            })
            .catch((err) => {
                alert('Error while logging in')
            })
            .finally(() => {
                setIsLoginPromisePending(false)
            })
    }


    return (<>
        <Stack>
            <Typography variant="h5">Let Yourself In</Typography>

            <TextField
                variant="standard"
                fullWidth
                label="login email"
                placeholder="mail.something@to.me"
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <TextField
                variant="standard"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="login password"
                placeholder="*****"
                value={password}
                onChange={e => setPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip title={(showPassword ? 'Hide' : 'Show') + ' password'}>
                                <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                    {showPassword ? <VisibilityOutlinedIcon/> : <VisibilityOffOutlinedIcon/>}
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    ),
                }}
            />

            <FormControlLabel
                control={
                    <Checkbox checked={keepMeLoggedIn} onChange={e => setKeepMeLoggedIn(prev => !prev)}/>
                }
                label="Keep me logged in"
                sx={{marginTop: 1, marginBottom: -2}}
            />
            <Stack direction="row" justifyContent="center" paddingTop={4}>
                <Button onClick={() => handleLoginClick()} variant="outlined" endIcon={<LoginOutlinedIcon/>}>
                    Log in
                </Button>
                {isLoginPromisePending && (<span>pending...</span>)}
            </Stack>
        </Stack>
    </>)
}
