import {GitHub, Instagram, LinkedIn} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import {Link} from "@mui/material";

const Socials = () => {
    return(
        <Grid xs={12} sm={12} md={1} lg={1} sx={{ display: 'flex',
            mt:{
                xs:0,
                sm:0,
                md:2,
                lg:2,
            },
            flexDirection: {
                xs:'row',
                sm:'row',
                md:'column',
                lg:'column'
            },
            alignItems: 'center', justifyContent: 'center',textAlign: 'right',
            gap:{
                lg:4,
                md:4,
                sm:10,
                xs:5
            }
        }}>
            <Link target="_blank" href="https://www.instagram.com/hosseinn_heidary">
                <Instagram color="secondary" className="icon-light"
                           sx={{cursor:"pointer",fontSize:40,
                               transition: "font-size 0.1s ease-in-out",
                               borderRadius:3,
                               ":hover":{
                                   fontSize:50,
                                   filter: "brightness(2)"
                               }}}
                />
            </Link>
            <Link target="_blank" href="https://github.com/abnos5525">
                <GitHub color="secondary" fontSize="large" className="icon-light"
                        sx={{cursor:"pointer",fontSize:40,
                    borderRadius:6,
                    transition: "font-size 0.1s ease-in-out", ":hover":{
                        fontSize:50,
                        filter: "brightness(2)"
                    }}}/>
            </Link>
            <Link target="_blank" href="https://www.linkedin.com/in/hossein-heidary-00a928235/">
                <LinkedIn color="secondary" fontSize="large" className="icon-light"
                          sx={{cursor:"pointer",fontSize:40,
                    borderRadius:2,
                    transition: "font-size 0.1s ease-in-out", ":hover":{
                        fontSize:50,
                        filter: "brightness(2)"
                    }}}/>
            </Link>
        </Grid>
    )
}

export default Socials