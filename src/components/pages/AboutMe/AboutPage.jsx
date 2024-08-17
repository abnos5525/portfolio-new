import {Box, Button, Skeleton, Slide, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {useContext, useEffect, useState} from "react";
import {
    CodeOutlined,
    KeyboardDoubleArrowLeftOutlined,
    KeyboardDoubleArrowRight,
    KeyboardDoubleArrowRightOutlined
} from "@mui/icons-material";
import {Context} from "../../../ContextApp.jsx";
import DrawerActionButton from "../../sidebar/DrawerActionButton.jsx";
import {useTranslation} from "react-i18next";

const AboutPage = () => {
    const [avatarLoaded, setAvatarLoaded] = useState(false)

    const {t, i18n} = useTranslation()

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
        <>
                <Slide direction="down" in={avatarLoaded}
                       style={{transitionDelay: avatarLoaded ? "200ms": "0"}}>
                    <Typography variant="h5" textAlign="left" sx={{p:2,mb:2,
                        textAlign:i18n.language === "en" ? "right" : "left"}}>

                        {
                            i18n.language === "en" ?
                                <KeyboardDoubleArrowRightOutlined className="arrow-animation" fontSize="20"
                                                                 sx={{verticalAlign:"middle"}}/>
                                :
                                <KeyboardDoubleArrowLeftOutlined className="arrow-animation" fontSize="20"
                                                                 sx={{verticalAlign:"middle"}}/>
                        }
                        {
                            t("sidebar.aboutMe")
                        }
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
                        {[...Array(8)].map((_, index) => (
                            <Box key={index} sx={{ my: 2 }}>
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
                                {
                                    t("aboutMe.description")
                                }
                        </Typography>

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