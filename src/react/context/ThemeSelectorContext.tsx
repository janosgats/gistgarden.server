import React, {createContext, FC, ReactNode, useEffect, useState} from 'react';
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

    function composeValueToProvide(): IThemeSelectorContext {
        return {
            currentThemeOption: currentThemeOption,
            setThemeOption: (newOption: ThemeOption) => {
                setCurrentThemeOption(newOption)
            },
            toggleTheme: () => {
                setCurrentThemeOption(currentThemeOption === ThemeOption.LIGHT ? ThemeOption.DARK : ThemeOption.LIGHT)
            },
        }
    }

    const [valueToProvide, setValueToProvide] = useState<IThemeSelectorContext>(() => composeValueToProvide());


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


    useEffect(() => {
        setValueToProvide(composeValueToProvide())
    }, [currentThemeOption])

    return (
        <ThemeSelectorContext.Provider value={valueToProvide}>
            <ThemeProvider theme={currentThemeOption === ThemeOption.LIGHT ? lightTheme : darkTheme}>
                {children}
            </ThemeProvider>
        </ThemeSelectorContext.Provider>
    )
}