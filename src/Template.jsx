import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CacheProvider} from "@emotion/react";
import {prefixer} from "stylis";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";

    const cacheRTL = createCache({
        key: "muirtl",
        stylisPlugins: [prefixer, rtlPlugin]
    })

    const darkTheme = createTheme({
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
                main: "#312121",
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
const Template = ({children}) => {

    return(
        <CacheProvider value={cacheRTL}>
            <ThemeProvider theme={darkTheme}>
                {children}
            </ThemeProvider>
        </CacheProvider>
    )
}

export default Template