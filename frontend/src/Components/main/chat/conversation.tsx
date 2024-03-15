import { Tabs } from "flowbite-react";
import { tabsTheme } from "../../../utils/themes";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiWechatChannelsFill } from "react-icons/ri";
import { messageUser } from "../../../model/messageUser.model";
import UserService from "../../../services/user.service";
import User from "../../../model/user.model";
import { useEffect, useState } from "react";
import MessageService from "../../../services/message.service";
import { latestMessages } from "../../../utils/data";

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

const ConversationArea: React.FC<data> = ({ latestMessages, selectedMessageIndex, latestGroupMessages, handleSelectMessage, userData }) => {
    return (
        <Tabs aria-label="Tabs with icons" style="underline" theme={tabsTheme}>
            <Tabs.Item active title="Friends" icon={LiaUserFriendsSolid}>
                {!latestMessages ? (
                    console.log('i have no message'),
                    null) :
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
                                console.log(message),
                                <img
                                    src={userData[0].id === message.__reciever__.id ? message.__owner__.picture : message.__reciever__.picture}
                                    className="object-cover bg-contain h-full bg-no-repeat bg-center"
                                    alt=""
                                />
                            )}
                        </div>
                        <div className="msg-detail overflow-hidden">
                            <div className="msg-username font-poppins mb-1 text-black dark:text-white font-semibold text-base">
                                {message.__reciever__.id === userData[0].id ? message.__owner__.firstName + ' ' + message.__owner__.lastName : message.__reciever__.firstName + ' ' + message.__reciever__.lastName}
                            </div>
                            <div className="msg-content font-medium text-xs">
                                <span className="msg-message whitespace-nowrap overflow-hidden overflow-ellipsis text-main-dark-SIDEMESSAGE">
                                    {message.senderId === userData[0].id ? <span className="font-poppins font-bold text-gray-700">YOU:<span className="text-black dark:text-white"> {message.message} </span> </span>: message.message}
                                </span>
                                <span className="msg-date text-main-light-FERN text-sm ml-4">
                                    {new Date(message.date).toLocaleString('en-MA', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
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
    );
};
export default ConversationArea;