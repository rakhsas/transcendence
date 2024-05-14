import React, { useContext, useEffect, useRef, useState } from "react";
import User from "../../../model/user.model";
import ModalComponent from "../../../utils/modal.component";
import { Dropdown } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import AudioVisualizer from "./audioVisualiser";
import DataContext from "../../../services/data.context";
import LoadingComponent from "../../shared/loading/loading";
import { Socket } from "socket.io-client";
type props = {
    MESSAGES: any[];
    userData: any;
    selectedMessageIndex: any;
    getMessageFriend: any;
    isModalOpen: any;
    onOpenModal: any;
    onCloseModal: any;
    modalPicPath: any;
    socketChat: any;
    getFriend: any;
    friendId: string;
    setMESSAGES: any;
}
const ChatAreaComponent: React.FC<props> = ({ MESSAGES, userData, isModalOpen, onOpenModal, onCloseModal, modalPicPath, socketChat, getFriend, friendId, setMESSAGES }) => {
    const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
    const userDat = useContext(DataContext);
    const [socket, setSocket] = useState<Socket>();
    const navigate = useNavigate();
	const messagesRef = useRef<HTMLDivElement>(null);
    const [messageStates, setMessageStates] = useState<boolean[]>([]);
    const scrollToBottom = (element: HTMLElement) => {
		element.scrollTop = element.scrollHeight;
	};
    useEffect(() => {
        setSocket(userDat[1]);
    }, [userDat]);
    // useEffect(() => {
		// if (messagesRef.current)
		// 	scrollToBottom(messagesRef.current!);
	// }, [MESSAGES, messagesRef]);
    const handleInviteOneVsOne = (friendId: string, userId: string) => {
        socketChat?.emit('inviteOneVsOne', { userId, friendId});
        navigate('/dashboard/gameRoom/' + friendId);
    }
    useEffect(() => {
    const messageStates = MESSAGES.map((message: any) => {
            return message.message.length > 0 || message.img || message.audio ? true : false;
        });
        setMessageStates(messageStates);
    }, [MESSAGES]);
    const onDirectMessage = async(data: any) => {
        // console.log(data)
        if (friendId === data.senderId)
        {
        //     console.log(await data)
            const newMessage = [...MESSAGES];
            newMessage.push(data);
        //     // MESSAGES.push(data);
            setMESSAGES(newMessage);
            if (messagesRef.current)
			    scrollToBottom(messagesRef.current!);
        }
	}
   socket?.on("newMessage", onDirectMessage);
   // setLatestMessages(await messageService.latestMessages(userData[0].id))
   // useEffect(() => {
       // }, [socketChat]);
       // socketChat?.on("directMessageNotif", onDirectMessage);
       if (!MESSAGES)
           return <LoadingComponent />
       if (!userDat)
       return <LoadingComponent />
       return (
           <>
            {MESSAGES.map((message: any, index: any) => {
                const sender: User = message.senderId === userData[0].id ? userData[0] : getFriend(friendId);
                // console.log(sender, 'sender')
                if (message.message.length > 0) {
                    return (
                        <div className="p-4" key={index}>
                            <div className={`flex items-center gap-2.5 ${message.senderId === userData[0].id ? 'owner' : 'reciever'}`}>
                                <img className="w-8 h-8 object-cover self-start rounded-full" src={baseAPIUrl + sender.picture} alt="Jese image" />
                                <div className="flex message flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl">
                                    <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{sender.firstName + ' ' + sender.lastName}</span>
                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(message.date || message.createdAt).toLocaleString('en-MA', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.message}</p>
                                </div>
                                <Dropdown label={undefined}
                                renderTrigger={() => {
                                    return (
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white options" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01"/>
                                        </svg>
                                    )
                                }}>
                                {
                                    messageStates[index] && (
                                            <Dropdown.Item onClick={() => {
                                                handleInviteOneVsOne(friendId, userData[0].id);
                                                // navigate('/dashboard/gameRoom/' + reciever.id);
                                            }}>Invite One VS ONE</Dropdown.Item>
                                            )
                                        }
                                </Dropdown>
                            </div>

                        </div>
                    )
                }
                else if (message.img || message.image) {
                    const image = message.img || message.image;
                    // console.log(baseAPIUrl + image)
                    return (
                        <div className="p-4" key={index}>
                            <div className={`flex items-center gap-2.5 ${message.senderId === userData[0].id ? 'owner' : 'reciever'}`}>
                                <img className="w-8 h-8 object-cover self-start rounded-full" src={baseAPIUrl + sender.picture} alt="" />
                                <div className="flex flex-row-reverse items-center gap-1">
                                    <div className="flex message flex-col w-full max-w-[326px] leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl">
                                        <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse mb-2">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{sender.firstName + ' ' + sender.lastName}</span>
                                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(message.date).toLocaleString('en-MA', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="group relative my-2.5">
                                            <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                <button onClick={() => onOpenModal(baseAPIUrl + image)} className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50">
                                                    {/* <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3" />
                                                    </svg> */}
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
                                        {isModalOpen && <ModalComponent picPath={modalPicPath} status={isModalOpen} onClose={onCloseModal} />}
                                    </div>
                                    <Dropdown label={undefined} renderTrigger={() => {
                                        return (
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white options" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01"/>
                                            </svg>
                                        )
                                    }}>
                                    {
                                        messageStates[index] && (
                                            <Dropdown.Item onClick={() => {
                                                handleInviteOneVsOne(friendId, userData[0].id);
                                                // navigate('/dashboard/gameRoom/' + reciever.id);
                                            }}>Invite One VS ONE</Dropdown.Item>
                                            )
                                            }
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    )
                }
                else if (message.audio && message.audio.length > 0) {
                    return (
                        <div className="p-4" key={index}>
                            <div className={`flex items-center gap-2.5 ${message.senderId === userData[0].id ? 'owner' : 'reciever'}`}>
                                <img className="w-8 h-8 object-cover self-start rounded-full" src={baseAPIUrl + sender.picture} alt="" />
                                <div className="flex message flex-col gap-2.5 w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                                    <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{sender.firstName + ' ' + sender.lastName}</span>
                                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{new Date(message.date).toLocaleString('en-MA', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <AudioVisualizer audioSrc={baseAPIUrl + message.audio} />
                                </div>
                                <Dropdown label={undefined} renderTrigger={() => {
                                    return (
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white options" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01"/>
                                        </svg>
                                    )
                                }}>
                                {
                                    messageStates[index] && (
                                            <Dropdown.Item onClick={() => {
                                                handleInviteOneVsOne(friendId, userData[0].id);
                                            }}>Invite One VS ONE</Dropdown.Item>
                                            )
                                }
                                </Dropdown>
                            </div>
                        </div>
                    )
                }
            })}
        </>
    )
}

export default ChatAreaComponent;