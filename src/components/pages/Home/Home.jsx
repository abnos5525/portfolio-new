import { Box, Slide } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react";
import Avatar from "./Avatar.jsx";
import Intro from "./Intro.jsx";
import Socials from "./Socials.jsx";
import DrawerActionButton from "../../sidebar/DrawerActionButton.jsx";
import { useTranslation } from "react-i18next";
import {Helmet} from "react-helmet-async";

const Home = () => {
    const [avatarLoaded, setAvatarLoaded] = useState(false);

    const { i18n } = useTranslation();

    return (
        <>
            <Helmet>
                <title>Portfolio-New | Home</title>
            </Helmet>
            <Slide direction={i18n.language === "en" ? "right" : "left"} in={avatarLoaded}
                   style={{ transitionDelay: avatarLoaded ? "600ms" : "0" }}>
                <Box sx={{ position: "relative" }}>
                    <Box component="img" src="./images/imojis/light_bulb.png"
                         sx={{
                             position: "absolute",
                             top: -40,
                             left: i18n.language === "en" ? "auto" : 20,
                             right: i18n.language === "en" ? 20 : "auto",
                             transition: "all 0.3s ease",
                         }}
                    />
                    <Box className="light-bulb-glow" sx={{
                        position: "absolute",
                        top: -40,
                        left: i18n.language === "en" ? "auto" : 47,
                        right: i18n.language === "en" ? 41 : "auto",
                        transition: "all 0.3s ease",
                    }} />
                </Box>
            </Slide>

            <Grid container>
                <Avatar avatarLoaded={avatarLoaded} setAvatarLoaded={setAvatarLoaded} />
                <Intro avatarLoaded={avatarLoaded} />
                <Socials />
            </Grid>

            <DrawerActionButton />
        </>
    );
}

export default Home;
