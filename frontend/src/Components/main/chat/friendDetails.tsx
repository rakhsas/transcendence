import { useState } from "react";
import { messageUser } from "../../../model/messageUser.model";
import { Dropdown } from "flowbite-react";
import ModalComponent from "../../../utils/modal.component";
import { messages } from "../../../utils/data";
import User from "../../../model/user.model";
import { useNavigate } from "react-router-dom";

type DetailsAreaProps = {
    MESSAGES: any;
    selectedMessageIndex: string;
    handleSelectedColor: (color: string) => void;
    selectedColor: string;
    modalPicPath: string;
    isModalOpen: boolean;
    onCloseModal: () => void;
    onOpenModal: (picPath: string) => void;
    getMessageFriend: (message: messageUser) => User;
    handleOpenDetails: () => void
}
function DetailsArea({
    MESSAGES,
    selectedMessageIndex,
    handleSelectedColor,
    selectedColor,
    modalPicPath,
    isModalOpen,
    onCloseModal,
    onOpenModal,
    getMessageFriend,
    handleOpenDetails
}: DetailsAreaProps) {
    const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;

    if (!MESSAGES) {
        return null;
    }
    const navigate = useNavigate();
    const messageData = getMessageFriend(MESSAGES[selectedMessageIndex]);
    // console.log("messageData222: ", MESSAGES[selectedMessageIndex]);
    // console.log(isModalOpen, modalPicPath, selectedMessageIndex, latestMessages[selectedMessageIndex])
    return (
        <>
            {
                !MESSAGES ? null :
                <div className="detail-area shrink-0 border-l-[1px] border-gray-700 ml-auto flex flex-col overflow-auto">
                        <div className="detail-area-header">
                            <div className="msg-profile group" onClick={handleOpenDetails}>
                                <img src={baseAPIUrl + messageData.picture} alt="" />
                            </div>
                            <div className="font-onest text-xl capitalize text-black dark:text-white">{messageData.username}</div>
                        </div>
                        <div className="options flex flex-row items-center justify-around p-4 overflow-hidden">
                            <div className="item flex justify-between flex-col items-center space-y-1" onClick={() => navigate(`/dashboard/profile/${messageData.id}`)}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="29" height="29" viewBox="0 0 512 512" className="fill-black dark:fill-white">
                                    <path d="M257 232c-43.009 0-78-34.991-78-78s34.991-78 78-78c43.01 0 78 34.991 78 78S300.01 232 257 232zM257 96c-31.981 0-58 26.019-58 58s26.019 58 58 58 58-26.019 58-58S288.981 96 257 96zM410 420c-5.522 0-10-4.478-10-10v-93.178C400 288.799 377.201 266 349.178 266H164.822C136.799 266 114 288.799 114 316.822V410c0 5.522-4.477 10-10 10s-10-4.478-10-10v-93.178C94 277.771 125.771 246 164.822 246h184.355C388.229 246 420 277.771 420 316.822V410C420 415.522 415.522 420 410 420z"></path>
                                </svg>
                                <span className="font-onest text-xs capitalize text-black dark:text-white"> Profile </span>
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
export default DetailsArea;
