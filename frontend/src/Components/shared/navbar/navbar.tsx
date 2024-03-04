import { useContext, useEffect, useState } from "react";
import "./navbar.css"
import { CustomFlowbiteTheme, Label, TextInput, Textarea } from 'flowbite-react';
import DataContext from "../../../services/data.context";
// import theme from "../../../utils/theme";

const SearchIcon = () => (
    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 stroke-black dark:stroke-white"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);

const colorSettings : CustomFlowbiteTheme['textInput'] = {
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
  
    useEffect(() => {
      const root = window.document.documentElement;
      root.classList.remove(colorTheme);
      root.classList.add(theme);
  
      // save theme to local storage
      localStorage.setItem('theme', theme);
    }, [theme, colorTheme]);
    const userData = useContext(DataContext);
    return (
        <div className="p-8 flex flex-row justify-between">
            <div className="heading mt-2">
                <span className="text-[#585a6b] text-xl font-bold subpixel-antialiased font-poppins">Good Evening,<span className="dark:text-white text-black uppercase font-poppins"> {userData ? userData.username: 'User'}</span></span>
            </div>
            <div className="max-w-md pl-4 flex flex-row justify-around">
                <div className="mode p-1 mt-[1px] mr-1" onClick={() => {
                    setTheme(colorTheme);
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 4000 4000" style={{ display : colorTheme === "dark" ? 'block' : "none"}}>
                        <path d="M2000 1320A680 680 0 102000 2680 680 680 0 102000 1320zM2000 1047.95c-75.105 0-136-60.895-136-136V776c0-75.105 60.895-136 136-136s136 60.895 136 136v135.95C2136 987.056 2075.105 1047.95 2000 1047.95zM2769.383 1366.634c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.125 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C2839.043 1353.353 2804.18 1366.634 2769.383 1366.634zM3224 2136h-135.934c-75.105 0-136-60.895-136-136s60.895-136 136-136H3224c75.105 0 136 60.895 136 136S3299.105 2136 3224 2136zM2865.473 3001.506c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C2935.066 2988.241 2900.27 3001.506 2865.473 3001.506zM2000 3360c-75.105 0-136-60.895-136-136v-135.95c0-75.105 60.895-136 136-136s136 60.895 136 136V3224C2136 3299.105 2075.105 3360 2000 3360zM1134.527 3001.506c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.158 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C1204.188 2988.208 1169.324 3001.506 1134.527 3001.506zM911.934 2136H776c-75.105 0-136-60.895-136-136s60.895-136 136-136h135.934c75.105 0 136 60.895 136 136S987.039 2136 911.934 2136zM1230.617 1366.634c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C1300.211 1353.369 1265.414 1366.634 1230.617 1366.634z"></path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 24 24" style={{ display : colorTheme === "light" ? 'block' : "none"}}>
                        <path fill="white" d="M12.07,21A9,9,0,0,1,11,3a1,1,0,0,1,.83,1.7A5.93,5.93,0,0,0,10.05,9a6,6,0,0,0,6.06,6A6.13,6.13,0,0,0,19,14.25a1,1,0,0,1,1.4,1.27A9.07,9.07,0,0,1,12.07,21ZM8.69,5.79a7,7,0,1,0,8.4,11.13,7.93,7.93,0,0,1-1,.06A8,8,0,0,1,8.69,5.79Z"></path>
                    </svg>
                </div>
                <TextInput theme={colorSettings} rightIcon={SearchIcon} color="gray" type="text" placeholder="Search" />
            </div>
        </div>
    )
}

export default NavbarComponent;