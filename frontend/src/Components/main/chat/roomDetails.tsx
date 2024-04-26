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
	channelRole: string;
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
	roomMembers,
	channelRole
}) => {
	const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
	if (!channelInfo) {
		return null;
	}
	const [isdropdownUsersOpen, setDropdownUsersStatus] = useState<boolean>(false);
	const [muteUsersDropdown, setmuteUsersDropdownStatus] = useState<boolean>(false);
	const [optionMember, setOptionMember] = useState<any>();
	const [userInput, setUserInput] = useState<string>('');
	const [users, setUsers] = useState<any[]>();
	const [usersCopy, setUsersCopy] = useState<any[]>();
	const [filtredUsers, setFiltredUsers] = useState<any[]>();
	const userService = new UserService();
	const [dropdownTimeout, setDropdownTimeout] = useState(null);
	const [optionsDropdown, setOptionsDropdown] = useState<boolean>(false);
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
	useEffect(() => {
		if (optionsDropdown) {
		  const timeoutId = setTimeout(() => {
			setOptionsDropdown(false);
		  }, 5000);
		  setDropdownTimeout(timeoutId);
		}
		return () => {
		  if (dropdownTimeout) {
			clearTimeout(dropdownTimeout);
		  }
		};
	  }, [optionsDropdown]);
	const toggleOptionsDropdown = (member: any) => {
		setOptionsDropdown(!optionsDropdown);
		setOptionMember(member);
	}

	const handleCheckboxChange = (index: number, user1: any) => {
		// Update usersCopy array when a checkbox is toggled
		const updatedUsersCopy = usersCopy?.map((user, i) =>
			user.username === user1.username ? { ...user, selected: !user.selected } : user
		);
		setUsersCopy(updatedUsersCopy);
	};
	const addUser = async () => {
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
	chatSocket?.on('userKicked', async (data: any) => {
		//console.log('userKicked: ', data);
		setRoomMembers(data);
	})
	chatSocket?.on('channelJoined', async (data: any) => {
		setRoomMembers(data);
	})
	
	chatSocket?.on('joinedError', (payload: any) => {
	})
	const kickUser = (target: string, userId: string, channelId: number) => {
		chatSocket?.emit('kickTheUser', {
			target,
			channelId,
			userId,
		});
	}
	const MuteUser = (userId: string, channelId: number, username: string) => {
		chatSocket?.emit('muteUser', {
			userId,
			channelId,
			username
		});
	}

	const leaveChannel = (friendId: string, channelId: number) => {
		chatSocket?.emit('leavChannel', {
			userId: friendId,
			channelId
		});
	}
	return (
		<>
			{
				!channelInfo
					?
					null
					:
                	<div className="detail-area shrink-0 border-l-[1px] border-gray-700 ml-auto flex flex-col overflow-auto w-full md:ml-0 h-full items-center">
						<div className="detail-area-header">
							<div className="msg-profile group w-16 h-16" onClick={handleOpenDetails}>
								<img src={baseAPIUrl + channelInfo.picture} alt="" className="w-full h-full object-cover" />
							</div>
							<div className="font-onest text-xl capitalize text-black dark:text-white overflow-hidden">{channelInfo.name}</div>
						</div>
						{
							channelInfo.private === true &&
							(
								<>
									<div className="flex flex-row justify-center items-center">
										<div className="options flex flex-row items-center justify-around p-4 overflow-hidden">
											<div className="item flex justify-between flex-col items-center space-y-1 cursor-pointer" onClick={() => setDropdownUsersStatus(!isdropdownUsersOpen)}>
												<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
													<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
												</svg>
												<span className="text-black dark:text-white font-onest text-xs capitalize"> Add Member </span>
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
											<ul className="h-full flex flex-col gap-2 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 w-full">
												{
													filtredUsers?.map((user, index) => (
														<li key={index} className="mx-2 bg-zinc-800 rounded">
															<div className="flex flex-row gap-2 w-full h-12 rounded justify-between items-center px-2">
																<div className="pic">
																	<img src={baseAPIUrl + user.picture} className="w-8 h-8 rounded-full object-cover" />
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
											<a onClick={addUser} className="cursor-pointer flex justify-center items-center p-3 text-sm font-medium border-t border-gray-200 rounded-b-lg bg-gray-700 dark:border-gray-600 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-green-500 hover:underline">
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
						<div className="z-20 mt-2 w-full max-w-sm bg-white divide-y max-h-60 divide-gray-100 rounded-lg shadow dark:bg-zinc-800 dark:divide-gray-700 overflow-hidden" aria-labelledby="dropdownNotificationButton">
							<div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-zinc-700 dark:text-white">
								Room Members
							</div>
							<div className="divide-y divide-gray-100 dark:divide-gray-700 relative">
								<ul className="overflow-y-auto px-4">
									{
										roomMembers?.map((member: any, index: number) => {
											const user = member.user;
											//console.log('channelRole: ', channelRole);
											return (
												<div key={index} className="">
													<a className="flex px-4 py-3 justify-between hover:bg-gray-100 dark:hover:bg-gray-700 items-center w-full">
														<div className="flex-shrink-0">
															<img className="rounded-full w-11 h-11 object-cover" src={baseAPIUrl + user.picture} alt={user.firstName + ' ' + user.lastName} />
														</div>
														<div className="w-full ps-3">
															<div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
																<span className="font-semibold text-gray-900 dark:text-white">{user.firstName + ' ' + user.lastName}</span>
															</div>
														</div>
														<svg onClick={() => toggleOptionsDropdown(member)} className={`w-5 h-5 cursor-pointer fill-black dark:fill-gray-200 ${channelRole === 'MEMBER' || member.user.id === userData[0].id ? 'invisible' : 'visible'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
															<path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
														</svg>
													</a>
												</div>
											)
										})
									}
								</ul>
							</div>
							{
								optionsDropdown && (
									<div className={`z-30 right-0 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-zinc-700 dark:divide-gray-600 ${optionsDropdown ? 'visible' : 'invisible'}`} style={{ transform: 'translateX(-50%)' }}>
										{
											(optionMember?.role !== 'OWNER') ? (
												<>
													{/* <ul className="py-2 text-sm text-gray-700 text-center dark:text-gray-200 divide-y divide-gray-100  dark:divide-gray-600">
														<li>
															<a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Make Admin</a>
														</li>
													</ul> */}
													<div className="py-2 px-4">
														<a className="cursor-pointer px-4 bg-inherit flex justify-start items-center p-3 text-sm font-medium text-green-500  border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100  dark:hover:bg-gray-600 dark:text-green-500 hover:underline">
															<svg className="w-6 h-6 text-green-500 dark:text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
																<path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="2" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
															</svg>
															Make Admin
														</a>
													</div>
													<div className="py-2 px-4" onClick={() => MuteUser(optionMember?.user?.id, channelInfo.id, optionMember?.user.username)}>
														<a className="cursor-pointer px-4 bg-inherit flex justify-start items-center p-3 text-sm font-medium text-red-500  border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100  dark:hover:bg-gray-600 dark:text-red-500 hover:underline">
															<svg className="w-6 h-6 text-red-500 dark:text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
																<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.5 8.43A4.985 4.985 0 0 1 17 12c0 1.126-.5 2.5-1.5 3.5m2.864-9.864A8.972 8.972 0 0 1 21 12c0 2.023-.5 4.5-2.5 6M7.8 7.5l2.56-2.133a1 1 0 0 1 1.64.768V12m0 4.5v1.365a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m1-4 14 14"/>
															</svg>
															Mute
														</a>
													</div>
													<div className="py-2 px-4" onClick={() => MuteUser(optionMember?.user?.id, channelInfo.id, optionMember?.user.username)}>
														<a className="cursor-pointer px-4 bg-inherit flex justify-start items-center p-3 text-sm font-medium text-white  border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100  dark:hover:bg-gray-600 dark:text-white hover:underline">
															<svg className="w-6 h-6 text-black dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
																<path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
															</svg>

															Ban
														</a>
													</div>
													<div className="py-2 px-4" onClick={() => kickUser(optionMember?.user?.id, userData[0].id, channelInfo.id)}>
														<a className="cursor-pointer px-4 bg-inherit flex justify-start items-center p-3 text-sm font-medium text-red-500  border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100  dark:hover:bg-gray-600 dark:text-red-500 hover:underline">
															<svg className="w-6 h-6 text-red-500 dark:text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
																<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
															</svg>
															Kick
														</a>
													</div>
													<div className="py-2 px-4" onClick={() => leaveChannel(optionMember?.user?.id, channelInfo.id)}>
														<a className="cursor-pointer gap-2 bg-inherit flex justify-start items-center p-3 text-sm font-medium text-red-500  border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100  dark:hover:bg-gray-600 dark:text-red-500 hover:underline">
															<svg className="w-6 h-6 text-red-500 dark:text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
																<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
															</svg>

															Leave Channel
														</a>
													</div>
												</>
											):
											<div className="flex flex-row py-2 justify-center w-full text-sm text-gray-700 text-center dark:text-gray-200 divide-y divide-gray-100  dark:divide-gray-600">
												<span className="text-orange-400 font-medium font-onest"> You Have No Options </span>
											</div>
										}
									</div>
								)
							}
						</div>
					</div>
			}
		</>
	);
}

export default RoomDetails