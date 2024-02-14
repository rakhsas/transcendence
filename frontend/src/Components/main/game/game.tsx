import React from 'react';
import paddle from './../../../assets/mega-creator (1).png'
import { Button } from 'flowbite-react';

interface CarouselItemProps {
    image: string;
    heading: string;
}
  
const CarouselItem: React.FC<CarouselItemProps> = ({ image, heading }) => (
<a href="#" className="max-w-sm w-full custom-shadow bg-main-1 hover:bg-main-1 text-white shadow-inner shadow-slate-600">
    <div className="flex flex-row">
    <div className="flex flex-col justify-between">
        <h5 className="text-2xl font-bold tracking-tight">{heading}</h5>
        <Button color="gray" className="focus:ring-0 focus:ring-orange-500 border-2 border-main-1">
        Play Now
        </Button>
    </div>
    <div className="w-1/2">
        <img src={image} className="object-cover rounded" alt="" />
    </div>
    </div>
</a>
);

const GameModesCarousel: React.FC = () => {
    const images = [paddle, paddle, paddle];
    const heading = ['AI Challenge', 'Head-to-Head', 'Play With friend'];
  
    const items = images.map((image, index) => ({ image, heading: heading[index] }));
  
    return (
      <div className="flex items-center justify-center">
        <OwlCarousel
          items={3}
          className="owl-theme"
          loop
          nav
          margin={8}
          animateIn="animate__animated animate__fadeInUp"
          animateOut="animate__animated animate__fadeOutDown"
          onTranslated={({ item }) => {
            const items = document.querySelectorAll('.owl-item');
            items.forEach((el, index) => {
              if (index !== item.index) {
                el.classList.remove('animate__fadeInUp');
                el.classList.add('animate__fadeOutDown');
              } else {
                el.classList.remove('animate__fadeOutDown');
                el.classList.add('animate__fadeInUp');
              }
            });
          }}
        >
          {items.map((item, index) => (
            <CarouselItem key={index} image={item.image} heading={item.heading} />
          ))}
        </OwlCarousel>
      </div>
    );
  };

export default GameModesCarousel;