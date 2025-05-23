import {
    CodeOutlined,
    DarkModeOutlined,
    HomeOutlined, LanguageOutlined,
    LightModeOutlined,
    ManOutlined, PersonOutline,
    WorkOutline
} from "@mui/icons-material";
import {Divider, Fab, Link, MenuItem, Typography} from "@mui/material";
import {useContext} from "react";
import {Context} from "../../ContextApp.jsx";
import Grid from "@mui/material/Unstable_Grid2";
import {useTranslation} from "react-i18next";

import resume from "../../../public/file/resume.pdf"

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
                        <HomeOutlined sx={{verticalAlign: "middle", float: i18n.language === "en" ? "right" : "left"}}/>
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
                        <ManOutlined sx={{verticalAlign: "middle", float: i18n.language === "en" ? "right" : "left"}}/>
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
                        <CodeOutlined sx={{verticalAlign: "middle", float: i18n.language === "en" ? "right" : "left"}}/>
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
                        <WorkOutline sx={{verticalAlign: "middle", float: i18n.language === "en" ? "right" : "left"}}/>
                        {
                            t("sidebar.projects")
                        }
                    </Typography>
                </MenuItem>

                <Divider variant="middle"/>

                <MenuItem>
                    <Link href={resume} download sx={{m:"auto", textDecoration:"none"}}>
                        <Typography sx={{textAlign:"center"}}>
                            <PersonOutline sx={{verticalAlign: "middle", float: i18n.language === "en" ? "right" : "left"}}/>
                            {
                                t("sidebar.resume")
                            }
                        </Typography>
                    </Link>
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