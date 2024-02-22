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
import { NavLink } from "react-router-dom";
import User from '../../../model/user.model';
import DataContext from '../../../services/data.context';

function SidebarComponent(): JSX.Element {
	const [isSidebarOpen, setSidebarOpen] = useState(true);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const handleSideIcon = () => {
		setSidebarOpen(!isSidebarOpen);
	};
	const handleIconClick = (index: number) => {
		setActiveIndex(index);
	};
	
	const icons = [
		{ icon: <HomeIcon activeIndex={activeIndex} />, label: 'Home', path: '' },
		{ icon: <ProfileIcon activeIndex={activeIndex} />, label: 'Profile', path: 'profile' },
		{ icon: <AnalyticsIcon activeIndex={activeIndex} />, label: 'Analytics', path: 'analytics' },
		{ icon: <ChatIcon activeIndex={activeIndex} />, label: 'Chat', path: 'chat' },
		{ icon: <SettingsIcon activeIndex={activeIndex} />, label: 'Settings', path: 'settings' }
	];

  return (
	<>
		<div className="w-[100px] bg-zinc-900 shadow overflow-y-auto flex flex-col justify-between h-screen">
			<img src={logo} alt="Logo" className="mx-auto pt-10" />
			<div className="flex flex-col justify-center flex-grow mx-auto">
				{icons.map((icon, index) => (
					<NavLink to={icon.path} key={index} className="w-full">
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
			{/* <div className="mx-auto pb-10">
				<LogoutIcon activeIndex={false} />
			</div> */}
		</div>
	</>
  );
}
export default SidebarComponent;