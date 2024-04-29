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
			base: "border-0 ring-0 relative flex",
			input: {
				base: "block bg-white dark:bg-zinc-800 text-black dark:text-white focus:border-4 border-2 border-main-light-FERN focus:border-main-light-FERN dark:border-main-light-EGGSHELL focus:ring-0",
                colors: {
                    primary: "w-full border-main-light-FERN focus:border-main-light-PUMPKIN dark:border-main-light-EGGSHELL focus:border-main-light-EGGSHELL",
                }
            },
		}
	},
    select: {
        base: "block bg-white dark:bg-zinc-800 text-black dark:text-white focus:border-0 border-0 border-main-light-FERN focus:border-main-light-FERN dark:border-main-light-EGGSHELL focus:ring-0",
        field: {
            base: "border-0 ring-0 relative flex",
            select: {
                base: "block bg-white dark:bg-zinc-800 text-black dark:text-white focus:border-4 border-2 border-main-light-FERN focus:border-main-light-FERN dark:border-main-light-EGGSHELL focus:ring-0",
                colors: {
                    primary: "w-full border-main-light-FERN focus:border-main-light-PUMPKIN dark:border-main-light-EGGSHELL focus:border-main-light-EGGSHELL",
                }
            },
        }
    },
	label: {
	},
    modal: {
        header: {
            base: "flex justify-between place-self-center w-full items-center text-center dark:bg-main-light-EGGSHELL bg-main-light-FERN text-white font-poppins p-4",
            title: "text-white justify-items-end text-center text-white font-poppins",
            close: {
                base: "-mr-1 flex rounded-lg p-1.5 text-sm dark:text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
                icon: "w-5 h-5"
            }
        }
    },
    tabs: {
        
    }
};
export {
    theme,
    customTheme
}