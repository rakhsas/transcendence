import React, { Suspense } from "react";
import "./HomePage.css";
import { useEffect, useState } from "react";
import LoadingComponent from "./shared/loading/loading";
// import Spline from '@splinetool/react-spline';
const Spline = React.lazy(() => import('@splinetool/react-spline'));
function HomePageComponent(): JSX.Element {
	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
	const [theme, setTheme] = useState(localStorage.theme);
	const colorTheme = theme === 'dark' ? 'light' : 'dark';
	async function loginWithIntra() {
		window.location.href = APIURL + "auth/42/login";
	}
	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove(colorTheme);
		root.classList.add(theme);
		localStorage.setItem('theme', theme);
	}, [theme, colorTheme]);
	{/* <div className="dashboardContainer bg-auto sm:bg-center md:bg-center h-full">
	<div className="logo-container">
	<img src={Logo} alt="Game Logo" className="logo mt-4 lg:ml-32 ml-5" />
	</div>
	<div
	className="LetSKickNow lg:w-auto md:h-auto lg:h-56 lg:ml-44 ml-16 lg:mt-32 mt-8 text-orange-300 lg:text-7xl text-6xl font-bold  font-['IBM Plex Sans Thai Looped'] tracking-widest overflow-hidden">
	LET’S
	<br />
	KICK
	<br />
	NOW
	</div>
	<div className="ItSEasyAndTakesLessThan20Second lg:ml-44 ml-16 mt-4 text-orange-300 lg:text-2xl text-1xl font-bold font-['IBM Plex Sans Thai Looped'] tracking-widest">it’s easy and takes less than 20 second</div>
	<div className="buttons flex lg:flex-row flex-col lg:ml-40 ml-16 mr-16 mt-12">
	<div className="Button lg:ml-4 md:ml-0 mt-4 lg:w-48 lg:h-12 w-full md:w-44 px-2 py-2 bg-neutral-800 rounded-lg shadow border-2 border-red-600 justify-center items-center gap-2 inline-flex hover:cursor-pointer" onClick={loginWithIntra}>
	<div className="ContinueWith text-white text-base font-semibold font-['Inter'] leading-snug">Continue with</div>
	<div className="Plus w-6 h-6 p-1 justify-center items-center flex">
	<div className="Group w-4 h-4 relative">
	<img src="https://profile.intra.42.fr/assets/42_logo_black-684989d43d629b3c0ff6fd7e1157ee04db9bb7a73fba8ec4e01543d650a1c607.png" alt="" />
	</div>
	</div>
	</div>
	</div>
	<div className="info mt-4 lg:ml-40 ml-16">
	<span className="text-gray-300 text-sm lg:ml-4 no-underline">
	This website requires a 42intra account for sign-up and sign-in.
	</span>
	</div>
</div> */}
	return (
		<Suspense fallback={<LoadingComponent />}>
			<div className="flex flex-col h-screen">
				<section className="w-full new:px-16 px-4 text-gray-700 bg-white dark:bg-zinc-800 overflow-hidden">
					<div className="container flex flex-col flex-wrap items-center justify-between py-5 mx-auto md:flex-row max-w-7xl">
						<div className="relative flex flex-col md:flex-row">
							<a href="#_" className="flex items-center mb-5 font-medium text-gray-900 lg:w-auto lg:items-center lg:justify-center md:mb-0">
								<span className="mx-auto text-xl font-black leading-none text-gray-900 dark:text-white select-none">PING<span className="text-main-light-EGGSHELL dark:text-main-light-FERN">PONG.</span></span>
							</a>
						</div>
						<div className="inline-flex items-center ml-5 space-x-6 lg:justify-end"  onClick={() => { setTheme(colorTheme); }}>
							<svg  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 4000 4000" style={{ display: colorTheme === "dark" ? 'block' : "none" }}>
								<path className={`${colorTheme === "dark" ? 'fill-black' : "fill-white"}`} d="M2000 1320A680 680 0 102000 2680 680 680 0 102000 1320zM2000 1047.95c-75.105 0-136-60.895-136-136V776c0-75.105 60.895-136 136-136s136 60.895 136 136v135.95C2136 987.056 2075.105 1047.95 2000 1047.95zM2769.383 1366.634c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.125 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C2839.043 1353.353 2804.18 1366.634 2769.383 1366.634zM3224 2136h-135.934c-75.105 0-136-60.895-136-136s60.895-136 136-136H3224c75.105 0 136 60.895 136 136S3299.105 2136 3224 2136zM2865.473 3001.506c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C2935.066 2988.241 2900.27 3001.506 2865.473 3001.506zM2000 3360c-75.105 0-136-60.895-136-136v-135.95c0-75.105 60.895-136 136-136s136 60.895 136 136V3224C2136 3299.105 2075.105 3360 2000 3360zM1134.527 3001.506c-34.797 0-69.594-13.265-96.156-39.811-53.125-53.092-53.125-139.204-.066-192.329l96.09-96.14c53.125-53.158 139.254-53.142 192.379-.05s53.125 139.204.066 192.329l-96.09 96.14C1204.188 2988.208 1169.324 3001.506 1134.527 3001.506zM911.934 2136H776c-75.105 0-136-60.895-136-136s60.895-136 136-136h135.934c75.105 0 136 60.895 136 136S987.039 2136 911.934 2136zM1230.617 1366.634c-34.797 0-69.66-13.281-96.223-39.86l-96.09-96.14c-53.059-53.125-53.059-139.237.066-192.329s139.254-53.108 192.379.05l96.09 96.14c53.059 53.125 53.059 139.237-.066 192.329C1300.211 1353.369 1265.414 1366.634 1230.617 1366.634z"></path>
							</svg>
							<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 64 64" style={{ display: colorTheme === "dark" ? 'none' : "block" }}>
								<path className={`${colorTheme === "light" ? "fill-white" : 'fill-black'}`} d="M55.68,36.83c0.32,0.45,0.41,1.02,0.22,1.57C52.59,47.73,43.72,54,33.83,54c-12.9,0-23.4-10.5-23.4-23.41	c0-11.02,7.83-20.65,18.61-22.9c0.12-0.03,0.24-0.04,0.36-0.04c0.65,0,1.23,0.37,1.53,0.96c0.3,0.61,0.24,1.33-0.19,1.89	C28.25,13.62,27,17,27,23c0.44,5.97,3.66,11.21,9,14c2.42,1.23,5.62,1.82,8.38,1.82c3.14,0,6.24-0.86,8.96-2.48	c0.27-0.17,0.58-0.25,0.9-0.25C54.81,36.09,55.35,36.36,55.68,36.83z M33.83,50.68c7.04,0,13.51-3.7,17.13-9.61	c-2.11,0.71-4.31,1.07-6.58,1.07c-11.45,0-20.77-9.32-20.77-20.77c0-3.2,0.73-6.31,2.12-9.14c-7.17,3.17-11.98,10.38-11.98,18.36	C13.75,41.67,22.76,50.68,33.83,50.68z"></path>
							</svg>
						</div>
					</div>
				</section>
				<section className="px-2 py-32 bg-white dark:bg-zinc-800 md:px-0 relative h-full overflow-hidden">
					<div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
						<div className="flex flex-wrap items-center sm:-mx-3">
							<div className="w-full flex flex-row justify-between overflow-hidden border-0">
								<div className="scene absolute w-full h-full">
									<Spline scene="https://prod.spline.design/PZbUFccq1l6V2YHi/scene.splinecode" className=""/>
								</div>
								<div className="w-full md:w-1/2 md:px-3 absolute top-1/2 md:top-1/3">
									<div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0 z-50">
										<h1 className="text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
											<span className="block xl:inline">Join The Adventure</span>
											<span className="block xl:inline"> PINGPONG.</span>
										</h1>
										<div className="relative flex flex-col sm:flex-row sm:space-x-4  w-fit">
											<a className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-gradient-to-r from-main-light-FERN to-main-light-EGGSHELL rounded-md sm:mb-0 sm:w-auto cursor-pointer" onClick={loginWithIntra}>
												Continue with Intra
												<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="w-full px-4 text-gray-700 bg-white dark:bg-zinc-800 overflow-hidden">
				</section>
			</div>
		</Suspense>
	);
}

export default HomePageComponent;
