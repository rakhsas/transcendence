import { useEffect, useState } from "react";
import { messageUser1 } from "../../../model/messageUser.model";
import LoadingComponent from "../../shared/loading/loading";
import { ChannelService } from "../../../services/channel.service";

interface ChatFormProps {
    channelId: number;
    userData: any[];
    roomMessages: any[];
    setRoomMessages: any;
    setLstGroupMessages: any;
}
const ChatForm: React.FC<ChatFormProps> = ({channelId, userData, roomMessages, setRoomMessages, setLstGroupMessages}) => {
    const [message, setMessage] = useState('');
    if (!userData[0] || !userData[1])
        return <LoadingComponent />;
    const channelService = new ChannelService();
    const socketChat = userData[1];
    const handleTextSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const messageValue = formData.get('message') as string;
        if (!messageValue) {
            return;
        }
        const newMessage: any = {
            from: userData[0].id,
            senderId: userData[0].id,
            cid: channelId,
            message: messageValue,
            image: '',
            audio: ''
        };
        await socketChat?.emit('channelMessages', newMessage);
        setLstGroupMessages(await channelService.latestChannels(userData[0].id))
        setRoomMessages(await channelService.getChannelMessages(channelId));
        setMessage('');
    };
    // const handleImageSubmit = async (selectedFile: File) => {
    //     const formData = new FormData();
    //     formData.append('file', selectedFile);
    //     let imagePath;
    //     try {
    //         const APIURL = import.meta.env.VITE_API_AUTH_KEY;
    //         const response = await fetch(APIURL + 'upload', {
    //             method: 'POST',
    //             body: formData,
    //             credentials: 'same-origin'
    //         });
    //         if (response.ok) {
    //             imagePath = await response.json();
    //             imagePath = imagePath.url;
    //             const newMessage: messageUser1 = {
    //                 to: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
    //                 from: userData[0].id,
    //                 message: '',
    //                 image: imagePath ? imagePath : '',
    //                 senderId: userData[0].id,
    //                 recieverId: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
    //                 recieverName: getMessageFriend(MESSAGES[selectedMessageIndex]).username,
    //                 date: new Date().toISOString(),
    //                 audio: ''
    //             };
    //             socketChat?.emit('message', newMessage);
    //             handleSelectMessage(selectedMessageIndex, friendId);
    //             setMessage('');
    //             setLatestMessages(await messageService.latestMessages(userData[0].id));
    //         } else {
    //             console.error('Failed to upload image');
    //         }
    //     } catch (error) {
    //         console.error('Error uploading file:', error);
    //     }
    // };
    return (
        <form onSubmit={handleTextSubmit} className="w-full h-full m-0 px-4 flex items-center justify-center">
            <div className="field flex justify-center w-full h-full py-4 items-center gap-2 transition-all ease-in-out duration-500">
                <svg className="stroke-gray-600 dark:stroke-gray-400" fill="none" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <input value={message} name="message" onChange={(e) => setMessage(e.target.value)} color={"primary"} className="input-message w-full px-4 focus:ring-0 focus:border-b-0 focus:outline-none bg-gray-300 dark:bg-zinc-900 text-black dark:text-gray-200 py-4 rounded-full border-none outline-none placeholder-gray-500 transition-all ease-in-out duration-500" type="" placeholder="Type something..." />
                <div className={`plus flex flex-row gap-1 ${message.length > 0 ? 'hidden' : 'block'}`}>
                    {/* <div className="send text flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 dark:bg-transparent overflow-hidden" onClick={chooseFile}>
                        <svg className="stroke-gray-600 dark:stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                    </div> */}
                    {/* <div className={`send audio flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 overflow-hidden`} onClick={recording ? stopRecording : startRecording}> */}
                        {/* <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                                            <line x1="12" y1="19" x2="12" y2="23"></line>
                                                            <line x1="8" y1="23" x2="16" y2="23"></line>
                                                        </svg> */}
                        {/* {recording ? <div className="recording flex items-center justify-center w-8 h-8 rounded-full bg-red-500 overflow-hidden" /> : <div className="recording flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 overflow-hidden" />} */}
                    {/* </div> */}
                </div>
                <div className={`plus flex justify-center items-center p-1 rounded-full bg-blue-500 ${message.length > 0 ? 'block' : 'hidden'}`}>
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </div>
            </div>
        </form>
    )
}

export default ChatForm;