import { Button, Label, Modal, Select, Tabs, TextInput } from "flowbite-react";
import { tabsTheme } from "../../../utils/themes";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiWechatChannelsFill } from "react-icons/ri";
import { messageUser } from "../../../model/messageUser.model";
import User from "../../../model/user.model";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { ChannelService } from "../../../services/channel.service";
import { ChannelTypes } from "../../../utils/types";

type data = {
    latestMessages: messageUser[];
    lstGroupMessages: any[];
    selectedMessageIndex: string;
    handleSelectMessage: (index: string, friendId?: string, cid?: number) => void;
    userData: any;
    setLstGroupMessages: any;
    addChannel: any;
    isOpen: boolean;
    setIsOpen: any;
    selectedItem: string;
    setSelectedItem: any;
}
interface LatestMesg {
    friend: User;
    latestMessage: messageUser;
}

const ConversationArea: React.FC<data> = ({ latestMessages, selectedMessageIndex, lstGroupMessages, handleSelectMessage, userData, addChannel, isOpen, setIsOpen, selectedItem, setSelectedItem }) => {
   
    useEffect(() => {

    }, [lstGroupMessages])
    return (
        <div className="flex flex-col relative justify-between pb-5 overflow-y-auto overflow-x-hidden border-r-[1px] dark:border-gray-700 border-black">
            <Tabs aria-label="Tabs with icons" style="underline" theme={tabsTheme}>
                <Tabs.Item active title="Friends" icon={LiaUserFriendsSolid}>
                    {latestMessages.length == 0 ?
                        (
                            <div className="flex items-center justify-center h-64 w-64 text-red-900 dark:text-red-500">
                                You have no messages
                            </div>
                        ) : (
                            latestMessages.map((message, index) => (
                                <div key={index} className={`msg ${selectedMessageIndex === index.toString() ? 'active' : ''}`} onClick={() => {
                                    handleSelectMessage(
                                        index.toString(),
                                        message.__reciever__.id === userData[0].id ? message.__owner__.id : message.__reciever__.id,
                                        undefined
                                    )
                                }}>
                                    <div className="msg-profile rounded-full mr-4 bg-rose-400 ">
                                        <div className="msg-profile group" style={{ backgroundImage: `url(${userData[0].id === message.__reciever__.id ? message.__owner__.picture : message.__reciever__.picture})` }}>
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
                                                            YOU :
                                                            <span className="text-black dark:text-white">
                                                                {message.img ? message.img.slice(7, 14) + '...' : message.message.length > 10 ? message.message.slice(0, 10) + '...' : message.message}
                                                            </span>
                                                        </span>
                                                        :
                                                        message.img ? message.img.slice(7, 14) + '...' : message.message.length > 10 ? ' ' + message.message.slice(0, 10) + '...' : ' ' + message.message
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
                        // const latestMessage = item.lastMessage;
                        const channel = item.channel;
                        return (
                            <div key={index} className={`msg ${selectedMessageIndex === index.toString() ? 'active' : ''}`} onClick={() => {
                                handleSelectMessage(index.toString(), undefined, channel.id)
                            }}>
                                <div className="msg-profile rounded-full mr-4">
                                    <svg
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="css-i6dzq1"
                                    >
                                        <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-6.5" />
                                        <path d="M22 8.5l-10 7-10-7" />
                                        <path d="M2 15.5l10-7 10 7M12 2v6.5" />
                                    </svg>
                                </div>
                                <div className="msg-detail overflow-hidden ml-2">
                                    <div className="msg-username font-poppins mb-1 text-black dark:text-white font-semibold text-base capitalize">
                                        {channel.name}
                                    </div>
                                    {/* <div className="msg-content font-medium text-xs">
                                        <span className="msg-message whitespace-nowrap overflow-hidden overflow-ellipsis text-main-dark-SIDEMESSAGE">

                                            <span className="font-poppins font-bold text-gray-700">
                                                {
                                                    latestMessage.senderId === userData[0].id ? 'You : ' : 'No One'
                                                }
                                            </span>
                                            {
                                                latestMessage.message.length > 0 ? latestMessage.message.length > 10 ? latestMessage.message.slice(7, 14) + '...' : latestMessage.message : latestMessage.img ? latestMessage.img.slice(0, 8) + '...' : latestMessage.audio ? 'Audio' : 'No message'
                                            }
                                        </span>
                                        <span className="msg-date text-main-light-FERN text-sm ml-5">
                                            {new Date(latestMessage.date).toLocaleString('en-MA', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                        )
                    }
                    )}
                </Tabs.Item>
            </Tabs>
            <button className="add bottom-6" onClick={() => { setIsOpen(!isOpen) }}></button>
            {isOpen ? <Modal show={isOpen} onClose={() => setOpenModal(false)}>
                <Modal.Header>Channel Details</Modal.Header>
                <Modal.Body>
                    <form className="flex flex-col gap-4 m-0" onSubmit={addChannel}>
                        <div className="grid grid-flow-col justify-stretch md:grid-flow-col space-x-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="channelName" value="Your email" />
                                </div>
                                <TextInput id="channelName" type="text" placeholder="Give It a name" required />
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
                                            <TextInput id="password" type="password" required />
                                        </div>
                                    </div>
                                ) :
                                    null
                            }
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </Modal.Body>
            </Modal> : null}
        </div>

    );
};
export default ConversationArea;