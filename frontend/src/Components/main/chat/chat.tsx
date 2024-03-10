import { useContext, useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import "./chat.css";
import DataContext from "../../../services/data.context";
import LoadingComponent from "../../shared/loading/loading";
import { TextInput } from "flowbite-react";
import { inputTheme } from "../../../utils/themes";
import ConversationArea from "./conversation";
// import { latestGroupMessages, messages } from "../../../utils/data";
import DetailsArea from "./details";
import ModalComponent from "../../../utils/modal.component";
import { messageUser, messageUser1 } from "../../../model/messageUser.model";
import MessageService from "../../../services/message.service";
import { Socket } from "socket.io-client";

function chatComponent(): JSX.Element {
    const [MESSAGES, setMESSAGES] = useState<any>(null);
    const [selectedColor, setSelectedColor] = useState("black");
    const [selectedMessageIndex, setSelectedMessageIndex] = useState('0');
    const [socketChat, setSocketChat] = useState<Socket>();
    // const [selectedMessageIndex, setSelectedMessageIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [modalPicPath, setModalPicPath] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastMessageIndex, setLastMessageIndex] = useState('');
    const [latestMessages, setLatestMessages] = useState<any[]>([]);
    const messageService = new MessageService();
    const userData = useContext(DataContext);
    if (!userData) {
            return <LoadingComponent />;
    }
    useEffect(() => {
        if (!userData[0] || !userData[1]) return;
        console.log(userData)
        const fetchData = async () => {
            try {
                // console.log(userData[0].id)
                const fetchedUserData = await messageService.latestMessages(userData[0].id);
                setLatestMessages(fetchedUserData);
                // console.log(fetchedUserData)
            } catch (error) {
                console.error('Error fetching user ', error);
            }
        };
        fetchData();
        console.log("----> " + userData[1])
        setSocketChat(userData[1]);
    }, [userData]);
    if (!userData[0] || !userData[1]) {
        return <LoadingComponent />;
    }
    const latestGroupMessages: any = [];
    function userLastMessageIndex(): string
    {
        return MESSAGES.find(selectedMessageIndex).findLastIndex(
        (message: { senderId: any; }) => Number(message.senderId) === userData[0].id);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log("ldak khouna: ", getMessageFriend(MESSAGES[selectedMessageIndex]))
        event.preventDefault();
        const newMessage: messageUser1 = {
            to: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
            from: userData[0].id,
            content: event.currentTarget.message.value,
            image: '',
            senderId: userData[0].id,
            recieverId: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
            recieverName: getMessageFriend(MESSAGES[selectedMessageIndex]).username
        };
        // MESSAGES.push(newMessage);
        const newMessages = [...MESSAGES, newMessage];
        setMESSAGES(newMessages);
        setMessage('');
        socketChat?.emit('message', newMessage);
    };
    var messages: messageUser[] = [];
    const handleSelectMessage = async (index: string, friendId: string) => {
        setSelectedMessageIndex(index);
        // console.log(selectedMessageIndex)
        await setMESSAGES(await messageService.getMessages(userData[0].id, friendId));
        console.log("latestMessages", MESSAGES)
        // console.log("messages", MESSAGES[index]);

    };

    const handleSelectedColor = (color: string) => {
        setSelectedColor(color);
    }

    const onOpenModal = (picPath: string) => {
        setModalPicPath(picPath);
        setIsModalOpen(true);
    };

    const onCloseModal = () => {
        setIsModalOpen(false);
    };
    const getMessageFriend = (message: messageUser) => {
        const { __owner__, __reciever__ } = message;
        return __owner__.id === userData[0].id ? __reciever__ : __owner__;
    };
    return (
        <>
            <div className="flex w-full border-t-[1px] dark:border-gray-700 border-black">
                <div className="conversation-area border-r-[1px] dark:border-gray-700 border-black">
                    {ConversationArea({ latestMessages, selectedMessageIndex, latestGroupMessages, handleSelectMessage, userData })}
                </div>
                <div className="chat-area  flex flex-col overflow-hidden flex-1">
                    {
                        !MESSAGES ? null :
                        <div className="flex-1 overflow-hidden">
                            <div className="chat-area-header flex sticky top-0 left-0 z-10 overflow-hidden w-full items-center justify-between p-5 bg-zinc-800">
                                <div className="flex flex-row items-center space-x-2">
                                    <div className="msg-profile group">
                                        <img src={getMessageFriend(MESSAGES[selectedMessageIndex]).picture} alt="" />
                                    </div>
                                    <div className="font-onest text-xl capitalize">
                                        {
                                            getMessageFriend(MESSAGES[selectedMessageIndex]).firstName + ' ' + getMessageFriend(MESSAGES[selectedMessageIndex]).lastName
                                        }
                                    </div>
                                
                                </div>
                                <div className="flex flex-row justify-between w-20 h-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50">
                                        <path d="M 11.839844 2.988281 C 11.070313 2.925781 10.214844 3.148438 9.425781 3.703125 C 8.730469 4.1875 7.230469 5.378906 5.828125 6.726563 C 5.128906 7.398438 4.460938 8.097656 3.945313 8.785156 C 3.425781 9.472656 2.972656 10.101563 3 11.015625 C 3.027344 11.835938 3.109375 14.261719 4.855469 17.980469 C 6.601563 21.695313 9.988281 26.792969 16.59375 33.402344 C 23.203125 40.011719 28.300781 43.398438 32.015625 45.144531 C 35.730469 46.890625 38.160156 46.972656 38.980469 47 C 39.890625 47.027344 40.519531 46.574219 41.207031 46.054688 C 41.894531 45.535156 42.59375 44.871094 43.265625 44.171875 C 44.609375 42.769531 45.800781 41.269531 46.285156 40.574219 C 47.390625 39 47.207031 37.140625 45.976563 36.277344 C 45.203125 35.734375 38.089844 31 37.019531 30.34375 C 35.933594 29.679688 34.683594 29.980469 33.566406 30.570313 C 32.6875 31.035156 30.308594 32.398438 29.628906 32.789063 C 29.117188 32.464844 27.175781 31.171875 23 26.996094 C 18.820313 22.820313 17.53125 20.878906 17.207031 20.367188 C 17.597656 19.6875 18.957031 17.320313 19.425781 16.425781 C 20.011719 15.3125 20.339844 14.050781 19.640625 12.957031 C 19.347656 12.492188 18.015625 10.464844 16.671875 8.429688 C 15.324219 6.394531 14.046875 4.464844 13.714844 4.003906 L 13.714844 4 C 13.28125 3.402344 12.605469 3.050781 11.839844 2.988281 Z M 11.65625 5.03125 C 11.929688 5.066406 12.09375 5.175781 12.09375 5.175781 C 12.253906 5.398438 13.65625 7.5 15 9.53125 C 16.34375 11.566406 17.714844 13.652344 17.953125 14.03125 C 17.992188 14.089844 18.046875 14.753906 17.65625 15.492188 L 17.65625 15.496094 C 17.214844 16.335938 15.15625 19.933594 15.15625 19.933594 L 14.871094 20.4375 L 15.164063 20.9375 C 15.164063 20.9375 16.699219 23.527344 21.582031 28.410156 C 26.46875 33.292969 29.058594 34.832031 29.058594 34.832031 L 29.558594 35.125 L 30.0625 34.839844 C 30.0625 34.839844 33.652344 32.785156 34.5 32.339844 C 35.238281 31.953125 35.902344 32.003906 35.980469 32.050781 C 36.671875 32.476563 44.355469 37.582031 44.828125 37.914063 C 44.84375 37.925781 45.261719 38.558594 44.652344 39.425781 L 44.648438 39.425781 C 44.28125 39.953125 43.078125 41.480469 41.824219 42.785156 C 41.195313 43.4375 40.550781 44.046875 40.003906 44.457031 C 39.457031 44.867188 38.96875 44.996094 39.046875 45 C 38.195313 44.972656 36.316406 44.953125 32.867188 43.332031 C 29.417969 41.714844 24.496094 38.476563 18.007813 31.984375 C 11.523438 25.5 8.285156 20.578125 6.664063 17.125 C 5.046875 13.675781 5.027344 11.796875 5 10.949219 C 5.003906 11.027344 5.132813 10.535156 5.542969 9.988281 C 5.953125 9.441406 6.558594 8.792969 7.210938 8.164063 C 8.519531 6.910156 10.042969 5.707031 10.570313 5.339844 L 10.570313 5.34375 C 11.003906 5.039063 11.382813 5 11.65625 5.03125 Z" fill="white"></path>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M 4 4.75 C 3.271 4.75 2.5706875 5.0396875 2.0546875 5.5546875 C 1.5396875 6.0706875 1.25 6.771 1.25 7.5 L 1.25 16.5 C 1.25 17.229 1.5396875 17.929313 2.0546875 18.445312 C 2.5706875 18.960313 3.271 19.25 4 19.25 L 14.5 19.25 C 15.229 19.25 15.929312 18.960313 16.445312 18.445312 C 16.960313 17.929313 17.25 17.229 17.25 16.5 L 17.25 16.166016 L 20.982422 17.861328 C 21.369422 18.037328 21.819734 18.004438 22.177734 17.773438 C 22.534734 17.543438 22.75 17.147656 22.75 16.722656 L 22.75 7.2773438 C 22.75 6.8523438 22.534734 6.4565625 22.177734 6.2265625 C 21.819734 5.9955625 21.369422 5.9626719 20.982422 6.1386719 L 17.25 7.8339844 L 17.25 7.5 C 17.25 6.771 16.960313 6.0706875 16.445312 5.5546875 C 15.929312 5.0396875 15.229 4.75 14.5 4.75 L 4 4.75 z M 4 6.25 L 14.5 6.25 C 14.832 6.25 15.149766 6.3812344 15.384766 6.6152344 C 15.618766 6.8502344 15.75 7.168 15.75 7.5 L 15.75 9 L 15.75 15 L 15.75 16.5 C 15.75 16.832 15.618766 17.149766 15.384766 17.384766 C 15.149766 17.618766 14.832 17.75 14.5 17.75 L 4 17.75 C 3.668 17.75 3.3502344 17.618766 3.1152344 17.384766 C 2.8812344 17.149766 2.75 16.832 2.75 16.5 L 2.75 7.5 C 2.75 7.168 2.8812344 6.8502344 3.1152344 6.6152344 C 3.3502344 6.3812344 3.668 6.25 4 6.25 z M 21.25 7.6640625 L 21.25 16.335938 L 17.25 14.517578 L 17.25 9.4824219 C 17.25 9.4824219 20.213 8.1350625 21.25 7.6640625 z" fill="white"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className={`chat-area-main h-full overflow-auto pb-16 p-2 ${selectedColor}`}>
                                {MESSAGES.map((message: { senderId: any; __owner__: { picture: string | undefined; }; img: string | undefined; content: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; date: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
                                    console.log(lastMessageIndex),
                                    <div className={`chat-msg ${message.senderId === userData[0].id ? 'owner' : null}`} key={index}>
                                        <div className="chat-msg-profile">
                                            <img className="chat-msg-img" src={message.senderId === userData[0].id ? userData[0].picture : getMessageFriend(MESSAGES[selectedMessageIndex]).picture } alt="" />
                                        </div>
                                        <div className="chat-msg-content">
                                            {message.img ? (
                                                <div className="chat-msg-text bg-main-light-FERN text-white">
                                                    <img src={message.img} alt="" onDoubleClick={() => onOpenModal(message.img || '')} />
                                                </div>
                                            ) : null}
                                            {message.content ? (
                                                <div className="chat-msg-text bg-main-light-FERN text-white">
                                                    {message.content}
                                                </div>
                                            ) : null}
                                            {isModalOpen && <ModalComponent picPath={modalPicPath} status={isModalOpen} onClose={onCloseModal} />}
                                            {
                                                (message.senderId === userData[0].id
                                                    //    && index === lastMessageIndex
                                                       )
                                                    ? 
                                                        <div className='chat-msg-date text-main-light-FERN'> {message.date} </div>
                                                    :
                                                        null
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                    }
                    <form onSubmit={handleSubmit}>
                        <div className="footer flex bg-zinc-900 border-t-2   border-t-gray-500 flex-row items-center w-full overflow-hidden" style={{ padding: "10px 20px" }} >
                            <TextInput className="p-2 w-full" name="message" type="text" theme={inputTheme} value={message} onChange={(e) => setMessage(e.target.value)} color={"primary"} placeholder="Type something here..." />
                            <button type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="32px" height="32px" >
                                    <path d="M 5.4453125 4.0019531 A 1.50015 1.50015 0 0 0 4.109375 6.0644531 L 11.380859 24 L 4.109375 41.935547 A 1.50015 1.50015 0 0 0 6.1699219 43.841797 L 43.169922 25.341797 A 1.50015 1.50015 0 0 0 43.169922 22.658203 L 6.1699219 4.1582031 A 1.50015 1.50015 0 0 0 5.4453125 4.0019531 z M 8.3828125 8.6191406 L 39.146484 24 L 8.3828125 39.380859 L 14.011719 25.5 L 27.5 25.5 A 1.50015 1.50015 0 1 0 27.5 22.5 L 14.011719 22.5 L 8.3828125 8.6191406 z" fill="white" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="detail-area shrink-0 border-l-[1px] border-gray-700 ml-auto flex flex-col overflow-auto">
                    {DetailsArea({ MESSAGES, selectedMessageIndex, handleSelectedColor, selectedColor, modalPicPath, isModalOpen, onCloseModal, onOpenModal, getMessageFriend })}
                </div>
            </div>
        </>
    );
}

export default chatComponent;

