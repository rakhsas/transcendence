import "./navbar.css"
import HomeIcon from '../icons/Home';
// import IconButton from '@mui/material/IconButton';
// import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
// import Badge from '@mui/material/Badge';
// import MenuItem from '@mui/material/MenuItem';

// import { Avatar, Dropdown, Navbar } from 'flowbite-react';
function NavbarComponent(): JSX.Element {

    return (
        <div className="flex justify-between items-center h-20 lg:px-8 xs:mx-4 xs:gap-1 relative">
            <div className="scale-100 Side lg:w-[25%] md:w-[50%] h-12 rounded-[20px] border-2">
                <div className="h-full bg-[#2C2729] rounded-xl top-0 left-0 right-0 bottom-0 flex flex-wrap justify-center items-center">
                    <div className="bg-transparent flex flex-row items-center">
                        <input type="search" name="q" className="mr-9 placeholder:text-white border-transparent focus:ring-transparent focus:border-transparent bg-transparent text-white py-2 text-sm rounded-md" placeholder="Search..." autoComplete="off"></input>
                        <span className="relative inset-y-0 left-0  pl-2 bg-transparent">
                            <button type="submit" className="p-1">
                                <svg fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
            <div className="icons">
                <div className="w-full flex flex-column gap-2 justify-between items-center ">
                    <div className="rounded-lg cursor-pointer">
                        <HomeIcon activeIndex={0} />
                    </div>
                    {/* <div className="rounded-lg cursor-pointer">
                        <HomeIcon activeIndex={0} />
                    </div> */}
                    {/* <div className="rounded-lg cursor-pointer">
                        <HomeIcon activeIndex={1} />
                    </div> */}
                    {/* <div className="notification h-full">
                        <MenuItem>
                            <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="default"
                            >
                            <Badge badgeContent={17} color="error">
                                <NotificationsNoneOutlinedIcon />
                            </Badge>
                            </IconButton>
                        </MenuItem>
                    </div> */}
                </div>
            </div>
            
        </div>
    )
}

export default NavbarComponent;