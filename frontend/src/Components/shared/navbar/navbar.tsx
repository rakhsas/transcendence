import { useContext, useEffect, useState } from "react";
import "./navbar.css"
import { CustomFlowbiteTheme, TextInput } from 'flowbite-react';
import DataContext from "../../../services/data.context";
import LoadingComponent from "../loading/loading";
import { Socket } from "socket.io-client";
import UserService from "../../../services/user.service";
import User from "../../../model/user.model";

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
    DirectMessage = "DirectMessage"
}
type notifItems = {
    from: string;
    to: string;
    message: string;
    sender: User;
    type: NotificationType;
}

function NavbarComponent(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.theme);
    const colorTheme = theme === 'dark' ? 'light' : 'dark';
    const [notifications, setNotifications] = useState<notifItems[]>([]);
    const [notificationCount, setNotificationCount] = useState<boolean>(false);
    const userService = new UserService();
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme, colorTheme]);
    const userData = useContext(DataContext);
    if (!userData[0] || !userData[1])
        return <LoadingComponent />
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
            message: ' Directs You.',
            sender: sender,
            type: NotificationType.DirectMessage
        }
        const updatedItems: notifItems[] = [...notifications, newItem];
        setNotifications(updatedItems);
    }
    // socket?.on("directMessageNotif", onDirectMessage);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setNotificationCount(false)
    };
    const document = window.document.querySelector('#nav');
    document?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.id !== 'dropdownDefaultButton') {
            setIsOpen(false);
        }
    });
    return (
        <div className="p-4 flex flex-col sm:flex-row sm:justify-between" id="nav">
            <div className="heading mb-2 sm:mb-0">
                <span className="text-[#585a6b] text-xl font-bold subpixel-antialiased font-poppins">Good Evening,<span className="dark:text-white text-black uppercase font-poppins"> {userData[0] ? userData[0].username : 'User'}</span></span>
            </div>
            <div className="max-w-md pl-4 flex flex-col sm:flex-row sm:space-x-4">
                <div className="relative h-10 flex items-center">
                    <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" onClick={() => { toggleDropdown() }}>
                        <svg className='fill-black dark:fill-white' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0 0 24 24">
                            <path d="M16.5,3C13.605,3,12,5.09,12,5.09S10.395,3,7.5,3C4.462,3,2,5.462,2,8.5C2,14,12,21,12,21s10-7,10-12.5 C22,5.462,19.538,3,16.5,3z M12,18.518C8.517,15.845,4,11.406,4,8.5C4,6.57,5.57,5,7.5,5C9.902,5,12,7.907,12,7.907S14.14,5,16.5,5 C18.43,5,20,6.57,20,8.5C20,11.406,15.483,15.845,12,18.518z"></path>
                            {notificationCount ? <circle cx="20" cy="6" r="4" fill="#FF0000" /> : ''}
                        </svg>
                    </button>

                    <div className={`fixed z-10 top-14 w-64 mt-2  bg-white divide-y divide-gray-500 rounded-lg shadow dark:bg-main-light-EGGSHELL ${isOpen ? 'block' : 'hidden'}`}>
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" id="dropdown">
                            {
                                notifications.length > 0
                                    ?
                                    notifications.map((item, index) => (
                                        item.type === NotificationType.DirectMessage ?
                                            <li className="flex items-center px-4 py-2" key={index}>
                                                <img src={item.sender.picture} alt="Action Owner" className="w-8 h-8 rounded-full mr-2" />
                                                <span><span className="font-poppins font-semibold">{item.sender.username}</span>{item.message}</span>
                                            </li>
                                            :
                                            <li className="flex items-center justify-between px-4 py-2" key={index}>
                                                <div className="flex items-center">
                                                    <img className="w-8 h-8 rounded-full mr-2" src={item.sender.picture} alt="User Avatar" />
                                                    <span>{item.sender.firstName} {item.sender.lastName}</span>
                                                </div>
                                                <button className="bg-green-400 hover:bg-green-400 text-white font-semibold py-1 px-4 rounded-2xl focus:outline-none">
                                                    Join
                                                </button>
                                            </li>


                                    ))
                                    :
                                    <li className="flex items-center px-4 py-2">
                                        {/* <img src={item.sender.picture} alt="Action Owner" className="w-8 h-8 rounded-full mr-2" /> */}
                                        <span className="font-poppins font-semibold">No Notification</span>
                                    </li>

                            }
                        </ul>
                    </div>
                </div>


                <div className="mode p-1 mt-[1px] mr-1 cursor-pointer" onClick={() => {
                    setTheme(colorTheme);
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 4000 4000" style={{ display: colorTheme === "dark" ? 'block' : "none" }}>
                        <path d="M2000 1320A680 680 0 102000 2680 680 680 0 102000 1320zM2000 1047.95c-75.105 0-136-60.895-136-136V776c0-75.105 60.895-136 136-136s136 60.895 136 136v135.95C2136 987.056 2075.105 1047.95 2000 1047.95zM2769.383 1366.634c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.125 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C2839.043 1353.353 2804.18 1366.634 2769.383 1366.634zM3224 2136h-135.934c-75.105 0-136-60.895-136-136s60.895-136 136-136H3224c75.105 0 136 60.895 136 136S3299.105 2136 3224 2136zM2865.473 3001.506c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C2935.066 2988.241 2900.27 3001.506 2865.473 3001.506zM2000 3360c-75.105 0-136-60.895-136-136v-135.95c0-75.105 60.895-136 136-136s136 60.895 136 136V3224C2136 3299.105 2075.105 3360 2000 3360zM1134.527 3001.506c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.158 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C1204.188 2988.208 1169.324 3001.506 1134.527 3001.506zM911.934 2136H776c-75.105 0-136-60.895-136-136s60.895-136 136-136h135.934c75.105 0 136 60.895 136 136S987.039 2136 911.934 2136zM1230.617 1366.634c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C1300.211 1353.369 1265.414 1366.634 1230.617 1366.634z"></path>
                    </svg>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 24 24" style={{ display: colorTheme === "dark" ? "none" : 'block' }} stroke-width="0.5">
                        <path fill="white" d="M12.07,21A9,9,0,0,1,11,3a1,1,0,0,1,.83,1.7A5.93,5.93,0,0,0,10.05,9a6,6,0,0,0,6.06,6A6.13,6.13,0,0,0,19,14.25a1,1,0,0,1,1.4,1.27A9.07,9.07,0,0,1,12.07,21ZM8.69,5.79a7,7,0,1,0,8.4,11.13,7.93,7.93,0,0,1-1,.06A8,8,0,0,1,8.69,5.79Z">
                        </path>
                    </svg> */}
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 64 64" style={{ display: colorTheme === "dark" ? 'none' : "block" }}>
                        <path className="fill-none dark:fill-white" d="M55.68,36.83c0.32,0.45,0.41,1.02,0.22,1.57C52.59,47.73,43.72,54,33.83,54c-12.9,0-23.4-10.5-23.4-23.41	c0-11.02,7.83-20.65,18.61-22.9c0.12-0.03,0.24-0.04,0.36-0.04c0.65,0,1.23,0.37,1.53,0.96c0.3,0.61,0.24,1.33-0.19,1.89	C28.25,13.62,27,17,27,23c0.44,5.97,3.66,11.21,9,14c2.42,1.23,5.62,1.82,8.38,1.82c3.14,0,6.24-0.86,8.96-2.48	c0.27-0.17,0.58-0.25,0.9-0.25C54.81,36.09,55.35,36.36,55.68,36.83z M33.83,50.68c7.04,0,13.51-3.7,17.13-9.61	c-2.11,0.71-4.31,1.07-6.58,1.07c-11.45,0-20.77-9.32-20.77-20.77c0-3.2,0.73-6.31,2.12-9.14c-7.17,3.17-11.98,10.38-11.98,18.36	C13.75,41.67,22.76,50.68,33.83,50.68z"></path>
                    </svg>
                </div>
                <TextInput theme={colorSettings} rightIcon={SearchIcon} color="gray" type="text" placeholder="Search" className="w-full sm:w-auto" />
            </div>
        </div>
    )
}

export default NavbarComponent;
// notif
// accept call


