import {Box, Button} from "@mui/material";
import {WorkOutline} from "@mui/icons-material";
import {useCallback, useContext, useEffect, useState} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {Context} from "../../../ContextApp.jsx";
import DrawerActionButton from "../../sidebar/DrawerActionButton.jsx";
import {useTranslation} from "react-i18next";
import Title from "./Title.jsx";
import Skills from "./Skills.jsx";

const SkillsPage = () => {

    const [activeSkill, setActiveSkill] = useState(null);
    const [loadedImages, setLoadedImages] = useState({});

    const {t} = useTranslation()

    const skills = [
        {name: "HTML", img: "./images/icons/html.png", progress: 95},
        {name: "CSS", img: "./images/icons/css.png", progress: 85},
        {name: "JavaScript", img: "./images/icons/javascript.png", progress: 70},
        {name: "TypeScript", img: "./images/icons/typescript.png", progress: 60},
        {name: "ReactJs", img: "./images/icons/reactjs.png", progress: 85},
        {name: "Redux", img: "./images/icons/redux.png", progress: 70},
        {name: "VueJs", img: "./images/icons/vuejs.png", progress: 70},
        {name: "NodeJs", img: "./images/icons/nodejs.png", progress: 50},
        {name: "Bootstrap", img: "./images/icons/bootstrap.png", progress: 85},
        {name: "TailwindCss", img: "./images/icons/tailwind.png", progress: 85},
        {name: "Python", img: "./images/icons/python.png", progress: 75},
        {name: "Git", img: "./images/icons/git.png", progress: 65},
    ]

    const loadImage = useCallback((index, src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => setLoadedImages(prev => ({ ...prev, [index]: true }));
        img.onerror = () => setLoadedImages(prev => ({ ...prev, [index]: false }));
    }, []);

    useEffect(() => {
        skills.forEach((skill, index) => loadImage(index, skill.img));
    }, [skills, loadImage]);

    const {setActivePage} = useContext(Context)

    const handleMenuItemClick = (page) => {
        setActivePage(page)
    }

    return (
        <>
            <Title loadedImages={loadedImages[0]}/>

            <Grid container sx={{mt: 2}}>
                <Grid container spacing={2}>
                    {skills.map((skill, index) => (
                        <Skills key={index}
                                index={index}
                                skill={skill}
                                activeSkill={activeSkill}
                                setActiveSkill={setActiveSkill}
                                loadedImages={loadedImages[index]}
                        />
                    ))}
                </Grid>
            </Grid>
            <Box sx={{textAlign: "center"}}>
                <Button color="secondary" onClick={() => handleMenuItemClick("projects")}
                        variant="contained" sx={{my: 10, px: 5, py: 2}}>
                    <WorkOutline className="float-animation"/>
                    {
                        t("sidebar.projects")
                    }
                </Button>
            </Box>

            <DrawerActionButton/>
        </>
    )
}

export default SkillsPage