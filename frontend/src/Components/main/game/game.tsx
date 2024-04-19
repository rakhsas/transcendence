import { Button, Card } from 'flowbite-react';
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import playFill from './../../../assets/img/Play-Fill.svg'
import './game.css';
import { useNavigate } from 'react-router-dom';
interface CarouselItemProps {
    image: string;
    heading: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ image, heading, link, background }) =>{ 
    const navigate = useNavigate();
    return (
    <>
        <div className="w-[21rem] h-[21rem]">
            <div className="outli mt-6 mx-auto w-64 h-64 rounded-[1.7rem] -z-10" style={{ background: 'transparent'}}>
                <div className="container-rooms overflow-hidden mt-6 top-0 left-10 w-64 h-64 rounded-[1.7rem] p-4 flex absolute flex-col justify-between bg-zinc-900 ">
                    <div className="play rounded-full w-8 h-8 bg-main-light-FERN" onClick={() => navigate(link)}>
                        <img src={image} alt="Play" />
                    </div>
                    <div className="heading m-auto flex-col  space-y-4 overflow-y-hidden">
                        <span className='font-poppins text-white font-bold text-3xl overflow-y-hidden'>{ heading }</span>
                    </div>
                </div>
            </div>
        </div>
    </>);
};

const GameModesCarousel: React.FC = () => {

    const images = [playFill, playFill];

    const link = ['/dashboard/game', '/dashboard/headtohead'];
    const heading = ['Play with AI', 'Play Realtime match'];

    const renderImages = () => images.map((image, index) => (
        <CarouselItem
            key={index}
            image={image}
            heading={heading[index]}
            link={link[index]}
        />
    ));
    const options = {
        className: "owl-theme",
        center: true,
        dots: false,
        loop: true,
        margin: 10,
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