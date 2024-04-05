import './sidebar.css';
import logo from './../../../assets/Frame 1.svg'
import { useContext, useEffect, useState } from 'react';
import ExpandLeft from './../../../assets/Icon/Expand_left.png'
import ExpandRight from './../../../assets/Icon/Expand_right.png'
import ProfileIcon from '../icons/Profile';
import HomeIcon from '../icons/Home';
import AnalyticsIcon from '../icons/Analytics';
import ChatIcon from '../icons/Chat';
import SettingsIcon from '../icons/Settings';
import LogoutIcon from '../icons/Logout';
import { NavLink, useLocation } from "react-router-dom";
import User from '../../../model/user.model';
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
		{ icon: <ChatIcon activeIndex={activeIndex} />, label: 'Chat', path: Paths.CHAT},
		{ icon: <AnalyticsIcon activeIndex={activeIndex} />, label: 'Analytics', path: Paths.ANALYTICS },
		{ icon: <SettingsIcon activeIndex={activeIndex} />, label: 'Settings', path: Paths.SETTINGS }
	];

  return (
	<>
		<div className="w-[100px] dark:bg-zinc-900 bg-main-light-WHITE shadow overflow-y-auto flex flex-col justify-between h-screen">
			<img src={logo} alt="Logo" className="mx-auto pt-10" />
			<div className="flex flex-col justify-center flex-grow mx-auto">
				{icons.map((icon, index) => (
					<NavLink to={icon.path === 'profile' ?  icon.path + '/' + userData[0].id : icon.path} key={index} className="w-full">
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
				<LogoutIcon activeIndex={false}/>
			</div>
		</div>
	</>
  );
}
export default SidebarComponent;