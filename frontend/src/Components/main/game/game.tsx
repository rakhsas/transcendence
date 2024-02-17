import { Button, Card } from 'flowbite-react';
import { motion } from 'framer-motion';
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import playFill from './../../../assets/img/Play-Fill.svg'
import { HtmlHTMLAttributes, useEffect } from 'react';

interface CarouselItemProps {
    image: string;
    heading: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ image, heading }) => (
    <div className="container flex flex-col justify-between p-4 bg-zinc-900 rounded-3xl w-72 h-64">
        <div className="play rounded-full w-8 h-8 bg-main-light-FERN">
            <img src={image} alt="Play" />
        </div>
        <div className="heading flex flex-col justify-between items-center space-y-4">
            <span className='font-poppins text-white font-bold text-3xl overflow-hidden'>{ heading }</span>
            <p className='font-poppins text-justify text-white'> Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit </p>
        </div>
    </div>
);


const GameModesCarousel: React.FC = () => {

    const images = [playFill, playFill, playFill];
    const heading = ['Uncharted 1', 'Uncharted 2', 'Uncharted 3'];

    const renderImages = () => images.map((image, index) => (
        <CarouselItem
            key={index}
            image={image}
            heading={heading[index]}
        />
    ));

    return (
        <div
            style={{  marginTop: '24px', marginLeft: '4px', marginRight: '4px'}}
            className='gamesmodeCont'>
            <OwlCarousel
                nav={false}
                dots={false}
                className="owl-theme"
                autoplay={true}
                center
                responsive={
                    {
                        0: {
                            items: 4,
                        }
                    }
                }
                autoplayHoverPause={true}
                animateOut={true}
                smartSpeed={500}
                autoplayTimeout={2000}
                loop
            >
                {renderImages()}
            </OwlCarousel>
        </div>
    );
};


export default GameModesCarousel;