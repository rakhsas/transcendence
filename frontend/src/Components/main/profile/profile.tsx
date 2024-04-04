
import { useContext, useEffect, useState } from 'react';
// import DataContext from '../../../services/data.context';

import DataContext from '../../../services/data.context';
import Achei from '../../../assets/acheivements/poker.png'
import Achei2 from '../../../assets/acheivements/fire.png'
import Achei3 from '../../../assets/acheivements/fire3.png'
import Achei4 from '../../../assets/acheivements/fire2.png'
import Achei1 from '../../../assets/acheivements/poker1.png'
import './updateprofile.css'
import CreatChartDesign from './Chart';
import picture from './mdarify.png'
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../shared/loading/loading';
import User from '../../../model/user.model';
import { gameScores, totalGames } from '../../../utils/types';
import { GameService } from '../../../services/game.service';
import { Socket } from 'socket.io-client';

interface ButtonAttributes {
	className: string;
	value: string;
	onClick?: () => void;
}

const FunctionProfileForm: React.FC = () => {
	const [id, setId] = useState<string>('');
	const userData = useContext(DataContext);
	const [user, setUser] = useState<any>();
	const [friends, setFriends] = useState<User[]>();
	const [users, setUsers] = useState<User[]>();
	const [BlockedFriend, SetBlocked] = useState<boolean>(false);
	const [score, setScore] = useState<gameScores[]>([]);
	const [totalGames, setTotalGames] = useState<any>();
	const [socketChat, setSocketChat] = useState<Socket>();
	const achievements = [
		{
			icon: Achei,
			name: 'Play The First Game',
			description: 'Play the first game on the platform',
			completed: true
		},
		{
			icon: Achei1,
			name: 'Play The Second Game',
			description: 'Play the second game on the platform',
			completed: true
		},
		{
			icon: Achei2,
			name: 'Play The Third Game',
			description: 'Play the third game on the platform',
			completed: false
		},
		{
			icon: Achei3,
			name: 'Play The Fourth Game',
			description: 'Play the fourth game on the platform',
			completed: true
		},
		{
			icon: Achei4,
			name: 'Play The Fifth Game',
			description: 'Play the fifth game on the platform',
			completed: true
		},
	];
	const gameService = new GameService();
	useEffect(() => {
		if (!userData) {
			return;
		}
		let routepath = window.location.pathname;
		const idFromPath = routepath.split('/').findLast((item: any) => item) || '';
		setId(idFromPath);
		setUser(userData[0]);
		setUsers(userData[3]);
		setFriends(userData[7]);
		setSocketChat(userData[1]);
	}, [userData]);

	useEffect(() => {
		if (id !== 'profile' && user && friends && users) {
			const requestedUser = users.find((u) => u.id === id);
			if (requestedUser) {
				const isFriend = friends.some((friend) => friend.id === requestedUser.id);
				setUser((prevUser: User) => ({
					...prevUser,
					...requestedUser,
					isFriend: isFriend
				}));
			}
		}
	}, [id, friends, users]);

	useEffect(() => {
		const fetchScores = async () => {
			if (user) {
				const result = await gameService.GetScoreMatches(user.id);
				setScore(result);
				const totalGames = await gameService.getTotalMatches(user.id);
				setTotalGames(totalGames);
			}
		};
		fetchScores();
	}, [user]);

	const ButtonClick = () => {
		SetBlocked(!BlockedFriend);
	}
	if (!userData) {
		return <LoadingComponent />;
	}
	const sendFriendRequest = () => {
		if (socketChat && user) {
			socketChat.emit('friendRequest', {
				userId: userData[0].id,
				friendId: user.id
			});
		}
	}
	return (
		<div className="body m-4 flex flex-col new:flex-row w-full h-[90vh] justify-between gap-4 bg-inherit overflow-visible Setting">
			<div className="side1 flex flex-col gap-4 items-center w-full md:min-w-[35%] min-h-full overflow-hidden">
				<div className="w-full md:w-[85%] h-1/2 p-4 flex justify-center items-center dark:bg-zinc-900  bg-main-light-WHITE border-gray-200 rounded-3xl shadow overflow-hidden">
					<div className="flex flex-col p-2 items-center w-full">
						<div className="flex justify-center items-center p-1 w-full">
							<div className={`relative border-2 rounded-full `} style={{
								borderColor: user?.coalitionColor,
							}}>
								<img alt={user?.username} src={user?.picture} className="w-24 h-24 object-cover" />
							</div>
						</div>
						<div className="py-4">
							<h5 className="text-xl text-black dark:text-white font-bolder font-poppins">{user?.firstName + ' ' + user?.lastName}</h5>
						</div>
						{
							id && id !== 'profile' && (
								<div className="flex flex-1 flex-wrap justify-center items-center w-full py-2">
									{
										user && user?.isFriend === false ? (
											<button type="button" className="dark:text-white text-black bg-yellow-300 hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2 mb-2 me-2 dark:focus:ring-yellow-900" onClick={
												() => sendFriendRequest()
											}>
												Send Friend Request
											</button>
										) : (
											<button type="button" className="dark:text-white text-black bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2 mb-2 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Block</button>
										)

									}
								</div>
							)
						}
					</div>
				</div>
				<div className='w-full md:w-[85%] flex flex-col justify-between p-4 rounded-3xl items-center h-[75vh] dark:bg-zinc-900  bg-main-light-WHITE'>
					<div className="header w-full overflow-hidden text-center py-2.5">
						<h5 className='font-bolder dark:text-main-light-FERN text-main-light-EGGSHELL font-poppins uppercase'>ACHIEVEMENTS</h5>
					</div>
					<div className="achievements flex flex-col justify-center gap-8 w-full h-full">
						{
							achievements.map((achievement, index) => {
								return (
									<div key={index} className="flex flex-row justify-around items-center hover:bg-slate-700 rounded-md px-2 overflow-hidden">
										<img src={achievement.icon} className="ml-2 w-16 h-16" />
										<p className="flex flex-row justify-center items-center dark:text-white text-black">{achievement.name}</p>
										{
											achievement.completed ? (
												<svg className="w-6 h-6 dark:text-main-light-FERN text-main-light-EGGSHELL svgIcon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
													<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
												</svg>
											) : (
												<svg className="w-6 h-6 dark:text-main-light-FERN text-main-light-EGGSHELL svgIcon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
													<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
												</svg>
											)
										}
									</div>
								);
							})
						}
					</div>
				</div>
			</div>
			<div className="side2 flex flex-col gap-4 items-center w-full md:min-w-[65%] min-h-full overflow-hidden ">
			<div className="w-full md:w-[85%] p-4 flex flex-col items-center dark:bg-zinc-900 bg-main-light-WHITE h-[65%] border-gray-200 rounded-3xl overflow-hidden">
				<div className="header w-full overflow-hidden text-center py-2.5">
					<h5 className='font-bolder dark:text-main-light-FERN text-main-light-EGGSHELL font-poppins uppercase'>Games History</h5>
				</div>
				<div className="history flex flex-col justify-around items-center gap-4 w-full h-full overflow-y-auto">
					{
						score?.map((object: gameScores, index) => (
							<div key={index} className=' flex flex-row gap-8 justify-around items-center overflow-hidden w-full px-2'>
									<div className="user flex flex-col items-center">
										<div className={`rating flex flex-row ${object.winner.id === object.player1.id ? 'block' : 'hidden'}`}>
											<svg className="w-4 h-4 mt-2 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
												<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
											</svg>
											<svg className="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
												<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
											</svg>
											<svg className="w-4 h-4 mt-2 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
												<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
											</svg>
										</div>
										<img src={object.player1.picture} alt="" className='w-20 h-20 object-cover rounded-full' style={{ border: `2px solid ${object?.player1?.coalitionColor} ` }} />
									</div>
									<div className="flex flex-row gap-2">
										<p className="w-8 h-8 flex justify-center items-center dark:text-white text-black font-bold text-2xl">{object?.user_score}</p>
										<p className="w-8 h-8 flex justify-center items-center dark:text-white text-black font-bold text-sm">VS</p>
										<p className="w-8 h-8 flex justify-center items-center dark:text-white text-black font-bold text-2xl">{object?.player_score}</p>
									</div>
									<div className="user flex flex-col items-center">
										<div className={`rating flex flex-row ${object.winner.id === object.player2.id ? 'block' : 'hidden'}`}>
											<svg className="w-4 h-4 mt-2 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
												<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
											</svg>
											<svg className="w-4 h-4 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
												<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
											</svg>
											<svg className="w-4 h-4 mt-2 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
												<path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
											</svg>
										</div>
										<img src={object.player2.picture} alt="" className='w-20 h-20 object-cover rounded-full' style={{ border: `2px solid ${object?.player2?.coalitionColor} ` }} />
									</div>
								</div>
							))
						}
					</div>
				</div>
				<div className="w-full md:w-[85%] p-4 flex flex-col justify-between items-center dark:bg-zinc-900  bg-main-light-WHITE h-[35%] rounded-3xl">
					<div className="header w-full overflow-hidden text-center py-2.5">
						<h5 className='font-bolder dark:text-main-light-FERN text-main-light-EGGSHELL font-poppins uppercase'>user progress</h5>
					</div>
					<CreatChartDesign user={user} totalGames={totalGames} />
				</div>
			</div>
		</div>
	);
}

export default FunctionProfileForm;



