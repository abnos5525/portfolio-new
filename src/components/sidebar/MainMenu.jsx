import {
    CodeOutlined,
    DarkModeOutlined,
    HomeOutlined,
    LightModeOutlined,
    ManOutlined,
    WorkOutline
} from "@mui/icons-material";
import {Divider, Fab, MenuItem, Typography} from "@mui/material";
import {useContext} from "react";
import {Context} from "../../ContextApp.jsx";
import Grid from "@mui/material/Unstable_Grid2";

const MainMenu = () => {

    const {activePage, setActivePage, setDrawerOpen, theme,setTheme} = useContext(Context)

    const handleMenuItemClick = (item) => {
        setActivePage(item)
        setDrawerOpen(false)
    }

    const changeTheme = () => {
        if(theme === "theme1"){
            setTheme("theme2")
        }else{
            setTheme("theme1")
        }
    }

    return (
        <Grid container gap={1}>
            <Grid xs={12} md={12}>
                <MenuItem onClick={() => handleMenuItemClick("home")}
                          sx={{
                              backgroundColor: activePage === "home" ? "primary.light" : "inherit",
                              height: 60
                          }}>

                    <Typography sx={{m: "auto"}}>
                        <HomeOutlined sx={{verticalAlign: "middle"}}/>
                        صفحه اصلی
                    </Typography>
                </MenuItem>
            </Grid>
            <Grid xs={12} md={12}>
                <MenuItem onClick={() => handleMenuItemClick("about")}
                          sx={{backgroundColor: activePage === "about" ? "primary.light" : "inherit", height: 60}}>
                    <Typography sx={{m: "auto"}}>
                        <ManOutlined sx={{verticalAlign: "middle"}}/>
                        درباره من
                    </Typography>
                </MenuItem>
            </Grid>
            <Grid xs={12} md={12}>
                <MenuItem onClick={() => handleMenuItemClick("skills")}
                          sx={{backgroundColor: activePage === "skills" ? "primary.light" : "inherit", height: 60}}>
                    <Typography sx={{m: "auto"}}>
                        <CodeOutlined sx={{verticalAlign: "middle"}}/>
                        مهارت ها
                    </Typography>
                </MenuItem>
            </Grid>
            <Grid xs={12} md={12}>
                <MenuItem onClick={() => handleMenuItemClick("projects")}
                          sx={{backgroundColor: activePage === "projects" ? "primary.light" : "inherit", height: 60}}>
                    <Typography sx={{m: "auto"}}>
                        <WorkOutline sx={{verticalAlign: "middle"}}/>
                        پروژه ها
                    </Typography>
                </MenuItem>
                <Divider variant="middle"/>

                <Fab size="small" sx={{m:2, bgcolor:"secondary.main", ":hover":{bgcolor:"secondary.light"} }} onClick={changeTheme}>
                    {
                        theme === "theme2" ?
                            <DarkModeOutlined />
                            :
                            <LightModeOutlined />
                    }

                </Fab>
            </Grid>
        </Grid>
    )
}

export default MainMenu