import { Button, Label, Modal, Select, Tabs, TextInput } from "flowbite-react";
import { tabsTheme } from "../../../utils/themes";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiWechatChannelsFill } from "react-icons/ri";
import { messageUser } from "../../../model/messageUser.model";
import User from "../../../model/user.model";
import { useState } from "react";
import { Socket } from "socket.io-client";

type data = {
    latestMessages: messageUser[];
    latestGroupMessages: messageUser[];
    selectedMessageIndex: string;
    handleSelectMessage: (index: string, friendId: string) => void;
    userData: any;
}
interface LatestMesg {
    friend: User;
    latestMessage: messageUser;
}
enum ChannelTypes {
    PUBLIC = 'public',
    PROTECTED = 'protected',
    PRIVATE = 'private',
  }
const ConversationArea: React.FC<data> = ({ latestMessages, selectedMessageIndex, latestGroupMessages, handleSelectMessage, userData }) => {
    const socket: Socket = userData[1];
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>('');
    const setOpenModal = (status: boolean) => {
        setIsOpen(status);
    }
    const addChannel = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const name = event.currentTarget.channelName.value;
        const type = event.currentTarget.types.value;
        const password =  event.currentTarget.password?.value;
        setOpenModal(false);
        setSelectedItem('');
        socket?.emit('createChannel', {
            channelName: name,
            isPrivate: type === ChannelTypes.PRIVATE,
            channelType: type,
            ownerId: userData[0].id,
            password: password
        })
    }
    return (
        <>
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
                                        message.__reciever__.id === userData[0].id ? message.__owner__.id : message.__reciever__.id
                                    )
                                }}>
                                    <div className="msg-profile rounded-full mr-4 bg-rose-400 ">
                                        {message?.cid ?
                                            (
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
                                            ) : (
                                                <img
                                                    src={userData[0].id === message.__reciever__.id ? message.__owner__.picture : message.__reciever__.picture}
                                                    className="object-cover bg-contain h-full bg-no-repeat bg-center"
                                                    alt=""
                                                />
                                            )}
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
                                                                {message.img ? message.img.slice(34, 40) + '...' : message.message.length > 10 ? message.message.slice(0, 10) + '...' : message.message}
                                                            </span>
                                                        </span>
                                                        :
                                                        message.img ? message.img.slice(34, 40) + '...' : message.message.length > 10 ? ' ' + message.message.slice(0, 10) + '...' : ' ' + message.message
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
                    {/* {latestGroupMessages.map((message, index) => (
                            <div key={index} className={`msg ${selectedMessageIndex === index ? 'active' : ''}`} onClick={() => { handleSelectMessage(index) }}>
                                <div className="msg-profile rounded-full mr-4 bg-rose-400 ">
                                    {message.status === "group" ? (
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
                                    ) : (
                                        <img
                                            src={message.profile}
                                            className="object-cover bg-contain h-full bg-no-repeat bg-center"
                                            alt=""
                                        />
                                    )}
                                </div>
                                <div className="msg-detail overflow-hidden">
                                    <div className="msg-username font-poppins mb-1 text-black dark:text-white font-semibold text-base">
                                        {message.username}
                                    </div>
                                    <div className="msg-content font-medium text-xs">
                                        <span className="msg-message whitespace-nowrap overflow-hidden overflow-ellipsis text-main-dark-SIDEMESSAGE">
                                            {message.message}
                                        </span>
                                        <span className="msg-date text-main-light-FERN text-sm ml-5">
                                            {message.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))} */}
                </Tabs.Item>
            </Tabs>
            <button className="add" onClick={() => { setIsOpen(!isOpen) }}></button>
            {/* <div className="overlay"></div> */}
            <Modal show={isOpen} onClose={() => setOpenModal(false)}>
                <Modal.Header>Terms of Service</Modal.Header>
                <Modal.Body>
                    <form className="flex max-w-md flex-col gap-4" onSubmit={addChannel}>
                        <div className="w-full">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="channelName" value="Your email" />
                                </div>
                                <TextInput id="channelName" type="text" placeholder="TESTTTTOS" required />
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
                <Modal.Footer>
                    <Button onClick={() => setOpenModal(false)}>I accept</Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Decline
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
};
export default ConversationArea;