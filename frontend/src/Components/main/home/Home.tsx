import './Home.css';
import GameModesCarousel from './../game/game';
import { useContext, useEffect, useRef } from 'react';
import DataContext from '../../../services/data.context';
import LoadingComponent from '../../shared/loading/loading';
import Robot from './../../../assets/robot.png';
import avatarGirl from './../../../assets/avatars/Beautiful_Elf.png'
import fire from './../../../assets/Icon/fire.svg';
// import group from './../../../assets/Icon/Group_light.svg'
import avatar from './../../../assets/img/wepik-export-20240216142312HeMy.png';
import avatar1 from './../../../assets/img/wepik-export-20240216142735Xpq3.png';
import avatar2 from './../../../assets/img/wepik-export-20240216143758sn9c.png';
import avatar3 from './../../../assets/img/wepik-export-20240216144328sF6H.png';
import play from './../../../assets/img/Play.svg'
import videoSource from './../../../assets/avatars/490488ec-2f13-402b-b203-951e4a4775cd.mp4';
import Chart from 'chart.js/auto';


const group = () => {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className='fill-black dark:fill-white stroke-black dark:stroke-white' xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="2.5" strokeLinecap="round"/>
        <path d="M13.7679 6.5C13.9657 6.15743 14.2607 5.88121 14.6154 5.70625C14.9702 5.5313 15.3689 5.46548 15.7611 5.51711C16.1532 5.56874 16.5213 5.73551 16.8187 5.99632C17.1161 6.25713 17.3295 6.60028 17.4319 6.98236C17.5342 7.36445 17.521 7.76831 17.3939 8.14288C17.2667 8.51745 17.0313 8.8459 16.7175 9.08671C16.4037 9.32751 16.0255 9.46985 15.6308 9.49572C15.2361 9.52159 14.8426 9.42983 14.5 9.23205"/>
        <path d="M10.2321 6.5C10.0343 6.15743 9.73935 5.88121 9.38458 5.70625C9.02981 5.5313 8.63113 5.46548 8.23895 5.51711C7.84677 5.56874 7.47871 5.73551 7.18131 5.99632C6.88391 6.25713 6.67053 6.60028 6.56815 6.98236C6.46577 7.36445 6.47899 7.76831 6.60614 8.14288C6.73329 8.51745 6.96866 8.8459 7.28248 9.08671C7.5963 9.32751 7.97448 9.46985 8.36919 9.49572C8.76391 9.52159 9.15743 9.42983 9.5 9.23205"/>
        <path d="M12 12.5C16.0802 12.5 17.1335 15.8022 17.4054 17.507C17.4924 18.0524 17.0523 18.5 16.5 18.5H7.5C6.94771 18.5 6.50763 18.0524 6.59461 17.507C6.86649 15.8022 7.91976 12.5 12 12.5Z"/>
        <path d="M19.2965 15.4162L18.8115 15.5377L19.2965 15.4162ZM13.0871 12.5859L12.7179 12.2488L12.0974 12.9283L13.0051 13.0791L13.0871 12.5859ZM17.1813 16.5L16.701 16.639L16.8055 17H17.1813V16.5ZM15.5 12C16.5277 12 17.2495 12.5027 17.7783 13.2069C18.3177 13.9253 18.6344 14.8306 18.8115 15.5377L19.7816 15.2948C19.5904 14.5315 19.2329 13.4787 18.578 12.6065C17.9126 11.7203 16.9202 11 15.5 11V12ZM13.4563 12.923C13.9567 12.375 14.6107 12 15.5 12V11C14.2828 11 13.3736 11.5306 12.7179 12.2488L13.4563 12.923ZM13.0051 13.0791C15.3056 13.4614 16.2789 15.1801 16.701 16.639L17.6616 16.361C17.1905 14.7326 16.019 12.5663 13.1691 12.0927L13.0051 13.0791ZM18.395 16H17.1813V17H18.395V16ZM18.8115 15.5377C18.8653 15.7526 18.7075 16 18.395 16V17C19.2657 17 20.0152 16.2277 19.7816 15.2948L18.8115 15.5377Z"/>
        <path d="M10.9129 12.5859L10.9949 13.0791L11.9026 12.9283L11.2821 12.2488L10.9129 12.5859ZM4.70343 15.4162L5.18845 15.5377L4.70343 15.4162ZM6.81868 16.5V17H7.19453L7.29898 16.639L6.81868 16.5ZM8.49999 12C9.38931 12 10.0433 12.375 10.5436 12.923L11.2821 12.2488C10.6264 11.5306 9.71723 11 8.49999 11V12ZM5.18845 15.5377C5.36554 14.8306 5.68228 13.9253 6.22167 13.2069C6.75048 12.5027 7.47226 12 8.49999 12V11C7.0798 11 6.08743 11.7203 5.42199 12.6065C4.76713 13.4787 4.40955 14.5315 4.21841 15.2948L5.18845 15.5377ZM5.60498 16C5.29247 16 5.13465 15.7526 5.18845 15.5377L4.21841 15.2948C3.98477 16.2277 4.73424 17 5.60498 17V16ZM6.81868 16H5.60498V17H6.81868V16ZM7.29898 16.639C7.72104 15.1801 8.69435 13.4614 10.9949 13.0791L10.8309 12.0927C7.98101 12.5663 6.8095 14.7326 6.33838 16.361L7.29898 16.639Z"/>
        </svg>
    )
}



const HomeComponent: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const userData = useContext(DataContext);
    
    let chartInstance: Chart | null = null;
    // if (!userData[0])
    //     return <LoadingComponent />;
    useEffect(() => {

        if (!userData[0]) {
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

    if (!userData[0])
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
    //     bar: ` rounded-full text-center font-medium bg-[var(--${userData[0].coalition})] leading-auto text-white dark:text-cyan-100 space-x-2; `,
    //     color: {
    //         "red": `bg-${userData[0].coalition}`,
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
                        <div className="title text-2xl text-black dark:text-white font-poppins overflow-hidden">Public Rooms</div>
                        {
                            roomData.pictures.map((room, index) => {
                                return (
                                    <div className="public-room1 rounded-3xl bg-main-light-EGGSHELL items-center justify-between flex flex-row p-2" key={index}>
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
                        <p className="capitalize text-black dark:text-white font-poppins text-2xl self-start overflow-hidden"> Games</p>
                        <div className="flex flex-col w-full flex-1">
                            <GameModesCarousel />
                            <div className="hamza flex col flex-1 items-start rounded-3xl bg-red-900">
                                <div className="div w-96 h-80"></div>
                            </div>
                        </div>
                    </div>
                    <div className='flex w-[35rem] max-w-[60rem] flex-col items-center place-self-start p-4 justify-center'>
                        <p className="capitalize text-black dark:text-white font-poppins text-2xl self-start overflow-hidden"> your statistic </p>
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
            <aside className="m-2 p-4 rounded-3xl lg:block md:block hidden h-fit dark:bg-zinc-900 bg-[#F1F2FD]">
                <div className="contain flex flex-col justify-between items-center mx-auto">
                    <div className="profile mt-2 w-12 h-12 bg-white">
                        <img src={userData[0].picture} className='object-cover bg-contain h-full bg-no-repeat bg-center' alt={userData[0].username} />
                    </div>
                    <div className="groupslogo mt-8">
                        {/* <img src={group} alt='Groups' /> */}
                        {group()}
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
                                            <div className={`w-4 h-4 rounded-full ${friendData.isOnline[index] === true ? 'bg-green-500' : 'bg-[#A5BAA9]'}  border-2 border-main-dark-SPRUCE`}></div>
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
