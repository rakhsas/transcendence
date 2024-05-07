import { useContext, useEffect, useState } from "react";
import "./navbar.css"
import { Button, CustomFlowbiteTheme, TextInput } from 'flowbite-react';
import DataContext from "../../../services/data.context";
import LoadingComponent from "../loading/loading";
import { Socket } from "socket.io-client";
import User from "../../../model/user.model";
import { notificationInterface } from './../../../utils/types'
import { NotificationService } from "../../../services/notification.service";
import { useNavigate } from "react-router-dom";
import UserService from "../../../services/user.service";

const SearchIcon = () => (
    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 stroke-white"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);

const colorSettings: CustomFlowbiteTheme['textInput'] = {
    field: {
        base: "relative w-full rounded-full",
        input: {
            colors: {
                primary: 'bg-main-500 text-white border-0 dark: bg-main-light-EGGSHELL #bg-main-light-FERN focus:border-none focus:ring-0 dark:border-none dark: placeholder-gray-400',
                // gray: "text-black focus:border-none focus:ring-0 dark:border-none placeholder-gray-400 dark:bg-neutral-700 bg-neutral-300 border-gray-300 dark:text-white",
            },
        }
    }
}

// enum NotificationType {
//     CallRequest = "CallRequest",
//     DirectMessage = "DirectMessage",
//     FriendRequest = "FriendRequest",
//     ChannelInvite = "ChannelInvite",
//     RoomMessage = "RoomMessage"
// }

export enum NotificationType {
    MESSAGE = 'MESSAGE',
    FRIEND_REQUEST = 'FRIEND_REQUEST',
    CALL_REQUEST = 'CALL_REQUEST',
    CHANNEL_MESSAGE = 'CHANNEL_MESSAGE',
    CHANNEL_INVITE = 'CHANNEL_INVITE',
    ROOM_MESSAGE = 'ROOM_MESSAGE',
    FRIEND_REQUEST_ACCEPTED= 'FRIEND_REQUEST_ACCEPTED',
    FRIEND_REQUEST_DECLINED= 'FRIEND_REQUEST_DECLINED',
    KIKED = 'KIKED',
    ONEVSONE = 'ONEVSONE',
    ONEVSONE_DECLINED = 'ONEVSONE_DECLINED',
}

interface NotifMessage {
    message: string;
    image: string;
    audio: string;
}
type notifItems = {
    from: string;
    to: string;
    message: NotifMessage;
    sender: User;
    type: NotificationType;
}
function NavbarComponent(): JSX.Element {
    const APIURL = import.meta.env.VITE_FRONT_URL;
    const BASE_API_URL = import.meta.env.VITE_API_AUTH_KEY;
    const [isNotifOpen, setNotifIsOpen] = useState<boolean>(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.theme);
    const colorTheme = theme === 'dark' ? 'light' : 'dark';
    // const [notifications, setNotifications] = useState<notifItems[]>([]);
    const [notificationCount, setNotificationCount] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [channelNotifPayload, setChannelNotifPayload] = useState<any>({});
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [notifications, setNotifications] = useState<notificationInterface[]>([]);
    const [greeting, setGreeting] = useState<string>('');
    const navigate = useNavigate();
    const userService = new UserService();
    useEffect(() => {
        const updateGreeting = () => {
            const now = new Date();
            const hour = now.getHours();
        
            if (hour < 12) {
                setGreeting('Good Morning,');
            } else if (hour < 18) {
                setGreeting('Good Afternoon,');
            } else {
                setGreeting('Good Evening,');
            }
        };
        updateGreeting();
        const intervalId = setInterval(updateGreeting, 60000);
    
        return () => clearInterval(intervalId);
    }, []);
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme, colorTheme]);
    const userData = useContext(DataContext);
    if (!userData)
        return <LoadingComponent />
    useEffect(() => {
        // setUsers(userData[3]);
        //console.log('Users', userData[3]);
        setNotifications(userData[6]);
    }, []);
    useEffect(() => {
        notifications.slice(0, 5).forEach(notif => {
            if (notif.seen === false) {
                setNotificationCount(true);
            }
        });

    }, [notifications]);
    useEffect(() => {
        if (!searchInput) {
            setFilteredUsers([]);
            return;
        }
        const fetchUsers = async () => {
            const users = userService.searchUsers(searchInput);
            users.then((data) => {
                setUsers(data);
            })
        }
        fetchUsers();
        const filtered = users.filter(user => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            return fullName.includes(searchInput.toLowerCase()) || user.username.toLowerCase().includes(searchInput.toLowerCase());
        });
        setFilteredUsers(filtered);
    }, [searchInput]);
    const handleNavigate = (id: string) => {
        setSearchInput('');
        navigate(`/dashboard/profile/${id}`);
    }
    const socket: Socket = userData[1];
    const onRequestCall = async (data: any) => {
        const newItem: notificationInterface = {
            id: data.id,
            type: NotificationType.CALL_REQUEST,
            message: data.message,
            audio: data.audio,
            image: data.image,
            seen: false,
            read: false,
            issuer: data.issuer,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            channel: data.channel,
            target: data.target
        }
        const updatedItems: notificationInterface[] = [...notifications, newItem];
        updatedItems.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(updatedItems);
        setNotificationCount(true);
    }
    // socket?.on("RequestCall", onRequestCall);
    const onDirectMessage = async (data: any) => {
        const newItem: notificationInterface = {
            id: data.id,
            type: data.type,
            message: data.message,
            audio: data.audio,
            image: data.image,
            seen: false,
            read: false,
            issuer: data.issuer,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            channel: data.channel,
            target: data.target
        }
        const updatedItems: notificationInterface[] = [...notifications, newItem];
        updatedItems.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(updatedItems);
        setNotificationCount(true);
    }
    socket?.on("directMessageNotif", onDirectMessage);
    socket?.on("roomMessageNotif", async (data: any) => {
        const newItem: notificationInterface = {
            id: data.id,
            type: data.type,
            message: data.message,
            audio: data.audio,
            image: data.image,
            seen: false,
            read: false,
            issuer: data.issuer,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            channel: data.channel,
            target: data.target
        }
        const updatedItems: notificationInterface[] = [...notifications, newItem];
        updatedItems.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(updatedItems);
        setNotificationCount(true);
    })
    socket?.on("gameRequestDeclined", async (data: any) => {
        const newItem: notificationInterface = {
            id: data.id,
            type: data.type,
            message: data.message,
            audio: data.audio,
            image: data.image,
            seen: false,
            read: false,
            issuer: data.issuer,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            channel: data.channel,
            target: data.target
        }
        const updatedItems: notificationInterface[] = [...notifications, newItem];
        updatedItems.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(updatedItems);
        setNotificationCount(true);
        navigate('/dashboard');
    })
    socket?.on("channelJoinNotif", async (data: any) => {
        setChannelNotifPayload(data.payload);
        const newItem: notificationInterface = {
            id: data.lastnotif.id,
            type: data.lastnotif.type,
            message: data.lastnotif.message,
            audio: data.lastnotif.audio,
            image: data.lastnotif.image,
            seen: false,
            read: false,
            issuer: data.lastnotif.issuer,
            createdAt: data.lastnotif.createdAt,
            updatedAt: data.lastnotif.updatedAt,
            channel: data.lastnotif.channel,
            target: data.lastnotif.target
        }

        const updatedItems: notificationInterface[] = [...notifications, newItem];
        updatedItems.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(updatedItems);
        setNotificationCount(true);
    })
    socket?.on("friendRequestNotif", async (data: any) => {
        const newItem: notificationInterface = {
            id: data.id,
            type: data.type,
            message: data.message,
            audio: data.audio,
            image: data.image,
            seen: false,
            read: false,
            issuer: data.issuer,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            channel: data.channel,
            target: data.target
        }
        const updatedItems: notificationInterface[] = [...notifications, newItem];
        updatedItems.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(updatedItems);
        setNotificationCount(true);
    })
    socket?.on("invitedGame", async (data: any) => {
        const newItem: notificationInterface = {
            id: data.id,
            type: NotificationType.ONEVSONE,
            message: data.message,
            audio: data.audio,
            image: data.image,
            seen: false,
            read: false,
            issuer: data.issuer,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            channel: data.channel,
            target: data.target
        }
        const updatedItems: notificationInterface[] = [...notifications, newItem];
        updatedItems.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(updatedItems);
        setNotificationCount(true);
    })
    socket?.on("friendRequestAcceptedNotif", async (data: any) => {
        const newItem: notificationInterface = {
            id: data.id,
            type: NotificationType.FRIEND_REQUEST_ACCEPTED,
            message: data.message,
            audio: data.audio,
            image: data.image,
            seen: false,
            read: false,
            issuer: data.issuer,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            channel: data.channel,
            target: data.target
        }
        const updatedItems: notificationInterface[] = [...notifications, newItem];
        updatedItems.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(updatedItems);
        setNotificationCount(true);
    });
    socket?.on("friendRequestDecinedNotif", async (data: any) => {
        const newItem: notificationInterface = {
            id: data.id,
            type: NotificationType.FRIEND_REQUEST_DECLINED,
            message: data.message,
            audio: data.audio,
            image: data.image,
            seen: false,
            read: false,
            issuer: data.issuer,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            channel: data.channel,
            target: data.target
        }
        const updatedItems: notificationInterface[] = [...notifications, newItem];
        updatedItems.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(updatedItems);
        setNotificationCount(true);
    });
    socket?.on("friendRequestNotif", async (data: any) => {
        const newItem: notificationInterface = {
            id: data.id,
            type: data.type,
            message: data.message,
            audio: data.audio,
            image: data.image,
            seen: false,
            read: false,
            issuer: data.issuer,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            channel: data.channel,
            target: data.target
        }
        const updatedItems: notificationInterface[] = [...notifications, newItem];
        updatedItems.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(updatedItems);
        setNotificationCount(true);
    })
    socket?.on("kickedNotif", async (data: any) => {
        const newItem: notificationInterface = {
            id: data.id,
            type: NotificationType.KIKED,
            message: data.message,
            audio: data.audio,
            image: data.image,
            seen: false,
            read: false,
            issuer: data.issuer,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            channel: data.channel,
            target: data.target
        }
        const updatedItems: notificationInterface[] = [...notifications, newItem];
        updatedItems.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotifications(updatedItems);
        setNotificationCount(true);
    })
    const toogleSearchDropDown = () => {
        setIsSearchOpen(!isSearchOpen);
    };
    const document = window.document.querySelector('#dropdownNotification');
    document?.addEventListener('click', (e) => {
        setNotifIsOpen(false);
    });
    const updateNotif = () => {
        const notificationService = new NotificationService();
        notifications.slice(0, 5).forEach(async (element: notificationInterface) => {
            const test = await notificationService.returnSeenNotification(element.id);
        })
        setNotificationCount(false);
    }
    const acceptVideoCall = async (item: any) => {
        const constraints = {
            audio: true,
            video: true,
        };
        console.log('here');
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track: MediaStreamTrack) => {track.enabled = false});
        userData[8](stream)
        stream && socket.emit("acceptVideoCall", {
            user: userData[0],
            caller: item.issuer,
            permission: true
        });
        setNotifIsOpen(false);
        item.seen = true;
    }
    return (
        <div className="p-4 flex flex-col sm:flex-row items-center sm:justify-between" id="nav">
            <div className="heading mb-2 sm:mb-0">
                <span className="text-white text-xl font-bold subpixel-antialiased font-poppins">{greeting}<span className="text-main-light-FERN uppercase font-poppins"> {userData[0] ? userData[0].username : 'User'}</span></span>
            </div>
            <div className="max-w-md  flex flex-row-reverse gap-3 sm:flex-row px-3 ">
                <div className="relative h-10 flex items-center  ">
                    <div className="svg dark: bg-main-light-EGGSHELL #bg-main-light-FERN rounded-full p-2" onClick={() =>  {setNotifIsOpen(!isNotifOpen); updateNotif()}}>
                        {/* <svg  className="w-6 h-6 fill-black dark:fill-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                            <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
                        </svg> */}
                        <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"/>
                        </svg>
                        {notificationCount ? <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full top-1 start-2.5 dark:border-gray-900" /> : ''}
                    </div>
                    <div id="dropdownNotification" className={`fixed z-50 -right-0 top-14 mt-2 w-full max-w-md bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-zinc-800 dark:divide-gray-700 ${isNotifOpen ? 'block' : 'hidden'}`} aria-labelledby="dropdownNotificationButton">
                        <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-zinc-800 dark:text-white">
                            Notifications
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-400">
                        {
                                notifications && notifications.length > 0
                                    ?
                                    notifications
                                        .filter((item: notificationInterface) => !item.seen) // Filter unseen notifications
                                        .slice(0, 5) // Take the first 5 unseen notifications
                                        .map((item: notificationInterface, index) => {
                                    // //console.log('Notifications', item);
                                        if (item.type === NotificationType.MESSAGE) {
                                            return (
                                                <a  key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => {
                                                    setNotifIsOpen(false);
                                                    item.seen = true;
                                                }}>
                                                    <div className="flex-shrink-0">
                                                        <div className="pic rounded-full w-12 h-12">
                                                            <img className="h-full w-full object-cover bg-contain bg-no-repeat bg-center" src={BASE_API_URL + item.issuer.picture} alt="Jese image" />
                                                        </div>
                                                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-green-400 border border-white rounded-full dark:border-gray-800">
                                                            {
                                                                item.message?.length > 0 ? (
                                                                    <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                                        <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
                                                                    </svg>
                                                                ) : item.image?.length > 0 ? (
                                                                    <svg className="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path fillRule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
                                                                        <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clipRule="evenodd"/>
                                                                    </svg>

                                                                ) : (
                                                                    <svg className="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm2.318.052h-.002A1 1 0 0 0 12 8v5.293A4.033 4.033 0 0 0 10.5 13C8.787 13 7 14.146 7 16s1.787 3 3.5 3 3.5-1.146 3.5-3c0-.107-.006-.211-.017-.313A1.04 1.04 0 0 0 14 15.5V9.766c.538.493 1 1.204 1 2.234a1 1 0 1 0 2 0c0-1.881-.956-3.14-1.86-3.893a6.4 6.4 0 0 0-1.636-.985 4.009 4.009 0 0 0-.165-.063l-.014-.005-.005-.001-.002-.001ZM9 16c0-.356.452-1 1.5-1s1.5.644 1.5 1-.452 1-1.5 1S9 16.356 9 16Z" clipRule="evenodd"/>
                                                                    </svg>
                                                                )
                                                        }
                                                        </div>
                                                    </div>
                                                    <div className="w-full ps-3">
                                                    <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                                                        New message from <span className="font-semibold text-gray-900 dark:text-main-light-FERN">
                                                            {item.issuer.username}
                                                        </span>: {
                                                            item.message?.length > 0 ? (
                                                                item.message?.length > 10 ? item.message.slice(0, 10) + ' ...' : item.message
                                                            ) : (
                                                                item.image?.length > 0 ? 'Picture' :
                                                                item.audio?.length > 0 ? 'Audio' :
                                                                null
                                                            )
                                                        }
                                                    </div>
                                                        <div className="text-xs text-main-light-FERN ">a few moments ago</div>
                                                    </div>
                                                </a>
                                            )
                                        }
                                        else if (item.type === NotificationType.FRIEND_REQUEST) {
                                        //console.log('Friend Request', item);
                                            return (
                                                <a  key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <div className="flex-shrink-0">
                                                        <div className="pic rounded-full w-11 h-11">
                                                            <img className="h-full object-cover bg-contain bg-no-repeat bg-center" src={BASE_API_URL + item.issuer.picture} alt="Robert image" />
                                                        </div>
                                                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-gray-900 border border-white rounded-full dark:border-gray-800">
                                                            <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                                <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="w-full ps-3">
                                                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">{item.issuer.username}</span> sent you a friend request.</div>
                                                        <div className="text-xs text-blue-600 dark:text-blue-500">
                                                            {
                                                                new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[1].split(':').slice(0, 2).join(':') + ' ' + new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[2]
                                                            }
                                                        </div>
                                                        <div className="flex gap-2 w-fit">
                                                        <Button color="success" pill onClick={() => {
                                                            socket?.emit("acceptFriendRequest",
                                                            {
                                                                userId: userData[0].id,
                                                                friendId: item.issuer.id
                                                            }
                                                            );
                                                            setNotifIsOpen(false);
                                                            item.seen = true;
                                                        }}>
                                                            Accept
                                                        </Button>
                                                        <Button color="failure" pill onClick={() => {
                                                            socket?.emit("declineFriendRequest",
                                                            {
                                                                userId: userData[0].id,
                                                                friendId: item.issuer.id
                                                            });
                                                            setNotifIsOpen(false);
                                                            item.seen = true;
                                                        }}>
                                                            Decline
                                                        </Button>
                                                    </div>
                                                    </div>
                                                </a>
                                            )
                                        }
                                        else if (item.type === NotificationType.ONEVSONE) {
                                            return (
                                                <a  key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <div className="flex-shrink-0">
                                                        <div className="pic rounded-full w-11 h-11">
                                                            <img className="h-full object-cover bg-contain bg-no-repeat bg-center" src={BASE_API_URL + item.issuer.picture} alt="Robert image" />
                                                        </div>
                                                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-gray-900 border border-white rounded-full dark:border-gray-800">
                                                            <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                                <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="w-full ps-3">
                                                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">{item.issuer.username}</span> invited You To a Game.</div>
                                                        <div className="text-xs text-blue-600 dark:text-blue-500">
                                                            {
                                                                new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[1].split(':').slice(0, 2).join(':') + ' ' + new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[2]
                                                            }
                                                        </div>
                                                        <div className="flex gap-2 w-fit">
                                                        <Button color="success" pill onClick={() => {
                                                            navigate(`/dashboard/gameRoom/${item.issuer.id}`);
                                                            setNotifIsOpen(false);
                                                            item.seen = true;
                                                        }}>
                                                            Accept
                                                        </Button>
                                                        <Button color="failure" pill onClick={() => {
                                                            socket?.emit("declineGameRequest",
                                                            {
                                                                issuer: userData[0].id,
                                                                target: item.issuer.id
                                                            });
                                                            setNotifIsOpen(false);
                                                            item.seen = true;
                                                        }}>
                                                            Decline
                                                        </Button>
                                                    </div>
                                                    </div>
                                                </a>
                                            )
                                        }
                                        else if (item.type === NotificationType.CHANNEL_INVITE) {
                                            return (
                                                <a  key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <div className="flex-shrink-0">
                                                        <div className="pic rounded-full w-11 h-11">
                                                            <img className="h-full object-cover bg-contain bg-no-repeat bg-center" src={BASE_API_URL + item.issuer.picture} alt="Robert image" />
                                                        </div>
                                                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-purple-500 border border-white rounded-full dark:border-gray-800">
                                                            <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                                <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="w-fit ps-3">
                                                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400 w-fit§">
                                                            <span className="font-semibold text-gray-900 dark:text-white">{item.issuer.username}</span> : invited you to join the channel <span className="font-semibold text-gray-900 dark:text-white">{item.channel?.name + '.'}</span>
                                                        </div>
                                                        <div className="flex items-center justify-around w-full">
                                                            <div className="text-xs text-blue-600 dark:text-blue-500">
                                                                {
                                                                    new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[1].split(':').slice(0, 2).join(':') + ' ' + new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[2]
                                                                }
                                                            </div>
                                                            <Button color="success" pill onClick={() => {
                                                                socket?.emit("acceptJoinChannel",
                                                                {
                                                                    id: item.channel.id,
                                                                    channelId: item.channel.id,
                                                                    __owner__: userData[0].id,
                                                                    role: 'MEMBER',
                                                                    issuer: item.issuer,
                                                                    message: item.message,
                                                                    createdAt: new Date().toISOString(),
                                                                    updatedAt: new Date().toISOString(),
                                                                    seen: false,
                                                                    read: false,
                                                                    type: NotificationType.CHANNEL_INVITE,
                                                                    password: ''
                                                                }
                                                                );
                                                                setNotifIsOpen(false);
                                                                item.seen = true;
                                                            }}>
                                                                Accept
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </a>
                                            )
                                        } else if (item.type === NotificationType.CALL_REQUEST) {
                                            return (
                                                <a key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <div className="flex-shrink-0">
                                                        <div className="pic rounded-full w-11 h-11">
                                                            <img className="h-full object-cover bg-contain bg-no-repeat bg-center" src={BASE_API_URL + item.issuer.picture} alt="Robert image" />
                                                        </div>
                                                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-purple-500 border border-white rounded-full dark:border-gray-800">
                                                            <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                                                                <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="w-full ps-3">
                                                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">Incoming call from <span className="font-semibold text-gray-900 dark:text-white">{item.issuer.username}</span>.</div>
                                                        <div className="text-xs text-blue-600 dark:text-blue-500">
                                                            {
                                                                new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[1].split(':').slice(0, 2).join(':') + ' ' + new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[2]
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 w-fit">
                                                        <Button color="success" pill onClick={() => 
                                                            acceptVideoCall(item)
                                                        }>
                                                            Accept
                                                        </Button>
                                                        <Button color="failure" pill onClick={() => {
                                                            // socket.emit("acceptVideoCall", {
                                                            //     user: userData[0],
                                                            //     caller: item.issuer,
                                                            //     permission: false
                                                            // });
                                                            setNotifIsOpen(false);
                                                            item.seen = true;
                                                            /*socket?.emit("declineFriendRequest",
                                                            {
                                                                userId: userData[0].id,
                                                                friendId: item.issuer.id
                                                            });*/
                                                        }}>
                                                            Decline
                                                        </Button>
                                                    </div>
                                                </a>
                                            )
                                        }
                                        else if (item.type === NotificationType.CHANNEL_MESSAGE) {
                                            return (
                                                <a  key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => {
                                                    setNotifIsOpen(false);
                                                    item.seen = true;
                                                }}>
                                                    <div className="flex-shrink-0">
                                                        <div className="pic rounded-full w-12 h-12">
                                                            <img className="h-full w-full object-cover bg-contain bg-no-repeat bg-center" src={BASE_API_URL + item.issuer.picture} alt="Jese image" />
                                                        </div>
                                                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-main-light-FERN border border-white rounded-full dark:border-gray-800">
                                                            <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                                <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="w-full ps-3">
                                                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">New message from <span className="font-semibold text-gray-900 dark:text-main-light-FERN">{item.issuer.username}</span>:
                                                            {
                                                                item.message.length > 0 ? (
                                                                    item.message.length > 10 ? item.message.slice(0, 10) + ' ...' : item.message
                                                                ) : (
                                                                    item.image && item.image.length > 0 ? 'Picture' :
                                                                    item.audio && item.audio.length > 0 ? 'Audio' :
                                                                    null
                                                                )
                                                            }
                                                        </div>
                                                        <div className="text-xs text-main-light-FERN ">
                                                            {
                                                                new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[1].split(':').slice(0, 2).join(':') + ' ' + new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[2]
                                                            }
                                                        </div>
                                                    </div>
                                                </a>
                                            )
                                        }
                                        else if (item.type === NotificationType.FRIEND_REQUEST_ACCEPTED) {
                                            return (
                                                <a  key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => {
                                                    setNotifIsOpen(false);
                                                    item.seen = true;
                                                }}>
                                                    <div className="flex-shrink-0">
                                                        <div className="pic rounded-full w-11 h-11">
                                                            <img className="h-full object-cover bg-contain bg-no-repeat bg-center" src={BASE_API_URL + item.issuer.picture} alt={item.issuer.username} />
                                                        </div>
                                                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-yellow-300 border border-white rounded-full dark:border-gray-800">
                                                            <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                                <path fillRule="evenodd" d="M18 14a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2v-2Z" clipRule="evenodd"/>
                                                                <path fillRule="evenodd" d="M15.026 21.534A9.994 9.994 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2c2.51 0 4.802.924 6.558 2.45l-7.635 7.636L7.707 8.87a1 1 0 0 0-1.414 1.414l3.923 3.923a1 1 0 0 0 1.414 0l8.3-8.3A9.956 9.956 0 0 1 22 12a9.994 9.994 0 0 1-.466 3.026A2.49 2.49 0 0 0 20 14.5h-.5V14a2.5 2.5 0 0 0-5 0v.5H14a2.5 2.5 0 0 0 0 5h.5v.5c0 .578.196 1.11.526 1.534Z" clipRule="evenodd"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="w-full ps-3">
                                                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">{item.issuer.username}</span> accepted your friend request.</div>
                                                        <div className="text-xs text-blue-600 dark:text-blue-500">
                                                            {
                                                                new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[1].split(':').slice(0, 2).join(':') + ' ' + new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[2]
                                                            }
                                                        </div>
                                                    </div>
                                                </a>
                                            )
                                        }
                                        else if (item.type === NotificationType.FRIEND_REQUEST_DECLINED ) {return (
                                            <div key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => {
                                                setNotifIsOpen(false);
                                                item.seen = true;
                                            }}>
                                                <div className="flex-shrink-0">
                                                    <div className="pic rounded-full w-11 h-11">
                                                        <img className="h-full bject-cover bg-contain bg-no-repeat bg-center" src={BASE_API_URL + item.issuer.picture} alt={item.issuer.username} />
                                                    </div>
                                                    <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-red-500 border border-white rounded-full dark:border-gray-800">
                                                        <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                            <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clipRule="evenodd"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="w-full ps-3">
                                                    <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">{item.issuer.username}</span> declined your friend request.</div>
                                                    <div className="text-xs text-blue-600 dark:text-blue-500">
                                                        {
                                                            new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[1].split(':').slice(0, 2).join(':') + ' ' + new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[2]
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        else if (item.type === NotificationType.ONEVSONE_DECLINED ) {return (
                                            <div key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => {
                                                setNotifIsOpen(false);
                                                item.seen = true;
                                            }}>
                                                <div className="flex-shrink-0">
                                                    <div className="pic rounded-full w-11 h-11">
                                                        <img className="h-full bject-cover bg-contain bg-no-repeat bg-center" src={BASE_API_URL + item.issuer.picture} alt={item.issuer.username} />
                                                    </div>
                                                    <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-red-500 border border-white rounded-full dark:border-gray-800">
                                                        <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                            <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clipRule="evenodd"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="w-full ps-3">
                                                    <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">{item.issuer.username}</span> declined your friend request.</div>
                                                    <div className="text-xs text-blue-600 dark:text-blue-500">
                                                        {
                                                            new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[1].split(':').slice(0, 2).join(':') + ' ' + new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[2]
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        else if (item.type === NotificationType.KIKED ) {return (
                                            <div key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <div className="flex-shrink-0">
                                                    <div className="pic rounded-full w-11 h-11">
                                                        <img className="h-full bject-cover bg-contain bg-no-repeat bg-center" src={BASE_API_URL + item.issuer.picture} alt={item.issuer.username} />
                                                    </div>
                                                    <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-red-500 border border-white rounded-full dark:border-gray-800">
                                                        <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="w-full ps-3">
                                                    <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">{item.issuer.username}</span> Kiked You From <span className="text-green-500 font-medium font-onest">{item.channel.name}</span>.</div>
                                                    <div className="text-xs text-blue-600 dark:text-blue-500">
                                                        {
                                                            new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[1].split(':').slice(0, 2).join(':') + ' ' + new Date(item.createdAt).toLocaleString().split(',')[1].split(' ')[2]
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    })
                            :
                            null
                            }
                        </div>
                    </div>
                </div>
                <div className="mode mt-[1px] mr-1 cursor-pointer dark: bg-main-light-EGGSHELL #bg-main-light-FERN rounded-full p-1" onClick={() => { setTheme(colorTheme); }}>
                    <svg  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 4000 4000" style={{ display: colorTheme === "dark" ? 'block' : "none" }}>
                        <path fill="white" d="M2000 1320A680 680 0 102000 2680 680 680 0 102000 1320zM2000 1047.95c-75.105 0-136-60.895-136-136V776c0-75.105 60.895-136 136-136s136 60.895 136 136v135.95C2136 987.056 2075.105 1047.95 2000 1047.95zM2769.383 1366.634c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.125 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C2839.043 1353.353 2804.18 1366.634 2769.383 1366.634zM3224 2136h-135.934c-75.105 0-136-60.895-136-136s60.895-136 136-136H3224c75.105 0 136 60.895 136 136S3299.105 2136 3224 2136zM2865.473 3001.506c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C2935.066 2988.241 2900.27 3001.506 2865.473 3001.506zM2000 3360c-75.105 0-136-60.895-136-136v-135.95c0-75.105 60.895-136 136-136s136 60.895 136 136V3224C2136 3299.105 2075.105 3360 2000 3360zM1134.527 3001.506c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.158 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C1204.188 2988.208 1169.324 3001.506 1134.527 3001.506zM911.934 2136H776c-75.105 0-136-60.895-136-136s60.895-136 136-136h135.934c75.105 0 136 60.895 136 136S987.039 2136 911.934 2136zM1230.617 1366.634c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C1300.211 1353.369 1265.414 1366.634 1230.617 1366.634z"></path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 64 64" style={{ display: colorTheme === "dark" ? 'none' : "block" }}>
                        <path fill="white" d="M55.68,36.83c0.32,0.45,0.41,1.02,0.22,1.57C52.59,47.73,43.72,54,33.83,54c-12.9,0-23.4-10.5-23.4-23.41	c0-11.02,7.83-20.65,18.61-22.9c0.12-0.03,0.24-0.04,0.36-0.04c0.65,0,1.23,0.37,1.53,0.96c0.3,0.61,0.24,1.33-0.19,1.89	C28.25,13.62,27,17,27,23c0.44,5.97,3.66,11.21,9,14c2.42,1.23,5.62,1.82,8.38,1.82c3.14,0,6.24-0.86,8.96-2.48	c0.27-0.17,0.58-0.25,0.9-0.25C54.81,36.09,55.35,36.36,55.68,36.83z M33.83,50.68c7.04,0,13.51-3.7,17.13-9.61	c-2.11,0.71-4.31,1.07-6.58,1.07c-11.45,0-20.77-9.32-20.77-20.77c0-3.2,0.73-6.31,2.12-9.14c-7.17,3.17-11.98,10.38-11.98,18.36	C13.75,41.67,22.76,50.68,33.83,50.68z"></path>
                    </svg>
                </div>
                <div className="group" onClick={() => { toogleSearchDropDown() }}>
                    <TextInput theme={colorSettings} rightIcon={SearchIcon} color="primary" type="text" placeholder="Search" className="w-full sm:w-auto" value={searchInput} onChange={(e) => {e.preventDefault(); setSearchInput(e.target.value)}} />
                    {
                        filteredUsers.length > 0 ? (
                            <div className={`absolute mt-2 z-40 rounded-md shadow-lg dark:bg-neutral-700 md:w-64 bg-neutral-300 ring-1 ring-black ring-opacity-5 p-1 ${isSearchOpen ? 'block' : 'hidden'}`}>
                                    {filteredUsers.slice(0, 3).map((user, index) => (
                                        <div onClick={() => handleNavigate(user.id)} key={index} className="flex flex-col">
                                            <div className="flex px-4 py-2 hover:bg-gray-100 w-full dark:hover:bg-gray-600 dark:hover:text-white">
                                                <div className="pic">
                                                    <img className="w-8 h-8 me-2 rounded-full object-cover" src={BASE_API_URL + user.picture} alt="Jese image" />
                                                </div>
                                                <div className="info">
                                                    <span>{user.firstName + ' ' + user.lastName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                        ) : ''
                    }
                </div>
            </div>
        </div>
        // <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800">
        //     <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        //         <div className="flex items-center justify-between">
        //         <a className="flex-none" >
        //             <img className="w-10 h-auto" src="../assets/img/logo/logo-short.png" alt="Logo"/>
        //         </a>
        //         <div className="sm:hidden">
        //             <button type="button" className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-gray-700 dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-collapse="#navbar-image-2" aria-controls="navbar-image-2" aria-label="Toggle navigation">
        //             <svg className="hs-collapse-open:hidden flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
        //             <svg className="hs-collapse-open:block hidden flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        //             </button>
        //         </div>
        //         </div>
        //         <div id="navbar-image-2" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
        //             <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
        //                 <a className="font-medium text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="#" aria-current="page">Landing</a>
        //                 <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="#">Account</a>
        //                 <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="#">Work</a>
        //                 <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="#">Blog</a>
        //             </div>
        //         </div>
        //     </nav>
        // </header>
    )
}

export default NavbarComponent;

