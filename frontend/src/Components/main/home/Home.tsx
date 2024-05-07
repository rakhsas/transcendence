import './Home.css';
import GameModesCarousel from './../game/game';
import { useContext, useEffect, useRef, useState } from 'react';
import DataContext from '../../../services/data.context';
import LoadingComponent from '../../shared/loading/loading';
import Robot from './../../../assets/robot.png';
// // import RobotBlur from './../../../assets/image48.png';
// import Robot from './../../../assets/image 47.png';
import fire from './../../../assets/Icon/fire.svg';
import play from './../../../assets/img/Play.svg'
import videoSource from './../../../assets/avatars/490488ec-2f13-402b-b203-951e4a4775cd.mp4';
import { FriendsService } from '../../../services/friend.service';
import { Socket, io } from "socket.io-client";
import User from '../../../model/user.model';
import { Channel } from '../../../utils/types';
import ModalComponent from '../../modal/modal';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import InfoModal from '../../modal/Info.modal';

const group = () => {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.3 9.42857C4.51344 9.42857 5.5 8.0192 5.5 6.28571C5.5 4.55223 4.51344 3.14286 3.3 3.14286C2.08656 3.14286 1.1 4.55223 1.1 6.28571C1.1 8.0192 2.08656 9.42857 3.3 9.42857ZM18.7 9.42857C19.9134 9.42857 20.9 8.0192 20.9 6.28571C20.9 4.55223 19.9134 3.14286 18.7 3.14286C17.4866 3.14286 16.5 4.55223 16.5 6.28571C16.5 8.0192 17.4866 9.42857 18.7 9.42857ZM19.8 11H17.6C16.995 11 16.4484 11.3487 16.0497 11.9134C17.435 12.9987 18.4181 14.958 18.6313 17.2857H20.9C21.5084 17.2857 22 16.5835 22 15.7143V14.1429C22 12.4094 21.0134 11 19.8 11ZM11 11C13.1278 11 14.85 8.53973 14.85 5.5C14.85 2.46027 13.1278 0 11 0C8.87219 0 7.15 2.46027 7.15 5.5C7.15 8.53973 8.87219 11 11 11ZM13.64 12.5714H13.3547C12.6397 13.0625 11.8456 13.3571 11 13.3571C10.1544 13.3571 9.36375 13.0625 8.64531 12.5714H8.36C6.17375 12.5714 4.4 15.1054 4.4 18.2286V19.6429C4.4 20.9442 5.13906 22 6.05 22H15.95C16.8609 22 17.6 20.9442 17.6 19.6429V18.2286C17.6 15.1054 15.8262 12.5714 13.64 12.5714ZM5.95031 11.9134C5.55156 11.3487 5.005 11 4.4 11H2.2C0.986563 11 0 12.4094 0 14.1429V15.7143C0 16.5835 0.491562 17.2857 1.1 17.2857H3.36531C3.58188 14.958 4.565 12.9987 5.95031 11.9134Z" fill="white"/>
        </svg>



    )
}

enum statusColor {
    yellow = 'yellow',
    red = 'red',
    green = 'green'

}

type friend = {
    user: User,
    status: string,
    color: statusColor
    gameStatus?: string
}
const url: string = "https://" + import.meta.env.VITE_API_SOCKET_URL;
const HomeComponent: React.FC = () => {
    const navigate = useNavigate();
    const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const userData = useContext(DataContext);
    const [channel, setChannel] = useState<any>({});// channel data
    const [friends, setFriends] = useState<any[]>([]);
    const [friendData, setFriendData] = useState<friend[]>([]);
    const [globalSocket, setGlobalSocket] = useState<Socket | null>(null);
    // const [playingUsers, setPlayingUsers] = useState<string[]>([]);
    const [protectedChannels, setProtectedChannels] = useState<Channel[]>([]);
    const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const firstLogin = Cookies.get('firstLogin');
    // const twoFactorAuthentication = Cookies.get('twoFactorAuthentication');
    useEffect(() => {
        if (!userData) {
            return;
        }
        setProtectedChannels(userData[4]);
        setPublicChannels(userData[5]);
        const fetchFriends = async () => {
            const friendService = new FriendsService();
            const friends = await friendService.getFriends(userData[0].id);
            if (friends.length !== 0) {
                setFriends(friends);
                setFriendData(friends.map((friend: User) => ({
                    user: friend,
                    status: 'offline',
                    color: statusColor.red,
                    gameStatus: 'offline'
                })));
            }
            setFriends(['No Friends']);
            const globalSocket: Socket = io(url, {
                path: "/global",
                query: {
                    name: userData[0].username
                },
            });
            setGlobalSocket(globalSocket);
        };
        fetchFriends();
        return () => {
            globalSocket?.disconnect();
        };
    }, [chartRef, userData]);
    if (!userData || userData.length === 0 || !friends.length)
        return <LoadingComponent />;
    const socket: Socket = userData[1];
    socket?.on('protectedChannels', async (data: any) => {
        //console.log('protectedChannels: ', await data);
        setProtectedChannels(data);
    })
    socket?.on('publicChannels', (data: any) => {
        setPublicChannels(data);
    })
    const joinChannel = (channel: Channel) => {
        socket?.emit('acceptJoinChannel', {
            id: channel.id,
            channelId: channel.id,
            __owner__: userData[0].id,
            role: 'MEMBER',
            requestedUserId: userData[0].id,
            userName: userData[0].username,
        });
        setOpenModal(false);
    }
    // const socket: Socket = globalSocket;
    globalSocket?.on('updateList', (data: any) => {
        const connectedUsers: string[] = data.userIds;
        setFriendData(prevFriendData =>
            prevFriendData.map(friend => {
                if (connectedUsers.includes(friend.user.username)) {
                    return {
                        ...friend,
                        status: 'online',
                        color: statusColor.green,
                        gameStatus: 'offline'
                    };
                } else {
                    return {
                        ...friend,
                        status: 'offline',
                        color: statusColor.red,
                        gameStatus: 'offline'
                    };
                }
            })
        );
    });
    globalSocket?.on('playingUsers', (data: any) => {
        const playingUsers: any = data.userIds;
        const friendDataCopy = [...friendData];
        friendDataCopy.forEach(friend => {
            if (playingUsers?.includes(friend.user.username)) {
                friend.gameStatus = 'online';
            } else {
                friend.gameStatus = 'offline';
            }
        });
        setFriendData(friendDataCopy);
    });
    return (
        <>
            <main className="flex-1 p-4 overflow-y-auto relative">
                
                {
                    firstLogin === 'true' && (
                        <InfoModal userData={userData} socketChat={socket}/>
                    )
                }
                <section className="min-h-2/3 flex items-center justify-center p-2 flex-wrap lg:flex-nowrap">
                    <div className="w-full relative overflow-hidden p-4">
                        <div className="relative flex justify-between flex-col mt-8">
                            <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-neutral-700 to-slate-900 rounded-3xl overflow-hidden">
                                <div className="absolute inset-0 bg-teal-500 #blur-[5px] bg-left-bottom fgg"></div>
                                <div className="absolute top-0 left-0 w-full h-full flex items-center z-10">
                                    <video className="object-cover w-full h-full" autoPlay loop muted>
                                        <source src={videoSource} type="video/mp4" />
                                    </video>
                                </div>
                            </div>
                            <div className="flex flex-col p-8 justify-between relative z-10">
                                <div className="flex flex-col justify-between">
                                    <div className="w-fit flex flex-row p-2 bg-gradient-to-br from-main-light-EGGSHELL to-main-light-FERN rounded-xl">
                                        <img src={fire} alt="Fire" />
                                        <div className="text-white font-bold text-xl"> Popular</div>
                                    </div>
                                    <div className="div mt-4">
                                        <div className="text-white font-semibold text-3xl leading-10">AI: The Next Frontier</div>
                                    </div>
                                </div>
                                <div className="w-fit p-4 bg-gradient-to-r from-slate-900 via-gray-900 to-zinc-600 rounded-full" onClick={() => navigate('/dashboard/game')}>
                                    <div className="bg-emerald-400 rounded-3xl flex flex-col justify-center hover:cursor-pointer px-4 py-2">
                                        <div className="text-white font-bold">Play Now</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="robot absolute overflow-hidden top-[-10%] z-10 max-sm:hidden -right-1">
                            <img className="w-80 h-[23rem] max-sm:w-40" src={Robot} alt="Robot" />
                        </div>
                    </div>
                    <div className="roomsHolder w-2/3 bg-transparent flex flex-col overflow-auto justify-around flex-1 lg:flex-initial p-4 space-y-4">
                        <div className="title text-2xl text-black dark:text-white font-poppins overflow-hidden">Public Rooms</div>
                        <div className="rooms flex flex-col overflow-auto p-4 space-y-4">
                            {
                                publicChannels?.length == 0
                                ?
                                (
                                    <div className="noRoom flex justify-start">
                                        <span className='font-poppins text-lg dark:text-main-light-FERN text-main-light-EGGSHELL'> Noo Rooom Yet</span>
                                    </div>
                                )
                                :
                                publicChannels.map((channel, index) => {
                                    return (
                                        <div className="public-room1 rounded-3xl bg-main-light-EGGSHELL items-center justify-between flex flex-row p-2" key={index}>
                                            <div className="infos flex flex-row items-center space-x-4">
                                                <div className="pic w-12 h-12 rounded-2xl object-cover">
                                                    <img src={baseAPIUrl + channel.picture} className=' h-full w-full bg-cover bg-center' alt="Profile" />
                                                </div>
                                                <div className="description">
                                                    <div className="text-white font-bold">{channel.name}</div>
                                                </div>
                                            </div>
                                            <div className="action cursor-pointer"  onClick={() => {joinChannel(channel);}}>
                                                <img src={play} alt="Play" />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </section>
                <section className='flex flex-col mb-20  flex-wrap justify-between p-2'>
                    <div className='min-w-[601px] flex-row flex-1 h-full p-2'>
                        <p className="capitalize text-black dark:text-white font-poppins text-2xl self-start overflow-hidden"> Games</p>
                        <div className="gamesScrollHolder flex flex-col w-full flex-1  gap-6">
                            <GameModesCarousel />
                        </div>
                    </div>
                    <div className='flex w-full flex-col items-center place-self-start p-4 justify-center gap-4'>
                        <p className="capitalize text-black dark:text-white font-poppins text-2xl self-start overflow-hidden"> Protected Rooms </p>
                        <div className="flex flex-wrap justify-between w-full">
                            {protectedChannels?.length === 0 ? (
                                <div className="flex justify-center">
                                    <span className='font-poppins text-lg dark:text-main-light-FERN text-main-light-EGGSHELL'> No Rooms</span>
                                </div>
                            ) : (
                                protectedChannels.map((channel, index) => (
                                    <div className="public-room1 rounded-3xl bg-main-light-EGGSHELL m-1 flex flex-row items-center justify-between p-2 w-full sm:w-full md:w-[48%] xl:w-[48%]" key={index}>
                                        <div className="infos flex flex-row items-center space-x-4">
                                            <div className="pic w-12 h-12 rounded-2xl">
                                                <img src={baseAPIUrl + channel.picture} className=' bg-contain h-full bg-no-repeat bg-center' alt="Profile" />
                                            </div>
                                            <div className="description">
                                                <div className="text-white font-bold">{channel.name}</div>
                                                <span className='text-gray-500'>{channel.type}</span>
                                            </div>
                                        </div>
                                        <div className="action cursor-pointer" onClick={() => {
                                            setOpenModal(!openModal);
                                            setChannel(channel);
                                        }}>
                                        <img src={play} alt="Play" />
                                        </div>
                                    </div>
                                ))
                            )}
                            {openModal && (
                                <ModalComponent isOpen channelData={channel} setOpenModal={setOpenModal} userData={userData}/>
                            )}
                        </div>
                    </div> 
                </section>

            </main>
            <aside className="m-2 p-4 rounded-3xl lg:block md:block hidden h-fit dark:bg-zinc-900# bg-main-light-EGGSHELL  bg-main-light-WHITE#">
                <div className="contain flex flex-col justify-between items-center mx-auto">
                    <div className="profile mt-2 w-12 h-12 bg-white">
                        <img src={baseAPIUrl + userData[0].picture} className='object-cover bg-contain h-full bg-no-repeat bg-center' alt={userData[0].username} />
                    </div>
                    <div className="groupslogo mt-8">
                        {group()}
                    </div>
                    <div className="friends mt-4 flex flex-wrap gap-2 flex-col">
                        {
                            friendData.length == 0
                                ?
                                    'Loading...'
                                :
                                    friendData.slice(0, 7).map((friend, index) => {
                                        return (
                                            <div className="w-16 h-20 relative flex flex-col items-center" key={index} onClick={() => navigate(`/dashboard/profile/${friend.user.id}`)}>
                                                <div className="img p-2" key={index}>
                                                    <img src={baseAPIUrl + friend.user.picture} className={`w-10 h-10 mx-auto rounded-full object-cover ring-2 ${friend.color == 'red' ? 'ring-red-400' : 'ring-green-400'} p-1`} color="success" />
                                                </div>
                                                <div className="absolute top-0 right-2 mb-1 mr-[1px]">
                                                    <div className={`w-4 h-4 rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-[#A5BAA9]'}  border-2 border-main-dark-SPRUCE`}></div>
                                                </div>
                                                <div className={`absolute text-sm rounded-lg text-white bg-main-light-FERN p-[3px] top-12 ${friend.gameStatus === 'online' ? '' : 'hidden'} `}>In Game</div>
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
