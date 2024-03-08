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
	const socket: Socket = io(url, {
        path: "/chat",
    });
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
