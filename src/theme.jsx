import {createMuiTheme} from '@mui/material'


const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#00998c",
            contrastText: "#fff"
        },
        secondary: {
            main: "#676767",
        },
        error: {
            main: "#cb0000"
        },
        info: {
            main: "#e7bb3e"
        }
    },
    typography: {
        // In Chinese and Japanese the characters are usually larger,
        // so a smaller fontsize may be appropriate.
        fontSize: 16,
    },
})


export default theme;