import {useTranslation} from "react-i18next";
import {Slide, Typography} from "@mui/material";
import {KeyboardDoubleArrowLeftOutlined, KeyboardDoubleArrowRightOutlined} from "@mui/icons-material";

const Title = ({avatarLoaded}) => {

    const {t, i18n} = useTranslation()

    return(
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
    )
}

export default Title