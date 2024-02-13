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
	<div className={`bg-transparent h-[100vh] w-32 relative flex items-center justify-center ${isSidebarOpen ? 'block' : 'hidden'} `}>
		<div className="Side max-h-[600px] w-20 h-3/4 rounded-[25px] border-2 relative">
			<div className="h-full bg-[#2C2729] rounded-3xl py-8 top-0 left-0 right-0 bottom-0 flex flex-col  flex-wrap justify-between items-center">
			<div className="w-auto h-auto">
				<div className="w-auto h-[45px] relative flex flex-col justify-center items-center">
				<img src={logo} alt="" />
				</div>
			</div>
			<div className="w-8 h-8 p-1  bg-white rounded-lg z-10 cursor-pointer self-end " onClick={handleSideIcon}>
				{isSidebarOpen ? <img src={ExpandLeft} alt="expand-left" /> : <img src={ExpandRight} alt="expand-right" />}
			</div>
			<div className="w-auto flex-grow justify-center">
				<div className="icon-container flex-col justify-center">
					{icons.map((icon, index) => (
						<NavLink to={ icon.path } key={index} className="w-full">
						<div
							key={index}
							className={`px-3 py-4 rounded-lg justify-start items-center gap-3 flex cursor-pointer ${activeIndex === index ? 'bg-[#2C2729]' : ''
							}`}
							onClick={() => handleIconClick(index)}
						>
							{icon.icon}
						</div>
					</NavLink>
					))}
				</div>
			</div>
			<div className="w-full flex flex-col justify-end items-center">
				<div className="p-2  rounded-lg justify-center items-center gap-2 flex">
					<LogoutIcon activeIndex={false} />
				</div>
			</div>
			
			</div>
		</div>
	</div>
	</>
  );
}
export default SidebarComponent;