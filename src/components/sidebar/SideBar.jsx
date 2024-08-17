import {useContext} from "react";
import { Drawer} from "@mui/material";
import MainMenu from "./MainMenu.jsx";
import {Context} from "../../ContextApp.jsx";
import {useTranslation} from "react-i18next";

const SideBar = () =>{
    const {drawerOpen,setDrawerOpen} = useContext(Context)

    const {i18n} = useTranslation()

    return(
            <Drawer anchor={i18n.language === "en" ? "left" : "right"} sx={{
                height:"100vh",
                overflowX:"hidden",overflowY:"auto", zIndex:"2",
                "& .MuiDrawer-paper": {
                    width: 230,
                    bgcolor:"primary.main",
                },
              }}
                open={drawerOpen} variant="temporary" onClose={()=> setDrawerOpen(false)}>

                <MainMenu/>

            </Drawer>
    )
}

export default SideBar