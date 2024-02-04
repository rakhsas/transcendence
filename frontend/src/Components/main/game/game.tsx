import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
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
    <Card href="#" className="max-w-sm w-64 custom-shadow bg-main-2 hover:text-gray-900 text-white">
      <div className="flex flex-col">
        <h5 className="text-2xl font-bold tracking-tight ">{heading}</h5>
        <img src={image} className="object-cover h-48 rounded" alt="" />
        <Button className='bg-[#e15253] hover:bg-orange-500 border-2 border-main-1'> Play Now </Button>
      </div>
    </Card>
  // </div>
);


const GameModesCarousel: React.FC = () => {
  const images = [headToHead, aiChallenge, paddle];
  const heading = ['AI Challenge', 'Head-to-Head', 'Play With Friend'];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px'
  };
  const renderImages = () => images.map((image, index) => <CarouselItem key={index} image={image} heading={heading[index]}/>);
    
    return (
      <div className="flex items-center justify-center">
        <div className="w-full flex flex-row flex-wrap items-center justify-center p-4 gap-4">
          {/* <Slider {...settings}>{
          }</Slider> */}
          {renderImages()}
        </div>
      </div>
    );
};

export default GameModesCarousel;
