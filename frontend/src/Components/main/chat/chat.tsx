import { useContext, useState, useEffect, useRef } from "react";
import "./chat.css";
import DataContext from "../../../services/data.context";
import LoadingComponent from "../../shared/loading/loading";
import ConversationArea from "./conversation";
import DetailsArea from "./friendDetails";
import { messageUser, messageUser1 } from "../../../model/messageUser.model";
import MessageService from "../../../services/message.service";
import { Socket } from "socket.io-client";
import AuthService from "../../../services/auth.service";
import ChatAreaComponent from "./chatArea";
import { ChannelService } from "../../../services/channel.service";
import ChatRoom from "./chatRoom";
import User from "../../../model/user.model";
import { Avatar } from "flowbite-react";
import RoomDetails from "./roomDetails";

enum roomRoles {
  OWNER = "OWNER",
  ADMIN = "ADMIN"
}

interface membersRole {
  user: User,
  role: roomRoles
}

function chatComponent(): JSX.Element {
  const baseAPIUrl = import.meta.env.VITE_API_AUTH_KEY;
  const [roomMessages, setRoomMessages] = useState<any>(null);
  const [roomMembers, setRoomMembers] = useState<membersRole[]>([])
  const [MESSAGES, setMESSAGES] = useState<any>(null);
  const [friendId, setFriendId] = useState('');
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedMessageIndex, setSelectedMessageIndex] = useState('0');
  const [socketChat, setSocketChat] = useState<Socket>();
  const [message, setMessage] = useState('');
  const [modalPicPath, setModalPicPath] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latestMessages, setLatestMessages] = useState<any[]>([]);
  const [onOpenDetails, setOnOpenDetails] = useState<boolean>(false);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [lstGroupMessages, setLstGroupMessages] = useState<any>([]);
  const messageService = new MessageService();
  const channelService = new ChannelService();
  const audioRefs = useRef([] as HTMLAudioElement[]);
  const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [channelId, setChannelId] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>('');
  const userData = useContext(DataContext);
  if (!userData) {
    return <LoadingComponent />;
  }
  const socket: Socket = userData[1];
  useEffect(() => {
    if (messagesRef.current)
      scrollToBottom(messagesRef.current!);
  }, [MESSAGES]);
  const scrollToBottom = (element: HTMLElement) => {
    element.scrollTop = element.scrollHeight;
  };
  useEffect(() => {
    if (!userData[0] || !userData[1]) return;
    const fetchData = async () => {
      try {
        const authService = new AuthService();
        await authService.getPayload();
        const fetchedUserData = await messageService.latestMessages(userData[0].id);
        setLatestMessages(fetchedUserData);
        const fetchedChannels = await channelService.latestChannels(userData[0].id);
        setLstGroupMessages(fetchedChannels);
      } catch (error) {
        console.error('Error fetching user ', error);
      }
    };
    fetchData();
    setSocketChat(userData[1]);
  }, [userData]);
  if (!userData[0] || !userData[1]) {
    return <LoadingComponent />;
  }
  const handleTextSubmit = async (e: any) => {
    e.preventDefault();
    const messageValue = message
    if (!messageValue) {
      return;
    }
    if (friendId != '') {
      const newMessage: messageUser1 = {
        to: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
        from: userData[0].id,
        message: messageValue,
        image: '', // No image selected
        senderId: userData[0].id,
        recieverId: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
        recieverName: getMessageFriend(MESSAGES[selectedMessageIndex]).username,
        date: new Date().toISOString(),
        audio: ''
      };
      socketChat?.emit('message', newMessage);
      const newMessages = [...MESSAGES, newMessage];
      setMESSAGES(newMessages);
      setMessage('');
      setLatestMessages(await messageService.latestMessages(userData[0].id));
    } else if (channelId != -1) {
      const newMessage: any = {
        from: userData[0].id,
        senderId: userData[0].id,
        cid: channelId,
        message: messageValue,
        image: '',
        audio: ''
      };
      socketChat?.emit('channelMessages', newMessage);
      setLstGroupMessages(await channelService.latestChannels(userData[0].id))
      setRoomMessages(await channelService.getChannelMessages(channelId));
      setMessage('');
    }
  };
  const handleImageSubmit = async (selectedFile: File) => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    let imagePath;
    try {
      const APIURL = import.meta.env.VITE_API_AUTH_KEY;
      const response = await fetch(APIURL + 'upload', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      });
      if (response.ok) {
        imagePath = await response.json();
        imagePath = imagePath.url;
        if (friendId != '') {
          const newMessage: messageUser1 = {
            to: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
            from: userData[0].id,
            message: '',
            image: imagePath ? imagePath : '',
            senderId: userData[0].id,
            recieverId: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
            recieverName: getMessageFriend(MESSAGES[selectedMessageIndex]).username,
            date: new Date().toISOString(),
            audio: ''
          };
          socketChat?.emit('message', newMessage);
          handleSelectMessage(selectedMessageIndex, friendId);
          setMessage('');
          setLatestMessages(await messageService.latestMessages(userData[0].id));
        } else if (channelId != -1) {
          const newMessage: any = {
            from: userData[0].id,
            senderId: userData[0].id,
            cid: channelId,
            message: '',
            image: imagePath,
            audio: ''
          };
          socketChat?.emit('channelMessages', newMessage);
          setLstGroupMessages(await channelService.latestChannels(userData[0].id))
          setRoomMessages(await channelService.getChannelMessages(channelId));
        }
        if (messagesRef.current)
          scrollToBottom(messagesRef.current)
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleChange = (event: any) => {
    const selectedFile = event.target.files[0];
    handleImageSubmit(selectedFile);
  };
  const chooseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', handleChange); // Add event listener
    input.click();
  };
  const handleSelectMessage = async (index: string, friendId?: string, cid?: number) => {
    setSelectedMessageIndex(index);
    if (friendId) {
      setFriendId(friendId);
      setMESSAGES((await messageService.getMessages(userData[0].id, friendId)));
      // console.log(MESSAGES);
      setRoomMessages(null);
      setChannelId(-1)
    }
    else if (cid) {
      setFriendId('')
      setMESSAGES(null);
      setChannelId(cid);
      await channelService.getChannelMembers(cid).then(
        (data: any) => {
          setRoomMembers(data);
        }
      )
      await channelService.getChannelMessages(cid).then(
        (data: any) => {
          setRoomMessages(data);
        }
      )
    }
  };
  const onDirectMessage = async (data: any) => {
    setMESSAGES((await messageService.getMessages(userData[0].id, friendId)));
    setLatestMessages(await messageService.latestMessages(userData[0].id))
  }
  socketChat?.on("directMessageNotif", onDirectMessage)
  const handleOpenDetails = () => {
    setOnOpenDetails(!onOpenDetails)
  }

  const handleSelectedColor = (color: string) => {
    // setSelectedColor(color);
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
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: any = []; // Create a new array for chunks

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' }); // Use the chunks array directly
        const formData = new FormData();
        formData.append('file', audioBlob);
        const APIURL = import.meta.env.VITE_API_AUTH_KEY;
        try {
          const response = await fetch(APIURL + 'upload/audio', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
          });
          if (response.ok) {
            const data = await response.json();
            const audioPath = data.url;
            if (friendId !== '') {
              const newMessage: messageUser1 = {
                to: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
                from: userData[0].id,
                message: '',
                audio: audioPath || '',
                image: '',
                senderId: userData[0].id,
                recieverId: getMessageFriend(MESSAGES[selectedMessageIndex]).id,
                recieverName: getMessageFriend(MESSAGES[selectedMessageIndex]).username,
                date: new Date().toISOString()
              };
              socketChat?.emit('message', newMessage);
              const newMessages = [...MESSAGES, newMessage];
              setMESSAGES(newMessages);
              setLatestMessages(await messageService.latestMessages(userData[0].id));
            } else if (channelId != -1) {
              const newMessage: any = {
                from: userData[0].id,
                senderId: userData[0].id,
                cid: channelId,
                message: '',
                image: '',
                audio: audioPath
              };
              socketChat?.emit('channelMessages', newMessage);
              setLstGroupMessages(await channelService.latestChannels(userData[0].id))
              setRoomMessages(await channelService.getChannelMessages(channelId));
            }
          } else {
            console.error('Failed to upload audio:', response.statusText);
          }
        } catch (error) {
          console.error('Error uploading audio:', error);
        }
      }
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };
  const setOpenModal = (status: boolean) => {
    setIsOpen(status);
  }

  return (
    <>
      <div className="flex w-full border-t-[1px] dark:border-gray-700 border-black">
        <ConversationArea
          latestMessages={latestMessages}
          selectedMessageIndex={selectedMessageIndex}
          lstGroupMessages={lstGroupMessages}
          handleSelectMessage={handleSelectMessage}
          userData={userData}
          setLstGroupMessages={setLstGroupMessages}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          socket={socket}
        />
        <div className="flex flex-col overflow-hidden flex-1 h-full">
          {selectedMessageIndex !== "-1" && (
            <div className="flex-1 overflow-hidden h-[85%]">
              {MESSAGES && (
                <>
                  <div className="chat-area-header flex sticky top-0 left-0 overflow-hidden w-full items-center justify-between p-5 bg-inherit dark:bg-zinc-800">
                    <div className="flex flex-row items-center space-x-2">
                      <div
                        className="msg-profile group bg-white"
                        style={{
                          backgroundImage: `url(${
                            getMessageFriend(MESSAGES[selectedMessageIndex])
                              .picture
                          })`,
                        }}
                      ></div>
                      <div className="font-onest text-lg capitalize text-zinc-700 dark:text-white">
                        {getMessageFriend(MESSAGES[selectedMessageIndex])
                          .firstName +
                          " " +
                          getMessageFriend(MESSAGES[selectedMessageIndex])
                            .lastName}
                      </div>
                    </div>
                    <div className="flex flex-row justify-around w-20 h-8 gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="24"
                        height="24"
                        viewBox="0 0 50 50"
                        className="fill-black dark:fill-white stroke-2"
                      >
                        <path d="M 11.839844 2.988281 C 11.070313 2.925781 10.214844 3.148438 9.425781 3.703125 C 8.730469 4.1875 7.230469 5.378906 5.828125 6.726563 C 5.128906 7.398438 4.460938 8.097656 3.945313 8.785156 C 3.425781 9.472656 2.972656 10.101563 3 11.015625 C 3.027344 11.835938 3.109375 14.261719 4.855469 17.980469 C 6.601563 21.695313 9.988281 26.792969 16.59375 33.402344 C 23.203125 40.011719 28.300781 43.398438 32.015625 45.144531 C 35.730469 46.890625 38.160156 46.972656 38.980469 47 C 39.890625 47.027344 40.519531 46.574219 41.207031 46.054688 C 41.894531 45.535156 42.59375 44.871094 43.265625 44.171875 C 44.609375 42.769531 45.800781 41.269531 46.285156 40.574219 C 47.390625 39 47.207031 37.140625 45.976563 36.277344 C 45.203125 35.734375 38.089844 31 37.019531 30.34375 C 35.933594 29.679688 34.683594 29.980469 33.566406 30.570313 C 32.6875 31.035156 30.308594 32.398438 29.628906 32.789063 C 29.117188 32.464844 27.175781 31.171875 23 26.996094 C 18.820313 22.820313 17.53125 20.878906 17.207031 20.367188 C 17.597656 19.6875 18.957031 17.320313 19.425781 16.425781 C 20.011719 15.3125 20.339844 14.050781 19.640625 12.957031 C 19.347656 12.492188 18.015625 10.464844 16.671875 8.429688 C 15.324219 6.394531 14.046875 4.464844 13.714844 4.003906 L 13.714844 4 C 13.28125 3.402344 12.605469 3.050781 11.839844 2.988281 Z M 11.65625 5.03125 C 11.929688 5.066406 12.09375 5.175781 12.09375 5.175781 C 12.253906 5.398438 13.65625 7.5 15 9.53125 C 16.34375 11.566406 17.714844 13.652344 17.953125 14.03125 C 17.992188 14.089844 18.046875 14.753906 17.65625 15.492188 L 17.65625 15.496094 C 17.214844 16.335938 15.15625 19.933594 15.15625 19.933594 L 14.871094 20.4375 L 15.164063 20.9375 C 15.164063 20.9375 16.699219 23.527344 21.582031 28.410156 C 26.46875 33.292969 29.058594 34.832031 29.058594 34.832031 L 29.558594 35.125 L 30.0625 34.839844 C 30.0625 34.839844 33.652344 32.785156 34.5 32.339844 C 35.238281 31.953125 35.902344 32.003906 35.980469 32.050781 C 36.671875 32.476563 44.355469 37.582031 44.828125 37.914063 C 44.84375 37.925781 45.261719 38.558594 44.652344 39.425781 L 44.648438 39.425781 C 44.28125 39.953125 43.078125 41.480469 41.824219 42.785156 C 41.195313 43.4375 40.550781 44.046875 40.003906 44.457031 C 39.457031 44.867188 38.96875 44.996094 39.046875 45 C 38.195313 44.972656 36.316406 44.953125 32.867188 43.332031 C 29.417969 41.714844 24.496094 38.476563 18.007813 31.984375 C 11.523438 25.5 8.285156 20.578125 6.664063 17.125 C 5.046875 13.675781 5.027344 11.796875 5 10.949219 C 5.003906 11.027344 5.132813 10.535156 5.542969 9.988281 C 5.953125 9.441406 6.558594 8.792969 7.210938 8.164063 C 8.519531 6.910156 10.042969 5.707031 10.570313 5.339844 L 10.570313 5.34375 C 11.003906 5.039063 11.382813 5 11.65625 5.03125 Z"></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-black dark:fill-white"
                      >
                        <path d="M 4 4.75 C 3.271 4.75 2.5706875 5.0396875 2.0546875 5.5546875 C 1.5396875 6.0706875 1.25 6.771 1.25 7.5 L 1.25 16.5 C 1.25 17.229 1.5396875 17.929313 2.0546875 18.445312 C 2.5706875 18.960313 3.271 19.25 4 19.25 L 14.5 19.25 C 15.229 19.25 15.929312 18.960313 16.445312 18.445312 C 16.960313 17.929313 17.25 17.229 17.25 16.5 L 17.25 16.166016 L 20.982422 17.861328 C 21.369422 18.037328 21.819734 18.004438 22.177734 17.773438 C 22.534734 17.543438 22.75 17.147656 22.75 16.722656 L 22.75 7.2773438 C 22.75 6.8523438 22.534734 6.4565625 22.177734 6.2265625 C 21.819734 5.9955625 21.369422 5.9626719 20.982422 6.1386719 L 17.25 7.8339844 L 17.25 7.5 C 17.25 6.771 16.960313 6.0706875 16.445312 5.5546875 C 15.929312 5.0396875 15.229 4.75 14.5 4.75 L 4 4.75 z M 4 6.25 L 14.5 6.25 C 14.832 6.25 15.149766 6.3812344 15.384766 6.6152344 C 15.618766 6.8502344 15.75 7.168 15.75 7.5 L 15.75 9 L 15.75 15 L 15.75 16.5 C 15.75 16.832 15.618766 17.149766 15.384766 17.384766 C 15.149766 17.618766 14.832 17.75 14.5 17.75 L 4 17.75 C 3.668 17.75 3.3502344 17.618766 3.1152344 17.384766 C 2.8812344 17.149766 2.75 16.832 2.75 16.5 L 2.75 7.5 C 2.75 7.168 2.8812344 6.8502344 3.1152344 6.6152344 C 3.3502344 6.3812344 3.668 6.25 4 6.25 z M 21.25 7.6640625 L 21.25 16.335938 L 17.25 14.517578 L 17.25 9.4824219 C 17.25 9.4824219 20.213 8.1350625 21.25 7.6640625 z"></path>
                      </svg>
                      <svg
                        stroke="currentColor"
                        className="stroke-black dark:stroke-white"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="23"
                        width="23"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={handleOpenDetails}
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </div>
                  </div>
                  <div
                    ref={messagesRef}
                    className={`chat-area-main h-full overflow-auto pb-20 bg-white ${selectedColor} `}
                  >
                    <ChatAreaComponent
                      MESSAGES={MESSAGES}
                      userData={userData}
                      selectedMessageIndex={selectedMessageIndex}
                      getMessageFriend={getMessageFriend}
                      isModalOpen={isModalOpen}
                      onOpenModal={onOpenModal}
                      onCloseModal={onCloseModal}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      modalPicPath={modalPicPath}
                      audioRefs={audioRefs}
                    />
                  </div>
                </>
              )}
              {roomMembers && roomMessages && (
                <>
                  <div className="chat-area-header flex sticky top-0 left-0 overflow-hidden w-full items-center justify-between p-4 bg-inherit dark:bg-zinc-800">
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-row items-center">
                        <Avatar
                          img={
                            baseAPIUrl +
                              lstGroupMessages[selectedMessageIndex].channel
                                .picture || ""
                          }
                          rounded
                        />
                      </div>
                      <div className="font-onest text-lg capitalize text-zinc-700 dark:text-white">
                        {lstGroupMessages[selectedMessageIndex].channel.name}
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <Avatar.Group className="justify-around w-fit h-full">
                        {roomMembers.map((member, index) => (
                          <Avatar
                            img={member.user.picture}
                            rounded
                            stacked
                            key={index}
                          />
                        ))}
                        {<Avatar.Counter total={roomMembers.length} />}
                      </Avatar.Group>
                      <svg
                        stroke="currentColor"
                        className="stroke-black dark:stroke-white"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="23"
                        width="23"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={handleOpenDetails}
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </div>
                  </div>
                  <div
                    ref={messagesRef}
                    className={`chat-area-main h-full overflow-auto pb-20 bg-white ${selectedColor} `}
                  >
                    <ChatRoom
                      roomMembers={roomMembers}
                      roomMessages={roomMessages}
                      userData={userData}
                      channelId={channelId}
                      isModalOpen={isModalOpen}
                      onOpenModal={onOpenModal}
                      onCloseModal={onCloseModal}
                      modalPicPath={modalPicPath}
                      setRoomMessages={setRoomMessages}
                    />
                  </div>
                </>
              )}
            </div>
          )}
          {(friendId !== "" || channelId !== -1) && (
                // console.log('friendId: ', friendId, ' channelId: ', channelId),
                // <div className="area h-[11%] border-t border-gray-300">
                //     <form onSubmit={handleTextSubmit} className="w-full h-full m-0 px-4 flex items-center justify-center">
                //         <div className="field flex justify-center w-full h-full py-4 items-center gap-2 transition-all ease-in-out duration-500">
                //             <svg className="stroke-gray-600 dark:stroke-gray-400" fill="none" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
                //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                //             </svg>
                //             <input value={message} name="message" onChange={(e) => setMessage(e.target.value)} autoComplete="OFF" color={"primary"} className="input-message w-full px-4 focus:ring-0 focus:border-b-0 focus:outline-none bg-gray-300 dark:bg-zinc-900 text-black dark:text-gray-200 py-4 rounded-full border-none outline-none placeholder-gray-500 transition-all ease-in-out duration-500" type="" placeholder="Type something..." />
                //             <div className={`plus flex flex-row gap-1 ${message.length > 0 ? 'hidden' : 'block'}`}>
                //                 <div className="send text flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 dark:bg-transparent overflow-hidden" onClick={chooseFile}>
                //                     <svg className="stroke-gray-600 dark:stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                //                         <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                //                     </svg>
                //                 </div>
                //                 <div className={`send audio flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 overflow-hidden`} onClick={recording ? stopRecording : startRecording}>
                //                     {/* <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                //                                     <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                //                                     <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                //                                     <line x1="12" y1="19" x2="12" y2="23"></line>
                //                                     <line x1="8" y1="23" x2="16" y2="23"></line>
                //                                 </svg> */}
                //                     {recording ? <div className="recording flex items-center justify-center w-8 h-8 rounded-full bg-red-500 overflow-hidden" /> : <div className="recording flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 overflow-hidden" />}
                //                 </div>
                //             </div>
                //             <div className={`plus flex justify-center items-center p-1 rounded-full bg-blue-500 ${message.length > 0 ? 'block' : 'hidden'}`} onClick={handleTextSubmit}>
                //                 <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg">
                //                     <line x1="22" y1="2" x2="11" y2="13"></line>
                //                     <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                //                 </svg>
                //             </div>
                //         </div>
                //     </form>
                // </div>
            <div className="flex flex-row items-center h-16 rounded-xl bg-white dark:bg-main-dark-SPRUCE w-full px-4">
              <form onSubmit={handleTextSubmit} className="m-0 flex flex-row items-center h-16 rounded-xl w-full px-4" >
                <div>
                  <div className="flex items-center justify-center text-gray-400 hover:text-gray-600" onClick={chooseFile} >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex-grow ml-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={message}
                      name="message"
                      onChange={(e) => setMessage(e.target.value)}
                      autoComplete="OFF"
                      className="flex w-full border bg-white dark:bg-zinc-950 focus:ring-1 text-black dark:text-white rounded-xl focus:border-indigo-300 pl-4 h-10"
                    />
                    <div className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={handleTextSubmit}
                    className="flex items-center justify-center bg-main-light-FERN rounded-xl text-white px-4 py-1 flex-shrink-0"
                  >
                    <span>Send</span>
                    <span className="ml-2 overflow-hidden">
                      <svg
                        className="w-4 h-auto transform rotate-45 -mt-px"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        {onOpenDetails && friendId !== ""
          ? DetailsArea({
              MESSAGES,
              selectedMessageIndex,
              handleSelectedColor,
              selectedColor,
              modalPicPath,
              isModalOpen,
              onCloseModal,
              onOpenModal,
              getMessageFriend,
              handleOpenDetails,
            })
          : null}
        {onOpenDetails && channelId != -1 ? (
          <RoomDetails
            channelInfo={lstGroupMessages[selectedMessageIndex].channel}
            handleOpenDetails={handleOpenDetails}
            chatSocket={socketChat}
            setRoomMembers={setRoomMembers}
            roomMembers={roomMembers}
            userData={userData}
          />
        ) : null}
      </div>
    </>
  );
}

export default chatComponent;

