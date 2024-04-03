// import { Engine } from "@tsparticles/engine";
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
// const url: string = "wss://10.12.249.229";
const url: string = "https://" + import.meta.env.VITE_API_SOCKET_URL;
function DashboardComponent() {
	const [userData, setUserData] = useState<User | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [globalSocket, setGlobalSocket] = useState<Socket | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [protectedChannels, setProtectedChannels] = useState<Channel[]>([]);
	const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
	const [notifications, setNotifications] = useState<notificationInterface[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const authService = new AuthService();
				const fetchedPayloadData = await authService.getPayload();
				const userService = new UserService();
				const fetchedUserData = await userService.getUser(fetchedPayloadData.id);
				setUserData(fetchedUserData);
				console.log(fetchedUserData)
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
				const socketCHAT: Socket = io(url, {
					path: "/chat",
					query: {
						userName: fetchedUserData?.username
					},
					withCredentials: true
				});
				setSocket(socketCHAT);
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
	if (!userData || !socket || !globalSocket || !users) {
		return <LoadingComponent />;
	}
	return (
		<DataContext.Provider value={[userData, socket, globalSocket, users, protectedChannels, publicChannels, notifications]}>
			<div className="flex dark:bg-main-dark-SPRUCE bg-main-light-WHITEBLUE h-lvh ">
				<SidebarComponent />
				<div className="overflow-auto  flex flex-col w-full">
					<NavbarComponent />
					<div className="flex flex-1">
						<Outlet />
					</div>
				</div>
			</div>
		</DataContext.Provider>
	)
}
export default DashboardComponent;
