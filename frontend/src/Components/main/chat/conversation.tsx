import { CustomFlowbiteTheme, FileInput, FlowbiteButtonTheme, Label, Modal, Select, Tabs, TextInput } from "flowbite-react";
import { tabsTheme } from "../../../utils/themes";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiWechatChannelsFill } from "react-icons/ri";
import { messageUser } from "../../../model/messageUser.model";
import User from "../../../model/user.model";
import { ChangeEvent, useEffect, useState } from "react";
import { ChannelTypes } from "../../../utils/types";
import UploadService from "../../../services/upload.service";
import { Socket } from "socket.io-client";
import { customTheme } from "../../../utils/theme";
import defaultAvatar from "./../../../assets/avatars/anime_style.png";
type data = {
	latestMessages: messageUser[];
	lstGroupMessages: any[];
	selectedMessageIndex: string;
	handleSelectMessage: (index: string, friendId?: string, cid?: number) => void;
	userData: any;
	setLstGroupMessages: any;
	isOpen: boolean;
	setIsOpen: any;
	selectedItem: string;
	setSelectedItem: any;
	socket: Socket;
}
interface LatestMesg {
	friend: User;
	latestMessage: messageUser;
}


const ConversationArea: React.FC<data> = ({ latestMessages, selectedMessageIndex, lstGroupMessages, handleSelectMessage, setLstGroupMessages, userData, isOpen, setIsOpen, selectedItem, setSelectedItem, socket }) => {
	const [imagePath, setImagePath] = useState<any>(null);
	useEffect(() => {

	}, [lstGroupMessages]);
	const addChannel = async (event: any) => {
        event.preventDefault();
		setImagePath(null);
        const name = event.currentTarget.channelName.value;
        const type = event.currentTarget.types.value;
        const password = event.currentTarget.password?.value;
		if (password && password.length !== 6) {
			return;
		}
		const formData = new FormData();
		formData.append('file', imagePath);
        if (name === '' || type === '') {
          return;
        }
        const uploadService = new UploadService();
        const image = await uploadService.getPayload(formData);
        setIsOpen(false);
        setSelectedItem('');
        socket?.emit('createChannel', {
            channelName: name,
            isPrivate: type === ChannelTypes.PRIVATE,
            channelType: type,
            ownerId: userData[0].id,
            password: password,
			picture: image
        });
        const updatedChannels = await new Promise<any>((resolve) => {
            socket?.once('channelCreated', (updatedChannels: any) => {
                resolve(updatedChannels);
            });
        });
        setLstGroupMessages(updatedChannels);
    }
	// const chooseFile = (event: any) => {
	// 	const input = document.createElement('input');
	// 	input.type = 'file';
	// 	input.accept = 'image/*';
	// 	input.addEventListener('change', handleChange); // Add event listener
	// 	input.click();
	// 	const fileInput = event.target;
	// 	const chosenFile = fileInput.files && fileInput.files[0];
	// 	if (chosenFile) {
	// 		const reader = new FileReader();
	// 		reader.onload = () => {
	// 			const imgElement = document.querySelector("#list") as HTMLImageElement;
	// 			setImagePath(chosenFile);
	// 			if (imgElement) {
	// 				imgElement.src = reader.result as string;
	// 			}
	// 		};
	// 		reader.readAsDataURL(chosenFile);
	// 	}
	// };
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const fileInput = event.target;
		const chosenFile = fileInput.files && fileInput.files[0];
		if (chosenFile) {
			const reader = new FileReader();
			reader.onload = () => {
				const imgElement = document.querySelector("#channelPicture") as any;
				console.log(imgElement)
				setImagePath(chosenFile);
				if (imgElement) {
					imgElement.src = reader.result as string;
				}
			};
			reader.readAsDataURL(chosenFile);
		}
	};
    const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
	return (
		<div className={`md:flex flex-col  ${selectedMessageIndex !== '-1' ? 'hidden' : 'flex' } relative justify-between pb-5 overflow-y-auto w-full md:w-64 overflow-x-hidden border-r-[1px] dark:border-gray-700 border-black`}>
			<Tabs aria-label="Tabs with icons" style="underline" theme={tabsTheme}>
				<Tabs.Item active title="Friends" icon={LiaUserFriendsSolid}>
					<div className="flex flex-col items-start w-full lg:w-80 gap-1 relative">
						{latestMessages.length == 0 ?
							(
								<div className="flex items-center font-poppins justify-center h-64 w-64 text-red-900">
									You have no messages
								</div>
							) : (
								latestMessages.map((message: any, index) => (
									<div key={index} className={`flex justify-between msg md:gap-2 lg:gap-0 h-20 items-center w-full overflow-hidden px-2 ${selectedMessageIndex === index.toString() ? 'active' : ''}`} onClick={() => {
										handleSelectMessage(
											index.toString(),
											message.__reciever__.id === userData[0].id ? message.__owner__.id : message.__reciever__.id,
											undefined
										)
									}}>
										<div className="flex justify-center w-1/4 h-auto">
											<div className="msg-profile group object-cover" style={{ backgroundImage: `url(${ userData[0].id === message.__reciever__.id ? baseAPIUrl + message.__owner__.picture : baseAPIUrl + message.__reciever__.picture})` }}>
											</div>
										</div>
										<div className="msg-detail overflow-hidden w-3/4 flex h-20 flex-col justify-center">
											<div className="msg-username font-poppins mb-1 text-black dark:text-white font-semibold text-base">
												{message.__reciever__.id === userData[0].id ? message.__owner__.firstName + ' ' + message.__owner__.lastName : message.__reciever__.firstName + ' ' + message.__reciever__.lastName}
											</div>
											<div className="msg-content font-medium text-xs">
												<span className="msg-message whitespace-nowrap overflow-hidden overflow-ellipsis text-main-dark-SIDEMESSAGE">
													{
														message.senderId === userData[0].id
															?
															<span className="font-poppins font-bold text-gray-400">
																YOU:
																<span className="text-black dark:text-white">
																	{
																		message.message.length > 0 ? (
																			message.message.length > 10 ? message.message.slice(0, 10) + ' ...' : message.message
																		) : (
																			message.img ? ' Picture' : ' Audio'
																		)
																	}
																</span>
															</span>
															:
															<span className="font-poppins font-bold text-gray-400">
																HIM:
																<span className="text-black dark:text-white">
																	{
																		message.message.length > 0 ? (
																			message.message.length > 10 ? message.message.slice(0, 10) + ' ...' : message.message
																		) : (
																			message.img ? ' Picture' : ' Audio'
																		)
																	}
																</span>
															</span>
													}
												</span>
												<span className="msg-date text-main-light-FERN text-sm ml-4">
													{new Date(message.date).toLocaleString('en-MA', { hour: '2-digit', minute: '2-digit' })}
												</span>
											</div>
										</div>
									</div>
						)))}
					</div>
				</Tabs.Item>
				<Tabs.Item title="Rooms" icon={RiWechatChannelsFill}>
					{lstGroupMessages.map((item, index) => {
						const channel = item.channel;
						return (
							<div key={index} className={`msg py-5 px-2 ${selectedMessageIndex === index.toString() ? 'active' : ''}`} onClick={() => {
								
								handleSelectMessage(index.toString(), undefined, channel.id)
							}}>
								<div className="msg-profile rounded-full mr-4">
									<div className="msg-profile group" style={{ backgroundImage: `url(${encodeURI(baseAPIUrl + channel.picture)})` }}>
									</div>
								</div>
								<div className="msg-detail overflow-hidden ml-2">
									<div className="msg-username font-poppins mb-1 text-black dark:text-white font-semibold text-base capitalize">
										{channel.name}
									</div>
								</div>
							</div>
						)
					}
					)}
				</Tabs.Item>
			</Tabs>
			<button className="add bottom-6" onClick={() => { setIsOpen(!isOpen) }}></button>
			{isOpen ? <Modal show={isOpen} onClose={() => {setIsOpen(false)}} className="bg-zinc-900">
				<Modal.Header theme={customTheme.modal?.header} className="text-center dark:bg-main-light-EGGSHELL bg-main-light-FERN text-white">Channel Details</Modal.Header>
				<Modal.Body className="bg-white dark:bg-zinc-800">
					<form className="flex flex-col gap-4 m-0" onSubmit={addChannel}>
						<div className="conta flex flex-col gap-8">
							<div className="flex justify-center ">
								<div className="p-2 overflow-hidden flex flex-col w-52 h-52 justify-center items-center gap-12">
									<img alt="Uploaded" className={`object-cover w-full h-full rounded-full ${imagePath ? 'block' : 'hidden'}`} id="channelPicture" />
									<div className={`svg border rounded-full border-gray-500 w-full h-full flex  justify-center items-center ${!imagePath ? 'block' : 'hidden'}`}>
										<span className="text-gray-500 text-lg font-poppins">Put Picture</span>
									</div>
									<label htmlFor="file" id="uploadbtn" className="gap-4 change-picture bg-zinc-800 dark:bg-stone-800 rounded-full m-2">
										<svg className="hoverIcon__2025e" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="white" d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"></path></svg>
									</label>
									<input type="file" id="file" accept="image/jpg, image/jpeg" onChange={handleFileChange} />
								</div>
							</div>
							<div className="grid grid-flow-col justify-stretch md:grid-flow-col space-x-4">
								<div>
									<div className="mb-2 block">
										<Label htmlFor="channelName" value="Room Name" />
									</div>
									<TextInput id="channelName" className="" theme={customTheme.textInput} color="primary" required type="text" autoComplete="OFF" placeholder="Give It a name" />
								</div>
								<div className="mb-2 block">
									<div className="mb-2 block">
										<Label htmlFor="types" value="Select your country" />
									</div>
									<Select id="types" theme={customTheme.select} color="primary" required onChange={(e) => setSelectedItem(e.currentTarget.value)}>
										<option value={ChannelTypes.PUBLIC}>Public</option>
										<option value={ChannelTypes.PROTECTED}>Protected</option>
										<option value={ChannelTypes.PRIVATE}>Private</option>
									</Select>
								</div>
								{
									selectedItem === ChannelTypes.PROTECTED ? (
										<div className="mb-2 block">
											<div>
												<div className="mb-2 block">
													<Label htmlFor="password" value="Your password" />
												</div>
												<TextInput id="password" type="password" theme={customTheme.textInput} color="primary" maxLength={6} minLength={6} />
											</div>
										</div>
									) :
										null
								}
							</div>
						</div>
						<button  className="dark:bg-main-light-EGGSHELL bg-main-light-FERN font-poppins p-4 rounded-xl w-fit px-8 self-center cursor-pointer" onClick={(e) => addChannel}>Submit</button>
					</form>
				</Modal.Body>
			</Modal> : null}
		</div>

	);
};
export default ConversationArea;
