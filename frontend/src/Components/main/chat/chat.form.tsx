import { useEffect, useRef, useState } from "react";
import { messageUser1 } from "../../../model/messageUser.model";
import MessageService from "../../../services/message.service";
import { ChannelService } from "../../../services/channel.service";
import MuteService from "../../../services/mute.service";

interface props {
    friendId: string,
    channelId: number,
    getFriend: any,
    userData: any,
    MESSAGES: any,
    setMESSAGES: any,
    socketChat: any,
    setLatestMessages: any,
    setLstGroupMessages: any,
    setRoomMessages: any,
    mutedUsers: any,
    handleSelectMessage: any,
    selectedMessageIndex: any,
    blockedResult: any
}
const ChatForm: React.FC<props> = ({ friendId, channelId, getFriend, userData, MESSAGES, setMESSAGES, socketChat, setLatestMessages, setLstGroupMessages, setRoomMessages, mutedUsers, handleSelectMessage, selectedMessageIndex, blockedResult }) => {
	const [isDisabled, setIsDisabled] = useState(false);
    const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
    const [messageText, setMessageText] = useState('');
	const [recording, setRecording] = useState(false);
    const messageService = new MessageService();
	const muteService = new MuteService();
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const channelService = new ChannelService();
    const handleTextSubmit = async (e: any) => {
		e.preventDefault();
		const messageValue = messageText;
		if (!messageValue || isDisabled) {
			//console.log('Message is empty');
			return;
		}
		if (friendId != '') {
			const newMessage: messageUser1 = {
				to: getFriend(friendId)!.id,
				from: userData[0].id,
				message: messageValue,
				image: null,
				senderId: userData[0].id,
				recieverId: getFriend(friendId)!.id,
				recieverName: getFriend(friendId)!.username,
				date: new Date().toISOString(),
				audio: null
			};
			socketChat?.emit('message', newMessage);
			const newMessages = [...MESSAGES, newMessage];
			setMESSAGES(newMessages);
			setMessageText('');
			setLatestMessages(await messageService.latestMessages(userData[0].id));
		} else if (channelId != -1) {
			const newMessage: any = {
				from: userData[0].id,
				senderId: userData[0].id,
				cid: channelId,
				message: messageValue,
				image: null,
				audio: null
			};
			socketChat?.emit('channelMessages', newMessage);
			setLstGroupMessages(await channelService.latestChannels(userData[0].id))
			setRoomMessages(await channelService.getChannelMessages(channelId));
			setMessageText('');
		}
	};
    useEffect(() => {
        if (blockedResult) {
            setIsDisabled(true);
            setMessageText('You Cannot Send Messages to this User');
        }
    }, [blockedResult]);
    useEffect(() => {
		const mutedUser = mutedUsers.find((object) => {
		  return object.userId === userData[0].id && new Date(object.finishedAt) > new Date();
		});
		if (mutedUser) {
		  const timeRemaining = new Date(mutedUser.finishedAt).getTime() - new Date().getTime();
		  if (timeRemaining > 0) {
			setIsDisabled(true);
			setMessageText(`You are muted for ${Math.ceil(timeRemaining / 1000)} seconds`);
	  
			const interval = setInterval(() => {
			  const remaining = new Date(mutedUser.finishedAt).getTime() - new Date().getTime();
			  if (remaining <= 0) {
				setIsDisabled(false);
				clearInterval(interval);
				setMessageText('');
			  } else {
				setMessageText(`You are muted for ${Math.ceil(remaining / 1000)} seconds`);
			  }
			}, 1000);
			return () => clearInterval(interval);
		  } else {
			setIsDisabled(false);
		  }
		}
	}, [mutedUsers, userData]);
    const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			const chunks: any = [];
			mediaRecorder.ondataavailable = (e) => {
				chunks.push(e.data);
			};
			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(chunks, { type: 'audio/wav' }); // Use the chunks array directly
				const formData = new FormData();
				stream.getTracks().forEach((track) => track.stop());
				formData.append('file', audioBlob);
				const APIURL = import.meta.env.VITE_API_AUTH_KEY;
				try {
					const response = await fetch(APIURL + 'upload/audio', {
						method: 'POST',
						body: formData,
						credentials: 'same-origin'
					});
					if (response.ok) {
						const data = await response.json();
						const audioPath = data.url;
						if (friendId !== '') {
							const newMessage: messageUser1 = {
								to: getFriend(friendId)!.id,
								from: userData[0].id,
								message: '',
								audio: audioPath || null,
								image: null,
								senderId: userData[0].id,
								recieverId: getFriend(friendId)!.id,
								recieverName: getFriend(friendId)!.username,
								date: new Date().toISOString()
							};
							socketChat?.emit('message', newMessage);
							setMESSAGES((await messageService.getMessages(userData[0].id, friendId)));
							setLatestMessages(await messageService.latestMessages(userData[0].id));
						} else if (channelId != -1) {
							const newMessage: any = {
								from: userData[0].id,
								senderId: userData[0].id,
								cid: channelId,
								message: '',
								image: null,
								audio: audioPath
							};
							socketChat?.emit('channelMessages', newMessage);
							setLstGroupMessages(await channelService.latestChannels(userData[0].id))
							setRoomMessages(await channelService.getChannelMessages(channelId));
						}
					} else {
						console.error('Failed to upload audio:', response.statusText);
					}
				} catch (error) {
					console.error('Error uploading audio:', error);
				}
			}
			mediaRecorder.start();
			setRecording(true);
		} catch (error) {
			console.error('Error starting recording:', error);
		}
	};
	const handleImageSubmit = async (selectedFile: File) => {
		if (isDisabled)
			return;
		const formData = new FormData();
		formData.append('file', selectedFile);
		let imagePath;
		try {
			const APIURL = import.meta.env.VITE_API_AUTH_KEY;
			const response = await fetch(APIURL + 'upload', {
				method: 'POST',
				body: formData,
				credentials: 'same-origin'
			});
			if (response.ok) {
				imagePath = await response.json();
				imagePath = imagePath.url;
				if (friendId != '') {
					const newMessage: messageUser1 = {
						to: getFriend(friendId)!.id,
						from: userData[0].id,
						message: '',
						image: imagePath ? imagePath : null,
						senderId: userData[0].id,
						recieverId: getFriend(friendId)!.id,
						recieverName: getFriend(friendId)!.username,
						date: new Date().toISOString(),
						audio: null
					};
					socketChat?.emit('message', newMessage);
					handleSelectMessage(selectedMessageIndex, friendId);
					setMessageText('');
					setLatestMessages(await messageService.latestMessages(userData[0].id));
				} else if (channelId != -1) {
					const newMessage: any = {
						from: userData[0].id,
						senderId: userData[0].id,
						cid: channelId,
						message: '',
						image: imagePath ? imagePath : null,
						audio: null
					};
					socketChat?.emit('channelMessages', newMessage);
					setLstGroupMessages(await channelService.latestChannels(userData[0].id))
					setRoomMessages(await channelService.getChannelMessages(channelId));
				}
				// if (messagesRef.current)
				// 	scrollToBottom(messagesRef.current)
			} else {
				console.error('Failed to upload image');
			}
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};
    const stopRecording = () => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
			mediaRecorderRef.current.stop();
			setRecording(false);
		}
	};
    const handleChange = (event: any) => {
		const selectedFile = event.target.files[0];
		handleImageSubmit(selectedFile);
	};
    const chooseFile = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/jpeg';
		input.addEventListener('change', handleChange); // Add event listener
		input.click();
	};
    return (
            <form onSubmit={handleTextSubmit} className="m-0 flex flex-row items-center h-16 rounded-xl w-full px-4" >
                <div className="flex">
                    <div className="flex items-center justify-center text-gray-400 hover:text-gray-600" onClick={() => {
                        if (!isDisabled)
                            chooseFile()
                    }} >
                        <svg width="24" height="24" className="stroke-gray-600 dark:stroke-white" strokeWidth="0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 13V11C3 7.22876 3 5.34315 4.17157 4.17157C5.34315 3 7.22876 3 11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H12" className="stroke-gray-600 dark:stroke-white" strokeWidth="1.5"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.9997 13.5854L18.7569 13.3425L18.7422 13.3278C18.6785 13.2641 18.6249 13.2105 18.5777 13.1671C17.1476 11.8531 14.8649 12.2235 13.9237 13.9224C13.8926 13.9785 13.8587 14.0463 13.8185 14.1268L13.8185 14.1268L13.8092 14.1454L13.781 14.2016L13.7791 14.2053L13.7763 14.2021L13.7353 14.1545L8.75926 8.34907C8.39983 7.92975 7.76853 7.88119 7.34921 8.24061C6.92988 8.60003 6.88132 9.23133 7.24074 9.65066L12.2168 15.4561L12.2256 15.4664C12.2545 15.5001 12.2884 15.5397 12.3193 15.5727C13.246 16.5622 14.8679 16.3625 15.5269 15.1778C15.5489 15.1383 15.5722 15.0917 15.592 15.052L15.592 15.0519L15.598 15.0398C15.6528 14.9304 15.6656 14.9052 15.6732 14.8916C15.9869 14.3253 16.7478 14.2018 17.2245 14.6398C17.2359 14.6504 17.2561 14.6702 17.3426 14.7567L18.9441 16.3582C18.9902 15.6404 18.9983 14.7479 18.9997 13.5854Z" className="fill-gray-600 dark:fill-white" strokeWidth="0"/>
                            <circle cx="16.5" cy="7.5" r="1.5" className="fill-gray-600 dark:fill-white"/>
                            <path d="M8 16V15H9V16H8ZM3.62469 20.7809C3.19343 21.1259 2.56414 21.056 2.21913 20.6247C1.87412 20.1934 1.94404 19.5641 2.37531 19.2191L3.62469 20.7809ZM7 21V16H9V21H7ZM8 17H3V15H8V17ZM8.6247 16.7809L3.62469 20.7809L2.37531 19.2191L7.3753 15.2191L8.6247 16.7809Z" className="fill-gray-600 dark:fill-white"/>
                        </svg>
                    </div>
                    <div className={`realtive flex items-center justify-center h-full w-12 right-0 top-0 text-gray-600 dark:text-white hover:text-white`} onClick={() => {
                        if(!isDisabled)
                            recording ? stopRecording() : startRecording()
                    }}>
                        {<svg className={`${recording ? 'text-yellow-300' : ''}`} stroke="currentColor" strokeWidth="1.5" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                        }
                    </div>
                </div>
                <div className="flex-grow ml-4">
                    <div className="relative w-full">
                    <input
                        type="text"
                        disabled={isDisabled}
                        value={messageText}
                        name="message"
                        placeholder={isDisabled ? messageText : "Type a message"}
                        onChange={(e) => setMessageText(e.target.value)}
                        autoComplete="off"
                        className="flex w-full border bg-white dark:bg-zinc-950 focus:ring-0 text-black dark:text-white rounded-xl dark:focus:border-main-light-FERN focus:border-main-light-EGGSHELL pl-4 h-10"
                        />
                    </div>
                </div>
                <div className='ml-2 '>
                    <button
                        onClick={handleTextSubmit}
                        className="justify-center bg-main-light-FERN dark:bg-main-light-EGGSHELL rounded-full text-white p-2"
                    >
                        <span className="overflow-hidden">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.39969 6.32015L15.8897 3.49015C19.6997 2.22015 21.7697 4.30015 20.5097 8.11015L17.6797 16.6002C15.7797 22.3102 12.6597 22.3102 10.7597 16.6002L9.91969 14.0802L7.39969 13.2402C1.68969 11.3402 1.68969 8.23015 7.39969 6.32015Z" stroke="#FBFDFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10.1104 13.6501L13.6904 10.0601" stroke="#FBFDFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>

                        </span>
                    </button>
                </div>
            </form>
    )
}

export default ChatForm;