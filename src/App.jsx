import {Box, Typography, Button, Menu, MenuItem, Skeleton} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {GitHub, Instagram, LinkedIn, MenuRounded} from "@mui/icons-material";
import {useEffect, useState} from "react";

const App = () => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [avatarLoaded, setAvatarLoaded] = useState(false)
    const open = Boolean(anchorEl)

    const avatar = './images/programmer.png'

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const [activePage, setActivePage] = useState("home")

    const handleMenuItemClick = (page) => {
        setActivePage(page)
        handleClose()
    }

    const handleAvatarLoad = () => {
        setAvatarLoaded(true);
    }

    // استفاده از useEffect برای بارگذاری تصویر
    useEffect(() => {
        const img = new window.Image();
        img.src = avatar;
        img.onload = handleAvatarLoad;
    }, []);

    return (
        <Box sx={{m:{
                xs:2,
                sm:2,
                md:5,
                lg:5
            },p:1, height:"auto", borderRadius:3, background: 'linear-gradient(to left, #E06432 , #261a1a)'}}>

            <Box sx={{height:"auto", borderRadius:4, backgroundColor: "primary.dark", position:"relative"}}>
                <Grid container>
                    <Grid xs={12} sm={12} md={5} lg={5} sx={{textAlign:"center", mt:5}}>
                        {!avatarLoaded && (
                            <Skeleton variant="rectangular" animation="wave"
                                      sx={{ width: 350, height: 350, m:"auto", mb:2, borderRadius:3 }} />
                        )}
                        {avatarLoaded && (
                            <img
                                src={avatar}
                                alt="programmer"
                                width={300}
                                height={300}
                            />
                        )}

                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} sx={{ display: 'flex',flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',textAlign: 'right' }}>
                        <Typography color="text.primary" sx={{ textAlign: 'right', mt:1 }} variant="h6">
                            __سلام من
                        </Typography>
                        <Typography color="text.primary" sx={{ textAlign: 'right',
                            fontSize:{
                                lg:60,
                                md:45,
                                sm:45,
                                xs:40
                            }
                        }}>
                            محمدحسین حیدریم
                        </Typography>
                        <Typography color="text.primary" sx={{ textAlign: 'right',mt:1}} >
                            یک برنامه نویس فرانت اند.
                        </Typography>

                        <Button color="secondary" variant="contained" sx={{my:5}}>
                            درباره من
                        </Button>
                    </Grid>
                    <Grid xs={12} sm={12} md={1} lg={1} sx={{ display: 'flex',
                        mb:{
                            xs:3,
                            sm:3,
                            md:0,
                            lg:0,
                        },
                        flexDirection: {
                            xs:'row',
                            sm:'row',
                            md:'column',
                            lg:'column'
                        },
                        alignItems: 'center', justifyContent: 'center',textAlign: 'right',gap:2}}>
                        <Instagram color="secondary" fontSize="large" sx={{cursor:"pointer"}}/>
                        <GitHub color="secondary" fontSize="large" sx={{cursor:"pointer"}}/>
                        <LinkedIn color="secondary" fontSize="large" sx={{cursor:"pointer"}}/>
                    </Grid>
                </Grid>
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
                    }}
                >
                    <MenuItem onClick={() => handleMenuItemClick("home")}
                              sx={{ backgroundColor: activePage === "home" ? "primary.light" : "inherit" }}>صفحه اصلی</MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick("about")}
                              sx={{ backgroundColor: activePage === "about" ? "primary.light" : "inherit" }}>درباره من</MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick("skills")}
                              sx={{ backgroundColor: activePage === "skills" ? "primary.light" : "inherit" }}>مهارت ها</MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick("projects")}
                              sx={{ backgroundColor: activePage === "projects" ? "primary.light" : "inherit" }}>پروژه ها</MenuItem>
                </Menu>
            </Box>
        </Box>
    )
}

export default App
