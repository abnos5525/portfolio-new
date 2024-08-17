import {createTheme} from "@mui/material/styles";

export const theme1 = createTheme({
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
////////////////////////////////////////////////////////////
export const theme2 = createTheme({
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