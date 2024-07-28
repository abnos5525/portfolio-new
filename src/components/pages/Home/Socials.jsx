import {GitHub, Instagram, LinkedIn} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";

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
                xs:10
            }
        }}>
            <Instagram color="secondary"
                       sx={{cursor:"pointer",fontSize:40,
                           transition: "font-size 0.1s ease-in-out", ":hover":{
                               fontSize:50,
                           }}}
            />
            <GitHub color="secondary" fontSize="large" sx={{cursor:"pointer",fontSize:40,
                transition: "font-size 0.1s ease-in-out", ":hover":{
                    fontSize:50,
                }}}/>
            <LinkedIn color="secondary" fontSize="large" sx={{cursor:"pointer",fontSize:40,
                transition: "font-size 0.1s ease-in-out", ":hover":{
                    fontSize:50,
                }}}/>
        </Grid>
    )
}

export default Socials