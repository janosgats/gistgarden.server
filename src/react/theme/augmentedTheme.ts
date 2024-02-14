import {Palette, PaletteOptions} from '@mui/material';


let dummyUsageOfInterfaceToAvoidCleaningTheImportUpAsUnused1: Palette;
let dummyUsageOfInterfaceToAvoidCleaningTheImportUpAsUnused2: PaletteOptions;

declare module '@mui/material' {
    interface Palette {
        accessControl: {
            green: string
            red: string
        },
    }

    // allow configuration using `createTheme`
    interface PaletteOptions {
        accessControl?: {
            green?: string
            red?: string
        },
    }
}

