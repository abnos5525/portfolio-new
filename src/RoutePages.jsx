import {CSSTransition, SwitchTransition} from "react-transition-group";
import Home from "./components/pages/Home/Home.jsx";
import AboutPage from "./components/pages/AboutMe/AboutPage.jsx";
import SkillsPage from "./components/pages/Skills/SkillsPage.jsx";
import ProjectsPage from "./components/pages/Projects/ProjectsPage.jsx";
import {useContext} from "react";
import {Context} from "./ContextApp.jsx";
import {Box} from "@mui/material";

const RoutePages = () => {

    const {activePage, theme} = useContext(Context)

    const renderPage = () => {
        switch (activePage) {
            case "home":
                return <Home/>;
            case "about":
                return <AboutPage />;
            case "skills":
                return <SkillsPage />;
            case "projects":
                return <ProjectsPage />;
        }
    }

    return(
        <SwitchTransition>
            <CSSTransition
                key={activePage}
                timeout={300}
                classNames="page"
                unmountOnExit>

                <Box style={{marginTop:30}} sx={{m:{
                        xs:2,
                        sm:2,
                        md:5,
                        lg:5
                    },p:1, height:"auto",borderRadius:3,
                    background: `linear-gradient(to left, ${theme === "theme1" ? '#E06432' :'#deab3a'}  ,
                                                  ${theme === "theme1" ? '#261a1a' : '#522258'} )`}}>

                    <Box sx={{height:"auto",pb:5, borderRadius:4, backgroundColor: "primary.dark", position:"relative"}}>
                    {renderPage()}
                    </Box>
                </Box>

            </CSSTransition>
        </SwitchTransition>
    )
}

export default RoutePages