import './Home.css';
import GameModesCarousel from './../game/game';
import { useContext, useEffect, useRef } from 'react';
import DataContext from '../../../services/data.context';
import LoadingComponent from '../../shared/loading/loading';
import { Progress } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';
import Robot from './../../../assets/robot.png';
import avatarGirl from './../../../assets/avatars/Beautiful_Elf.png'
import fire from './../../../assets/Icon/fire.svg';
import group from './../../../assets/Icon/Group_light.svg'
import avatar from './../../../assets/img/wepik-export-20240216142312HeMy.png';
import avatar1 from './../../../assets/img/wepik-export-20240216142735Xpq3.png';
import avatar2 from './../../../assets/img/wepik-export-20240216143758sn9c.png';
import avatar3 from './../../../assets/img/wepik-export-20240216144328sF6H.png';
import play from './../../../assets/img/Play.svg'
import videoSource from './../../../assets/avatars/490488ec-2f13-402b-b203-951e4a4775cd.mp4';
import playFill from './../../../assets/img/Play-Fill.svg'
import Chart from 'chart.js/auto';

const HomeComponent: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const userData = useContext(DataContext);
    
    let chartInstance: Chart | null = null;
    
    useEffect(() => {

        if (!userData) {
            return ;
        }
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance = new Chart(ctx, {
                    type: 'radar',
                    data : {
                        labels: [
                          'Eating',
                          'Drinking',
                          'Sleeping',
                          'Designing',
                          'Coding',
                        ],
                        datasets: [{
                          label: 'My First Dataset',
                          data: [65, 59, 90, 81, 56],
                          fill: true,
                          backgroundColor: 'rgba(255, 99, 132, 0.2)',
                          borderColor: 'rgb(255, 99, 132)',
                          pointBackgroundColor: 'rgb(255, 99, 132)',
                          pointBorderColor: '#fff',
                          pointHoverBackgroundColor: '#fff',
                          pointHoverBorderColor: 'rgb(255, 99, 132)',
                          pointBorderWidth: 0,
                        }, {
                          label: 'My Second Dataset',
                          data: [28, 48, 40, 19, 96],
                          fill: true,
                          backgroundColor: 'rgba(54, 162, 235, 0.2)',
                          borderColor: 'rgb(54, 162, 235)',
                          pointBackgroundColor: 'rgb(54, 162, 235)',
                          pointBorderColor: '#fff',
                          pointHoverBackgroundColor: '#fff',
                          pointHoverBorderColor: 'rgb(54, 162, 235)'
                        },]
                    },
                    options: {
                        elements: {
                            line: {
                                borderWidth: 3,
                            }
                        },
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false,
                            }
                        }
                    },
                });
            }
        }

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [chartRef, userData]);

    if (!userData)
        return <LoadingComponent />;
    const friendData = {
        colors: ['#FFBEB8', '#FFDCB9', '#FF8A8A', '#F7C5BF'],
        friends: [avatar, avatar1, avatar2, avatar3],
        isOnline: [true, false, true, false],
        isInGame: [true, false, true, false]
    }
    const roomData = {
        pictures: ['room1', 'room2'],
        title: ['Magic room', 'Traditional room'],
        description: ['This is a magic room', 'This is a Traditional room']
    }
    // const customProgressTheme: CustomFlowbiteTheme['progress'] = {
    //     base: `w-64 overflow-hidden rounded-full bg-white dark:bg-gray-700`,
    //     bar: ` rounded-full text-center font-medium bg-[var(--${userData.coalition})] leading-auto text-white dark:text-cyan-100 space-x-2; `,
    //     color: {
    //         "red": `bg-${userData.coalition}`,
    //     },
    // };
    return (
        <>
            <main className="flex-1 p-4 overflow-y-auto">
                <section className="min-h-2/3 flex items-center justify-center p-2">
                    <div className="w-full relative overflow-hidden p-4">
                        <div className="relative flex justify-between flex-col mt-8">
                        <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-neutral-700 to-slate-900 rounded-3xl overflow-hidden">
                            <div className="absolute inset-0 bg-teal-600 blur-[20px]"></div>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center z-10">
                                <video className="object-cover w-full h-full" autoPlay loop muted>
                                    <source src={videoSource} type="video/mp4" />
                                </video>
                            </div>
                        </div>
                            <div className="flex flex-col p-8 justify-between relative z-10">
                                <div className="flex flex-col justify-between">
                                    <div className="w-fit flex flex-row p-2 bg-gradient-to-br from-orange-700 to-amber-400 rounded-xl">
                                        <img src={fire} alt="Fire" />
                                        <div className="text-white font-bold text-xl"> Popular</div>
                                    </div>
                                    <div className="div mt-4">
                                        <div className="text-white font-semibold text-3xl leading-10">AI: The Next Frontier</div>
                                    </div>
                                </div>
                                <div className="w-fit p-4 bg-gradient-to-r from-slate-900 via-gray-900 to-zinc-600 rounded-full">
                                    <div className="bg-emerald-400 rounded-3xl flex flex-col justify-center hover:cursor-pointer px-4 py-2">
                                        <div className="text-white font-bold">Play Now</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="robot absolute top-[-10%] z-10 -right-4">
                            <img className="w-80 h-[23rem]" src={Robot} alt="Robot" />
                        </div>
                    </div>
                    <div className="w-2/3 bg-transparent flex flex-col justify-around p-4 space-y-4 blur-[0.5px]">
                        <div className="title text-2xl text-white font-poppins overflow-hidden">Public Rooms</div>
                        {
                            roomData.pictures.map((room, index) => {
                                return (
                                    <div className="public-room1 custom-shadow rounded-3xl bg-main-light-EGGSHELL items-center justify-between flex flex-row p-2" key={index}>
                                        <div className="infos flex flex-row items-center space-x-4">
                                            <div className="pic w-12 h-12 bg-white rounded-2xl">
                                                <img src={roomData.pictures[index]} className=' bg-contain h-full bg-no-repeat bg-center' alt="Profile" />
                                            </div>
                                            <div className="description">
                                                <div className="text-white font-bold">{roomData.title[index]}</div>
                                                <span className='text-gray-500'>{roomData.description[index]}</span>
                                            </div>
                                        </div>
                                        <div className="action">
                                            <img src={play} alt="Play" />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </section>
                <section className='flex flex-row mb-20  flex-wrap justify-between p-2'>
                    <div className='min-w-[601px] flex-row flex-1 h-full p-2'>
                        <p className="capitalize text-white font-poppins text-2xl self-start overflow-hidden"> Games</p>
                        <div className="flex flex-col w-full flex-1">
                            <GameModesCarousel />
                            <div className="hamza flex col flex-1 items-start rounded-3xl bg-red-900">
                                <div className="div w-96 h-80"></div>
                            </div>
                        </div>
                    </div>
                    <div className='flex w-[35rem] max-w-[60rem] flex-col items-center place-self-start p-4 justify-center'>
                        <p className="capitalize text-white font-poppins text-2xl self-start overflow-hidden"> your statistic </p>
                        <div className="w-full m-4 p-2 bg-main-light-EGGSHELL rounded-3xl relative">
                            <div className="flex min-h-[50vh] flex-col items-start p-4">
                                <div className="top overflow-hidden">
                                    <span className='font-poppins text-stone-300 text-3xl font-semibold overflow-hidden'> Top Weekend </span>
                                </div>
                                <div className="content flex flex-row py-px">
                                    <div className="item-left flex flex-col items-start pr-4">
                                        <span className='text-3xl font-bold text-white'> Kratos </span>
                                        <span className='text-2xl font-bold text-white'> 2000 </span>
                                        <p className='text-stone-400 text-xl'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. </p>
                                        <canvas ref={chartRef}></canvas>
                                    </div>
                                </div>
                            </div>
                            <div className="item-right absolute bottom-0 right-0">
                                <img className='w-32 h-[28rem]' src={avatarGirl} alt="Avatar" />
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <aside className="m-2 p-4 rounded-3xl lg:block md:block hidden h-fit bg-zinc-900">
                <div className="contain flex flex-col justify-between items-center mx-auto">
                    <div className="profile mt-2 w-12 h-12 bg-white">
                        <img src={userData.picture} className='object-cover bg-contain h-full bg-no-repeat bg-center' alt={userData.username} />
                    </div>
                    <div className="groupslogo mt-8">
                        <img src={group} alt='Groups' />
                    </div>
                    <div className="friends mt-4">
                        {
                            friendData.friends.map((friend, index) => {
                                return (
                                    <div className="w-16 h-20 relative flex flex-col items-center" key={index}>
                                        <div className={`w-12 h-12 rounded-full`} style={{ backgroundColor: friendData.colors[index] }}>
                                            <img src={friendData.friends[index]} alt="Friend Picture" />
                                        </div>
                                        <div className="absolute top-0 right-2 mb-1 mr-[1px]">
                                            <div className={`w-4 h-4 rounded-full ${friendData.isOnline[index] === true ? 'bg-green-500' : 'bg-[#A5BAA9]'}  border-2 border-main-light-SPRUCE`}></div>
                                        </div>
                                        <div className={`absolute text-sm rounded-lg text-white bg-main-light-FERN p-[3px] top-8 ${friendData.isInGame[index] ? '' : 'hidden'} `}>In Game</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </aside>
        </>
    )
}
export default HomeComponent;
