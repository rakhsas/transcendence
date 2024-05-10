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
import { keyframes } from "@emotion/react";
import ChatForm from "./chat.form";

enum roomRoles {
	OWNER = "OWNER",
	ADMIN = "ADMIN"
}

interface membersRole {
	user: User,
	role: roomRoles
}

function ChatComponent(): JSX.Element {
	const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
	const [roomMessages, setRoomMessages] = useState<any>(null);
	const [roomMembers, setRoomMembers] = useState<membersRole[]>([])
	const [MESSAGES, setMESSAGES] = useState<any>(null);
	const [friendId, setFriendId] = useState<string>('');
	const [selectedColor, setSelectedColor] = useState("black");
	const [selectedMessageIndex, setSelectedMessageIndex] = useState('-1');
	const [socketChat, setSocketChat] = useState<Socket>();
	const [modalPicPath, setModalPicPath] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [latestMessages, setLatestMessages] = useState<any[]>([]);
	const [onOpenDetails, setOnOpenDetails] = useState<boolean>(false);
	const [lstGroupMessages, setLstGroupMessages] = useState<any>([]);
	const messageService = new MessageService();
	const channelService = new ChannelService();
	const muteService = new MuteService();
	const messagesRef = useRef<HTMLDivElement>(null);
	const [channelId, setChannelId] = useState<number>(-1);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<any>('');
	const [mutedUsers, setMutedUsers] = useState<MutedUsers[]>([]);
	const [friends, setFriends] = useState<any[]>([]);
	const [isBlocked, setIsBlocked] = useState<boolean>(false);
	const [blockedResult, setBlockedResult] = useState<any>(null);
	const userData = useContext(DataContext);
	if (!userData) {
		return <LoadingComponent />;
	}
	const socket: Socket = userData[1];
	// useEffect(() => {
	// 	if (messagesRef.current)
	// 		scrollToBottom(messagesRef.current!);
	// }, [MESSAGES]);
	const scrollToBottom = (element: HTMLElement) => {
		element.scrollTop = element.scrollHeight;
	};
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
		setFriends(userData[7]);
	}, [userData]);
	if (!userData[0] || !userData[1]) {
		return <LoadingComponent />;
	}
	// useEffect(() => {
	// 	console.log(MESSAGES)
	// }, [MESSAGES]);

	socketChat?.on('newMemberJoined', async (data: any) => {
		setLstGroupMessages(await channelService.latestChannels(userData[0].id));
		if (channelId != -1 &&  channelId == data.payload.channelId)
			setRoomMembers(data.members);
	})
	
	// socket?.on("userKicked", async (data: any) => {
	// 	console.log(data)
	// })
	socket?.on("kickedNotif", async (data: any) => {
		// console.log(data);
		setChannelId(-1);
		setRoomMessages(null);
		setRoomMembers([]);
		setLstGroupMessages(await channelService.latestChannels(userData[0].id));
    })
	const handleSelectMessage = async (index: string, friendId?: string, cid?: number) => {
		setSelectedMessageIndex(index);
		setOnOpenDetails(false);
		if (friendId) {
			setChannelId(-1);
			setRoomMessages(null);
			setRoomMembers([]);
			setFriendId(friendId);
			setMESSAGES((await messageService.getMessages(userData[0].id, friendId)));
			setMutedUsers([]);
			setChannelId(-1);
			const blockedResult = await messageService.BlockBetween(userData[0].id, friendId);
			setBlockedResult(blockedResult);
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
		// console.log(data);
		// if (friendId == data.issuer.id)
		// {
		// 	if (MESSAGES)
		// 		setMESSAGES([...MESSAGES, data]);
		// }
		setLatestMessages(await messageService.latestMessages(userData[0].id))
	}
	useEffect(() => {
		socketChat?.on("directMessageNotif", onDirectMessage);
	}, [socketChat]);
	const handleOpenDetails = () => {
		setOnOpenDetails(!onOpenDetails)
	}

	const handleSelectedColor = (color: string) => {
		setSelectedColor(color);
	}

	const onOpenModal = (picPath: string) => {
		setModalPicPath(picPath);
		setIsModalOpen(true);
	};
	const onCloseModal = () => {
		setIsModalOpen(false);
	};
	socketChat?.on('userLeft', async (data: any) => {
		// setRoomMembers(data.members);
		// console.log(data.payload)
		if (data.payload.userId === userData[0].id) {
			setChannelId(-1);
			setRoomMessages(null);
			setRoomMembers([]);
			setLstGroupMessages(await channelService.latestChannels(userData[0].id));
		}else {
			setRoomMembers(data.members);
		}
	})
	const getMessageFriend = (message: messageUser) => {
		const { __owner__, __reciever__ } = message;
		return __owner__.id === userData[0].id ? __reciever__ : __owner__;
	};
	const getFriend = (friendId: string): User | undefined => {
		return friends.find((friend) => friend.id === friendId);
	};
	
	socket?.on("userMuted", async (data: any) => {
		setMutedUsers(data);
	})
	// const stopRecording = () => {
	// 	if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
	// 		mediaRecorderRef.current.stop();
	// 		setRecording(false);
	// 	}
	// };
	const setOpenModal = (status: boolean) => {
		setIsOpen(status);
	}
	useEffect(() => {},[MESSAGES])
	const callUser = async () => {
		if (userData[8]) {
			const constraints = {
				audio: true,
				video: true,
			};
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			stream.getTracks().forEach((track) => {track.enabled = false});
			userData[8](stream)
			stream && socketChat?.emit('iCallUser', {
				calle: getFriend(friendId)
			});
			stream && socketChat?.emit('callUser', {
				from: userData[0].id,
				senderId: userData[0].id,
				recieverId: getFriend(friendId)?.id
			})
		}
	}	
	return (
		<>
			<div className="flex w-full flex-warp border-t-[1px] dark:border-gray-700 border-black ">
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
				<div className={`flex flex-col overflow-hidden flex-1 h-full ${onOpenDetails ? '' : ''}`}>
					{selectedMessageIndex !== "-1" && (
						<div className="flex-1 overflow-hidden h-[85%]">
							{MESSAGES  && (
								<div className={`${onOpenDetails && friendId !== "" ? 'md:visible invisible' : ''} flex flex-col h-full`}>
									<div className="chat-area-header flex sticky top-0 left-0 overflow-hidden w-full items-center justify-between p-5 bg-inherit ">
										<div className="flex flex-row items-center space-x-2">
											<svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" onClick={()=>{
													setSelectedMessageIndex('-1');
													setFriendId('');
												}}>
												<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
											</svg>
											<div className="msg-profile group bg-white"
												style={{
													backgroundImage: `url(${baseAPIUrl + getFriend(friendId)?.picture
														})`,
												}}
											></div>
											<div className="font-onest text-lg capitalize text-white">
												{getFriend(friendId)?.firstName +
													" " +
													getFriend(friendId)?.lastName}
											</div>
										</div>
										<div className="flex flex-row justify-around w-20 h-8 gap-2">
											<svg onClick={() => {
												callUser();
												}} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" className="fill-white" >
												<path d="M 4 4.75 C 3.271 4.75 2.5706875 5.0396875 2.0546875 5.5546875 C 1.5396875 6.0706875 1.25 6.771 1.25 7.5 L 1.25 16.5 C 1.25 17.229 1.5396875 17.929313 2.0546875 18.445312 C 2.5706875 18.960313 3.271 19.25 4 19.25 L 14.5 19.25 C 15.229 19.25 15.929312 18.960313 16.445312 18.445312 C 16.960313 17.929313 17.25 17.229 17.25 16.5 L 17.25 16.166016 L 20.982422 17.861328 C 21.369422 18.037328 21.819734 18.004438 22.177734 17.773438 C 22.534734 17.543438 22.75 17.147656 22.75 16.722656 L 22.75 7.2773438 C 22.75 6.8523438 22.534734 6.4565625 22.177734 6.2265625 C 21.819734 5.9955625 21.369422 5.9626719 20.982422 6.1386719 L 17.25 7.8339844 L 17.25 7.5 C 17.25 6.771 16.960313 6.0706875 16.445312 5.5546875 C 15.929312 5.0396875 15.229 4.75 14.5 4.75 L 4 4.75 z M 4 6.25 L 14.5 6.25 C 14.832 6.25 15.149766 6.3812344 15.384766 6.6152344 C 15.618766 6.8502344 15.75 7.168 15.75 7.5 L 15.75 9 L 15.75 15 L 15.75 16.5 C 15.75 16.832 15.618766 17.149766 15.384766 17.384766 C 15.149766 17.618766 14.832 17.75 14.5 17.75 L 4 17.75 C 3.668 17.75 3.3502344 17.618766 3.1152344 17.384766 C 2.8812344 17.149766 2.75 16.832 2.75 16.5 L 2.75 7.5 C 2.75 7.168 2.8812344 6.8502344 3.1152344 6.6152344 C 3.3502344 6.3812344 3.668 6.25 4 6.25 z M 21.25 7.6640625 L 21.25 16.335938 L 17.25 14.517578 L 17.25 9.4824219 C 17.25 9.4824219 20.213 8.1350625 21.25 7.6640625 z"></path>
											</svg>
											<svg
												stroke="currentColor"
												className="stroke-white"
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
											socketChat={socketChat}
											getFriend={getFriend}
											friendId={friendId}
											setMESSAGES={setMESSAGES}
										/>
									</div>
								</div>
							)}
							{roomMembers && roomMessages && channelId !== -1 && (
								<div className={`${onOpenDetails && channelId != -1 && 'md:visible invisible'}  flex flex-col h-full`}>
									<div className="chat-area-header flex sticky top-0 left-0 overflow-hidden w-full items-center justify-between p-2 bg-inherit">
										<div className="flex gap-2 items-center">
											<svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" onClick={()=>{
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
											<div className="font-onest text-lg capitalize text-white">
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
									<div className={`chat-area-main h-full overflow-auto pb-20 bg-white ${selectedColor} `} >
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
								</div>
							)}
						</div>
					)}
					{(friendId !== "" || channelId !== -1) && (
						<div className={`flex flex-row items-center h-16 rounded-xl bg-white dark:bg-main-dark-SPRUCE w-full px-4 ${!onOpenDetails ? 'md:block' : 'md:block'}`}>
							<ChatForm 
								MESSAGES={MESSAGES}
								userData={userData}
								setMESSAGES={setMESSAGES}
								friendId={friendId}
								channelId={channelId}
								setRoomMessages={setRoomMessages}
								socketChat={socketChat}
								getFriend={getFriend}
								mutedUsers={mutedUsers}
								setLatestMessages={setLatestMessages}
								setLstGroupMessages={setLstGroupMessages}
								handleSelectMessage={handleSelectMessage}
								selectedMessageIndex={selectedMessageIndex}
								blockedResult={blockedResult}
							/>
						</div>
					)}
				</div>
				{onOpenDetails && friendId !== ""
					?
					<div className={`md:w-[340px] w-full h-full`}>
						<DetailsArea MESSAGES={MESSAGES} selectedMessageIndex={selectedMessageIndex} 
						selectedColor={selectedColor} handleSelectedColor={handleSelectedColor} modalPicPath={modalPicPath} isModalOpen={isModalOpen} onCloseModal={onCloseModal}
						onOpenModal={onOpenModal} getMessageFriend={getMessageFriend} getFriend={getFriend} friendId={friendId} handleOpenDetails={handleOpenDetails} />
					</div>
					: null}
				{onOpenDetails && channelId != -1 ? (
					<div className={`md:w-[340px] w-full h-full`}>
					<RoomDetails
						channelInfo={lstGroupMessages[selectedMessageIndex].channel}
						handleOpenDetails={handleOpenDetails}
						channelRole={lstGroupMessages[selectedMessageIndex].role}
						userData={userData}
						chatSocket={socketChat}
						setRoomMembers={setRoomMembers}
						roomMembers={roomMembers}
						/>
					</div>
				) : null}
			</div>
		</>
	);
}

export default ChatComponent;

