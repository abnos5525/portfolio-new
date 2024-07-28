import {Button, Slide, Typography} from "@mui/material";
import {ManOutlined} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import {useContext} from "react";
import {Context} from "../../../ContextApp.jsx";

const Intro = ({avatarLoaded}) => {

    const {setActivePage} = useContext(Context)

    const handleMenuItemClick = (page) => {
        setActivePage(page)
    }

    return(

        <Grid xs={12} sm={12} md={6} lg={6} sx={{ display: 'flex',flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',textAlign: 'right' }}>
            <Slide direction="down" in={avatarLoaded}
                   style={{transitionDelay: avatarLoaded ? "300ms": "0"}}>
                <Typography sx={{ textAlign: 'right', mt:1 }} variant="h6">
                    - سلام من
                </Typography>
            </Slide>
            <Slide direction="down" in={avatarLoaded}
                   style={{transitionDelay: avatarLoaded ? "400ms": "0"}}>
                <Typography color="secondary.light" sx={{ textAlign: 'right',
                    fontSize:{
                        lg:60,
                        md:45,
                        sm:45,
                        xs:40
                    }
                }}>
                    محمدحسین حیدریم
                </Typography>
            </Slide>
            <Slide direction="down" in={avatarLoaded}
                   style={{transitionDelay: avatarLoaded ? "500ms": "0"}}>
                <Typography sx={{ textAlign: 'right',mt:1}} >
                    یک برنامه نویس فرانت اند.
                </Typography>
            </Slide>

            <Slide direction="up" in={avatarLoaded}
                   style={{transitionDelay: avatarLoaded ? "200ms": "0"}}>
                <Button color="secondary" onClick={() => handleMenuItemClick("about")}
                        variant="contained" sx={{my:5,px:5, py:2}}>
                    <ManOutlined className="float-animation" />
                    درباره من
                </Button>
            </Slide>
        </Grid>
    )
}

export default Intro