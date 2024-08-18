import Slider from "react-slick";
import {useCallback, useEffect, useState} from "react";
import DrawerActionButton from "../../sidebar/DrawerActionButton.jsx";
import Title from "./Title.jsx";
import Items from "./Items.jsx";

const ProjectsPage = () => {
    const [loadedImages, setLoadedImages] = useState({});

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplaySpeed: 6000,
        cssEase: "linear",
        autoplay:true,
        slidesToShow: 2,
        arrows:false,
        focusOnSelect:false,
        slidesToScroll: 2,
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
        {img: "./images/projects/coffee.PNG", link: "https://abnos5525.github.io/coffee-app/",online:true},
        {img: "./images/projects/portfolio1.PNG", link: "https://abnos5525.github.io/portfolio-app/",online:true },
        {img: "./images/projects/portfolio2.PNG", link: "https://abnos5525.github.io/portfolio1/",online:true },
        {img: "./images/projects/restaurant.PNG", link: "https://github.com/abnos5525/restaurant",online:false },
        {img: "./images/projects/movie.PNG", link: "https://abnos5525.github.io/top-movies/",online:true },
        {img: "./images/projects/headphone.PNG", link: "https://github.com/abnos5525/headphone-shop",online:false },
    ]

    const loadImage = useCallback((index, src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => setLoadedImages(prev => ({ ...prev, [index]: true }));
        img.onerror = () => setLoadedImages(prev => ({ ...prev, [index]: false }));
    }, []);

    useEffect(() => {
        projects.forEach((project, index) => loadImage(index, project.img));
    }, [projects, loadImage]);

    return(
        <>
                <Title loadedImages={loadedImages[0]}/>

                <Slider {...settings}>
                    {projects.map((project, index) => (
                        <Items key={index} index={index} project={project} loadedImages={loadedImages[index]}/>
                    ))
                    }
                </Slider>

                <DrawerActionButton/>
        </>
    )
}

export default ProjectsPage