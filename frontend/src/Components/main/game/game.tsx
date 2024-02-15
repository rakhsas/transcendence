import { Button, Card } from 'flowbite-react';
import { motion } from 'framer-motion';
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import paddle from './../../../assets/mega-creator (1).png'
interface CarouselItemProps {
    image: string;
    heading: string;
    // className: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ image, heading }) => (
    <Card href="#" className={`shadow-none max-w-sm border-2 border-red-500 w-full custom-shadow bg-[#FAD0BD] hover:bg-main-1 text-black`}>
        <div className="flex flex-row">
            <div className="flex flex-col justify-between">
                <h5 className="text-2xl font-bold tracking-tight">{heading}</h5>
                <Button color='gray' className='focus:ring-0 focus:ring-orange-500 border-2 border-main-1'> Play Now </Button>
            </div>
            <div className="w-1/2">
                <img src={image} className="object-cover rounded" alt="" />
            </div>
        </div>
        <div className="inactive-shadow"></div>
    </Card>
);


const GameModesCarousel: React.FC = () => {
    const images = [paddle, paddle, paddle];
    const heading = ['AI Challenge', 'Head-to-Head', 'Play With friend'];
    // const [activeIndex, setActiveIndex] = useState(0);

    // const handleChange = (newIndex: number) => {
    //     setActiveIndex(newIndex);
    // };

    const renderImages = () => images.map((image, index) => (
        <CarouselItem
            key={index}
            image={image}
            heading={heading[index]}
            // className={index === activeIndex ? '' : 'inactive-shadow'}
        />
    ));

    return (
        <motion.div
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            exit={{ y: '100vh' }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className='flex justify-center mt-8 items-start h-52 overflow-hidden'
        >
            <div
                style={{ marginTop: 0 }}
                className='gamesmodeCont'
            >
                <OwlCarousel
                    nav={false}
                    dots={false}
                    className="owl-theme"
                    center={true}
                    autoplay={true}
                    autoplayHoverPause={true}
                    animateOut={true}
                    smartSpeed={500}
                    autoplayTimeout={2000}
                    loop
                    // onChanged={handleChange}
                >
                    {renderImages()}
                </OwlCarousel>
            </div>
        </motion.div>
    );
};


export default GameModesCarousel;