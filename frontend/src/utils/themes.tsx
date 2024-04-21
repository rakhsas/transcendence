import { CustomFlowbiteTheme } from "flowbite-react";

const inputTheme: CustomFlowbiteTheme["textInput"] = {
    base: "flex",
    field: {
        input: {
            colors: {
                primary:
                    "dark:bg-zinc-900 bg-neutral-100 focus:text-black dark:focus:text-white text-gray-200 focus:border-black placeholder-gray-700 focus:border-1 focus:ring-0 dark:focus:border-white",
            },
        },
    },
};
const tabsTheme: CustomFlowbiteTheme["tabs"] = {
    base: "flex flex-col gap-2",
    tablist: {
        tabitem: {
            // "base": "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 h-[80px]",
            base: "flex items-center justify-center p-4 rounded-t-lg text-red-500 text-sm font-poppins first:ml-0 h-[80px]",
            styles: {
                underline: {
                    active: {
                        on: "text-main-light-FERN active",
                        off: "text-gray-400 hover:border-gray-300 hover:text-gray-600"        
                    }
                }
            },
        },
        base: "flex flex-row gap-2 overflow-hidden",
    },
    tabpanel: "py-3",
    
};

export {
    inputTheme,
    tabsTheme
}