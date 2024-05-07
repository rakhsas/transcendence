import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import playFill from './../../../assets/img/Play-Fill.svg'
import './game.css';
import { useNavigate } from 'react-router-dom';
import AI from './../../../assets/rooms/ai.game.jpg'
import MultiPlayer from './../../../assets/rooms/realTime.game.jpg'
interface CarouselItemProps {
    image: string;
    heading: string;
    link: string;
    background?: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ image, heading, link, background }) =>{
    const navigate = useNavigate();
    return (
    <>
        <div className="w-[21rem] h-[21rem]">
            <div className={`outli mt-6 mx-auto w-72 h-64 rounded-[1.7rem] -z-10`} style={{ background: 'transparent'}}>
                <div className="container-rooms mt-6 overflow-hidden top-0 w-72 h-64 rounded-[1.7rem] p-4 flex absolute flex-col justify-between bg-zinc-900 bg-cover bg-blend-lighten" style={{ backgroundImage: `url(${background})`}}>
                    <div className="play rounded-full w-8 h-8 bg-main-light-FERN" onClick={() => navigate(link)}>
                        <img src={image} alt="Play" />
                    </div>
                    <div className="heading flex-col space-y-4 overflow-y-hidden">
                        <span className='font-poppins text-white font-bold text-xl overflow-y-hidden'>{ heading }</span>
                        <div className="description">
                            <p className="font-poppins text-xs overflow-hidden">
                                Jump into the action instantly!
                            </p>
                            <p className="font-poppins text-xs overflow-hidden">
                                Get matched with another player in real-time.
                            </p>
                            <p className="font-poppins text-xs overflow-hidden">
                                Just join the queue and we'll find your perfect opponent.
                            </p>
                        </div>
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
    const background = [AI, MultiPlayer];

    const renderImages = () => images.map((image, index) => (
        <CarouselItem
            key={index}
            image={image}
            heading={heading[index]}
            link={link[index]}
            background={background[index]}
        />
    ));
    const options = {
        className: "owl-theme",
        dots: false,
        loop: true,
        margin: 8,
    }
    return (
        <div
            className='gamesmodeCont w-full z-10'>
            <OwlCarousel
                autoplay
                autoplayHoverPause
                animateIn
                smartSpeed={1000}
                autoFocus
                center
                nav
                {...options}
                autoWidth
            >
                {renderImages()}
            </OwlCarousel>
        </div>
    );
};


export default GameModesCarousel;