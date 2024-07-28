import {CodeOutlined, HomeOutlined, ManOutlined, MenuRounded, WorkOutline} from "@mui/icons-material";
import {Menu, MenuItem} from "@mui/material";
import {useContext, useState} from "react";
import {Context} from "../ContextApp.jsx";

const MainMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const {activePage, setActivePage} = useContext(Context)

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleMenuItemClick = (page) => {
        setActivePage(page)
        handleClose()
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    return(
        <>
            <MenuRounded fontSize="large" sx={{position:"absolute", top:20,right:35, color:"white", cursor:"pointer"}}
                         id="demo-positioned-button"
                         aria-controls={open ? 'demo-positioned-menu' : undefined}
                         aria-haspopup="true"
                         aria-expanded={open ? 'true' : undefined}
                         onClick={handleClick}/>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}>
                <MenuItem onClick={() => handleMenuItemClick("home")}
                          sx={{ backgroundColor: activePage === "home" ? "primary.light" : "inherit",}}>
                    <HomeOutlined/>
                    صفحه اصلی
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("about")}
                          sx={{ backgroundColor: activePage === "about" ? "primary.light" : "inherit" }}>
                    <ManOutlined/>
                    درباره من
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("skills")}
                          sx={{ backgroundColor: activePage === "skills" ? "primary.light" : "inherit" }}>
                    <CodeOutlined/>
                    مهارت ها
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("projects")}
                          sx={{ backgroundColor: activePage === "projects" ? "primary.light" : "inherit" }}>
                    <WorkOutline/>
                    پروژه ها
                </MenuItem>
            </Menu>
        </>
    )
}

export default MainMenu