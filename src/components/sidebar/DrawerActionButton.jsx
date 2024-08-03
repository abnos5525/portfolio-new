import {MenuRounded} from "@mui/icons-material";
import {useContext} from "react";
import {Context} from "../../ContextApp.jsx";
import SideBar from "./SideBar.jsx";

const DrawerActionButton =() =>{

    const {setDrawerOpen} = useContext(Context)

    return(
        <>
            <MenuRounded fontSize="large" sx={{position:"absolute", top:20,right:35, color:"white", cursor:"pointer",zIndex:2}}
                         aria-haspopup="true"
                         onClick={()=> setDrawerOpen(true)}
            />
            <SideBar/>
        </>

    )
}

export default DrawerActionButton