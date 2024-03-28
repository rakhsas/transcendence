import { useEffect, useState } from "react";
import { Checkbox, Dropdown, TextInput } from "flowbite-react";
import ModalComponent from "../../../utils/modal.component";
import User from "../../../model/user.model";
import UserService from "../../../services/user.service";
import { Search } from "@mui/icons-material";
import { inputTheme } from "../../../utils/themes";
import { Socket } from "socket.io-client";

type DetailsAreaProps = {
    channelInfo: any;
    selectedMessageIndex: string;
    handleSelectedColor: (color: string) => void;
    selectedColor: string;
    modalPicPath: string;
    isModalOpen: boolean;
    onCloseModal: () => void;
    onOpenModal: (picPath: string) => void;
    handleOpenDetails: () => void,
    userData: any,
    chatSocket: any,
}
const search: any = () => (
    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
    </svg>
)

const RoomDetails: React.FC<DetailsAreaProps> = ({
    channelInfo,
    selectedMessageIndex,
    handleSelectedColor,
    selectedColor,
    modalPicPath,
    isModalOpen,
    onCloseModal,
    onOpenModal,
    handleOpenDetails,
    userData,
    chatSocket
}) => {
    const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
    if (!channelInfo) {
        return null;
    }
    const [isdropdownUsersOpen, setDropdownUsersStatus] = useState<boolean>(false);
    const [userInput, setUserInput] = useState<string>('');
    const [users, setUsers] = useState<any[]>();
    const [filtredUsers, setFiltredUsers] = useState<any[]>();
    const userService = new UserService();
    useEffect(() => {
        const fetchUsers = async () => {
            const users = await userService.getAllUsersExcept(userData[0].id);
            console.log(users);
            setUsers(users);
        }
        fetchUsers();
    }, [])
    useEffect(() => {
        if (userInput === '') {
            setFiltredUsers([]);
            return ;
        }
        const filtered = users?.filter(user => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            return fullName.includes(userInput.toLowerCase()) || user.username.toLowerCase().includes(userInput.toLowerCase());
        });
        setFiltredUsers(filtered);
    }, [userInput]);
    const addUser = async () => {
        console.log('clicked')
        users?.forEach(user => {
            if (user.selected) {
                chatSocket?.emit('joinChannel', {
                    id: channelInfo.id,
                    __owner__: userData[0].id,
                    role: 'MEMBER'
                })
            }
        });
    };

    chatSocket?.on('channelJoined', (data) => {
        console.log('channelJoined')
    })
    chatSocket?.on('channelError', (data) => {
        console.log('channelError')
    })
    // console.log('users', users)
    return (
        <>
            {
                !channelInfo ? null :
                    <div className="detail-area shrink-0 border-l-[1px] border-gray-700 ml-auto flex flex-col overflow-auto">
                        <div className="detail-area-header">
                            <div className="msg-profile group" onClick={handleOpenDetails}>
                                <img src={baseAPIUrl + channelInfo.picture} alt="" />
                            </div>
                            <div className="font-onest text-xl capitalize text-black dark:text-white">{channelInfo.name}</div>
                        </div>
                        <div className="options flex flex-row items-center justify-around p-4 overflow-hidden">
                            <div className="item flex justify-between flex-col items-center space-y-1 cursor-pointer" onClick={() => setDropdownUsersStatus(!isdropdownUsersOpen)}>
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <span className="text-black dark:text-white font-onest text-xs capitalize"> Add Member </span>
                            </div>
                            <Dropdown label="" dismissOnClick={false} placement="bottom" renderTrigger={() =>
                                <div className="item flex items-center flex-col space-y-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="29" height="29" viewBox="0 0 4000 4000" className="fill-black dark:fill-white">
                                        <path d="M2000 1660A340 340 0 102000 2340 340 340 0 102000 1660zM2952 1660A340 340 0 102952 2340 340 340 0 102952 1660zM1048 1660A340 340 0 101048 2340 340 340 0 101048 1660z"></path>
                                    </svg>
                                    <span className="text-black dark:text-white font-onest text-xs capitalize"> Options</span>
                                </div>
                            }>
                                <Dropdown.Item>
                                    <span className="mr-2 text-red-600 font-normal"> Block </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24" >
                                        <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 13.85307 19.369262 15.55056 18.318359 16.904297 L 7.0957031 5.6816406 C 8.4494397 4.6307377 10.14693 4 12 4 z M 5.6816406 7.0957031 L 16.904297 18.318359 C 15.55056 19.369262 13.85307 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 10.14693 4.6307377 8.4494397 5.6816406 7.0957031 z" fill="red"></path>
                                    </svg>
                                </Dropdown.Item>
                            </Dropdown>
                        </div>
                        <div className={`w-auto max-w-xl h-auto ${isdropdownUsersOpen ? 'block' : 'hidden'} mx-auto`}>
                            
                            <div className="z-10 bg-white rounded-lg shadow w-60 dark:bg-zinc-950" >
                                <div className="p-3">
                                    <div className="flex max-w-md flex-col gap-4" id="checkbox">
                                        <div className="flex items-center gap-2">
                                            <TextInput type="text" theme={inputTheme} color="primary" rightIcon={search} onChange={(e) => setUserInput(e.target.value)} placeholder="Moha Ouhammo" />
                                        </div>
                                    </div>
                                </div>
                                <ul className="h-auto flex flex-col gap-2 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 w-full">
                                    {
                                        filtredUsers?.map((user, index) => (
                                            <li key={index} className="mx-2 bg-zinc-800 rounded">
                                                <div className="flex flex-row gap-2 w-full h-12 rounded justify-between items-center px-2">
                                                    <div className="pic">
                                                        <img src={user.picture} className="w-8 h-8 rounded-full" />
                                                    </div>
                                                    <div className="info">
                                                        <span className="text-sm text-gray-700 dark:text-white"> {user.firstName + ' ' + user.lastName} </span>
                                                    </div>
                                                    <Checkbox id="add-to-room" defaultChecked={users && users[index]?.selected} onChange={() => {
                                                        const user = users && [...users];
                                                        if (user && user[index])
                                                        {
                                                            user[index].selected = !users[index].selected;
                                                            setUsers(users);
                                                        }
                                                    }} />
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                                <a onClick={addUser} className="flex justify-center items-center p-3 text-sm font-medium text-green-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-green-500 hover:underline">
                                    <svg className="w-6 h-6 text-green-500 dark:text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    </svg>
                                    Delete user
                                </a>
                            </div>
                        </div>
                        <div className="theme flex flex-row">
                            <div className="pic">
                                <img src="" alt="" />
                            </div>
                            <div className="description">
                            </div>
                        </div>
                        <div className="detail-changes overflow-hidden">
                            <div className="detail-change">
                                Change Color
                                <div className="colors">
                                    <div
                                        className={`color black ${selectedColor === "black" ? "selected" : ""
                                            }`}
                                        data-color="blue"
                                        onClick={() => handleSelectedColor("black")}
                                    ></div>
                                    <div
                                        className={`color blue ${selectedColor === "blue" ? "selected" : ""
                                            }`}
                                        data-color="blue"
                                        onClick={() => handleSelectedColor("blue")}
                                    ></div>
                                    <div
                                        className={`color purple ${selectedColor === "purple" ? "selected" : ""
                                            }`}
                                        data-color="purple"
                                        onClick={() => handleSelectedColor("purple")}
                                    ></div>
                                    <div
                                        className={`color green ${selectedColor === "green" ? "selected" : ""
                                            }`}
                                        data-color="green"
                                        onClick={() => handleSelectedColor("green")}
                                    ></div>
                                    <div
                                        className={`color orange ${selectedColor === "orange" ? "selected" : ""
                                            }`}
                                        data-color="orange"
                                        onClick={() => handleSelectedColor("orange")}
                                    ></div>
                                </div>
                            </div>
                            {/* <div className="theme change flex p-2 flex-row border-b-2 justify-center">
                            Theme
                            <div className="colors">
                                <Select id="countries" required>
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>Morocco</option>
                                    <option>Germany</option>
                                </Select>
                            </div>
                        </div> */}
                        </div>
                        <div className="detail-photos">
                            <div className="detail-photo-title">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-image"
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="M21 15l-5-5L5 21" />
                                </svg>
                                Shared photos
                            </div>
                            <div className="detail-photo-grid">
                                {/* {
                                    console.log("messagedetails: ", message),
                                    MESSAGES[selectedMessageIndex].map((message, index) => (
                                        (message.img! && message.img != "") ?
                                            <div key={index} className="detail-photo"
                                                onClick={() => onOpenModal(message.img)}
                                            >
                                                <img src={message.img} alt="" />
                                            </div>
                                            : null
                                    ))
                                } */}
                                {isModalOpen && <ModalComponent picPath={modalPicPath} status={isModalOpen} onClose={onCloseModal} />}
                            </div>
                            {/* <div className="view-more">View More</div> */}
                        </div>
                    </div>
                // <div id="options" className="options">
                //     <div className="head">
                //         <div className="close icon">
                //             <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg">
                //                 <line x1="19" y1="12" x2="5" y2="12"></line>
                //                 <polyline points="12 19 5 12 12 5"></polyline>
                //             </svg>
                //         </div>
                //     </div>

                //     <div className="info">
                //         <div className="person photo">
                //             <div className="online"></div>
                //         </div>
                //         <h2 className="name">Millie</h2>
                //         <div className="buttons">
                //             <div className="button">
                //                 <div className="icon">
                //                     <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                //                         <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                //                     </svg>
                //                 </div>
                //                 <p className="title">Audio</p>
                //             </div>
                //             <div className="button">
                //                 <div className="icon">
                //                     <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                //                         <polygon points="23 7 16 12 23 17 23 7"></polygon>
                //                         <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                //                     </svg>
                //                 </div>
                //                 <p className="title">Video</p>
                //             </div>
                //             <div className="button">
                //                 <div className="icon">
                //                     <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                //                         <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                //                         <circle cx="12" cy="7" r="4"></circle>
                //                     </svg>
                //                 </div>
                //                 <p className="title">Profile</p>
                //             </div>
                //             <div className="button">
                //                 <div className="icon">
                //                     <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                //                         <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                //                         <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                //                     </svg>
                //                 </div>
                //                 <p className="title">Mute</p>
                //             </div>
                //         </div>
                //         <hr />
                //         <div className="details">
                //             <label className="search-field">
                //                 <div className="icon">
                //                     <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                //                         <circle cx="11" cy="11" r="8"></circle>
                //                         <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                //                     </svg>
                //                 </div>
                //                 <input id="search" className="search" type="text" placeholder="Search" />
                //             </label>
                //             <label className="dark-mode">
                //                 <span className="label">Dark Mode</span>
                //                 <input id="input-dark" className="input-dark" type="checkbox" />
                //                 <div className="toggle">
                //                     <div className="circle"></div>
                //                 </div>
                //             </label>
                //             <div className="theme">
                //                 <span className="label">Theme</span>
                //                 <div className="colors">
                //                     <div id="color-blue" className="color blue"></div>
                //                     <div id="color-red" className="color red"></div>
                //                     <div id="color-green" className="color green"></div>
                //                     <div id="color-purple" className="color purple"></div>
                //                 </div>
                //             </div>
                //             <div className="media">
                //                 <span className="label">
                //                     <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                //                     </svg>
                //                     <span>Shared photos</span>
                //                 </span>
                //                 <div className="photos">
                //                     <img className="img" src="https://i.imgur.com/8jqYvFL.jpeg" />
                //                     <img className="img" src="https://i.imgur.com/jlFgGpe.jpeg" />
                //                     <img className="img" src="https://i.imgur.com/BfyXuwR.gif" />
                //                 </div>
                //                 <span className="view-more">View more</span>
                //             </div>
                //         </div>
                //     </div>
                // </div>
            }

        </>
    );
}

export default RoomDetails