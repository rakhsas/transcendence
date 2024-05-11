import { Routes, Route, Outlet } from 'react-router-dom';
import NavbarComponent, { NotificationType } from "../shared/navbar/navbar";
import SidebarComponent from "../shared/sidebar/sidebar";
import "./Dashboard.css"
import User from './../../model/user.model';
import { useEffect, useState } from 'react';
import UserService from '../../services/user.service';
import AuthService from './../../services/auth.service';
import DataContext from '../../services/data.context';
import { Socket, io } from 'socket.io-client';
import LoadingComponent from '../shared/loading/loading';
import { ChannelService } from '../../services/channel.service';
import { Channel, notificationInterface } from '../../utils/types';
import { NotificationService } from '../../services/notification.service';
import { FriendsService } from '../../services/friend.service';
import TwoFAComponent from '../modal/2fa.authenticate.modal';
import cookies from 'js-cookie';
import DraggableDiv from './draggable';
import { SwipeableButton } from 'react-swipeable-button';

const url: string = "https://" + import.meta.env.VITE_API_SOCKET_URL;
const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
function DashboardComponent() {
	const [userData, setUserData] = useState<User | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [globalSocket, setGlobalSocket] = useState<Socket | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [protectedChannels, setProtectedChannels] = useState<Channel[]>([]);
	const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
	const [notifications, setNotifications] = useState<notificationInterface[]>([]);
	const [userCallingWith, setUserCallingWith] = useState<User>();
	const [callPermission, setCallPermission] = useState<boolean>(false);
	const [friends, setFriends] = useState<any>();
	const [stream , setStream] = useState<MediaStream>();
	const [userList, setUserList] = useState<any[]>([]);
	const [selectedUserSocketId, setSelectedUserSocketId] = useState<string>('')
	const [caller, setCaller] = useState<User>();
	const [callRequest, setCallRequest] = useState<any>(null);
	const [callingUser, setCallingUser] = useState<any>(null);
	const [callingUserStatus, setCallingUserStatus] = useState<boolean>(false);
	const [callRejected, setCallRejected] = useState<boolean>(false);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const authService = new AuthService();
				const friendsService = new FriendsService();
				const fetchedPayloadData = await authService.getPayload();
				const userService = new UserService();
				const fetchedUserData = await userService.getUser(fetchedPayloadData.id);
				setUserData(fetchedUserData);
				const users = await userService.getAllUsersExcept(fetchedUserData.id);
				setUsers(users);
				const channelService = new ChannelService();
				const protectedChannels = await channelService.getProtectedChannelsExpectUser(fetchedUserData?.id);
				setProtectedChannels(protectedChannels);
				const publicChannels = await channelService.getPublicChannels(fetchedPayloadData?.id);
				setPublicChannels(publicChannels);
				const notificationService = new NotificationService();
				const notifications = await notificationService.getNotifications(fetchedUserData?.id);
				setNotifications(notifications);
				const fetchedFriends = await friendsService.getFriends(fetchedUserData?.id);
				setFriends(fetchedFriends);
				const socketCHAT: Socket = io(url, {
					path: "/chat",
					query: {
						userName: fetchedUserData?.username
					},
					withCredentials: true
				});
				setSocket(socketCHAT);
				//console.log(fetchedUserData.username)
				const globalSocket: Socket = io(url, {
					path: "/global",
					query: {
						name : fetchedUserData.username
					},
					withCredentials: true
				});
				setGlobalSocket(globalSocket);
			} catch (error) {
				console.error('Error fetching user ', error);
			}
		};
		fetchData();
		return () => {
			socket?.disconnect();
			globalSocket?.disconnect();
		};
	}, []);
	socket?.on('protectedChannels', async (data: any) => {
        //console.log('protectedChannels: ', await data);
        setProtectedChannels(data);
    })
    socket?.on('publicChannels', (data: any) => {
        setPublicChannels(data);
    })
	socket?.on("usernameUpdated", async (data: any) => {
        // userData[0] = data;
        setUserData(data);
    })
	socket?.on('updatedFriends', async (data: any) => {
		setFriends(data);
	});
	
	socket?.on("update-user-list", (data: any) => {
		setUserList(data)
	})
	socket?.on("callPermission", async (data: any) => {
		callingUser && setCallingUser(null);
		setUserCallingWith(userData.id !== data.user.id ? data.user : data.caller);
		setCallPermission(data.permission);
		setSelectedUserSocketId(data.selectedUser)
		setCaller(data.caller);
	})
	socket?.on("RequestCall", async (data: any) => {
		callingUser && setCallingUser(null);
		setCallRequest(data)
	})
	const acceptCall = async () => {
		const constraints = {
			audio: true,
			video: true,
		};
		const stream = await navigator.mediaDevices.getUserMedia(constraints);
		stream.getTracks().forEach((track: MediaStreamTrack) => {track.enabled = false});
		setStream(stream)
		stream && socket?.emit("acceptVideoCall", {
			user: userData,
			caller: callRequest.issuer,
			permission: true
		});
		setCallRequest(null);
	}
	socket?.on("iAmCallingAUser", async (data: any) => {
		setCallingUser(data.calle);
		setCallRejected(false);
		const executeEveryFiveSeconds = () => {
			socket.emit("isUserOnline", {
				userName: data.calle.username
			})
		}
		const interval = setInterval(executeEveryFiveSeconds, 5000);
		setTimeout(() => {
			clearInterval(interval);
			socket.emit("callRejected", {
				caller: userData,
				calle: callingUser
			})
			console.log('Call Due to Unconnected User.');
		}, 30000);
	})
	socket?.on("userIsOnline", async (data: any) => {
		setCallingUserStatus(data);
	})
	socket?.on("callRejected", async (data: any) => {
		callRequest && setCallRequest(null);
		setCallRejected(true);
		setTimeout(() => {
			callingUser && setCallingUser(null)
		}, 3000);
		setCallingUserStatus(false);
	})
	socket?.on("userUpdated", async (data: any) => {
		setUserData(data);
	})
	// socket?.on('channelJoined', async (data: any) => {
		// 	console.log('channelJoined: ', data);
	// })
	if (!userData || !socket || !globalSocket || !users) {
		return <LoadingComponent />;
	}
	const twoFactorAuthentication = cookies.get('twoFactorAuthentication');
	return (
		<DataContext.Provider value={[userData, socket, globalSocket, users, protectedChannels, publicChannels, notifications, friends, setStream, stream, userList]}>
			<div className="flex dark:bg-main-dark-SPRUCE h-lvh relative dashboard" id='dashboard'>
				<SidebarComponent />
				<div className="overflow-auto  flex flex-col w-full md:mb-0 mb-14 ">
					<NavbarComponent />
					<div className="flex flex-1 justify-center relative">
						{
							callingUser ? (
								<div className={`justify-between flex-col z-50 flex select-none rounded-3xl absolute bg-zinc-800 cursor-grab active:cursor-grabbing w-72 h-[450px]`}>
									{
										(callRejected === true) ?
										 (
											<div className="flex flex-col justify-between item	s-center h-full p-4">
												<div className="flex flex-col justify-center items-center">
													<div className="flex justify-center items-center h-28 w-28 rounded-full bg-main-light-EGGSHELL">
														<img src={ baseAPIUrl +  callingUser.picture} alt="profile" className="rounded-full h-24 w-24 object-cover" />
													</div>
													<div className="flex justify-center items-center">
														<p className="font-bold text-white font-poppins text-lg">{callingUser.firstName + ' ' + callingUser.lastName }</p>
													</div>
													<div className="flex justify-center items-center">
														<p className="font-bold text-gray-300 font-poppins text-xs overflow-hidden">
															{callingUser.firstName + ' ' + callingUser.lastName } doesn't answer the call.
														</p>
													</div>
												</div>
											</div>
										)
										:
										(
											<div className="flex flex-col justify-between item	s-center h-full p-4">
												<div className="flex flex-col justify-center items-center">
													<div className="flex justify-center items-center h-28 w-28 rounded-full bg-main-light-EGGSHELL">
														<img src={ baseAPIUrl +  callingUser.picture} alt="profile" className="rounded-full h-24 w-24 object-cover" />
													</div>
													<div className="flex justify-center items-center">
														<p className="font-bold text-white font-poppins text-lg">{callingUser.firstName + ' ' + callingUser.lastName }</p>
													</div>
													<div className="flex justify-center items-center">
														<p className="font-bold text-gray-300 font-poppins text-xs overflow-hidden">
														{!callingUserStatus ? 'Connecting...' : 'Ringing...'}
														</p>
													</div>
												</div>
											</div>
										)
									}
								</div>
							)
							: callRequest && (
								<div className={`justify-between flex-col z-50 flex select-none rounded-3xl absolute bg-zinc-800 cursor-grab active:cursor-grabbing w-72 h-[450px]`}>
									<div className="flex flex-col justify-between item	s-center h-full p-4">
										<div className="flex flex-col justify-center items-center">
											<div className="flex justify-center items-center h-28 w-28 rounded-full bg-main-light-EGGSHELL">
												<img src={ baseAPIUrl +  callRequest.issuer.picture} alt="profile" className="rounded-full h-24 w-24 object-cover" />
											</div>
											<div className="flex justify-center items-center">
												<p className="font-bold text-white font-poppins text-lg">{callRequest.issuer.firstName + ' ' + callRequest.issuer.lastName }</p>
											</div>
										</div>
										<div className="flex justify-center items-center mt-4">
											<div className="div w-60 flex">
												<SwipeableButton
													onSuccess={() => acceptCall()}
													onFailure={() => {
														socket.emit("callRejected", {
															caller: callRequest.issuer,
															calle: callRequest.target
														})
														setCallRequest(null);
													}}
													text="slide to answer"
													text_unlocked="accepted"
													color="#00453F"
												/>
											</div>
										</div>
									</div>
								</div>
	
							)
						}
						{
							twoFactorAuthentication == "true" && (
								<TwoFAComponent userData={userData}/>
							)
						}
						{
							callPermission && caller && userCallingWith && (
								<DraggableDiv socketCHAT={socket} caller={caller} user={userCallingWith} setUserCallingWith={setUserCallingWith} setCallPermission={setCallPermission} selectedUserSocketId={selectedUserSocketId} />
							)
						}
						<Outlet />
					</div>
				</div>
			</div>
		</DataContext.Provider>
	)
}

export default DashboardComponent;
