import {Box, Skeleton, Slide, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {useEffect, useState} from "react";
import MainMenu from "../../MainMenu.jsx";

const AboutPage = () => {
    const [avatarLoaded, setAvatarLoaded] = useState(false)

    const avatar = "./images/me.jpg"

    const handleAvatarLoad = () => {
        setAvatarLoaded(true);
    }

    useEffect(() => {
        const img = new window.Image();
        img.src = avatar;
        img.onload = handleAvatarLoad;
    }, []);

    return(
        <Box sx={{m:{
                xs:2,
                sm:2,
                md:5,
                lg:5
            },p:1, height:"auto", borderRadius:3, background: 'linear-gradient(to left, #E06432 , #261a1a)'}}>

            <Box sx={{height:"auto",pb:5, borderRadius:4, backgroundColor: "primary.dark", position:"relative"}}>
                <Slide direction="down" in={avatarLoaded}
                       style={{transitionDelay: avatarLoaded ? "200ms": "0"}}>
                    <Typography variant="h4" textAlign="left" sx={{p:2}}>
                        درباره من
                    </Typography>
                </Slide>
                <Grid container>
                    <Grid xs={12} sm={12} md={5} lg={5} sx={{textAlign:"center", order: { md: 2 }}}>
                        <Box sx={{ display: 'grid', justifyItems: 'center', position:"relative" }}>
                            {!avatarLoaded && (
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    sx={{ width: 250, height: 250, m: "auto", mb: 2, borderRadius: 6 }}
                                />
                            )}
                            <Box sx={{ width: 300, height: 300, position: 'relative' }}>
                                <Skeleton
                                    animation="wave"
                                    sx={{
                                        bgcolor: "primary.main",
                                        borderRadius: 4,
                                        display: avatarLoaded ? 'block' : 'none',
                                        position:"absolute",
                                        width: 330,
                                        height:530,
                                        top:-125,
                                        left:-15
                                    }}
                                />
                                <Box
                                    component="img"
                                    className="grayscale"
                                    src={avatar}
                                    width="100%"
                                    height="100%"
                                    sx={{
                                        borderRadius: 5,
                                        display: avatarLoaded ? 'block' : 'none',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid xs={12} sm={12} md={7} lg={7} sx={{order: { md: 1 }}}>
                        <Typography variant="subtitle1" sx={{lineHeight:2, p:2}}>
                            سلام! من محمدحسین حیدری هستم، برنامه‌نویس فرانت‌اند. طراحی و توسعه رابط‌های کاربری زیبا و کارآمد برای وب‌سایت‌ها و برنامه‌های وب، عشق و علاقه منه. با استفاده از تکنولوژی‌های مدرن و بهترین شیوه‌های برنامه‌نویسی، سعی می‌کنم تا تجربه کاربری را به بهترین شکل ممکن به کاربران ارائه بدم. هر پروژه برای من فرصتیه تا خلاقیت و مهارت‌های خود را به چالش بکشم و نتایج بی‌نظیری به دست بیارم. با علاقه‌مندی به یادگیری مداوم و به‌روز نگه داشتن دانش خود، همواره در تلاش هستم تا بهترین نسخه از خودم باشم و تاثیر مثبتی در دنیای دیجیتال بذارم.
                        </Typography>
                    </Grid>
                </Grid>
                <MainMenu />

            </Box>
        </Box>
    )
}

export default AboutPage