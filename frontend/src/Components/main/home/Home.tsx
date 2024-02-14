import './Home.css'
import avatar from './../../../assets/img/Frame.svg'
import coin from './../../../assets/img/icons8-coin-48.png'
import GameModesCarousel from './../game/game';
import { useContext } from 'react';
import DataContext from '../../../services/data.context';
import LoadingComponent from '../../shared/loading/loading';
import { Progress } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';


const HomeComponent: React.FC = () => {
	const active = "#B8F170";
	// const inactive = "#e0a91d";
	const userData = useContext(DataContext);
	let customProgressTheme: CustomFlowbiteTheme['progress'];
	if (!userData) {
		return <LoadingComponent />;
	} else {
		customProgressTheme = {
			base: `w-64 overflow-hidden rounded-full bg-white dark:bg-gray-700`,
			label: "flex justify-between font-medium dark:text-white",
			"bar": "rounded-full text-center font-medium bg-white leading-auto text-black dark:text-cyan-100 space-x-2",
			"color": {
				coalition: `bg-${userData.coalition}`,
			}
		}
	}
	// console.log(customProgressTheme.base)
	return (
		<>
			<main className="flex-1 p-4 overflow-y-auto">
				<section className="min-h-1/2 border-2 border-fuchsia-700 rounded-3xl">
					<div className='flex items-center flex-col mt-4 w-full p-2 justify-center'>
						<p className="uppercase text-yellow-200 self-start">Games Mode</p>
						{/* <div className='container mx-auto flex-1'> */}
							<GameModesCarousel />
						{/* </div> */}
					</div>
				</section>
				<section className="bg-green-500 h-2/3 mt-4">
					<ul>
						<li>mode2</li>
						<li>mode3</li>
					</ul>
				</section>
			</main>
			<aside className="bg-main-1 p-8 border-2 rounded-lg lg:block md:block hidden">
				<div className="profile rounded-2xl border-white border-2 bg-cover overflow-hidden" style={{ backgroundImage: `url(${userData.coalitionCover})` }}>
					<div className="flex flex-col w-full sm:gap-3 justify-between p-4">
						<div className="flex flex-col lg:flex-row">
							<div className="grid place-items-center relative">
								<div
									className="w-48 h-48 text-black md:w-36 md:h-36 lg:h-24 lg:w-24 bg-cover bg-no-repeat bg-center rounded-full bg-gray-300 border-2 shadow-base"
									style={{ backgroundImage: `url(${userData.picture})`, borderColor: `${userData.coalitionColor}`, borderWidth: '3px' }}>
								</div>
								<a>
									<div className="relative mt-[-2px] grid place-items-center">
										<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="banner" x="0px" y="0px" width="70" height="70" viewBox="0 0 68 104" fill={userData ? userData.coalitionColor : '#000'} xmlSpace="preserve" className="coalition-flag--flag">
											<g id="banner-content">
												<g id="UI-Intranet-banner-content" transform="translate(-96.000000, -60.000000)">
													<g id="banner-content-g-1" transform="translate(96.000000, 60.000000)">
														<polygon id="banner-content-polygon-1" points="0,0 0,80.5 34.3,104 68,80.5 68,0"></polygon>
													</g>
												</g>
											</g>
											<foreignObject x="0" y="0" width="68" height="50" >
												<img src={userData.coalitionPic} alt="" />
											</foreignObject>
										</svg>
									</div>
								</a>
							</div>
							<div className="lg:pl-2 overflow-hidden">
								<h2 className="text-2xl text-white font-bold text-center py-4 lg:text-left lg:py-0 drop-shadow-md">
									{userData.firstName + ' ' + userData.lastName}
								</h2>
								<p className="text-sm text-white lg:text-black">
									{userData.username}
								</p>
								<div className="text-sm flex flex-row items-center gap-1">
									<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#B8F170" stroke="#10742C">
										<circle cx="5" cy="5" r="4" fill={active} stroke="#000"></circle>
									</svg>
									<div className="drop-shadow-md text-white">Status</div></div>
							</div>
						</div>
						<div className="flex flex-col gap-6 lg:gap-3">
							<Progress
								theme={customProgressTheme}
								progress={72}
								color='coalition'
								size="xl"
								labelText
								textLabel='Level 0'
							/>
						</div>
						{/* Add other elements */}
					</div>
				</div>
				<div className="activity"></div>
			</aside>
		</>
	)
}
export default HomeComponent;