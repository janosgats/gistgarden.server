import React, {createContext, FC, ReactNode, useState} from 'react';
import {createTheme, ThemeProvider} from '@mui/material';

export enum ThemeOption {
    DARK = 1,
    LIGHT,
}

interface IThemeSelectorContext {
    currentThemeOption: ThemeOption
    setThemeOption: (newOption: ThemeOption) => void
    toggleTheme: () => void
}


export const ThemeSelectorContext = createContext<IThemeSelectorContext>(null as any);

export const ThemeSelectorContextProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [currentThemeOption, setCurrentThemeOption] = useState<ThemeOption>(ThemeOption.DARK);

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#48ff00',
            },
            secondary: {
                main: '#90caf9',
            },
        },
    });

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#48ff00',
            },
            secondary: {
                main: '#90caf9',
            },
        },
    });


    const valueToProvide: IThemeSelectorContext = {
        currentThemeOption: currentThemeOption,
        setThemeOption: (newOption: ThemeOption) => {
            setCurrentThemeOption(newOption)
        },
        toggleTheme: () => {
            setCurrentThemeOption(currentThemeOption === ThemeOption.LIGHT ? ThemeOption.DARK : ThemeOption.LIGHT)
        },
    }

    return (
        <ThemeSelectorContext.Provider value={valueToProvide}>
            <ThemeProvider theme={currentThemeOption === ThemeOption.LIGHT ? lightTheme : darkTheme}>
                {children}
            </ThemeProvider>
        </ThemeSelectorContext.Provider>
    )
}