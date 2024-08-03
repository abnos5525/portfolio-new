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
        <Box style={{marginTop:30}} sx={{m:{
                xs:2,
                sm:2,
                md:5,
                lg:5
            },p:1, height:"auto",borderRadius:3, background: 'linear-gradient(to left, #E06432 , #261a1a)'}}>

            <Box sx={{height:"auto",pb:5, borderRadius:4, backgroundColor: "primary.dark", position:"relative"}}>

                <Slide direction="left" in={avatarLoaded}
                       style={{transitionDelay: avatarLoaded ? "600ms": "0"}}>
                    <Box sx={{ position: "relative" }}>
                        <Box component="img" src="./images/imojis/light_bulb.png"
                             sx={{ position: "absolute", top: -40, left: 20 }}
                        />
                        <Box className="light-bulb-glow" />
                    </Box>
                </Slide>

                <Grid container>
                    <Avatar avatarLoaded={avatarLoaded} setAvatarLoaded={setAvatarLoaded} />

                    <Intro avatarLoaded={avatarLoaded}/>

                    <Socials/>
                </Grid>

                <DrawerActionButton/>

            </Box>
        </Box>
    )
}

export default Home
