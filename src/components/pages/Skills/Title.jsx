import {Slide, Typography} from "@mui/material";
import {KeyboardDoubleArrowLeftOutlined, KeyboardDoubleArrowRightOutlined} from "@mui/icons-material";
import {useTranslation} from "react-i18next";

const Title = ({loadedImages}) => {

    const {t, i18n} = useTranslation()

    return(
        <Slide direction="down" in={loadedImages}
               style={{transitionDelay: "200ms"}}>
            <Typography variant="h5" textAlign="left" sx={{p: 2,
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
                    t("sidebar.skills")
                }
            </Typography>
        </Slide>
    )
}

export default Title