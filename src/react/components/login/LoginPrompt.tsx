import React, {FC, useState} from "react";
import {Button, Paper, Stack, Typography, useTheme} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import {LoginPanel} from '@/react/components/login/LoginPanel';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import {RegisterPanel} from '@/react/components/login/RegisterPanel';

interface Props {
    onLoginSuccess: () => void
}

export const LoginPrompt: FC<Props> = (props) => {
    const theme = useTheme()

    const [panelToDisplay, setPanelToDisplay] = useState<"login" | "signup">("login")


    return (<>
        <Grid container justifyContent="center" alignItems="center" style={{minHeight: '100vh'}}>
            <Grid>
                <Paper
                    sx={{
                        padding: 3,
                        width: '100vw',
                        [theme.breakpoints.up('sm')]: {
                            width: '600px',
                        },
                    }}>
                    {panelToDisplay === "login" && (
                        <>
                            <LoginPanel onLoginSuccess={props.onLoginSuccess}/>

                            <Stack alignItems="center" marginTop={4} spacing={4}>
                                <Typography variant="h6">OR</Typography>

                                <Button onClick={() => setPanelToDisplay("signup")} color="secondary" variant="outlined" endIcon={<CelebrationOutlinedIcon/>}>
                                    Sign Up
                                </Button>
                            </Stack>
                        </>
                    )}
                    {panelToDisplay === "signup" && (
                        <RegisterPanel/>
                    )}
                </Paper>
            </Grid>
        </Grid>
    </>)
}
