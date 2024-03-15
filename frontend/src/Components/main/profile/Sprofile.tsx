// import DataContext from '../../../services/data.context';

import { useContext } from "react";
import './Friends.css';
// import { Doughnut } from 'react-chartjs-2';

import DataContext from "../../../services/data.context";
import './Sprofile.css';
import "./list.css";
import './profile.css'
import LoadingComponent from "../../shared/loading/loading";

// import Achei from '../../../assets/acheivements/poker.png'
// import Achei2 from '../../../assets/acheivements/fire.png'
// import Achei3 from '../../../assets/acheivements/fire3.png'
// import Achei4 from '../../../assets/acheivements/fire2.png'
// import Achei5 from '../../../assets/acheivements/8pool1.png'
// import Achei6 from '../../../assets/acheivements/fire1.png'
// import Achei7 from '../../../assets/acheivements/8pool2.png'
// import Achei8 from '../../../assets/acheivements/8pool3.png'
// import Achei9 from '../../../assets/acheivements/8pool.png'
import Achei1 from '../../../assets/acheivements/poker1.png'

import { Button } from 'flowbite-react';


import OwlCarousel from "react-owl-carousel";
// import { AcheivementItem } from '../game/game'
import playFill from './../../../assets/img/Play-Fill.svg'
import expandLeft from './../../../assets/Icon/Expand_left.png'
import expandRight from './../../../assets/Icon/Expand_right.png'
import CreatChartDesign from "./Chart";
// import LoadingComponent from "../../shared/loading/loading";
interface AcheivementItemProps {
    image: string;
    paragraph: string;
}

const AcheivementItem: React.FC<AcheivementItemProps> = ({ image, paragraph }) => (
    <>
        <div className='w-[21rem] h-[21rem]' >
            <div className="outli mt-6 mx-auto w-64 h-64 rounded-[1.7rem] -z-10" style={{ background: 'transparent' }}>
                <div className="container  overflow-hidden mt-6 top-0 left-10 w-64 h-64 rounded-[1.7rem] p-4 flex absolute flex-col justify-between bg-zinc-900 ">
                    <div className="play w-28 h-24 overflow-hidden">
                        <img src={image} alt="" className="w-full h-full" />
                    </div>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white svgIcon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2a3 3 0 0 0-2.1.9l-.9.9a1 1 0 0 1-.7.3H7a3 3 0 0 0-3 3v1.2c0 .3 0 .5-.2.7l-1 .9a3 3 0 0 0 0 4.2l1 .9c.2.2.3.4.3.7V17a3 3 0 0 0 3 3h1.2c.3 0 .5 0 .7.2l.9 1a3 3 0 0 0 4.2 0l.9-1c.2-.2.4-.3.7-.3H17a3 3 0 0 0 3-3v-1.2c0-.3 0-.5.2-.7l1-.9a3 3 0 0 0 0-4.2l-1-.9a1 1 0 0 1-.3-.7V7a3 3 0 0 0-3-3h-1.2a1 1 0 0 1-.7-.2l-.9-1A3 3 0 0 0 12 2Zm3.7 7.7a1 1 0 1 0-1.4-1.4L10 12.6l-1.3-1.3a1 1 0 0 0-1.4 1.4l2 2c.4.4 1 .4 1.4 0l5-5Z" clipRule="evenodd" />
                    </svg>
                    <div className="heading flex flex-col justify-between items-center space-y-4 overflow-y-hidden">

                        <p className='font-poppins text-justify text-white overflow-hidden '>
                            {paragraph}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </>

);

const AcheivementModel: React.FC = () => {

    const images = ['Achei', 'Achei1', 'Achei2', 'Achei3', 'Achei4', 'Achei5'];
    const listparagraph = [
        'Play The First Game',
        'You win The First Game',
        'You win The Maximum Score',
        'You win The First 5 Games',
        'You Play vs Your Friend',
        'You win The First 10 Games'];

    const renderImages = () => images.map((image, index) => (
        <AcheivementItem
            key={index}
            image={image}

            paragraph={listparagraph[index]}
        />
    ));

    return (
        <div
            style={{}}
            className='gamesmodeCont w-[80%] z-10 bg-white p-2'>
            <OwlCarousel
                nav={false}
                dots={false}
                className="owl-theme"
                autoplay={true}
                center
                responsive={
                    {

                        // 1500: {
                        //     items: 5,
                        // },
                        // 1125: {
                        //     items: 4,
                        // },
                        1200: {
                            items: 3,
                        },
                        600: {
                            items: 1,
                        },
                        0: {
                            items: 1,
                        }
                    }
                }
                autoplayHoverPause={true}
                animateOut={true}
                smartSpeed={700}
                autoplayTimeout={3000}
                navClass={[expandLeft, expandRight]}
                // navText={['<', '>']}
                loop
            >
                {renderImages()}
            </OwlCarousel>
        </div>
    );
};
/*

                            <img src={userData?.picture} alt="" className="log2Sing" />

                            <form action="# ">
                                <div className="mt-8 ">
                                    <div className="checkinfo">

                                        <button type="submit" className="text-white   focus:ring-4 focus:outline-none
                                     focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 
                                            text-center  par"
                                        >
                                            <a style={{ textDecoration: 'none' }} href={UrlProfile || ''}>{userData?.username}</a>
                                        </button>
                                    </div>
                                </div>
                            </form>
*/
function ProfileComponent(): JSX.Element {
    const userData = useContext(DataContext)[0];// get the value of user
    if (!userData)
        return <LoadingComponent />;
    const UrlProfile: string = 'https://profile.intra.42.fr/users/' + userData?.username;
    return (
        <>
            <div className="body m-4 flex flex-col new:flex-col w-full h-[90vh] justify-between gap-4 bg-inherit overflow-hidden overflow-y-scroll no-scrollbar">
                <div className="part1 flex flex-col md:flex-row gap-4 min-w-full h-auto overflow-hidden p-4 overflow-y-scroll no-scrollbar ">
                    <div className="part3 flex flex-col md:flex-row gap-4 w-auto md:min-w-[25%] min-h-full overflow-hidden bg-black p-2">
                        <div className="flex flex-col items-center justify-between w-full h-full p-2">  
                            <div className="picture w-3/4 h-3/4 rounded-3xl">
                                <img src={userData?.picture} alt="" className="object-cover bg-contain h-full bg-no-repeat bg-center" />
                            </div>
                            <div className="">
                                <button type="submit" className="text-white font-medium rounded-lg text-xl w-full sm:w-auto">
                                    <a style={{ textDecoration: 'none' }}>{userData?.username}</a>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="part4 flex flex-row md:flex-row gap-4 w-full md:min-w-[75%] h-auto overflow-hidden bg-black">
                        <AcheivementModel />
                    </div>
                </div>
                <div className="part2 flex flex-col md:flex-row gap-4 min-w-full  h-[85%] overflow-hidden overflow-y-scroll no-scrollbar p-4 bg-green-600">
                    <div className="part5 flex flex-col   gap-4  md:min-w-[75%] min-h-full overflow-hidden overflow-y-scroll no-scrollbar bg-black">
                        <h1 className=' text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 sheap1'>
                            SCORE-MATCHES
                        </h1>
                        <div className='op overflow-y-scroll no-scrollbar overflow-hidden'>
                            <div className='op-child p-4 mt-8 '>
                                <img
                                    src={userData?.picture || ''} alt="" className='coal1 object-cover w-full h-full bg-contain bg-no-repeat bg-center'
                                    style={{ border: `2px solid ${userData?.coalitionColor} ` }} />
                                <p className='ch3-p '>SpeedStyle</p>
                                <p className='ch4-p '>Failure</p>
                                <div className='child-ch1 overflow-y-scroll no-scrollbar'>
                                    <p className='ch1-p'>1</p>
                                    <p className='ch2-p'>2</p>
                                </div>
                                <p className='ch5-p'>Success</p>
                                <img src={userData?.picture || ''} alt="" className='coal2' />
                            </div>
                        </div>
                    </div>

                    <div className="part6 flex flex-col gap-4 w-full md:min-w-[15%] min-h-full overflow-hidden overflow-y-scroll no-scrollbar bg-black">
                        <h1 className=' text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 sheap2 overflow-y-scroll no-scrollbar'>
                            PROGRESS-USER
                        </h1>
                        <CreatChartDesign></CreatChartDesign>
                        <CreatChartDesign></CreatChartDesign>
                    </div>
                </div>
            </div>
        </>
    );
}


export default ProfileComponent;