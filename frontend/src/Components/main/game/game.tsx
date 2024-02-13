import React from 'react';
import aiChallenge from './../../../assets/img/image.jpg';
import paddle from './../../../assets/mega-creator (1).png'
import headToHead from './../../../assets/img/image(5).jpg';
import championshipCup from './../../../assets/img/81288940-08d9-4219-b7aa-600bf16c28c5.mp4';
import { Button, Card } from 'flowbite-react';

interface CarouselItemProps {
    image: string;
    heading: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ image, heading }) => (
    // <div className=" slide-item transition-all px-4 py-4">
    <Card href="#" className=" max-w-sm w-full custom-shadow bg-main-1 hover:bg-main-1  text-white shadow-inner shadow-slate-600">
        <div className="flex flex-row">
            <div className="flex flex-col justify-between">
                <h5 className="text-2xl font-bold tracking-tight ">{heading}</h5>
                <Button color='gray' className='focus:ring-0 focus:ring-orange-500 border-2 border-main-1'> Play Now </Button>
            </div>
            <div className="w-1/2">
                <img src={image} className="object-cover rounded" alt="" />
            </div>
        </div>
    </Card>
    // </div>
);


const GameModesCarousel: React.FC = () => {
    const images = [paddle, paddle, paddle];
    const heading = ['AI Challenge', 'Head-to-Head', 'Play With friend'];
    const renderImages = () => images.map((image, index) => <CarouselItem key={index} image={image} heading={heading[index]} />);

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-row flex-wrap items-center justify-center p-4 gap-8">
                {renderImages()}
            </div>
        </div>
    );
};

export default GameModesCarousel;
