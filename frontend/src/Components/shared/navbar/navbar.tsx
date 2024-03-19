import { useContext, useEffect, useState } from "react";
import "./navbar.css"
import { CustomFlowbiteTheme, TextInput } from 'flowbite-react';
import DataContext from "../../../services/data.context";
import LoadingComponent from "../loading/loading";
import { Socket } from "socket.io-client";
import UserService from "../../../services/user.service";
import User from "../../../model/user.model";
import AuthService from "../../../services/auth.service";

const SearchIcon = () => (
    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 stroke-black dark:stroke-white"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);

const colorSettings: CustomFlowbiteTheme['textInput'] = {
    field: {
        base: "relative w-full rounded-full",
        input: {
            colors: {
                primary: 'bg-neutral-500 text-white border-neutral-500',
                gray: "text-black focus:border-none focus:ring-0 dark:border-none placeholder-gray-400 dark:bg-neutral-700 bg-neutral-300 border-gray-300 dark:text-white",
            },
        }
    }
}

enum NotificationType {
    CallRequest = "CallRequest",
    DirectMessage = "DirectMessage",
    FriendRequest = "FriendRequest"
}
type notifItems = {
    from: string;
    to: string;
    message: string;
    sender: User;
    type: NotificationType;
}
function NavbarComponent(): JSX.Element {
    const [isNotifOpen, setNotifIsOpen] = useState<boolean>(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.theme);
    const colorTheme = theme === 'dark' ? 'light' : 'dark';
    const [notifications, setNotifications] = useState<notifItems[]>([]);
    const [notificationCount, setNotificationCount] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const userService = new UserService();
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme, colorTheme]);
    const userData = useContext(DataContext);
    if (!userData[0] || !userData[1])
        return <LoadingComponent />
    useEffect(() => {
        const fetchData = async () => {
            const authService = new AuthService();
            await authService.getPayload();
            const userService = new UserService();
            const users = await userService.getAllUsersExcept(userData[0].id);
            setUsers(users);
        };
        fetchData();
    }, []);
    useEffect(() => {
        const filtered = users.filter(user => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            return fullName.includes(searchInput.toLowerCase()) || user.username.toLowerCase().includes(searchInput.toLowerCase());
        });
        setFilteredUsers(filtered);
    }, [searchInput]);
    const socket: Socket = userData[1];
    const onRequestCall = async (data: any) => {
        console.log(data.senderId)
        const sender: User = await userService.getUser(data.senderId);
        const newItem: notifItems = {
            from: data.from,
            to: data.to,
            message: ' Requested a Call.',
            sender: sender,
            type: NotificationType.CallRequest
        }
        const updatedItems: notifItems[] = [...notifications, newItem];
        setNotifications(updatedItems);
        setNotificationCount(true);
    }
    socket?.on("RequestCall", onRequestCall);
    const onDirectMessage = async (data: any) => {
        setNotificationCount(true);
        const sender: User = await userService.getUser(data.senderId);
        const newItem: notifItems = {
            from: data.from,
            to: data.to,
            message: data.message,
            sender: sender,
            type: NotificationType.DirectMessage
        }
        const updatedItems: notifItems[] = [...notifications, newItem];
        setNotifications(updatedItems);
    }
    socket?.on("directMessageNotif", onDirectMessage);
    const toggleDropdown = () => {
        console.log("isNotifOpen: ", isNotifOpen)
        setNotifIsOpen(!isNotifOpen);
        setNotificationCount(false);
        console.log("isNotifOpen: ", isNotifOpen)
        // setNotifIsOpen(prevIsNotifOpen => !prevIsNotifOpen);
        // console.log(isNotifOpen)
    };
    const toogleSearchDropDown = () => {
        console.log("isSearchOpen: ", isSearchOpen)
        setIsSearchOpen(!isSearchOpen);
        console.log("isSearchOpen: ", isSearchOpen)
    };
    const document = window.document.querySelector('#nav');
    document?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.id !== 'dropdownDefaultButton') {
            setNotifIsOpen(false);
        }
    });
    return (
        <div className="p-4 flex flex-col sm:flex-row sm:justify-between" id="nav">
            <div className="heading mb-2 sm:mb-0">
                <span className="text-[#585a6b] text-xl font-bold subpixel-antialiased font-poppins">Good Evening,<span className="dark:text-white text-black uppercase font-poppins"> {userData[0] ? userData[0].username : 'User'}</span></span>
            </div>
            <div className="max-w-md pl-4 flex flex-col sm:flex-row sm:space-x-4">
                <div className="relative h-10 flex items-center">
                    <button onClick={() => { toggleDropdown(), console.log("isNotifOpen: ", isNotifOpen) }}>
                        <svg className="w-5 h-5 fill-black dark:fill-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                            <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
                        </svg>
                        {notificationCount ? <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full top-1 start-2.5 dark:border-gray-900" /> : ''}
                    </button>
                    <div className={`fixed z-50 -right-0 mx-2 top-14 mt-2 w-full max-w-md bg-slate-100 divide-y divide-gray-700 rounded-lg shadow dark:bg-zinc-900 dark:divide-gray-300 ${isNotifOpen ? 'block' : 'hidden'}`}>
                        <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-neutral-100 dark:bg-zinc-900 dark:text-white">
                            Notifications
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {
                                notifications.length > 0
                                    ?
                                    notifications.map((item, index) => {
                                        if (item.type === NotificationType.DirectMessage)
                                        {
                                            console.log(item.message)
                                            return (
                                                <a href="#" key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <div className="flex-shrink-0">
                                                        <div className="pic rounded-full w-12 h-12">
                                                            <img className="h-full w-full bject-cover bg-contain bg-no-repeat bg-center" src={item.sender.picture} alt="Jese image" />
                                                        </div>
                                                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-main-light-FERN border border-white rounded-full dark:border-gray-800">
                                                            <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                                <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
                                                                <path d="M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="w-full ps-3">
                                                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">New message from <span className="font-semibold text-gray-900 dark:text-main-light-FERN">{item.sender.username}</span>: {item.message.length > 10 ? item.message.slice(0, 10) + ' ...' : item.message}</div>
                                                        <div className="text-xs text-main-light-FERN ">a few moments ago</div>
                                                    </div>
                                                </a>
                                            )
                                        } else if (item.type === NotificationType.FriendRequest) {
                                            return (
                                                <a href="#" key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <div className="flex-shrink-0">
                                                        <div className="pic rounded-full w-11 h-11">
                                                            <img className="h-full bject-cover bg-contain bg-no-repeat bg-center" src="/docs/images/people/profile-picture-2.jpg" alt="Joseph image" />
                                                        </div>
                                                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-gray-900 border border-white rounded-full dark:border-gray-800">
                                                        <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                            <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z"/>
                                                        </svg>
                                                        </div>
                                                    </div>
                                                    <div className="w-full ps-3">
                                                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">Joseph Mcfall</span> and <span className="font-medium text-gray-900 dark:text-white">5 others</span> started following you.</div>
                                                        <div className="text-xs text-blue-600 dark:text-blue-500">10 minutes ago</div>
                                                    </div>
                                                </a>
                                            )
                                        }
                                        else if (item.type === NotificationType.CallRequest) {
                                            return (
                                                <a href="#" key={index} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <div className="flex-shrink-0">
                                                        <div className="pic rounded-full w-11 h-11">
                                                            <img className="h-full bject-cover bg-contain bg-no-repeat bg-center" src="/docs/images/people/profile-picture-5.jpg" alt="Robert image" />
                                                        </div>
                                                        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-purple-500 border border-white rounded-full dark:border-gray-800">
                                                        <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                                                            <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z"/>
                                                        </svg>
                                                        </div>
                                                    </div>
                                                    <div className="w-full ps-3">
                                                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">Robert Brown</span> posted a new video: Glassmorphism - learn how to implement the new design trend.</div>
                                                        <div className="text-xs text-blue-600 dark:text-blue-500">3 hours ago</div>
                                                    </div>
                                                </a>
                                            )
                                        }
                                    })
                                                :
                                                <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg dark:text-white">
                                                    Notifications
                                                </div>
                                            }
                        </div>
                    </div>
                </div>
                <div className="mode p-1 mt-[1px] mr-1 cursor-pointer" onClick={() => { setTheme(colorTheme); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 4000 4000" style={{ display: colorTheme === "dark" ? 'block' : "none" }}>
                        <path d="M2000 1320A680 680 0 102000 2680 680 680 0 102000 1320zM2000 1047.95c-75.105 0-136-60.895-136-136V776c0-75.105 60.895-136 136-136s136 60.895 136 136v135.95C2136 987.056 2075.105 1047.95 2000 1047.95zM2769.383 1366.634c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.125 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C2839.043 1353.353 2804.18 1366.634 2769.383 1366.634zM3224 2136h-135.934c-75.105 0-136-60.895-136-136s60.895-136 136-136H3224c75.105 0 136 60.895 136 136S3299.105 2136 3224 2136zM2865.473 3001.506c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C2935.066 2988.241 2900.27 3001.506 2865.473 3001.506zM2000 3360c-75.105 0-136-60.895-136-136v-135.95c0-75.105 60.895-136 136-136s136 60.895 136 136V3224C2136 3299.105 2075.105 3360 2000 3360zM1134.527 3001.506c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.158 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C1204.188 2988.208 1169.324 3001.506 1134.527 3001.506zM911.934 2136H776c-75.105 0-136-60.895-136-136s60.895-136 136-136h135.934c75.105 0 136 60.895 136 136S987.039 2136 911.934 2136zM1230.617 1366.634c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C1300.211 1353.369 1265.414 1366.634 1230.617 1366.634z"></path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 64 64" style={{ display: colorTheme === "dark" ? 'none' : "block" }}>
                        <path className="fill-none dark:fill-white" d="M55.68,36.83c0.32,0.45,0.41,1.02,0.22,1.57C52.59,47.73,43.72,54,33.83,54c-12.9,0-23.4-10.5-23.4-23.41	c0-11.02,7.83-20.65,18.61-22.9c0.12-0.03,0.24-0.04,0.36-0.04c0.65,0,1.23,0.37,1.53,0.96c0.3,0.61,0.24,1.33-0.19,1.89	C28.25,13.62,27,17,27,23c0.44,5.97,3.66,11.21,9,14c2.42,1.23,5.62,1.82,8.38,1.82c3.14,0,6.24-0.86,8.96-2.48	c0.27-0.17,0.58-0.25,0.9-0.25C54.81,36.09,55.35,36.36,55.68,36.83z M33.83,50.68c7.04,0,13.51-3.7,17.13-9.61	c-2.11,0.71-4.31,1.07-6.58,1.07c-11.45,0-20.77-9.32-20.77-20.77c0-3.2,0.73-6.31,2.12-9.14c-7.17,3.17-11.98,10.38-11.98,18.36	C13.75,41.67,22.76,50.68,33.83,50.68z"></path>
                    </svg>
                </div>
                <div className="group" onClick={() => { toogleSearchDropDown() }}>
                    <TextInput theme={colorSettings} rightIcon={SearchIcon} color="gray" type="text" placeholder="Search" className="w-full sm:w-auto" onChange={(e) => setSearchInput(e.target.value)} />
                    <div className={`absolute mt-2 z-10 rounded-md shadow-lg dark:bg-neutral-700 bg-neutral-300 ring-1 ring-black ring-opacity-5 p-1 ${isSearchOpen ? 'block' : 'hidden'}`}>
                        {filteredUsers.slice(0, 3).map((user, index) => (
                            <li>
                                <a key={index} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    <img className="w-6 h-6 me-2 rounded-full" src={user.picture} alt="Jese image" />
                                    {user.firstName} {user.lastName}
                                </a>
                            </li>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavbarComponent;

