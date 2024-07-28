import {CSSTransition, SwitchTransition} from "react-transition-group";
import Home from "./components/pages/Home/Home.jsx";
import AboutPage from "./components/pages/AboutMe/AboutPage.jsx";
import SkillsPage from "./components/pages/Skills/SkillsPage.jsx";
import ProjectsPage from "./components/pages/Projects/ProjectsPage.jsx";
import {useContext} from "react";
import {Context} from "./ContextApp.jsx";

const RoutePages = () => {

    const {activePage} = useContext(Context)

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
                <>
                    {renderPage()}
                </>
            </CSSTransition>
        </SwitchTransition>
    )
}

export default RoutePages