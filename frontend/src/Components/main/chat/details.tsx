import { useState } from "react";
import { messageUser } from "../../../model/messageUser.model";
import { Dropdown } from "flowbite-react";
import ModalComponent from "../../../utils/modal.component";
import { messages } from "../../../utils/data";
import User from "../../../model/user.model";

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
    getMessageFriend
}: DetailsAreaProps) {
    if (!MESSAGES) {
        return null;
    }
    const messageData = getMessageFriend(MESSAGES[selectedMessageIndex]);
    // console.log("messageData222: ", MESSAGES[selectedMessageIndex]);
    // console.log(isModalOpen, modalPicPath, selectedMessageIndex, latestMessages[selectedMessageIndex])
    return (
        <>
                {
                    !MESSAGES ? null :
                    <div>
                        <div className="detail-area-header">
                            <div className="msg-profile group">
                                <img src={messageData.picture} alt="" />
                            </div>
                            <div className="font-onest text-xl capitalize text-black dark:text-white">{messageData.username}</div>
                        </div>
                        <div className="options flex flex-row items-center justify-around p-4 overflow-hidden">
                            <div className="item flex justify-between flex-col items-center space-y-1">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="29" height="29" viewBox="0 0 512 512" className="fill-black dark:fill-white">
                                    <path d="M257 232c-43.009 0-78-34.991-78-78s34.991-78 78-78c43.01 0 78 34.991 78 78S300.01 232 257 232zM257 96c-31.981 0-58 26.019-58 58s26.019 58 58 58 58-26.019 58-58S288.981 96 257 96zM410 420c-5.522 0-10-4.478-10-10v-93.178C400 288.799 377.201 266 349.178 266H164.822C136.799 266 114 288.799 114 316.822V410c0 5.522-4.477 10-10 10s-10-4.478-10-10v-93.178C94 277.771 125.771 246 164.822 246h184.355C388.229 246 420 277.771 420 316.822V410C420 415.522 415.522 420 410 420z"></path>
                                </svg>
                                <span className="font-onest text-xs capitalize text-black dark:text-white"> Profile </span>
                            </div>
                            <div className="item flex justify-between flex-col items-center space-y-1">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="29" height="29" viewBox="0 0 50 50" className="fill-black dark:fill-white">
                                    <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
                                </svg>
                                <span className="text-black dark:text-white font-onest text-xs capitalize"> Search </span>
                            </div>
                            <Dropdown label="" dismissOnClick={false} placement="bottom" className="w-28" renderTrigger={() =>
                                <div className="item flex justify-between flex-col space-y-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="29" height="29" viewBox="0 0 4000 4000" className="fill-black dark:fill-white">
                                        <path d="M2000 1660A340 340 0 102000 2340 340 340 0 102000 1660zM2952 1660A340 340 0 102952 2340 340 340 0 102952 1660zM1048 1660A340 340 0 101048 2340 340 340 0 101048 1660z"></path>
                                    </svg>
                                    <span className="text-black dark:text-white font-onest text-xs capitalize"> Options</span>
                                </div>
                            }>
                                <Dropdown.Item>
                                    <span className="mr-2 text-red-600 font-poppins"> Block </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24" >
                                        <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 13.85307 19.369262 15.55056 18.318359 16.904297 L 7.0957031 5.6816406 C 8.4494397 4.6307377 10.14693 4 12 4 z M 5.6816406 7.0957031 L 16.904297 18.318359 C 15.55056 19.369262 13.85307 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 10.14693 4.6307377 8.4494397 5.6816406 7.0957031 z" fill="red"></path>
                                    </svg>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <span className="mr-2 text-red-600 font-normal"> Block </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24" >
                                        <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 13.85307 19.369262 15.55056 18.318359 16.904297 L 7.0957031 5.6816406 C 8.4494397 4.6307377 10.14693 4 12 4 z M 5.6816406 7.0957031 L 16.904297 18.318359 C 15.55056 19.369262 13.85307 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 10.14693 4.6307377 8.4494397 5.6816406 7.0957031 z" fill="red"></path>
                                    </svg>
                                </Dropdown.Item>
                            </Dropdown>
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
                }
        </>
    );
}
export default DetailsArea;
