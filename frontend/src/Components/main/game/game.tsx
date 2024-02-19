import { Button, Card } from 'flowbite-react';
import { motion } from 'framer-motion';
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import playFill from './../../../assets/img/Play-Fill.svg'
import expandLeft from './../../../assets/Icon/Expand_left.png'
import expandRight from './../../../assets/Icon/Expand_right.png'
import { useEffect } from 'react';
import './game.css';
interface CarouselItemProps {
    image: string;
    heading: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ image, heading }) => (
    <>
        <div className='w-80 h-[21rem]'>
            <div className="outli mt-6 mx-auto w-64 h-72 rounded-3xl -z-10" style={{ background: 'transparent'}}>
                <div className="container overflow-hidden mt-6 top-0 left-8 w-64 h-72 rounded-[1.4rem] p-4 flex absolute flex-col justify-between bg-zinc-900 hover:origin-bottom hover:-rotate-6 hover:scale-105 ">
                    <div className="play rounded-full w-8 h-8 bg-main-light-FERN">
                        <img src={image} alt="Play" />
                    </div>
                    <div className="heading flex flex-col justify-between items-center space-y-4 overflow-y-hidden">
                        <span className='font-poppins text-white font-bold text-3xl overflow-y-hidden'>{ heading }</span>
                        <p className='font-poppins text-justify text-white'> Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit </p>
                    </div>
                </div>
            </div>
        </div>
    </>

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
            style={{  marginTop: '24px', marginLeft: '4px', marginRight: '4px', padding: '2 100px'}}
            className='gamesmodeCont p-4 z-10'>
            <OwlCarousel
                nav={false}
                dots={false}
                className="owl-theme"
                autoplay={false}
                center
                responsive={
                    {
                        0: {
                            items: 3,
                        }
                    }
                }
                autoplayHoverPause={true}
                animateOut={true}
                smartSpeed={500}
                autoplayTimeout={2000}
                navClass={[expandLeft, expandRight]}
                navText={['<', '>']}
                loop
            >
                {renderImages()}
            </OwlCarousel>
        </div>
    );
};


export default GameModesCarousel;