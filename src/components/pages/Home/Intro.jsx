import {Box, Button, Slide, Typography} from "@mui/material";
import {KeyboardDoubleArrowLeftOutlined, KeyboardDoubleArrowRightOutlined, ManOutlined} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import {useContext, useEffect, useRef} from "react";
import {Context} from "../../../ContextApp.jsx";
import Typed from "typed.js";
import {useTranslation} from "react-i18next";

const Intro = ({avatarLoaded}) => {

    const {setActivePage} = useContext(Context)

    const {t, i18n} = useTranslation()

    const handleMenuItemClick = (page) => {
        setActivePage(page)
    }

    const TEXTS_fa = ["ریکت.","فرانت اند.","پایتون.","وب."]
    const TEXTS_en = ["reactjs.","frontend.","python.","web."]
    const textRef = useRef(null)

    useEffect(() => {
        const typed = new Typed(textRef.current, {
            strings: i18n.language === "en" ? TEXTS_en : TEXTS_fa,
            typeSpeed: 50,
            showCursor:false,
            loop: true
        })

        return () => {
            typed.destroy()
        }
    }, [i18n.language])

    return(
        <Grid xs={12} sm={12} md={6} lg={6} sx={{ display: 'flex',flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',textAlign: 'right' }}>
            <Slide direction="down" in={avatarLoaded}
                   style={{transitionDelay: avatarLoaded ? "300ms": "0"}}>
                <Typography sx={{ textAlign: 'right', mt:1 }} variant="h6">
                    {
                        i18n.language === "en" ?
                            <KeyboardDoubleArrowRightOutlined className="arrow-animation" fontSize="20"
                                                              sx={{verticalAlign:"middle"}}/>
                            :
                            <KeyboardDoubleArrowLeftOutlined className="arrow-animation" fontSize="20"
                                                             sx={{verticalAlign:"middle"}}/>
                    }

                    {
                        t("home.hello")
                    }

                </Typography>
            </Slide>
            <Slide direction="down" in={avatarLoaded}
                   style={{transitionDelay: avatarLoaded ? "400ms": "0"}}>
                <Typography color="secondary.light" sx={{ textAlign: 'right',
                    fontSize:{
                        lg:60,
                        md:45,
                        sm:45,
                        xs:27
                    }
                }}>
                    {
                        t("home.name")
                    }
                </Typography>
            </Slide>
            <Slide direction="down" in={avatarLoaded}
                   style={{transitionDelay: avatarLoaded ? "500ms": "0"}}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'center',mt:1}}>
                    <Typography sx={{ textAlign: 'right', ml: i18n.language === "en" ? 1 : 0}}>
                        {
                            t("home.programmer")
                        }
                    </Typography>

                    <Typography sx={{ textAlign: 'right', ml: i18n.language === "en" ? 0 : 1 }} ref={textRef}>
                    </Typography>

                </Box>
            </Slide>

            <Slide direction="up" in={avatarLoaded}
                   style={{transitionDelay: avatarLoaded ? "200ms": "0"}}>
                <Button color="secondary" onClick={() => handleMenuItemClick("about")}
                        variant="contained" sx={{my:5,px:5, py:2}}>
                    <ManOutlined className="float-animation" />
                    {
                        t("sidebar.aboutMe")
                    }
                </Button>
            </Slide>
        </Grid>
    )
}

export default Intro