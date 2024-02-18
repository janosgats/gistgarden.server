import React, {FC} from 'react';
import {Stack, Switch, Typography} from '@mui/material';
import {VisibilityOffOutlined as VisibilityOffOutlinedIcon, VisibilityOutlined as VisibilityOutlinedIcon} from '@mui/icons-material';

interface Props {
    shouldShowPrivateTopics: boolean
    setShouldShowPrivateTopics: React.Dispatch<React.SetStateAction<boolean>>
}

export const ShowPrivateTopicsSwitch: FC<Props> = (props) => {
    return (<>
        <Stack direction="row" alignItems="center">
            <Typography variant="subtitle1">
                Display Private Topics:&nbsp;
            </Typography>
            <Switch
                checked={props.shouldShowPrivateTopics}
                onClick={() => props.setShouldShowPrivateTopics(prev => !prev)}
                color="secondary"
                checkedIcon={<VisibilityOutlinedIcon/>}
                icon={<VisibilityOffOutlinedIcon/>}
            />
        </Stack>
    </>)
}