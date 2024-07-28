import {Box, Skeleton} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {useEffect} from "react";

const Avatar = ({avatarLoaded,setAvatarLoaded}) => {

    const avatar = './images/programmer.webp'

    const handleAvatarLoad = () => {
        setAvatarLoaded(true);
    }

    // استفاده از useEffect برای بارگذاری تصویر
    useEffect(() => {
        const img = new window.Image();
        img.src = avatar;
        img.onload = handleAvatarLoad;
    }, []);
    return(
        <Grid xs={12} sm={12} md={5} lg={5} sx={{textAlign:"center", mt:5}}>
            {!avatarLoaded && (
                <Skeleton variant="rectangular" animation="wave"
                          sx={{ width: 250, height: 250, m:"auto", mb:2, borderRadius:3 }} />
            )}
            <Box component="img"
                src={avatar}
                width={300}
                height={300}
            />
        </Grid>
    )
}

export default Avatar