// import { Engine } from "@tsparticles/engine";
import { Routes, Route, Outlet } from 'react-router-dom';
import NavbarComponent from "../shared/navbar/navbar";
import SidebarComponent from "../shared/sidebar/sidebar";
import "./Dashboard.css"
import User from './../../model/user.model';
import { useEffect, useState } from 'react';
import UserService from '../../services/user.service';

function DashboardComponent(props: any) {
	const [userData, setUserData] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
		  try {
			const userService = new UserService();
			const fetchedUserData = await userService.getUser(95248);
			setUserData(fetchedUserData);
		  } catch (error) {
			console.error('Error fetching user ', error);
		  } finally {
			setIsLoading(false);
		  }
		};
		fetchData();
	  }, []);
	  if (isLoading) {
		return <div> Loading... </div>;
	  }
  return (
	<div className="all flex bg-main-1">
	  <SidebarComponent {...userData!}/>
	  <div className="overflow-hidden flex-1 w-3/4">
		<NavbarComponent />
		
		<div className="h-[100vh] flex-1 flex ">
			<Outlet />
		</div>
	  </div>
	</div>
  )
}

export default DashboardComponent;
