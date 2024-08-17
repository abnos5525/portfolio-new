import {Box, Button, Skeleton, Slide, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {useContext, useEffect, useState} from "react";
import {CodeOutlined, KeyboardDoubleArrowLeftOutlined} from "@mui/icons-material";
import {Context} from "../../../ContextApp.jsx";
import DrawerActionButton from "../../sidebar/DrawerActionButton.jsx";

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

    const {setActivePage} = useContext(Context)

    const handleMenuItemClick = (page) => {
        setActivePage(page)
    }

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
                    <Typography variant="h5" textAlign="left" sx={{p:2,mb:2}}>
                        <KeyboardDoubleArrowLeftOutlined className="arrow-animation" fontSize="20" sx={{verticalAlign:"middle"}}
                        />
                        درباره من
                    </Typography>
                </Slide>
                <Grid container>
                    <Grid xs={12} sm={12} md={5} lg={5} sx={{textAlign:"center", order: { md: 2 }}}>
                        <Box sx={{ display: 'grid', justifyItems: 'center', position:"relative",
                            height: {
                                lg:260,
                                md:260,
                                sm:260,
                                xs:180
                            }
                        }}>
                            {!avatarLoaded && (
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    sx={{ width: {lg:250,md:250,sm:250,xs:200},
                                        height: {lg:250,md:250,sm:250,xs:200}, m: "auto", mb: 2, borderRadius: 6 }}
                                />
                            )}
                            <Box sx={{position: 'relative', minHeight: '300px' }}>
                                <Skeleton
                                    animation="wave"
                                    sx={{
                                        bgcolor: "primary.main",
                                        borderRadius: 4,
                                        display: avatarLoaded ? 'block' : 'none',
                                        position:"absolute",
                                        width: {
                                            lg:290,
                                            md:290,
                                            sm:290,
                                            xs:200
                                        },
                                        height:{
                                            lg:490,
                                            md:490,
                                            sm:490,
                                            xs:360
                                        },
                                        top:{
                                            lg:-115,
                                            md:-115,
                                            sm:-115,
                                            xs:-90
                                        },
                                        left:{
                                            lg:-8,
                                            md:-8,
                                            sm:-8,
                                            xs:-4
                                        }
                                    }}
                                />
                                <Box
                                    component="img"
                                    className="grayscale"
                                    src={avatar}
                                    sx={{
                                        borderRadius: 5,
                                        textAlign:"center",
                                        display: avatarLoaded ? 'block' : 'none',
                                        mx:"auto",
                                        width:{
                                            lg:270,
                                            md:270,
                                            sm:270,
                                            xs:190,
                                        },
                                        height:{
                                            lg:270,
                                            md:270,
                                            sm:270,
                                            xs:190,
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid xs={12} sm={12} md={7} lg={7} sx={{order: { md: 1 }}}>
                        {[...Array(5)].map((_, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Skeleton
                                    animation="wave"
                                    sx={{
                                        borderRadius: 80,
                                        display: avatarLoaded ? 'none' : 'block',
                                        width: "90%",
                                        height: 40,
                                        mx:"auto",
                                        textAlign:"center"
                                    }}
                                />
                            </Box>
                        ))}
                        <Typography variant="subtitle1" sx={{lineHeight:2, p:2, display: avatarLoaded ? 'block' : 'none'}} >
                            <p>
                                سلام! من محمدحسین حیدری هستم، برنامه‌نویس فرانت‌اند. طراحی و توسعه رابط‌های کاربری زیبا و کارآمد برای وب‌سایت‌ها و برنامه‌های وب، عشق و علاقه منه.
                            </p>
                            <p>
                                با استفاده از تکنولوژی‌های مدرن و بهترین شیوه‌های برنامه‌نویسی، سعی می‌کنم تا تجربه کاربری را به بهترین شکل ممکن به کاربران ارائه بدم.
                            </p>
                            <p>
                                هر پروژه برای من فرصتیه تا خلاقیت و مهارت‌های خود را به چالش بکشم و نتایج بی‌نظیری به دست بیارم.
                            </p>
                            <p>
                                با علاقه‌مندی به یادگیری مداوم و به‌روز نگه داشتن دانش خود، همواره در تلاش هستم تا بهترین نسخه از خودم باشم و تاثیر مثبتی در دنیای دیجیتال بذارم.
                            </p>
                        </Typography>

                        <Slide direction="up" in={avatarLoaded}
                               style={{transitionDelay: avatarLoaded ? "200ms": "0"}}>
                            <Box sx={{textAlign:{
                                    lg:"right",
                                    md:"center",
                                    sm:"center",
                                    xs:"center"
                                }}}>
                                <Button color="secondary" onClick={() => handleMenuItemClick("skills")}
                                        variant="contained" sx={{my:5,px:5, py:2}}>
                                    <CodeOutlined className="float-animation" />
                                    مهارت های من
                                </Button>
                            </Box>
                        </Slide>
                    </Grid>
                </Grid>

                <DrawerActionButton/>

            </Box>
        </Box>
    )
}

export default AboutPage