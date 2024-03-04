import { CustomFlowbiteTheme } from "flowbite-react";

const inputTheme: CustomFlowbiteTheme["textInput"] = {
    base: "flex",
    field: {
        input: {
            colors: {
                primary:
                    "bg-zinc-900 text-gray-200 placeholder-gray-700 focus:border-1 focus:border-white",
            },
        },
    },
};
const tabsTheme: CustomFlowbiteTheme["tabs"] = {
    tablist: {
        tabitem: {
            base: "flex items-center justify-center p-4 rounded-t-lg text-red-500 text-sm font-poppins first:ml-0",
            styles: {
                underline: {
                    active: {
                        on: "text-main-light-FERN active",
                        off: "text-gray-400 hover:border-gray-300 hover:text-gray-600"        
                    }
                }
            }
        }
    }
    
};

export {
    inputTheme,
    tabsTheme
}