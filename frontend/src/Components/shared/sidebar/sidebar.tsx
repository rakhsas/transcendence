import './sidebar.css';
import logo from './../../../assets/logo/logo.secondary.png'
import { useContext, useEffect, useState } from 'react';
import ProfileIcon from '../icons/Profile';
import HomeIcon from '../icons/Home';
import AnalyticsIcon from '../icons/Analytics';
import ChatIcon from '../icons/Chat';
import SettingsIcon from '../icons/Settings';
import LogoutIcon from '../icons/Logout';
import { NavLink, useLocation } from "react-router-dom";
import DataContext from '../../../services/data.context';
import { PathLiteral, Paths } from '../../../utils/types';
import AuthService from '../../../services/auth.service';
const paths = {
	[Paths.EMPTY]: 0,
	[Paths.PROFILE]: 1,
	[Paths.ANALYTICS]: 2,
	[Paths.CHAT]: 3,
	[Paths.SETTINGS]: 4
}
function SidebarComponent(): JSX.Element {
	const location = useLocation();
	const userData = useContext(DataContext);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const handleIconClick = (index: number) => {
		setActiveIndex(index);
	};
	const pathname = (location.pathname.split('/')[2]) as PathLiteral;
	useEffect(() => {
		if (pathname)
			setActiveIndex(paths[pathname]);

	}, [pathname]);
	const logout = async () => {
		const authService = new AuthService();
		await authService.logout();
	};
	const icons = [
		{ icon: <HomeIcon activeIndex={activeIndex} />, label: 'Home', path: Paths.EMPTY },
		{ icon: <ProfileIcon activeIndex={activeIndex} />, label: (Paths.PROFILE), path: Paths.PROFILE },
		{ icon: <ChatIcon activeIndex={activeIndex} />, label: 'Chat', path: Paths.CHAT },
		{ icon: <AnalyticsIcon activeIndex={activeIndex} />, label: 'Analytics', path: Paths.ANALYTICS },
		{ icon: <SettingsIcon activeIndex={activeIndex} />, label: 'Settings', path: Paths.SETTINGS }
	];

	return (
		<>
			<div className="containe overflow-hidden flex items-center justify-center py-4 px-2">
				<div className="w-[100px] dark:bg-zinc-900# dark: bg-main-light-EGGSHELL  shadow overflow-y-auto md:flex flex-col justify-between h-full hidden rounded-3xl">
					{/* <img src={logo} alt="Logo" className="mx-auto pt-10" /> */}
					<div className="logot m-auto p-6">
						<img src={logo} alt="logo" />
					</div>
					<div className="flex flex-col justify-center flex-grow mx-auto">
						{icons.map((icon, index) => (
							<NavLink to={icon.path === 'profile' ? icon.path + '/' + userData[0].id : icon.path} key={index} className="w-full">
								<div
									key={index}
									className="px-3 py-4 rounded-lg justify-start items-center gap-3 flex cursor-pointer"
									onClick={() => handleIconClick(index)}
								>
									{icon.icon}
								</div>
							</NavLink>
						))}
					</div>
					<div className="mx-auto pb-10" onClick={() => { logout() }}>
						<LogoutIcon activeIndex={false} />
					</div>
				</div>
			</div>
			<div className="containe overflow-hidden md:hidden absolute bottom-0 flex items-center justify-center py-1 px-2 w-full">
				<div className='dark: bg-main-light-EGGSHELL z-20 w-full rounded-2xl'>
					<div className='flex justify-center items-center ' >
						<div className="flex justify-center flex-grow mx-auto  px-3">
							{icons.map((icon, index) => (
								<NavLink to={icon.path === 'profile' ? icon.path + '/' + userData[0].id : icon.path} key={index} className="w-full">
									<div
										key={index}
										className="px-2 py-2 rounded-lg justify-start items-center gap-2 flex cursor-pointer"
										onClick={() => handleIconClick(index)}
									>
										{icon.icon}
									</div>
								</NavLink>
							))}
						</div>
						<div className="w-7  mr-3 " onClick={() => { logout() }}>
							<LogoutIcon activeIndex={false} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
export default SidebarComponent;
