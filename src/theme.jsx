import {createMuiTheme} from '@material-ui/core'


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
        }
    },
    typography: {
        // In Chinese and Japanese the characters are usually larger,
        // so a smaller fontsize may be appropriate.
        fontSize: 14,
    },
})


export default theme;