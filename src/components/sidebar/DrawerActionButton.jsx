import {MenuRounded} from "@mui/icons-material";
import {useContext} from "react";
import {Context} from "../../ContextApp.jsx";
import SideBar from "./SideBar.jsx";
import {useTranslation} from "react-i18next";

const DrawerActionButton =() =>{

    const {setDrawerOpen} = useContext(Context)

    const {i18n} = useTranslation()

    return(
        <>
            <MenuRounded fontSize="large" sx={{position:"absolute", top:20,
                right: i18n.language === "fa" ? 35 : "auto",
                left: i18n.language === "en" ? 35 : "auto",
                color:"white", cursor:"pointer",zIndex:2}}
                         aria-haspopup="true"
                         onClick={()=> setDrawerOpen(true)}
            />
            <SideBar/>
        </>

    )
}

export default DrawerActionButton