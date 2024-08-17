import {
    CodeOutlined,
    DarkModeOutlined,
    HomeOutlined, LanguageOutlined,
    LightModeOutlined,
    ManOutlined,
    WorkOutline
} from "@mui/icons-material";
import {Divider, Fab, MenuItem, Typography} from "@mui/material";
import {useContext} from "react";
import {Context} from "../../ContextApp.jsx";
import Grid from "@mui/material/Unstable_Grid2";
import {useTranslation} from "react-i18next";

const MainMenu = () => {

    const {activePage, setActivePage, setDrawerOpen, theme,setTheme} = useContext(Context)

    const {t, i18n} = useTranslation()

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

    const changeLang = () => {
        if(i18n.language === "en") {
            i18n.changeLanguage("fa")
        }
        else {
            i18n.changeLanguage("en")
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
                        {
                            t("sidebar.home")
                        }
                    </Typography>
                </MenuItem>
            </Grid>
            <Grid xs={12} md={12}>
                <MenuItem onClick={() => handleMenuItemClick("about")}
                          sx={{backgroundColor: activePage === "about" ? "primary.light" : "inherit", height: 60}}>
                    <Typography sx={{m: "auto"}}>
                        <ManOutlined sx={{verticalAlign: "middle"}}/>
                        {
                            t("sidebar.aboutMe")
                        }
                    </Typography>
                </MenuItem>
            </Grid>
            <Grid xs={12} md={12}>
                <MenuItem onClick={() => handleMenuItemClick("skills")}
                          sx={{backgroundColor: activePage === "skills" ? "primary.light" : "inherit", height: 60}}>
                    <Typography sx={{m: "auto"}}>
                        <CodeOutlined sx={{verticalAlign: "middle"}}/>
                        {
                            t("sidebar.skills")
                        }
                    </Typography>
                </MenuItem>
            </Grid>
            <Grid xs={12} md={12}>
                <MenuItem onClick={() => handleMenuItemClick("projects")}
                          sx={{backgroundColor: activePage === "projects" ? "primary.light" : "inherit", height: 60}}>
                    <Typography sx={{m: "auto"}}>
                        <WorkOutline sx={{verticalAlign: "middle"}}/>
                        {
                            t("sidebar.projects")
                        }
                    </Typography>
                </MenuItem>
                <Divider variant="middle"/>

                <Fab size="large" variant="extended" sx={{m:2, bgcolor:"secondary.main", ":hover":{bgcolor:"secondary.light"} }} onClick={changeTheme}>
                    {
                        theme === "theme2" ?
                            <DarkModeOutlined />
                            :
                            <LightModeOutlined />
                    }
                </Fab>

                <Fab size="large" variant="extended" sx={{m:2, bgcolor:"secondary.main", float:"right",
                    ":hover":{bgcolor:"secondary.light"} }} onClick={changeLang}>
                    <LanguageOutlined/>
                </Fab>
            </Grid>
        </Grid>
    )
}

export default MainMenu