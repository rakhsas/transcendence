import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./HomePage.css";
import Logo from "./../assets/Frame 1.png";
import Google from "./../assets/icons8-google.svg";
import Intra from "./../assets/Group.png";
import UserService from "../services/user.service";
function HomePageComponent(): JSX.Element {
	const [openModal, setOpenModal] = useState(false);
	const [searchParams] = useSearchParams();
	const userService = new UserService();
	let accessToken: any, provider: any, firstLogin: any;
	function stringToBoolean(str: string): boolean {
		return str === "true";
	}
	const APIURL = import.meta.env.VITE_API_AUTH_KEY;
	async function loginWithIntra() {
		window.location.href = APIURL + "auth/42/login";
		// const data = await userService.login();
		// console.log("data" , data)
	}

	// accessToken = searchParams.get("accessToken");
	// provider = searchParams.get("provider");
	// firstLogin = searchParams.get("firstLogin");
	// if (accessToken)
	// 	localStorage.setItem('accessToken', accessToken)
	// if (provider)
	// 	localStorage.setItem('provider', provider)
	// if (firstLogin) {
	// 	setOpenModal(stringToBoolean(firstLogin))
	// }

	useEffect(() => {
		if (accessToken) localStorage.setItem("accessToken", accessToken);
		if (provider) localStorage.setItem("provider", provider);
		if (firstLogin) setOpenModal(stringToBoolean(firstLogin));
	}, [accessToken, provider, firstLogin]);
	const ele: Element | null = document.querySelector("[role=dialog]");
	var btn: HTMLButtonElement | null;
	if (ele && ele != null) {
		btn = ele?.querySelector("button");
		if (btn) btn.style.display = "none";
	}

	return (
		<>
			<div className="dashboardContainer bg-auto sm:bg-center md:bg-center h-full">
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
					<div className="Button lg:ml-4 md:ml-0 mt-4 lg:w-48 lg:h-12 w-full md:w-44 px-2 py-2 bg-neutral-800 rounded-lg shadow border-2 border-red-600 justify-center items-center gap-2 inline-flex">
						<div className="ContinueWith text-white text-base font-semibold font-['Inter'] leading-snug">Continue with</div>
						<div className="Plus w-6 h-6 p-1 justify-center items-center flex">
							<div className="Group w-4 h-4 relative">
								<img src={Google} alt="" />
							</div>
						</div>
					</div>
					<div className="Button lg:ml-4 md:ml-0 mt-4 lg:w-48 lg:h-12 w-full md:w-44 px-2 py-2 bg-neutral-800 rounded-lg shadow border-2 border-red-600 justify-center items-center gap-2 inline-flex hover:cursor-pointer" onClick={loginWithIntra}>
						<div className="ContinueWith text-white text-base font-semibold font-['Inter'] leading-snug">Continue with</div>
						<div className="Plus w-6 h-6 p-1 justify-center items-center flex">
							<div className="Group w-4 h-4 relative">
								<img src={Intra} alt="" />
							</div>
						</div>
					</div>
				</div>
				<div className="info mt-4 lg:ml-40 ml-16">
					<span className="text-gray-300 text-sm lg:ml-4 no-underline">
						This website requires a 42intra account for sign-up and sign-in.
					</span>
				</div>
			</div>
		</>
	);
}

export default HomePageComponent;
