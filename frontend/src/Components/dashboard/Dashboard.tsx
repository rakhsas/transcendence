import { Routes, Route, Outlet } from 'react-router-dom';
import NavbarComponent from "../shared/navbar/navbar";
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
	const [friends, setFriends] = useState<any>();
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
	socket?.on("usernameUpdated", async (data: any) => {
        // userData[0] = data;
        setUserData(data);
    })
	socket?.on('updatedFriends', async (data: any) => {
		setFriends(data);
	})
	if (!userData || !socket || !globalSocket || !users) {
		return <LoadingComponent />;
	}
	const twoFactorAuthentication = cookies.get('twoFactorAuthentication');
	return (
		<DataContext.Provider value={[userData, socket, globalSocket, users, protectedChannels, publicChannels, notifications, friends]}>
			<div className="flex dark:bg-main-dark-SPRUCE bg-main-light-WHITEBLUE h-lvh ">
				<SidebarComponent />
				<div className="overflow-auto  flex flex-col w-full md:mb-0 mb-14 ">
					<NavbarComponent />
					<div className="flex flex-1">
						{
							twoFactorAuthentication == "true" && (
								<TwoFAComponent userData={userData}/>
							)
						}
						{/* <DraggableDiv socketCHAT={socket}/> */}
						<Outlet />
					</div>
				</div>
			</div>
		</DataContext.Provider>
	)
}
export default DashboardComponent;
