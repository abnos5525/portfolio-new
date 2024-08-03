import {Box, Button, LinearProgress, Skeleton, Slide, Typography, useMediaQuery} from "@mui/material";
import {KeyboardDoubleArrowLeftOutlined, WorkOutline} from "@mui/icons-material";
import {useContext, useEffect, useState} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import MainMenu from "../../MainMenu.jsx";
import {Context} from "../../../ContextApp.jsx";

const SkillsPage = () => {

    const [activeSkill, setActiveSkill] = useState(null);
    const [loadedImages, setLoadedImages] = useState({});
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const skills = [
        { name: "HTML", img: "./images/icons/html.png", progress: 95},
        { name: "CSS", img: "./images/icons/css.png", progress: 85 },
        { name: "JavaScript", img: "./images/icons/javascript.png", progress: 70 },
        { name: "TypeScript", img: "./images/icons/typescript.png", progress: 60 },
        { name: "ReactJs", img: "./images/icons/reactjs.png", progress: 85 },
        { name: "Redux", img: "./images/icons/redux.png", progress: 70 },
        { name: "VueJs", img: "./images/icons/vuejs.png", progress: 70 },
        { name: "NodeJs", img: "./images/icons/nodejs.png", progress: 50 },
        { name: "Bootstrap", img: "./images/icons/bootstrap.png", progress: 85 },
        { name: "TailwindCss", img: "./images/icons/tailwind.png", progress: 85 },
        { name: "Python", img: "./images/icons/python.png", progress: 75 },
        { name: "Git", img: "./images/icons/git.png", progress: 65 },
    ]

    useEffect(() => {
        const loadImage = (index, src) => {
            const img = new Image()
            img.src = src
            img.onload = () => setLoadedImages(prev => ({ ...prev, [index]: true }))
            img.onerror = () => setLoadedImages(prev => ({ ...prev, [index]: false }))
        }

        skills.forEach((skill, index) => loadImage(index, skill.img))
    }, [skills])

    const handleMouseEnter = (index) => {
        if (!isSmallScreen) {
            setActiveSkill(index)
        }
    }

    const handleMouseLeave = () => {
        if (!isSmallScreen) {
            setActiveSkill(null)
        }
    }

    const handleClick = (index) => {
        if (isSmallScreen) {
            setActiveSkill(activeSkill === index ? null : index)
        }
    }

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
                <Slide direction="down" in={loadedImages[0]}
                       style={{transitionDelay: "200ms"}}>
                    <Typography variant="h4" textAlign="left" sx={{p:2}}>
                        <KeyboardDoubleArrowLeftOutlined className="arrow-animation" fontSize="20" sx={{verticalAlign:"middle"}}/>
                        مهارت های من
                    </Typography>
                </Slide>

                <Grid container sx={{mt:2}}>
                    <Grid container spacing={2}>
                        {skills.map((skill, index) => (
                            <Grid
                                key={index}
                                xs={6}
                                sm={6}
                                md={3}
                                lg={3}
                                sx={{ textAlign: "center" }}>
                                <Box sx={{
                                    direction:"ltr",
                                    width:"60%",
                                    m:"auto",
                                    textAlign: "center",
                                    transition: "transform 0.3s, background-color 0.3s",
                                    "&:hover": {
                                        transform: isSmallScreen ? 'none' : "scale(1.1)",
                                        backgroundColor: isSmallScreen ? 'none' : "rgba(255, 255, 255, 0.1)",
                                    },
                                    borderRadius: 3,
                                    cursor:"pointer",
                                    position: "relative",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    height: "200px",
                                }}
                                     onMouseEnter={() => handleMouseEnter(index)}
                                     onMouseLeave={handleMouseLeave}
                                     onClick={() => handleClick(index)}>

                                    {loadedImages[index] ? (
                                        <Box
                                            component="img"
                                            className="grayscale"
                                            src={skill.img}
                                            sx={{
                                                borderRadius: 5,
                                                width: "100px",
                                                height: "100px",
                                                transition: "transform 0.3s",
                                                textAlign:"center",
                                                m:"auto"
                                            }}
                                        />
                                    ) : (
                                        <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: 5,mb:5 }} />
                                    )}

                                    {(activeSkill !== index) && (
                                        <Typography variant="subtitle1">
                                            {skill.name}
                                        </Typography>
                                    )}
                                    {(activeSkill === index) && (
                                        <Box sx={{ width: "80%" }}>
                                            <LinearProgress variant="determinate" color="secondary"
                                                            value={skill.progress}
                                                            sx={{ height: 10, borderRadius: 5 }} />
                                            <Typography variant="caption" sx={{ color: "#fff" }}>
                                                {skill.progress}%
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <MainMenu />
                <Box sx={{textAlign:"center"}}>
                    <Button color="secondary" onClick={() => handleMenuItemClick("projects")}
                            variant="contained" sx={{my:10,px:5, py:2}}>
                        <WorkOutline className="float-animation" />
                        پروژه های من
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default SkillsPage