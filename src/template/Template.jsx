import {createTheme, ThemeProvider} from "@mui/material/styles";
import {CacheProvider} from "@emotion/react";
import {prefixer} from "stylis";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import {useContext} from "react";
import {Context} from "../ContextApp.jsx";
import {theme1, theme2} from "./palettes.js";

    const cacheRTL = createCache({
        key: "muirtl",
        stylisPlugins: [prefixer, rtlPlugin]
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