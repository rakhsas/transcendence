import { Tabs } from "flowbite-react";
import { tabsTheme } from "../../../utils/themes";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiWechatChannelsFill } from "react-icons/ri";
import { messageUser } from "../../../model/messageUser.model";
import UserService from "../../../services/user.service";
import User from "../../../model/user.model";
import { useEffect, useState } from "react";

type data = {
    latestMessages: messageUser[];
    latestGroupMessages: messageUser[];
    // selectedMessageIndex: string;
    // handleSelectMessage: (index: string) => void;
    userData: any;
}

interface LatestMesg {
    friend: User;
    latestMessage: messageUser;
}

const ConversationArea: React.FC<data> = ({ latestMessages, latestGroupMessages, userData }) => {
    // const friendsMap = new Map<string, LatestMesg>();
    const [friendsData, setFriendsData] = useState<any[]>([]);
    
    useEffect(() => {
        async function processFriendsData(): Promise<any[]> {
            const userService = new UserService();
            const friendsPromises = latestMessages.map(async (object) => {
                try {
                    let friend: User;
                    if (object.recieverId === userData.id)
                        friend = await userService.getUser(object.senderId);
                    else
                        friend = await userService.getUser(object.recieverId);
                    return { friend: friend, latestMessage: object };
                } catch (error) {
                    console.error('Error Fetching friend data: ', error);
                }
            });
            const friendsMap = await Promise.all(friendsPromises);
            return friendsMap.filter(Boolean); // Remove any undefined values caused by errors
        }
    
        async function fetchDataAndProcessFriends() {
            const data = await processFriendsData();
            console.log('data: ', data);
            setFriendsData(data);
        }
    
        fetchDataAndProcessFriends();
    }, [latestMessages, userData]);
    // console.log('friendsData: ', friendsData);
    // fetchDataAndProcessFriends();
    return (
        <Tabs aria-label="Tabs with icons" style="underline" theme={tabsTheme}>
            <Tabs.Item active title="Friends" icon={LiaUserFriendsSolid}>
                {/* {friendsData[0]?.latestMessage.message} */}
            {/* {
                // console.log('friendsData: ', friendsData.length)
                // console.log('Data.length: ', Object.keys(friendsData).length),
                Object.keys(friendsData).map((friendId) => (
                    console.log('friendsData[friendId]: ', friendsData[friendId]),
                    <React.Fragment key={friendId}>fsdf</React.Fragment>
                ))
            } */}

                    {/* <div key={friendId} className={`msg `}>
                        <div className="msg-profile rounded-full mr-4 bg-rose-400 ">
                            {friendsData[friendId].latestMessage.cid === 1 ? (
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
                                    src={friendsData[friendId].friend.picture}
                                    className="object-cover bg-contain h-full bg-no-repeat bg-center"
                                    alt=""
                                />
                            )}
                        </div>
                        <div className="msg-detail overflow-hidden">
                            <div className="msg-username font-poppins mb-1 text-black dark:text-white font-semibold text-base">
                                {friendsData[friendId].friend.username}
                            </div>
                            <div className="msg-content font-medium text-xs">
                                <span className="msg-message whitespace-nowrap overflow-hidden overflow-ellipsis text-main-dark-SIDEMESSAGE">
                                    {friendsData[friendId].latestMessage.message}
                                </span>
                                <span className="msg-date text-main-light-FERN text-sm ml-4">
                                    {friendsData[friendId].latestMessage.date}
                                </span>
                            </div>
                        </div>
                    </div> */}
                {/* {latestMessages.map((message, index) => (
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
                                <span className="msg-date text-main-light-FERN text-sm ml-4">
                                    {message.date}
                                </span>
                            </div>
                        </div>
                    </div>
                ))} */}
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