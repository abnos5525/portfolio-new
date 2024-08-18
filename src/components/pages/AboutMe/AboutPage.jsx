import {Box, Button, Slide} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {useContext, useState} from "react";
import {
    CodeOutlined,
} from "@mui/icons-material";
import {Context} from "../../../ContextApp.jsx";
import DrawerActionButton from "../../sidebar/DrawerActionButton.jsx";
import {useTranslation} from "react-i18next";
import Title from "./Title.jsx";
import Avatar from "./Avatar.jsx";
import Description from "./Description.jsx";

const AboutPage = () => {
    const [avatarLoaded, setAvatarLoaded] = useState(false)

    const {t} = useTranslation()

    const {setActivePage} = useContext(Context)

    const handleMenuItemClick = (page) => {
        setActivePage(page)
    }

    return(
        <>
                <Title avatarLoaded={avatarLoaded}/>

                <Grid container>
                    <Grid xs={12} sm={12} md={5} lg={5} sx={{textAlign:"center", order: { md: 2 }}}>
                        <Avatar avatarLoaded={avatarLoaded} setAvatarLoaded={setAvatarLoaded}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={7} lg={7} sx={{order: { md: 1 }}}>

                        <Description avatarLoaded={avatarLoaded}/>

                        <Slide direction="up" in={avatarLoaded}
                               style={{transitionDelay: avatarLoaded ? "200ms": "0"}}>
                            <Box sx={{textAlign:"center"}}>
                                <Button color="secondary" onClick={() => handleMenuItemClick("skills")}
                                        variant="contained" sx={{my:5,px:5, py:2}}>
                                    <CodeOutlined className="float-animation" />
                                    {
                                        t("sidebar.skills")
                                    }
                                </Button>
                            </Box>
                        </Slide>
                    </Grid>
                </Grid>

                <DrawerActionButton/>

            </>
    )
}

export default AboutPage