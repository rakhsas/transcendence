import { useContext, useState, useEffect, useRef } from "react";
import "./chat.css";
import DataContext from "../../../services/data.context";
import LoadingComponent from "../../shared/loading/loading";
import ConversationArea from "./conversation";
import DetailsArea from "./friendDetails";
import { messageUser, messageUser1 } from "../../../model/messageUser.model";
import MessageService from "../../../services/message.service";
import { Socket } from "socket.io-client";
import AuthService from "../../../services/auth.service";
import ChatAreaComponent from "./chatArea";
import { ChannelService } from "../../../services/channel.service";
import ChatRoom from "./chatRoom";
import User from "../../../model/user.model";
import { Avatar } from "flowbite-react";
import RoomDetails from "./roomDetails";
import MuteService from "../../../services/mute.service";
import { MutedUsers } from "../../../utils/types";
import VideoCallComponent from "./videocall";

enum roomRoles {
	OWNER = "OWNER",
	ADMIN = "ADMIN"
}

interface membersRole {
	user: User,
	role: roomRoles
}

function chatComponent(): JSX.Element {
	const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
	const [roomMessages, setRoomMessages] = useState<any>(null);
	const [roomMembers, setRoomMembers] = useState<membersRole[]>([])
	const [MESSAGES, setMESSAGES] = useState<any>(null);
	const [friendId, setFriendId] = useState('');
	const [selectedColor, setSelectedColor] = useState("black");
	const [selectedMessageIndex, setSelectedMessageIndex] = useState('-1');
	const [socketChat, setSocketChat] = useState<Socket>();
	const [message, setMessage] = useState('');
	const [modalPicPath, setModalPicPath] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [latestMessages, setLatestMessages] = useState<any[]>([]);
	const [onOpenDetails, setOnOpenDetails] = useState<boolean>(false);
	const [recording, setRecording] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const [lstGroupMessages, setLstGroupMessages] = useState<any>([]);
	const messageService = new MessageService();
	const channelService = new ChannelService();
	const muteService = new MuteService();
	const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
	const messagesRef = useRef<HTMLDivElement>(null);
	const [channelId, setChannelId] = useState<number>(-1);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<any>('');
	const [mutedUsers, setMutedUsers] = useState<MutedUsers[]>([]);
	const [openVideoCall, setOpenVideoCall] = useState<boolean>();
	const userData = useContext(DataContext);
	if (!userData) {
		return <LoadingComponent />;
	}
	const socket: Socket = userData[1];
	useEffect(() => {
		if (messagesRef.current)
			scrollToBottom(messagesRef.current!);
	}, [MESSAGES]);
	const scrollToBottom = (element: HTMLElement) => {
		element.scrollTop = element.scrollHeight;
	};
	const [isDisabled, setIsDisabled] = useState(false);

	useEffect(() => {
		const mutedUser = mutedUsers.find((object) => {
		  return object.userId === userData[0].id && new Date(object.finishedAt) > new Date();
		});
		//console.log(mutedUser);
		if (mutedUser) {
		  const timeRemaining = new Date(mutedUser.finishedAt).getTime() - new Date().getTime();
		  if (timeRemaining > 0) {
			setIsDisabled(true);
			setMessage(`You are muted for ${Math.ceil(timeRemaining / 1000)} seconds`);
	  
			const interval = setInterval(() => {
			  const remaining = new Date(mutedUser.finishedAt).getTime() - new Date().getTime();
			  if (remaining <= 0) {
				setIsDisabled(false);
				clearInterval(interval);
				setMessage('');
			  } else {
				setMessage(`You are muted for ${Math.ceil(remaining / 1000)} seconds`);
			  }
			}, 1000);
	  
			return () => clearInterval(interval);
		  } else {
			setIsDisabled(false);
		  }
		}
	  }, [mutedUsers, userData]);
	  
	useEffect(() => {
		if (!userData[0] || !userData[1]) return;
		const fetchData = async () => {
			try {
				const authService = new AuthService();
				await authService.getPayload();
				const fetchedUserData = await messageService.latestMessages(userData[0].id);
				setLatestMessages(fetchedUserData);
				const fetchedChannels = await channelService.latestChannels(userData[0].id);
				setLstGroupMessages(fetchedChannels);
			} catch (error) {
				console.error('Error fetching user ', error);
			}
		};
		fetchData();
		setSocketChat(userData[1]);
	}, [userData]);
	if (!userData[0] || !userData[1]) {
		return <LoadingComponent />;
	}
	const handleTextSubmit = async (e: any) => {
		e.preventDefault();
		const messageValue = message;
		if (!messageValue || isDisabled) {
			//console.log('Message is empty');
			return;
		}
		if (friendId != '') {
			const newMessage: messageUser1 = {
				to: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
				from: userData[0].id,
				message: messageValue,
				image: '', // No image selected
				senderId: userData[0].id,
				recieverId: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
				recieverName: getMessageFriend(MESSAGES[selectedMessageIndex]).username,
				date: new Date().toISOString(),
				audio: ''
			};
			socketChat?.emit('message', newMessage);
			const newMessages = [...MESSAGES, newMessage];
			setMESSAGES(newMessages);
			setMessage('');
			setLatestMessages(await messageService.latestMessages(userData[0].id));
		} else if (channelId != -1) {
			const newMessage: any = {
				from: userData[0].id,
				senderId: userData[0].id,
				cid: channelId,
				message: messageValue,
				image: '',
				audio: ''
			};
			socketChat?.emit('channelMessages', newMessage);
			setLstGroupMessages(await channelService.latestChannels(userData[0].id))
			setRoomMessages(await channelService.getChannelMessages(channelId));
			setMessage('');
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
						to: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
						from: userData[0].id,
						message: '',
						image: imagePath ? imagePath : '',
						senderId: userData[0].id,
						recieverId: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
						recieverName: getMessageFriend(MESSAGES[selectedMessageIndex]).username,
						date: new Date().toISOString(),
						audio: ''
					};
					socketChat?.emit('message', newMessage);
					handleSelectMessage(selectedMessageIndex, friendId);
					setMessage('');
					setLatestMessages(await messageService.latestMessages(userData[0].id));
				} else if (channelId != -1) {
					const newMessage: any = {
						from: userData[0].id,
						senderId: userData[0].id,
						cid: channelId,
						message: '',
						image: imagePath,
						audio: ''
					};
					socketChat?.emit('channelMessages', newMessage);
					setLstGroupMessages(await channelService.latestChannels(userData[0].id))
					setRoomMessages(await channelService.getChannelMessages(channelId));
				}
				if (messagesRef.current)
					scrollToBottom(messagesRef.current)
			} else {
				console.error('Failed to upload image');
			}
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};



	const handleChange = (event: any) => {
		const selectedFile = event.target.files[0];
		handleImageSubmit(selectedFile);
	};
	const chooseFile = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.addEventListener('change', handleChange); // Add event listener
		input.click();
	};
	const handleSelectMessage = async (index: string, friendId?: string, cid?: number) => {
		setSelectedMessageIndex('');
		setSelectedMessageIndex(index);
		if (friendId) {
			setFriendId(friendId);
			setMESSAGES((await messageService.getMessages(userData[0].id, friendId)));
			// //console.log(MESSAGES);
			setRoomMessages(null);
			setRoomMembers([]);
			setMutedUsers([]);
			setChannelId(-1)
		}
		else if (cid) {
			setFriendId('')
			setMESSAGES(null);
			setChannelId(cid);
			await channelService.getChannelMembers(cid).then(
				(data: any) => {
					setRoomMembers(data);
				}
			)
			await channelService.getChannelMessages(cid).then(
				(data: any) => {
					setRoomMessages(data);
				}
			)
			await muteService.MutedUsers(cid).then(
				(data: any) => {
					setMutedUsers(data);
					//console.log(data);
				}
			)
		}
	};
	const onDirectMessage = async (data: any) => {
		setMESSAGES((await messageService.getMessages(userData[0].id, friendId)));
		setLatestMessages(await messageService.latestMessages(userData[0].id))
	}
	socketChat?.on("directMessageNotif", onDirectMessage)
	const handleOpenDetails = () => {
		setOnOpenDetails(!onOpenDetails)
	}

	const handleSelectedColor = (color: string) => {
		// setSelectedColor(color);
	}

	const onOpenModal = (picPath: string) => {
		setModalPicPath(picPath);
		setIsModalOpen(true);
	};

	const onCloseModal = () => {
		setIsModalOpen(false);
	};
	const getMessageFriend = (message: messageUser) => {
		const { __owner__, __reciever__ } = message;
		return __owner__.id === userData[0].id ? __reciever__ : __owner__;
	};
	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			const chunks: any = []; // Create a new array for chunks

			mediaRecorder.ondataavailable = (e) => {
				chunks.push(e.data);
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(chunks, { type: 'audio/wav' }); // Use the chunks array directly
				const formData = new FormData();
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
								to: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
								from: userData[0].id,
								message: '',
								audio: audioPath || '',
								image: '',
								senderId: userData[0].id,
								recieverId: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
								recieverName: getMessageFriend(MESSAGES[selectedMessageIndex]).username,
								date: new Date().toISOString()
							};
							socketChat?.emit('message', newMessage);
							const newMessages = [...MESSAGES, newMessage];
							setMESSAGES(newMessages);
							setLatestMessages(await messageService.latestMessages(userData[0].id));
						} else if (channelId != -1) {
							const newMessage: any = {
								from: userData[0].id,
								senderId: userData[0].id,
								cid: channelId,
								message: '',
								image: '',
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
	socket?.on("userMuted", async (data: any) => {
		setMutedUsers(data);
	})
	const stopRecording = () => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
			mediaRecorderRef.current.stop();
			setRecording(false);
		}
	};
	const setOpenModal = (status: boolean) => {
		setIsOpen(status);
	}

	return (
		<>
			<div className="flex bg-red-600l w-full flex-warp border-t-[1px] dark:border-gray-700 border-black ">
				<ConversationArea
					latestMessages={latestMessages}
					selectedMessageIndex={selectedMessageIndex}
					lstGroupMessages={lstGroupMessages}
					handleSelectMessage={handleSelectMessage}
					userData={userData}
					setLstGroupMessages={setLstGroupMessages}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					selectedItem={selectedItem}
					setSelectedItem={setSelectedItem}
					socket={socket}
				/>
				<div className=" sm:flex  flex-col overflow-hidden flex-1 h-full bg-green-400">

					{selectedMessageIndex !== "-1" && (
						<div className="flex-1 overflow-hidden h-[85%]">
							{MESSAGES && (
								<>
									<div className="chat-area-header flex sticky top-0 left-0 overflow-hidden w-full items-center justify-between p-5 bg-inherit dark:bg-zinc-800 ">
										<div className="flex flex-row items-center space-x-2">
											<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" onClick={()=>{
													setSelectedMessageIndex('-1');
													setRoomMembers([]);
													setRoomMessages([]);
													setChannelId(-1);
													setFriendId('');
												}}>
												<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
											</svg>
											<div className="msg-profile group bg-white"
												style={{
													backgroundImage: `url(${baseAPIUrl + getMessageFriend(MESSAGES[selectedMessageIndex])
															.picture
														})`,
												}}
											></div>
											<div className="font-onest text-lg capitalize text-zinc-700 dark:text-white">
												{getMessageFriend(MESSAGES[selectedMessageIndex])
													.firstName +
													" " +
													getMessageFriend(MESSAGES[selectedMessageIndex])
														.lastName}
											</div>
										</div>
										<div className="flex flex-row justify-around w-20 h-8 gap-2">
											<svg onClick={() => setOpenVideoCall(!openVideoCall)} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" className="fill-black dark:fill-white" >
												<path d="M 4 4.75 C 3.271 4.75 2.5706875 5.0396875 2.0546875 5.5546875 C 1.5396875 6.0706875 1.25 6.771 1.25 7.5 L 1.25 16.5 C 1.25 17.229 1.5396875 17.929313 2.0546875 18.445312 C 2.5706875 18.960313 3.271 19.25 4 19.25 L 14.5 19.25 C 15.229 19.25 15.929312 18.960313 16.445312 18.445312 C 16.960313 17.929313 17.25 17.229 17.25 16.5 L 17.25 16.166016 L 20.982422 17.861328 C 21.369422 18.037328 21.819734 18.004438 22.177734 17.773438 C 22.534734 17.543438 22.75 17.147656 22.75 16.722656 L 22.75 7.2773438 C 22.75 6.8523438 22.534734 6.4565625 22.177734 6.2265625 C 21.819734 5.9955625 21.369422 5.9626719 20.982422 6.1386719 L 17.25 7.8339844 L 17.25 7.5 C 17.25 6.771 16.960313 6.0706875 16.445312 5.5546875 C 15.929312 5.0396875 15.229 4.75 14.5 4.75 L 4 4.75 z M 4 6.25 L 14.5 6.25 C 14.832 6.25 15.149766 6.3812344 15.384766 6.6152344 C 15.618766 6.8502344 15.75 7.168 15.75 7.5 L 15.75 9 L 15.75 15 L 15.75 16.5 C 15.75 16.832 15.618766 17.149766 15.384766 17.384766 C 15.149766 17.618766 14.832 17.75 14.5 17.75 L 4 17.75 C 3.668 17.75 3.3502344 17.618766 3.1152344 17.384766 C 2.8812344 17.149766 2.75 16.832 2.75 16.5 L 2.75 7.5 C 2.75 7.168 2.8812344 6.8502344 3.1152344 6.6152344 C 3.3502344 6.3812344 3.668 6.25 4 6.25 z M 21.25 7.6640625 L 21.25 16.335938 L 17.25 14.517578 L 17.25 9.4824219 C 17.25 9.4824219 20.213 8.1350625 21.25 7.6640625 z"></path>
											</svg>
											<svg
												stroke="currentColor"
												className="stroke-black dark:stroke-white"
												fill="none"
												strokeWidth="2"
												viewBox="0 0 24 24"
												strokeLinecap="round"
												strokeLinejoin="round"
												height="23"
												width="23"
												xmlns="http://www.w3.org/2000/svg"
												onClick={handleOpenDetails}
											>
												<circle cx="12" cy="12" r="10"></circle>
												<line x1="12" y1="16" x2="12" y2="12"></line>
												<line x1="12" y1="8" x2="12.01" y2="8"></line>
											</svg>
										</div>
									</div>
									{
										openVideoCall && (
											<VideoCallComponent user={userData[0]} />
										)
									}
									<div ref={messagesRef} className={`chat-area-main h-full overflow-auto pb-20 bg-white ${selectedColor} `}>
										<ChatAreaComponent
											MESSAGES={MESSAGES}
											userData={userData}
											selectedMessageIndex={selectedMessageIndex}
											getMessageFriend={getMessageFriend}
											isModalOpen={isModalOpen}
											onOpenModal={onOpenModal}
											onCloseModal={onCloseModal}
											modalPicPath={modalPicPath}
											openVideoCall={openVideoCall}
											setOpenVideoCall={setOpenVideoCall}
											socketChat={socketChat}
										/>
									</div>
								</>
							)}
							{roomMembers && roomMessages && (
								<>
									<div className="chat-area-header flex sticky top-0 left-0 overflow-hidden w-full items-center justify-between p-2 bg-inherit dark:bg-zinc-800">
										<div className="flex gap-2 items-center">
											<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" onClick={()=>{
													setSelectedMessageIndex('-1');
													setRoomMembers([]);
													setRoomMessages([]);
													setChannelId(-1);
													setFriendId('');
												}}>
												<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
											</svg>

											<div className="flex flex-row items-center">
												<Avatar
													img={
														baseAPIUrl +
														lstGroupMessages[selectedMessageIndex].channel
															.picture || ""
													}
													rounded
												/>
											</div>
											<div className="font-onest text-lg capitalize text-zinc-700 dark:text-white">
												{lstGroupMessages[selectedMessageIndex].channel.name}
											</div>
										</div>
										<div className="flex flex-row items-center gap-2 p-1">
											<Avatar.Group className="justify-around p-2">
												{roomMembers.map((member, index) => (
													<Avatar className="avatarImage p-1"
														img={baseAPIUrl + member.user.picture}
														rounded
														stacked
														key={index}
													/>
												))}
												{<Avatar.Counter total={roomMembers.length} />}
											</Avatar.Group>
											<svg
												stroke="currentColor"
												className="stroke-black dark:stroke-white"
												fill="none"
												strokeWidth="2"
												viewBox="0 0 24 24"
												strokeLinecap="round"
												strokeLinejoin="round"
												height="23"
												width="23"
												xmlns="http://www.w3.org/2000/svg"
												onClick={handleOpenDetails}
											>
												<circle cx="12" cy="12" r="10"></circle>
												<line x1="12" y1="16" x2="12" y2="12"></line>
												<line x1="12" y1="8" x2="12.01" y2="8"></line>
											</svg>
										</div>
									</div>
									<div ref={messagesRef} className={`chat-area-main h-full overflow-auto pb-20 bg-white ${selectedColor} `} >
										<ChatRoom
											roomMembers={roomMembers}
											roomMessages={roomMessages}
											userData={userData}
											channelId={channelId}
											isModalOpen={isModalOpen}
											onOpenModal={onOpenModal}
											onCloseModal={onCloseModal}
											modalPicPath={modalPicPath}
											setRoomMessages={setRoomMessages}
											socketChat={socketChat}
										/>
									</div>
								</>
							)}
						</div>
					)}
					{(friendId !== "" || channelId !== -1) && (
						<div className="flex flex-row items-center h-16 rounded-xl bg-white dark:bg-main-dark-SPRUCE w-full px-4">
							<form onSubmit={handleTextSubmit} className="m-0 flex flex-row items-center h-16 rounded-xl w-full px-4" >
								<div className="flex">
									<div className="flex items-center justify-center text-gray-400 hover:text-gray-600" onClick={chooseFile} >
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
										</svg>
									</div>
									<div className={`realtive flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600`} onClick={recording ? stopRecording : startRecording}>
										{<svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
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
										value={message}
										name="message"
										placeholder={isDisabled ? message : "Type a message"}
										onChange={(e) => setMessage(e.target.value)}
										autoComplete="off"
										className="flex w-full border bg-white dark:bg-zinc-950 focus:ring-0 text-black dark:text-white rounded-xl dark:focus:border-main-light-FERN focus:border-main-light-EGGSHELL pl-4 h-10"
										/>
									</div>
								</div>
								<div className={`ml-4 `}>
									<button
										onClick={handleTextSubmit}
										className="flex items-center justify-center bg-main-light-FERN rounded-xl text-white px-4 py-1 flex-shrink-0"
									>
										<span>Send</span>
										<span className="ml-2 overflow-hidden">
											<svg
												className="w-4 h-auto transform rotate-45 -mt-px"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
												></path>
											</svg>
										</span>
									</button>
								</div>
							</form>
						</div>
					)}
				</div>
				{onOpenDetails && friendId !== ""
					?
					<DetailsArea MESSAGES={MESSAGES} selectedMessageIndex={selectedMessageIndex} 
					selectedColor={selectedColor} handleSelectedColor={handleSelectedColor} modalPicPath={modalPicPath} isModalOpen={isModalOpen} onCloseModal={onCloseModal}
					onOpenModal={onOpenModal} getMessageFriend={getMessageFriend} handleOpenDetails={handleOpenDetails} />
					: null}
				{onOpenDetails && channelId != -1 ? (
					<RoomDetails
						channelInfo={lstGroupMessages[selectedMessageIndex].channel}
						channelRole={lstGroupMessages[selectedMessageIndex].role}
						handleOpenDetails={handleOpenDetails}
						chatSocket={socketChat}
						setRoomMembers={setRoomMembers}
						roomMembers={roomMembers}
						userData={userData}
					/>
				) : null}
			</div>
		</>
	);
}

export default chatComponent;

