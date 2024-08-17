import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CacheProvider} from "@emotion/react";
import {prefixer} from "stylis";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import {useContext} from "react";
import {Context} from "./ContextApp.jsx";

    const cacheRTL = createCache({
        key: "muirtl",
        stylisPlugins: [prefixer, rtlPlugin]
    })

    const theme1 = createTheme({
        direction: "rtl",
        typography: {
            allVariants:{
              fontFamily: "vazir",
                color:"#fff"
            },
        },
        palette:{
            mode:"dark",
            primary:{
                main: "#261a1a",
                dark: "#1C1717",
                light: "#7c4242",
            },
            secondary:{
              main: "#E06432",
              light: "#dc815d",
              dark: "#bb3d0c",
            },
            success: {
                main:"#31cb68",
            },
            error:{
                main: "#cc3030"
            }
        }
    })

const theme2 = createTheme({
    direction: "rtl",
    typography: {
        allVariants:{
            fontFamily: "vazir",
            color:"#fff"
        },
    },
    palette:{
        mode:"dark",
        primary:{
            main: "#431b48",
            dark: "#6c264c",
            light: "#C63C51",
        },
        secondary:{
            main: "#deab3a",
            light: "#F9E400",
            dark: "#FFAF00",
        },
        success: {
            main:"#31cb68",
        },
        error:{
            main: "#cc3030"
        }
    }
})
const Template = ({children}) => {

        const {theme} = useContext(Context)

    return(
        <CacheProvider value={cacheRTL}>
            <ThemeProvider theme={theme === "theme1" ? theme1 : theme2}>
                {children}
            </ThemeProvider>
        </CacheProvider>
    )
}

export default Template