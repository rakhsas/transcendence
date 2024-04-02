import { useEffect, useState } from "react";
import { Checkbox, TextInput } from "flowbite-react";
import UserService from "../../../services/user.service";
import { inputTheme } from "../../../utils/themes";
import { Translate } from "@mui/icons-material";
import { Socket } from "socket.io-client";
import User from "../../../model/user.model";
import { log10 } from "chart.js/helpers";

type DetailsAreaProps = {
	channelInfo: any;
	handleOpenDetails: () => void,
	userData: any,
	chatSocket: any,
	setRoomMembers: any,
	roomMembers: any
}
const search: any = () => (
	<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
		<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
	</svg>
)

type alertProps = {
	user: User,
	isVisible: boolean
}

const RoomDetails: React.FC<DetailsAreaProps> = ({
	channelInfo,
	handleOpenDetails,
	userData,
	chatSocket,
	setRoomMembers,
	roomMembers
}) => {
	const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
	console.log(channelInfo)
	if (!channelInfo) {
		return null;
	}
	const [isdropdownUsersOpen, setDropdownUsersStatus] = useState<boolean>(false);
	const [muteUsersDropdown, setmuteUsersDropdownStatus] = useState<boolean>(false);
	const [userInput, setUserInput] = useState<string>('');
	const [users, setUsers] = useState<any[]>();
	const [usersCopy, setUsersCopy] = useState<any[]>();
	const [filtredUsers, setFiltredUsers] = useState<any[]>();
	const userService = new UserService();
	const [optionsDropdown, setOptionsDropdown] = useState<boolean[]>(Array(roomMembers.length).fill(false));
	const [alerts, setAlerts] = useState<alertProps[]>(roomMembers.map((member: any) => ({ user: member.user, isVisible: false })));
	useEffect(() => {
		const fetchUsers = async () => {
			const users = await userService.getAllUsersExcept(userData[0].id);
			setUsers(users);
			const usersCopy = users.map((user: any) => ({ ...user, selected: false }));
			setUsersCopy(usersCopy);
		}
		fetchUsers();
	}, [])
	useEffect(() => {
		if (userInput === '') {
			setFiltredUsers([]);
			return;
		}
		const filteredUsers = users?.filter(user => {
			const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
			return (
				(fullName.includes(userInput.toLowerCase()) || user.username.toLowerCase().includes(userInput.toLowerCase())) &&
				!roomMembers.some((member: any) => member.user.id === user.id)
			);
		});
		setFiltredUsers(filteredUsers);
	}, [userInput, alerts]);
	const toggleOptionsDropdown = (index: number) => {
		const newDropdownOpen = [...optionsDropdown];
		newDropdownOpen[index] = !newDropdownOpen[index];
		setOptionsDropdown(newDropdownOpen);
	}

	const handleCheckboxChange = (index:number, user1: any) => {
		// Update usersCopy array when a checkbox is toggled
		const updatedUsersCopy = usersCopy?.map((user, i) =>
		  user.username === user1.username ? { ...user, selected: !user.selected } : user
		);
		setUsersCopy(updatedUsersCopy);
	  };
	const addUser = async () => {
		console.log('users: ', users);
		console.log('usersCopy: ', usersCopy);
		usersCopy?.forEach((user: any, index: number) => {
			if (user.selected) {
				const updatedUsersCopy = [...usersCopy];
				updatedUsersCopy[index].selected = false; // Set to false after adding
				setUsersCopy(updatedUsersCopy);
				chatSocket?.emit('joinChannel', {
					id: channelInfo.id,
					__owner__: user.id,
					role: 'MEMBER',
					requestedUserId: userData[0].id,
					userName: user.username,
					channelName: channelInfo.name
				});
			}
		  });
		  const selectedUsers = usersCopy?.filter(user => user.selected);
		  const newRoomMembers = selectedUsers && [...roomMembers, ...selectedUsers];
		  setRoomMembers(newRoomMembers);
	  
		  // Reset the selection in usersCopy state
		  const updatedUsersCopy = usersCopy?.map(user => ({ ...user, selected: false }));
		  setUsersCopy(updatedUsersCopy);
	  
		  // Clear the userInput state
		  setUserInput('');
	};
	chatSocket?.on('channelJoined', async (data: any) => {
		setRoomMembers(data);
		console.log(data);
	})
	chatSocket?.on('joinedError', (payload: any) => {
	})
	const kickUser = (userId: string, channelId: number) => {
		chatSocket?.emit('kickTheUser', {
			userId,
			channelId
		});
	}
	useEffect(() => {
		console.log(filtredUsers)
	}, [filtredUsers, users, usersCopy])
	return (
		<>
			{
				!channelInfo ? null :
					<div className="detail-area shrink-0 border-l-[1px] border-gray-700 ml-auto flex flex-col overflow-auto">
						<div className="detail-area-header">
							<div className="msg-profile group w-16 h-16" onClick={handleOpenDetails}>
								<img src={baseAPIUrl + channelInfo.picture} alt="" className="w-full h-full" />
							</div>
							<div className="font-onest text-xl capitalize text-black dark:text-white overflow-hidden">{channelInfo.name}</div>
						</div>
						{
							channelInfo.private === true &&
							(
								<>
									<div className="flex flex-row justify-between items-center">
										<div className="options flex flex-row items-center justify-around p-4 overflow-hidden">
											<div className="item flex justify-between flex-col items-center space-y-1 cursor-pointer" onClick={() => setDropdownUsersStatus(!isdropdownUsersOpen)}>
												<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
													<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
												</svg>
												<span className="text-black dark:text-white font-onest text-xs capitalize"> Add Member </span>
											</div>
										</div>
										<div className="options flex flex-row items-center justify-around p-4 overflow-hidden">
											<div className="item flex justify-between flex-col items-center space-y-1 cursor-pointer" onClick={() => setmuteUsersDropdownStatus(!muteUsersDropdown)}>
												<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
													<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
												</svg>
												<span className="text-black dark:text-white font-onest text-xs capitalize"> Mute Member </span>
											</div>
										</div>
									</div>
									<div className={`w-auto max-w-xl h-auto ${isdropdownUsersOpen ? 'block' : 'hidden'} mx-auto`}>
										<div className="z-10 bg-white rounded-lg shadow w-60 dark:bg-zinc-950" >
											<div className="p-3">
												<div className="flex max-w-md flex-col gap-4" id="checkbox">
													<div className="flex items-center gap-2">
														<TextInput type="text" theme={inputTheme} color="primary" rightIcon={search} value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Moha Ouhammo" />
													</div>
												</div>
											</div>
											<ul className="h-auto flex flex-col gap-2 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 w-full">
												{
													filtredUsers?.map((user, index) => (
														<li key={index} className="mx-2 bg-zinc-800 rounded">
															<div className="flex flex-row gap-2 w-full h-12 rounded justify-between items-center px-2">
																<div className="pic">
																	<img src={user.picture} className="w-8 h-8 rounded-full" />
																</div>
																<div className="info">
																	<span className="text-sm text-gray-700 dark:text-white"> {user.firstName + ' ' + user.lastName} </span>
																</div>
																<Checkbox
																id={`user-${user.id}`}
																checked={usersCopy?.some(user1 => user1.id === user.id && user1.selected)}
																onChange={() => handleCheckboxChange(index, user)} />
															</div>
														</li>
													))
												}
											</ul>
											<a onClick={addUser} className="cursor-pointer flex justify-center items-center p-3 text-sm font-medium text-green-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-green-500 hover:underline">
												<svg className="w-6 h-6 text-green-500 dark:text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
													<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
												</svg>
												Add users
											</a>
										</div>
									</div>
								</>
							)
						}
							
						
						{/* <div className={`w-auto max-w-xl h-auto ${muteUsersDropdown ? 'block' : 'hidden'} mx-auto`}>
							<div className="z-10 bg-white rounded-lg shadow w-60 dark:bg-zinc-950" >
								<div className="p-3">
									<div className="flex max-w-md flex-col gap-4" id="checkbox">
										<div className="flex items-center gap-2">
											<TextInput type="text" theme={inputTheme} color="primary" value={userInput} rightIcon={search} onChange={(e) => setUserInput(e.target.value)} placeholder="Moha Ouhammo" />
										</div>
									</div>
								</div>
								<ul className="h-auto flex flex-col gap-2 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 w-full">
									{
										filtredUsers?.map((user, index) => (
											<li key={index} className="mx-2 bg-zinc-800 rounded">
												<div className="flex flex-row gap-2 w-full h-12 rounded justify-between items-center px-2">
													<div className="pic">
														<img src={user.picture} className="w-8 h-8 rounded-full" />
													</div>
													<div className="info">
														<span className="text-sm text-gray-700 dark:text-white"> {user.firstName + ' ' + user.lastName} </span>
													</div>
													<Checkbox id="add-to-room" defaultChecked={usersCopy && usersCopy[index]?.selected} onChange={() => {
														const updatedUsers = usersCopy?.map((user, i) => {
															if (user.username === user.username) {
															  return { ...user, selected: !user.selected };
															}
															return user;
														  });
														  setUsersCopy(updatedUsers);
													}} />
												</div>
											</li>
										))
									}
								</ul>
								<a onClick={addUser} className="cursor-pointer flex justify-center gap-2 items-center p-3 text-sm font-medium text-red-500 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 hover:underline">
									<svg className="w-6 h-6 text-black dark:fill-red-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50">
										<path d="M 0.90625 -0.03125 C 0.863281 -0.0234375 0.820313 -0.0117188 0.78125 0 C 0.40625 0.0664063 0.105469 0.339844 0 0.703125 C -0.105469 1.070313 0.00390625 1.460938 0.28125 1.71875 L 48.28125 49.71875 C 48.679688 50.117188 49.320313 50.117188 49.71875 49.71875 C 50.117188 49.320313 50.117188 48.679688 49.71875 48.28125 L 48.71875 47.25 C 48.933594 47.171875 49.125 47.109375 49.3125 47 L 49.8125 46.6875 L 49.8125 46.125 C 49.816406 44.007813 47.96875 42.289063 46.15625 40.625 C 45.738281 40.238281 45.304688 39.832031 44.90625 39.4375 C 48.203125 36.296875 50 32.261719 50 27.9375 C 50 20.636719 44.859375 14.246094 37.15625 11.90625 C 34.753906 5.007813 27.519531 0 19 0 C 13.984375 0 9.429688 1.753906 6.03125 4.59375 L 1.71875 0.28125 C 1.511719 0.0585938 1.210938 -0.0546875 0.90625 -0.03125 Z M 19 2 C 28.375 2 36 8.707031 36 16.9375 C 36 21.550781 33.601563 25.667969 29.84375 28.40625 L 7.4375 6 C 10.472656 3.515625 14.53125 2 19 2 Z M 3.28125 7.4375 C 1.214844 10.144531 0 13.421875 0 16.9375 C 0 21.390625 1.921875 25.539063 5.40625 28.71875 C 4.761719 30.484375 3.179688 31.726563 2 32.65625 C 0.878906 33.542969 -0.0820313 34.292969 0.21875 35.375 L 0.3125 35.78125 L 0.65625 36 C 1.410156 36.4375 2.417969 36.59375 3.53125 36.59375 C 6.472656 36.59375 10.332031 35.332031 13.34375 34.125 C 16.1875 40.574219 23.128906 44.84375 31 44.84375 C 32.316406 44.84375 33.667969 44.699219 35.03125 44.4375 C 37.207031 45.378906 40.199219 46.539063 43 47.15625 L 26.25 30.40625 C 24.050781 31.320313 21.59375 31.84375 19 31.84375 C 17.722656 31.84375 16.398438 31.714844 15.0625 31.4375 L 14.75 31.375 L 14.46875 31.5 C 9.425781 33.714844 5.101563 34.816406 2.8125 34.5625 C 2.960938 34.441406 3.113281 34.328125 3.25 34.21875 C 4.695313 33.078125 6.851563 31.367188 7.5 28.625 L 7.65625 28.03125 L 7.1875 27.625 C 3.84375 24.785156 2 21 2 16.9375 C 2 13.96875 3.011719 11.199219 4.71875 8.875 Z"></path>
									</svg>
									Add users
								</a>
							</div>
						</div> */}
						<div className="z-20 mt-2 w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-zinc-800 dark:divide-gray-700" aria-labelledby="dropdownNotificationButton">
							<div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-zinc-700 dark:text-white">
								Room Members
							</div>
							<div className="divide-y divide-gray-100 dark:divide-gray-700 relative">
								{
									roomMembers?.map((member: any, index: number) => {
										const user = member.user;
										
										return (
											<div key={index} className="">
												<a className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 items-center w-full">
													<div className="flex-shrink-0">
														<img className="rounded-full w-11 h-11" src={user.picture} alt={user.firstName + ' ' + user.lastName} />
													</div>
													<div className="w-full ps-3">
														<div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
															<span className="font-semibold text-gray-900 dark:text-white">{user.firstName + ' ' + user.lastName}</span>
														</div>
													</div>
													<svg onClick={() => toggleOptionsDropdown(index)} className="w-5 h-5 cursor-pointer fill-black dark:fill-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
														<path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
													</svg>
												</a>
												<div className={`z-30 absolute bg-white divide-y left-1/2 divide-gray-100 rounded-lg shadow w-44 dark:bg-zinc-700 dark:divide-gray-600 ${optionsDropdown[index] ? 'block' : 'hidden'}`} style={{ transform: 'translateX(-50%)' }}>
													<ul className="py-2 text-sm text-gray-700 text-center dark:text-gray-200 divide-y divide-gray-100  dark:divide-gray-600">
														<li>
															<a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Make Admin</a>
														</li>
														<li>
															<a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
														</li>
													</ul>
													<div className="py-2" onClick={()=> {
														kickUser(user.id, channelInfo.id);
													}}>
														<a className="cursor-pointer bg-inherit flex justify-center items-center p-3 text-sm font-medium text-red-500  border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100  dark:hover:bg-gray-600 dark:text-red-500 hover:underline">
															<svg className="w-6 h-6 text-red-500 dark:text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
																<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
															</svg>
															Kick
														</a>
													</div>
												</div>
											</div>
										)
									})
								}
							</div>
						</div>
					</div>

			}
		</>
	);
}

export default RoomDetails