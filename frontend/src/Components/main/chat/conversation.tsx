import { Avatar, Button, FileInput, Label, Modal, Select, Tabs, TextInput } from "flowbite-react";
import { tabsTheme } from "../../../utils/themes";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiWechatChannelsFill } from "react-icons/ri";
import { messageUser } from "../../../model/messageUser.model";
import User from "../../../model/user.model";
import { useEffect, useState } from "react";
import { ChannelTypes } from "../../../utils/types";
import UploadService from "../../../services/upload.service";
import { Socket } from "socket.io-client";

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
	const addChannel = async (event: React.FormEvent<HTMLFormElement>) => {
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
		<div className={`md:flex flex-col  ${selectedMessageIndex !== '-1' ? 'hidden' : 'flex' } relative justify-between pb-5 overflow-y-auto w-full md:w-64 overflow-x-hidden border-r-[1px] dark:border-gray-700 border-black`}>
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
																		message.message.img && message.message.img.length > 0 ? ' Picture' :
																		message.message.audio && message.message.audio.length > 0 ? ' Audio' :
																		null
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
																		message.message.img && message.message.img.length > 0 ? ' Picture' :
																		message.message.audio && message.message.audio.length > 0 ? ' Audio' :
																		null
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
			{isOpen ? <Modal show={isOpen} onClose={() => {setIsOpen(false)}}>
				<Modal.Header className="text-center">Channel Details</Modal.Header>
				<Modal.Body>
					<form className="flex flex-col gap-4 m-0" onSubmit={addChannel}>
						<div className="conta flex flex-col">
							<div className="flex justify-center">
								<input type="file" onChange={(e) => setImagePath(e.target.files?.[0])} />
							</div>
							<div className="grid grid-flow-col justify-stretch md:grid-flow-col space-x-4">
								<div>
									<div className="mb-2 block">
										<Label htmlFor="channelName" value="Room Name" />
									</div>
									<TextInput id="channelName" type="text" autoComplete="OFF" placeholder="Give It a name" />
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
						<Button type="submit">Submit</Button>
					</form>
				</Modal.Body>
			</Modal> : null}
		</div>

	);
};
export default ConversationArea;