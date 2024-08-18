import {Box, Skeleton, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

const Description = ({avatarLoaded}) => {

    const {t} = useTranslation()

    return(
        <>
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
        </>
    )
}

export default Description