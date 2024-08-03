import {useContext} from "react";
import { Drawer} from "@mui/material";
import MainMenu from "./MainMenu.jsx";
import {Context} from "../../ContextApp.jsx";

const SideBar = () =>{

    const {drawerOpen,setDrawerOpen} = useContext(Context)
    return(
            <Drawer anchor="right" sx={{
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