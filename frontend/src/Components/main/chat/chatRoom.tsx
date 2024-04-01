import React, { useEffect, useRef, useState } from "react";
import User from "../../../model/user.model";
import LoadingComponent from "../../shared/loading/loading";
import ModalComponent from "../../../utils/modal.component";
import { Socket } from "socket.io-client";

interface props {
    roomMessages: any[],
    userData: any[],
    channelId: number,
    roomMembers: any[],
    isModalOpen: any;
    onOpenModal: any;
    onCloseModal: any;
    modalPicPath: any;
    setRoomMessages: any;
    socketChat: any;
}

const ChatRoom: React.FC<props> = ({ roomMessages, userData, channelId, roomMembers, isModalOpen, onOpenModal, onCloseModal, modalPicPath, setRoomMessages, socketChat }) => {
    const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
    const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
    const audioRefs: any = useRef([] as HTMLAudioElement[]);
    const messagesRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    useEffect(() => {
        if (messagesRef.current)
        scrollToBottom(messagesRef.current!);
    }, [channelId, userData, roomMessages, roomMembers, setRoomMessages]);
    const scrollToBottom = (element: HTMLElement) => {
        console.log("element", element);
        element.scrollTop = element.scrollHeight;
    };
    if (!roomMessages || !userData || !channelId || !roomMembers)
        return <LoadingComponent />;
    socketChat?.on('channelMessage', async (data: any) => {
        const newMessage = [...roomMessages];
        newMessage.push(data);
        setRoomMessages(newMessage);
        scrollToBottom(messagesRef.current!);
    })
    return (
        <div className="" ref={messagesRef}>
            {
                roomMessages.length > 0 && roomMessages?.map((message: any, index) => {
                    const sender: User = roomMembers.find((member: any) => (member.user.id === message.senderId))?.user;
                    if (!sender)
                        return <LoadingComponent />
                    if (message.message.length > 0) {
                        return (
                            <div className="p-4" key={index}>
                                <div className={`flex items-start gap-2.5 ${message.senderId === userData[0].id ? 'owner' : 'reciever'}`}>
                                    <img className="w-8 h-8 object-cover rounded-full" src={sender.picture} alt="Jese image" />
                                    <div className="flex message flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl">
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{sender.firstName + ' ' + sender.lastName}</span>
                                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(message.date).toLocaleString('en-MA', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.message}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    else if (message.img.length > 0) {
                        return (
                            <div className="p-4" key={index}>
                                <div className={`flex items-start gap-2.5 ${message.senderId === userData[0].id ? 'owner' : 'reciever'}`}>
                                    <img className="w-8 h-8 object-cover rounded-full" src={sender.picture} alt="" />
                                    <div className="flex flex-col gap-1">
                                        <div className="flex message flex-col w-full max-w-[326px] leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{sender.firstName + ' ' + sender.lastName}</span>
                                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(message.date).toLocaleString('en-MA', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="group relative my-2.5">
                                                <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                    <button onClick={() => onOpenModal(baseAPIUrl + message.img || '')} className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50">
                                                        <svg className="w-5 h-5 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5"/>
                                                        </svg>
                                                    </button>
                                                    <div id="download-image" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                                        full-screen view
                                                        <div className="tooltip-arrow" data-popper-arrow></div>
                                                    </div>
                                                </div>
                                                <img src={baseAPIUrl + message.img} className="rounded-lg" />
                                            </div>
                                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
                                            {isModalOpen && <ModalComponent picPath={modalPicPath} status={isModalOpen} onClose={onCloseModal} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (message.audio && message.audio.length > 0) {
                        isPlaying[index] = false;
                        return (
                            <div className="p-4" key={index}>
                                <div className={`flex items-start gap-2.5 ${message.senderId === userData[0].id ? 'owner' : 'reciever'}`}>
                                    <img className="w-8 h-8 object-cover rounded-full" src={sender.picture} alt="" />
                                    <div className="flex message flex-col gap-2.5 w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{sender.firstName + ' ' + sender.lastName}</span>
                                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(message.date).toLocaleString('en-MA', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <audio ref={(el) => (audioRefs[index] = el)} src={baseAPIUrl + message.audio} />
                                            <button onClick={() => {
                                                // if (!audioRefs[index]) return;
                                                if (audioRefs[index].paused) {
                                                    audioRefs[index].play();
                                                } else {
                                                    audioRefs[index].pause();
                                                }
                                                console.log("isPlaying[index] before update", isPlaying[index]);
                                                setIsPlaying((prevIsPlaying: boolean[]) => {
                                                    const temp = [...prevIsPlaying];
                                                    temp[index] = !temp[index];
                                                    console.log("temp[index]", temp[index]);
                                                    return temp;
                                                });

                                            }} className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600" type="button">
                                                <svg className={`w-4 h-4 text-gray-800 dark:text-white ${isPlaying[index] ? 'block' : 'hidden'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 16">
                                                    <path d="M3 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm7 0H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z" />
                                                </svg>
                                                <svg className={`w-4 h-4 text-gray-800 dark:text-white ${isPlaying[index] ? 'hidden' : 'block'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 18V6l8 6-8 6Z" />
                                                </svg>
                                            </button>
                                            {/* </React.Fragment> */}
                                            <svg aria-hidden="true" className="w-[145px] md:w-[185px] md:h-[40px]" viewBox="0 0 185 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect y="17" width="3" height="6" rx="1.5" fill="#6B7280" className="dark:fill-white" />
                                                <rect x="7" y="15.5" width="3" height="9" rx="1.5" fill="#6B7280" className="dark:fill-white" />
                                                <rect x="21" y="6.5" width="3" height="27" rx="1.5" fill="#6B7280" className="dark:fill-white" />
                                                <rect x="14" y="6.5" width="3" height="27" rx="1.5" fill="#6B7280" className="dark:fill-white" />
                                                <rect x="28" y="3" width="3" height="34" rx="1.5" fill="#6B7280" className="dark:fill-white" />
                                                <rect x="35" y="3" width="3" height="34" rx="1.5" fill="#6B7280" className="dark:fill-white" />
                                                <rect x="42" y="5.5" width="3" height="29" rx="1.5" fill="#6B7280" className="dark:fill-white" />
                                                <rect x="49" y="10" width="3" height="20" rx="1.5" fill="#6B7280" className="dark:fill-white" />
                                                <rect x="56" y="13.5" width="3" height="13" rx="1.5" fill="#6B7280" className="dark:fill-white" />
                                                <rect x="63" y="16" width="3" height="8" rx="1.5" fill="#6B7280" className="dark:fill-white" />
                                                <rect x="70" y="12.5" width="3" height="15" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="77" y="3" width="3" height="34" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="84" y="3" width="3" height="34" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="91" y="0.5" width="3" height="39" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="98" y="0.5" width="3" height="39" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="105" y="2" width="3" height="36" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="112" y="6.5" width="3" height="27" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="119" y="9" width="3" height="22" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="126" y="11.5" width="3" height="17" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="133" y="2" width="3" height="36" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="140" y="2" width="3" height="36" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="147" y="7" width="3" height="26" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="154" y="9" width="3" height="22" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="161" y="9" width="3" height="22" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="168" y="13.5" width="3" height="13" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="175" y="16" width="3" height="8" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="182" y="17.5" width="3" height="5" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500" />
                                                <rect x="66" y="16" width="8" height="8" rx="4" fill="#1C64F2" />
                                            </svg>
                                            <span className="inline-flex self-center items-center p-2 text-sm font-medium text-gray-900 dark:text-white">s</span>
                                        </div>
                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}
export default ChatRoom;