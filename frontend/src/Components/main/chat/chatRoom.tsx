import React, { useEffect, useRef, useState } from "react";
import User from "../../../model/user.model";
import LoadingComponent from "../../shared/loading/loading";
import ModalComponent from "../../../utils/modal.component";
import AudioVisualizer from "./audioVisualiser";

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
    // const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
    // const audioRefs: any = useRef([] as HTMLAudioElement[]);
    const messagesRef = useRef<HTMLDivElement>(null);
    // const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    useEffect(() => {
        if (messagesRef.current)
        scrollToBottom(messagesRef.current!);
    }, [channelId, userData, roomMessages, roomMembers, setRoomMessages]);
    const scrollToBottom = (element: HTMLElement) => {
        element.scrollTop = element.scrollHeight;
    };
    if (!roomMessages || !userData || !channelId || !roomMembers)
        return <LoadingComponent />;
    socketChat?.on('channelMessage', async (data: any) => {
        const newMessage = [...roomMessages];
        newMessage.push(data);
        setRoomMessages(newMessage);
        if (messagesRef.current)
            scrollToBottom(messagesRef.current!);
    })
    
    return (
        <div className=""  ref={messagesRef}>
            {
                roomMessages.length > 0 && roomMessages?.map((message: any, index: any) => {
                    console.log(roomMessages)
                    let sender: User = roomMembers.find((member: any) => (member.user.id === message.senderId))?.user
                    // if (!sender)
                    //     return <LoadingComponent key={index}/>
                    if (message.message && message.message.length > 0) {
                        return (
                            <div className="p-4" key={index}>
                                <div className={`flex items-start gap-2.5 ${message.senderId === userData[0].id ? 'owner' : 'reciever'}`}>
                                    <img className="w-8 h-8 object-cover rounded-full" src={sender ? baseAPIUrl + sender?.picture : 'https://i.pinimg.com/736x/8b/11/a8/8b11a86980c64720a41ec22332a83115.jpg'} alt="Jese image" />
                                    <div className="flex message flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl">
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{sender ? sender?.firstName + ' ' + sender?.lastName : 'Pingpong User'}</span>
                                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(message.date).toLocaleString('en-MA', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.message}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    else if (message.img && message.img.length > 0) {
                        return (
                            <div className="p-4" key={index}>
                                <div className={`flex items-start gap-2.5 ${message.senderId === userData[0].id ? 'owner' : 'reciever'}`}>
                                    <img className="w-8 h-8 object-cover rounded-full" src={sender ? baseAPIUrl + sender?.picture : 'https://i.pinimg.com/736x/8b/11/a8/8b11a86980c64720a41ec22332a83115.jpg'} alt="" />
                                    <div className="flex flex-col gap-1">
                                        <div className="flex message flex-col w-full max-w-[326px] leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl">
                                            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{sender ? sender?.firstName + ' ' + sender?.lastName : 'Pingpong User'}</span>
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
                        return (
                            <div className="p-4" key={index}>
                                <div className={`flex items-start gap-2.5 ${message.senderId === userData[0].id ? 'owner' : 'reciever'}`}>
                                    <img className="w-8 h-8 object-cover rounded-full" src={sender ? baseAPIUrl + sender?.picture : 'https://i.pinimg.com/736x/8b/11/a8/8b11a86980c64720a41ec22332a83115.jpg'} alt="" />
                                    <div className="flex message flex-col gap-2.5 w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{sender ? sender?.firstName + ' ' + sender?.lastName : 'Pingpong User'}</span>
                                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(message.date).toLocaleString('en-MA', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <AudioVisualizer audioSrc={baseAPIUrl + message.audio} />
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