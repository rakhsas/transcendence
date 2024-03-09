import { useContext, useEffect, useRef, useState } from "react";
import "./navbar.css"
import { CustomFlowbiteTheme, Dropdown, Label, TextInput, Textarea } from 'flowbite-react';
import DataContext from "../../../services/data.context";
import LoadingComponent from "../loading/loading";
import { Socket } from "socket.io-client";
// import theme from "../../../utils/theme";

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

function NavbarComponent(): JSX.Element {
    const [theme, setTheme] = useState(localStorage.theme);
    const colorTheme = theme === 'dark' ? 'light' : 'dark';
    const [items, setItems] = useState<string[]>([]);
    const [notificationCount, setNotificationCount] = useState<number>(0);
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);
        root.classList.add(theme);

        // save theme to local storage
        localStorage.setItem('theme', theme);
    }, [theme, colorTheme]);
    const userData = useContext(DataContext);
    if (!userData)
        return <LoadingComponent />
    const socket: Socket = userData[1];
    const onRequestCall = (data: any) => {
        const newItem = `You have an incoming Call from : ` + data.from;
        setItems([...items, newItem]);
        setNotificationCount(notificationCount + 1);
    }
    socket?.on("RequestCall", onRequestCall);
    return (
        <div className="p-8 flex flex-row justify-between">
            <div className="heading mt-2">
                <span className="text-[#585a6b] text-xl font-bold subpixel-antialiased font-poppins">Good Evening,<span className="dark:text-white text-black uppercase font-poppins"> {userData[0] ? userData[0].username : 'User'}</span></span>
            </div>
            <div className="max-w-md pl-4 flex flex-row justify-around">
                <Dropdown id="notif" label="" dismissOnClick={false} placement="bottom" className="w-auto dark:bg-slate-200" renderTrigger={() =>
                    <div className="item flex justify-between flex-col space-y-2 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 128 128">
                            <path fill="white" d="M12.81 46.31c.24.06.49.09.73.09 1.34 0 2.57-.91 2.91-2.27 2.78-11.12 9.4-20.97 18.63-27.71 1.34-.98 1.63-2.85.65-4.19-.98-1.34-2.85-1.63-4.19-.65-10.36 7.57-17.79 18.61-20.91 31.1C10.22 44.28 11.2 45.91 12.81 46.31zM92.93 16.42c9.23 6.74 15.84 16.58 18.63 27.71.34 1.36 1.56 2.27 2.91 2.27.24 0 .49-.03.73-.09 1.61-.4 2.58-2.03 2.18-3.64-3.12-12.48-10.55-23.53-20.91-31.1-1.34-.98-3.21-.69-4.19.65C91.3 13.57 91.59 15.44 92.93 16.42zM19.2 90.85c-.98 3.91-.12 7.98 2.37 11.15 2.48 3.18 6.22 5 10.25 5h14.46c1.43 8.5 8.83 15 17.73 15s16.29-6.5 17.73-15h14.46c4.03 0 7.77-1.82 10.25-5 2.48-3.18 3.34-7.24 2.37-11.15L97.97 47.53C94.07 31.91 80.1 21 64 21S33.93 31.91 30.03 47.53L19.2 90.85zM64 116c-5.58 0-10.27-3.83-11.61-9h23.21C74.27 112.17 69.58 116 64 116zM64 27c13.34 0 24.92 9.04 28.15 21.98l10.83 43.32c.53 2.11.06 4.29-1.27 6.01-1.34 1.71-3.35 2.69-5.52 2.69H31.81c-2.17 0-4.18-.98-5.52-2.69-1.34-1.71-1.8-3.9-1.27-6.01l10.83-43.32C39.08 36.04 50.66 27 64 27z"></path>
                        {notificationCount > 0 &&
                        <text x="12" y="14" fontSize="12" fill="red" textAnchor="middle">{notificationCount}</text>
                        }
          </svg>
                    </div>
                }>
                    {items.map((item, index) => (
                        <Dropdown.Item key={index}>
                            <pre className="bg-green-600 p-2 w-auto rounded-2xl flex flex-row space-x-2">
                                <span className="text-white font-bold">{item}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="black" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 13.85307 19.369262 15.55056 18.318359 16.904297 L 7.0957031 5.6816406 C 8.4494397 4.6307377 10.14693 4 12 4 z M 5.6816406 7.0957031 L 16.904297 18.318359 C 15.55056 19.369262 13.85307 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 10.14693 4.6307377 8.4494397 5.6816406 7.0957031 z" />
                                </svg>
                            </pre>
                        </Dropdown.Item>
                    ))}
                </Dropdown>
                <div className="mode p-1 mt-[1px] mr-1" onClick={() => {
                    setTheme(colorTheme);
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 4000 4000" style={{ display: colorTheme === "dark" ? 'block' : "none" }}>
                        <path d="M2000 1320A680 680 0 102000 2680 680 680 0 102000 1320zM2000 1047.95c-75.105 0-136-60.895-136-136V776c0-75.105 60.895-136 136-136s136 60.895 136 136v135.95C2136 987.056 2075.105 1047.95 2000 1047.95zM2769.383 1366.634c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.125 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C2839.043 1353.353 2804.18 1366.634 2769.383 1366.634zM3224 2136h-135.934c-75.105 0-136-60.895-136-136s60.895-136 136-136H3224c75.105 0 136 60.895 136 136S3299.105 2136 3224 2136zM2865.473 3001.506c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C2935.066 2988.241 2900.27 3001.506 2865.473 3001.506zM2000 3360c-75.105 0-136-60.895-136-136v-135.95c0-75.105 60.895-136 136-136s136 60.895 136 136V3224C2136 3299.105 2075.105 3360 2000 3360zM1134.527 3001.506c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.158 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C1204.188 2988.208 1169.324 3001.506 1134.527 3001.506zM911.934 2136H776c-75.105 0-136-60.895-136-136s60.895-136 136-136h135.934c75.105 0 136 60.895 136 136S987.039 2136 911.934 2136zM1230.617 1366.634c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C1300.211 1353.369 1265.414 1366.634 1230.617 1366.634z"></path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 24 24" style={{ display: colorTheme === "light" ? 'block' : "none" }}>
                        <path fill="white" d="M12.07,21A9,9,0,0,1,11,3a1,1,0,0,1,.83,1.7A5.93,5.93,0,0,0,10.05,9a6,6,0,0,0,6.06,6A6.13,6.13,0,0,0,19,14.25a1,1,0,0,1,1.4,1.27A9.07,9.07,0,0,1,12.07,21ZM8.69,5.79a7,7,0,1,0,8.4,11.13,7.93,7.93,0,0,1-1,.06A8,8,0,0,1,8.69,5.79Z"></path>
                    </svg>
                </div>
                <TextInput theme={colorSettings} rightIcon={SearchIcon} color="gray" type="text" placeholder="Search" />
            </div>
        </div>
    )
}

export default NavbarComponent;