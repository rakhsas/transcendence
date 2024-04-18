import { CustomFlowbiteTheme, FileInput, FlowbiteButtonTheme, Label, Modal, Select, Tabs, TextInput } from "flowbite-react";
import { tabsTheme } from "../../../utils/themes";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiWechatChannelsFill } from "react-icons/ri";
import { messageUser } from "../../../model/messageUser.model";
import User from "../../../model/user.model";
import { useEffect, useState } from "react";
import { ChannelTypes } from "../../../utils/types";
import UploadService from "../../../services/upload.service";
import { Socket } from "socket.io-client";
import { customTheme } from "../../../utils/theme";

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
	const [imagePath, setImagePath] = useState<any>();
	useEffect(() => {

	}, [lstGroupMessages]);
	const addChannel = async (event: any) => {
		console.log('addChannel');
        event.preventDefault();
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
    const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
	return (
		<div className={`sm:flex flex-col bg-red-600 w-full sm:w-auto ${selectedMessageIndex !== '-1' ? 'hidden' : 'flex' } relative justify-between pb-5 overflow-y-auto w-64 overflow-x-hidden border-r-[1px] dark:border-gray-700 border-black`}>
			<Tabs aria-label="Tabs with icons" style="underline" theme={tabsTheme}>
				<Tabs.Item active title="Friends" icon={LiaUserFriendsSolid}>
					{latestMessages.length == 0 ?
						(
							<div className="flex items-center justify-center h-64 w-64 text-red-900 dark:text-red-500">
								You have no messages
							</div>
						) : (
							latestMessages.map((message: any, index) => (
								<div key={index} className={`msg py-5 px-2 ${selectedMessageIndex === index.toString() ? 'active' : ''}`} onClick={() => {
									handleSelectMessage(
										index.toString(),
										message.__reciever__.id === userData[0].id ? message.__owner__.id : message.__reciever__.id,
										undefined
									)
								}}>
									
									<div className="msg-profile rounded-full mr-4 bg-rose-400 ">
										<div className="msg-profile group object-cover" style={{ backgroundImage: `url(${ userData[0].id === message.__reciever__.id ? baseAPIUrl + message.__owner__.picture : baseAPIUrl + message.__reciever__.picture})` }}>
										</div>
									</div>
									<div className="msg-detail overflow-hidden ml-2">
										<div className="msg-username font-poppins mb-1 text-black dark:text-white font-semibold text-base">
											{message.__reciever__.id === userData[0].id ? message.__owner__.firstName + ' ' + message.__owner__.lastName : message.__reciever__.firstName + ' ' + message.__reciever__.lastName}
										</div>
										<div className="msg-content font-medium text-xs">
											<span className="msg-message whitespace-nowrap overflow-hidden overflow-ellipsis text-main-dark-SIDEMESSAGE">
												{
													message.senderId === userData[0].id
														?
														<span className="font-poppins font-bold text-gray-700">
															YOU:
															<span className="text-black dark:text-white rrrrr">
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
														<span className="font-poppins font-bold text-gray-700">
															HIM:
															<span className="text-black dark:text-white rrrrr">
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
				<Modal.Body className="bg-zinc-800">
					<form className="flex flex-col gap-4 m-0" onSubmit={addChannel}>
						<div className="conta flex flex-col gap-8">
							<div className="flex justify-center">
								<div className="pic w-32 h-32 rounded-full bg-green-500">
								<div className="flex flex-col items-center justify-center">
									<svg className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16" >
										<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
									</svg>
								</div>
								</div>
							{/* <Label htmlFor="dropzone-file" className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"> */}
							{/* </Label> */}
								{/* <input type="file" accept="image/jpeg, image/jpg" required className="" onChange={(e) => setImagePath(e.target.files?.[0])} /> */}
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
									<Select id="types" required onChange={(e) => setSelectedItem(e.currentTarget.value)}>
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
												<TextInput id="password" type="password" maxLength={6} minLength={6} />
											</div>
										</div>
									) :
										null
								}
							</div>
						</div>
						<button  className="bg-main-light-EGGSHELL p-4 rounded-xl w-fit px-8 self-center cursor-pointer" onClick={(e) => addChannel}>Submit</button>
					</form>
				</Modal.Body>
			</Modal> : null}
		</div>

	);
};
export default ConversationArea;