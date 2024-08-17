import {createContext, useState} from "react";

export const Context = createContext()
const ContextApp = ({children}) => {

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [activePage, setActivePage] = useState("home")
    const [theme, setTheme] = useState("theme2")
    const [lang, setLang] = useState("fa")

    return (
        <Context.Provider value={{
            drawerOpen,
            setDrawerOpen,

            activePage,
            setActivePage,

            theme,
            setTheme,

            lang,
            setLang
        }}>
            {children}
        </Context.Provider>
    )
}

export default ContextApp