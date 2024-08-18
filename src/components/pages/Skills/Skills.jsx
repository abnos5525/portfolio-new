import {Box, LinearProgress, Skeleton, Typography, useMediaQuery} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {memo} from "react";

const Skills = ({setActiveSkill,activeSkill, skill, loadedImages,index}) => {
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const handleMouseEnter = () => {
        if (!isSmallScreen) {
            setActiveSkill(index);
        }
    };

    const handleMouseLeave = () => {
        if (!isSmallScreen) {
            setActiveSkill(null);
        }
    };

    const handleClick = () => {
        if (isSmallScreen) {
            setActiveSkill(activeSkill === index ? null : index);
        }
    };

    return(
        <Grid
            xs={6}
            sm={6}
            md={3}
            lg={3}
            sx={{textAlign: "center"}}>
            <Box sx={{
                direction: "ltr",
                width: "60%",
                m: "auto",
                textAlign: "center",
                transition: "transform 0.3s, background-color 0.3s",
                "&:hover": {
                    transform: isSmallScreen ? 'none' : "scale(1.1)",
                    backgroundColor: isSmallScreen ? 'none' : "rgba(255, 255, 255, 0.1)",
                },
                borderRadius: 3,
                cursor: "pointer",
                position: "relative",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: "200px",
            }}
                 onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}
                 onClick={handleClick}>

                {loadedImages ? (
                    <Box
                        component="img"
                        className="grayscale"
                        src={skill.img}
                        sx={{
                            borderRadius: 5,
                            width: "100px",
                            height: "100px",
                            transition: "transform 0.3s",
                            textAlign: "center",
                            m: "auto",
                        }}
                    />
                ) : (
                    <Skeleton variant="rectangular" width={100} height={100}
                              sx={{borderRadius: 5, mb: 5}}/>
                )}

                {(activeSkill !== index) && (
                    <Typography variant="subtitle1">
                        {skill.name}
                    </Typography>
                )}
                {(activeSkill === index) && (
                    <Box sx={{width: "80%"}}>
                        <LinearProgress variant="determinate" color="secondary"
                                        value={skill.progress}
                                        sx={{height: 10, borderRadius: 5}}/>
                        <Typography variant="caption" sx={{color: "#fff"}}>
                            {skill.progress}%
                        </Typography>
                    </Box>
                )}
            </Box>
        </Grid>
    )
}

export default memo(Skills)