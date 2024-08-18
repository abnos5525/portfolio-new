import {Box, Link, Skeleton, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

const Items = ({ project, loadedImages, index }) => {

    const {t} = useTranslation()

    return(
        <Link href={project.link} target="_blank" key={index} style={{textDecoration:"none"}}>
            <Box sx={{textAlign:"center", mx:"auto"}}>
                {loadedImages ? (
                    <Box>
                        <Box
                            component="img"
                            className="grayscale"
                            src={project.img}
                            sx={{
                                borderRadius: 5,
                                width: {
                                    lg:550,
                                    md:550,
                                    sm:450,
                                    xs:220
                                },
                                textAlign:"center",
                                m:"auto"
                            }}
                        />
                        {
                            project.online ?
                                <Typography variant="h4"
                                            sx={{color:"success.main", my:2}}>
                                    {
                                        t("projects.online")
                                    }
                                </Typography>
                                :
                                <Typography variant="h4"
                                            sx={{color:"error.main", my:2}}>
                                    {
                                        t("projects.offline")
                                    }
                                </Typography>
                        }
                    </Box>
                ) : (
                    <Skeleton variant="rectangular" width={550} height={300}
                              sx={{borderRadius: 5, textAlign:"center", m:"auto"}} />
                )}
            </Box>
        </Link>
    )
}

export default Items