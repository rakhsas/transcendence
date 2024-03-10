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
// const url: string = "wss://10.12.249.229";
const url: string = "wss://" + import.meta.env.VITE_API_SOCKET_URL;
function DashboardComponent() {
	const [userData, setUserData] = useState<User | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);
	// const user = {
	// 	"id": "92ec84f8-33aa-4134-9f26-36bb12d68576",
	// 	"providerId": "95248",
	// 	"createdAt": "2024-03-07T19:29:22.895Z",
	// 	"updatedAt": "2024-03-07T19:29:22.895Z",
	// 	"firstName": "Rida",
	// 	"lastName": "Akhsas",
	// 	"picture": "https://cdn.intra.42.fr/users/1f8286f7d5687c6260fb6bca81d05853/rakhsas.JPG",
	// 	"provider": "42",
	// 	"coalition": "Pandora",
	// 	"coalitionPic": "https://cdn.intra.42.fr/coalition/image/77/Pandora-01.svg",
	// 	"coalitionCover": "https://cdn.intra.42.fr/coalition/cover/77/Pandora_BG.jpg",
	// 	"coalitionColor": "#b61282",
	// 	"email": "rakhsas@student.1337.ma",
	// 	"username": "rakhsas",
	// 	"adding": [],
	// 	"added": [],
	// 	"blocks": [],
	// 	"blocking": []
	// }
	useEffect(() => {
		const fetchData = async () => {
			try {
				const authService = new AuthService();
				const fetchedPayloadData = await authService.getPayload();
				const userService = new UserService();
				const fetchedUserData = await userService.getUser(fetchedPayloadData.id);
				setUserData(fetchedUserData);
			} catch (error) {
				console.error('Error fetching user ', error);
			}
		};
	
		fetchData();
		// setUserData(user);
	
		const socketCHAT: Socket = io(url, {
			path: "/chat",
		});
	
		setSocket(socketCHAT);
	
		return () => {
			socketCHAT.disconnect();
		};
	}, []);
	return (
		<DataContext.Provider value={[userData, socket]}>
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
