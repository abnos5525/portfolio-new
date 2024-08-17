import {Box, Link, Skeleton, Slide, Typography} from "@mui/material";
import {KeyboardDoubleArrowLeftOutlined} from "@mui/icons-material";
import Slider from "react-slick";
import {useEffect, useState} from "react";
import DrawerActionButton from "../../sidebar/DrawerActionButton.jsx";

const ProjectsPage = () => {
    const [loadedImages, setLoadedImages] = useState({});

    const settings = {
        dots: true,
        infinite: true,
        speed: 2500,
        autoplaySpeed: 6000,
        cssEase: "linear",
        autoplay:true,
        slidesToShow: 2,
        arrows:false,
        focusOnSelect:false,
        slidesToScroll: 1,
        style:{margin:10},
        responsive: [
            {
                breakpoint: 1200, // اندازه صفحه متوسط
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 900, // اندازه صفحه کوچک
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600, // اندازه صفحه بسیار کوچک
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 400, // اندازه صفحه بسیار کوچک
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ]
    }

    const projects = [
        { name: "کافی شاپ", img: "./images/projects/coffee.PNG", link: "https://abnos5525.github.io/coffee-app/",online:true},
        { name: "پورتفولیو", img: "./images/projects/portfolio1.PNG", link: "https://abnos5525.github.io/portfolio-app/",online:true },
        { name: "پورتفولیو2", img: "./images/projects/portfolio2.PNG", link: "https://abnos5525.github.io/portfolio1/",online:true },
        { name: "رستوران", img: "./images/projects/restaurant.PNG", link: "https://github.com/abnos5525/restaurant",online:false },
        { name: "فیلم برتر", img: "./images/projects/movie.PNG", link: "https://abnos5525.github.io/top-movies/",online:true },
        { name: "هدفونشاپ", img: "./images/projects/headphone.PNG", link: "https://github.com/abnos5525/headphone-shop",online:false },
    ]

    useEffect(() => {
        const loadImage = (index, src) => {
            const img = new Image()
            img.src = src
            img.onload = () => setLoadedImages(prev => ({ ...prev, [index]: true }))
            img.onerror = () => setLoadedImages(prev => ({ ...prev, [index]: false }))
        }

        projects.forEach((skill, index) => loadImage(index, skill.img))
    }, [projects])

    return(
        <Box sx={{m:{
                xs:1,
                sm:2,
                md:5,
                lg:5
            },p:1, height:"auto", borderRadius:3, background: 'linear-gradient(to left, #E06432 , #261a1a)'}}>

            <Box sx={{height:"auto",pb:5, borderRadius:4, backgroundColor: "primary.dark", position:"relative"}}>
                <Slide direction="down" in={loadedImages[0]}
                       style={{transitionDelay: "200ms"}}>
                    <Typography variant="h5" textAlign="left" sx={{p:2}}>
                        <KeyboardDoubleArrowLeftOutlined className="arrow-animation" fontSize="20" sx={{verticalAlign:"middle"}}/>
                        پروژه های من
                    </Typography>
                </Slide>

                <Slider {...settings}>
                    {projects.map((project, index) => (
                        <Link href={project.link} target="_blank" key={index} style={{textDecoration:"none"}}>
                            <Box sx={{textAlign:"center", mx:"auto"}}>
                                {loadedImages[index] ? (
                                    <Box>
                                        <Box
                                            component="img"
                                            className="grayscale"
                                            src={project.img}
                                            sx={{
                                                borderRadius: 5,
                                                width: {
                                                    lg:550,
                                                    md:550,
                                                    sm:450,
                                                    xs:220
                                                },
                                                textAlign:"center",
                                                m:"auto"
                                            }}
                                        />
                                        {
                                            project.online ?
                                                <Typography variant="h4"
                                                            sx={{color:"success.main", my:2}}>
                                                    آنلاین
                                                </Typography>
                                                :
                                                <Typography variant="h4"
                                                            sx={{color:"error.main", my:2}}>
                                                    آفلاین
                                                </Typography>
                                        }
                                    </Box>
                                ) : (
                                    <Skeleton variant="rectangular" width={550} height={300}
                                              sx={{borderRadius: 5, textAlign:"center", m:"auto"}} />
                                )}
                            </Box>
                        </Link>
                    ))
                    }
                </Slider>

                <DrawerActionButton/>
            </Box>
        </Box>
    )
}

export default ProjectsPage