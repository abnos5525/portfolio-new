import {createContext, useState} from "react";

export const Context = createContext()
const ContextApp = ({children}) => {

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [activePage, setActivePage] = useState("home")

    return(
        <Context.Provider value={{
            drawerOpen,
            setDrawerOpen,

            activePage,
            setActivePage,
        }}>
            {children}
        </Context.Provider>
    )
}

export default ContextApp