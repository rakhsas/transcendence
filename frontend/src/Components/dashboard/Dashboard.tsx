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
function DashboardComponent() {
	const [userData, setUserData] = useState<User | null>(null);

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
	<DataContext.Provider value={userData}>
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
