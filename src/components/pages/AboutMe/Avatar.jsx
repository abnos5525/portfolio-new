import {Box, Skeleton} from "@mui/material";
import {useEffect} from "react";

const Avatar = ({avatarLoaded, setAvatarLoaded}) => {

    const avatar = "./images/me.jpg"

    const handleAvatarLoad = () => {
        setAvatarLoaded(true);
    }

    useEffect(() => {
        const img = new window.Image();
        img.src = avatar;
        img.onload = handleAvatarLoad;
    }, []);

    return(
            <Box sx={{ display: 'grid', justifyItems: 'center', position:"relative",
                height: {
                    lg:260,
                    md:260,
                    sm:260,
                    xs:180
                }
            }}>
                {!avatarLoaded && (
                    <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{ width: {lg:250,md:250,sm:250,xs:200},
                            height: {lg:250,md:250,sm:250,xs:200}, m: "auto", mb: 2, borderRadius: 6 }}
                    />
                )}
                <Box sx={{position: 'relative', minHeight: '300px' }}>
                    <Skeleton
                        animation="wave"
                        sx={{
                            bgcolor: "primary.main",
                            borderRadius: 4,
                            display: avatarLoaded ? 'block' : 'none',
                            position:"absolute",
                            width: {
                                lg:290,
                                md:290,
                                sm:290,
                                xs:200
                            },
                            height:{
                                lg:490,
                                md:490,
                                sm:490,
                                xs:360
                            },
                            top:{
                                lg:-115,
                                md:-115,
                                sm:-115,
                                xs:-90
                            },
                            left:{
                                lg:-8,
                                md:-8,
                                sm:-8,
                                xs:-4
                            }
                        }}
                    />
                    <Box
                        component="img"
                        className="grayscale"
                        src={avatar}
                        sx={{
                            borderRadius: 5,
                            textAlign:"center",
                            display: avatarLoaded ? 'block' : 'none',
                            mx:"auto",
                            width:{
                                lg:270,
                                md:270,
                                sm:270,
                                xs:190,
                            },
                            height:{
                                lg:270,
                                md:270,
                                sm:270,
                                xs:190,
                            }
                        }}
                    />
                </Box>
            </Box>
    )
}

export default Avatar