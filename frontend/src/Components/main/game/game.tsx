import { Button, Card } from 'flowbite-react';
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import playFill from './../../../assets/img/Play-Fill.svg'
import './game.css';
interface CarouselItemProps {
    image: string;
    heading: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ image, heading }) => (
    <>
        <div className='w-[21rem] h-[21rem]'>
            <div className="outli mt-6 mx-auto w-64 h-64 rounded-[1.7rem] -z-10" style={{ background: 'transparent'}}>
                <div className="container-rooms overflow-hidden mt-6 top-0 left-10 w-64 h-64 rounded-[1.7rem] p-4 flex absolute flex-col justify-between bg-zinc-900 ">
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
    const options = {
        className: "owl-theme",
        center: true,
        dots: true,
        loop: true,
        margin: 100
    }
    return (
        <div
            className='gamesmodeCont w-full z-10'>
            <OwlCarousel
                {...options}
                autoWidth
            >
                {renderImages()}
            </OwlCarousel>
        </div>
    );
};


export default GameModesCarousel;