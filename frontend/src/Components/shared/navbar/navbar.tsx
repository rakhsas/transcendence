import { useContext } from "react";
import "./navbar.css"
import { CustomFlowbiteTheme, Label, TextInput, Textarea } from 'flowbite-react';
import DataContext from "../../../services/data.context";

const SearchIcon = () => (
    <svg fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
);

const colorSettings : CustomFlowbiteTheme['textInput'] = {
    field: {
        base: "relative w-full rounded-full",
        input: {
            colors: {
                primary: 'bg-neutral-500 text-white border-neutral-500',
                gray: "focus:border-none focus:ring-0 border-none placeholder-gray-400 bg-neutral-700 border-gray-300 text-white",
            },
        }
    }
}

function NavbarComponent(): JSX.Element {
    const userData = useContext(DataContext);
    return (
        <div className="p-8 flex flex-row justify-between">
            <div className="heading mt-2">
                <span className="text-[#585a6b] text-xl font-bold subpixel-antialiased font-poppins">Good Evening,<span className="text-white uppercase font-poppins"> {userData ? userData.username: 'User'}</span></span>
            </div>
            <div className="max-w-md pl-4">
                <TextInput theme={colorSettings} rightIcon={SearchIcon} color="gray" type="text" placeholder="Search" />
            </div>
        </div>
    )
}

export default NavbarComponent;