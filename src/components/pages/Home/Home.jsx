import {Box, Slide} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {useState} from "react";
import Avatar from "./Avatar.jsx";
import Intro from "./Intro.jsx";
import Socials from "./Socials.jsx";
import DrawerActionButton from "../../sidebar/DrawerActionButton.jsx";

const Home = () => {
    const [avatarLoaded, setAvatarLoaded] = useState(false)

    return (
        <>
                <Slide direction="left" in={avatarLoaded}
                       style={{transitionDelay: avatarLoaded ? "600ms": "0"}}>
                    <Box sx={{ position: "relative" }}>
                        <Box component="img" src="./images/imojis/light_bulb.png"
                             sx={{ position: "absolute", top: -40, left: {
                                    lg:20,
                                    md:20,
                                    sm:20,
                                    xs:-20
                                 } }}
                        />
                        <Box className="light-bulb-glow" sx={{
                            left:{
                                lg:47,
                                md:47,
                                sm:47,
                                xs:8
                            }
                        }} />
                    </Box>
                </Slide>

                <Grid container>
                    <Avatar avatarLoaded={avatarLoaded} setAvatarLoaded={setAvatarLoaded} />

                    <Intro avatarLoaded={avatarLoaded}/>

                    <Socials/>
                </Grid>

                <DrawerActionButton/>

            </>
    )
}

export default Home
