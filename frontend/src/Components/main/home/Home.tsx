import './Home.css';
import GameModesCarousel from './../game/game';
import { useContext } from 'react';
import DataContext from '../../../services/data.context';
import LoadingComponent from '../../shared/loading/loading';
import { Progress } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';
import Robot from './../../../assets/robot.png'
import image from './../../../assets/Image.png'
const HomeComponent: React.FC = () => {
	const active = "#B8F170";
	const userData = useContext(DataContext);
	if (!userData) {
		return <LoadingComponent />;
	}
	const customProgressTheme: CustomFlowbiteTheme['progress'] = {
		base: `w-64 overflow-hidden rounded-full bg-white dark:bg-gray-700`,
		bar: ` rounded-full text-center font-medium bg-[var(--${userData.coalition})] leading-auto text-white dark:text-cyan-100 space-x-2; `,
		color: {
			"red": `bg-${userData.coalition}`,
		},
	};
	return (
		<>
			<main className="flex-1 p-4 overflow-y-auto">
				<section className="min-h-2/3 flex items-center justify-center">
					<div className="w-full h-fill relative overflow-hidden">
						<div className="relative flex justify-between flex-col mt-8">
							<div className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-neutral-700 to-slate-900 rounded-3xl overflow-hidden">
								<div className="absolute inset-0 bg-teal-600 blur-[20px]"></div>
								<div className="absolute top-20 left-0 flex items-center">
									<img className="object-cover w-full h-full bg-cover" src={image} alt="Robot" />
								</div>
							</div>
							<div className="flex flex-col p-8 justify-between relative">
								<div className="flex flex-col justify-between">
									<div className="w-fit p-1 bg-gradient-to-br from-orange-700 to-amber-400 rounded-md">
										<div className="text-white font-bold text-sm">New Release</div>
									</div>
									<div className="div mt-4">
										<div className="text-white font-semibold text-3xl leading-10">AI: The Next Frontier</div>
									</div>
								</div>
								<div className="w-fit p-4 bg-gradient-to-r from-slate-900 via-gray-900 to-zinc-600 rounded-full">
									<div className="bg-emerald-400 rounded-3xl flex flex-col justify-center px-4 py-2">
										<div className="text-white font-bold">Play Now</div>
									</div>
								</div>
							</div>
						</div>
						<div className="robot absolute top-[-10%] z-10 -right-4">
							<img className="w-72 h-72" src={Robot} alt="Robot" />
						</div>
					</div>
				</section>



				{/* <div className='flex items-center flex-col mt-4 w-full p-2 justify-center'>
            <p className="uppercase text-white self-start">Games Mode</p>
                <GameModesCarousel />
        </div> */}
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
								color='red'
								size="xl"
								labelText
								textLabel='Level 0'
							/>
						</div>
					</div>
				</div>
				<div className="activity"></div>
			</aside>
		</>
	)
}
export default HomeComponent;