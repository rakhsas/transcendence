import { CustomFlowbiteTheme } from "flowbite-react";
import { useEffect, useState } from "react";

function theme() {
    const [theme, setTheme] = useState(localStorage.theme);
    const colorTheme = theme === 'dark' ? 'light' : 'dark';

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);
        root.classList.add(theme);

        localStorage.setItem('theme', theme);

    }, [theme, setTheme]);
    return [colorTheme, setTheme];
}

const customTheme: CustomFlowbiteTheme = {
	textInput: {
		field: {
			base: "border-0 ring-0",
			input: {
				base: "bg-white  dark:bg-zinc-800 text-black dark:text-white focus:border-4 border-2 border-main-light-FERN focus:border-main-light-FERN dark:border-main-light-EGGSHELL focus:ring-0",
			}
		}
	},
	label: {
		
	},
    modal: {
        header: {
            base: "flex justify-center items-center text-center dark:bg-main-light-EGGSHELL bg-main-light-FERN text-white font-poppins",
            title: "text-white justify-items-end text-center text-white",
            close: {
                base: "hidden",
                icon: ""
            }
        }
    }
};
export {
    theme,
    customTheme
}