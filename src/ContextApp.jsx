import {createContext, useState} from "react";

export const Context = createContext()
const ContextApp = ({children}) => {

    const [activePage, setActivePage] = useState("home")

    return(
        <Context.Provider value={{
            activePage,
            setActivePage
        }}>
            {children}
        </Context.Provider>
    )
}

export default ContextApp